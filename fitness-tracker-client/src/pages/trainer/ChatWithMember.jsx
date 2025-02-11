import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import io from "socket.io-client";
import { useParams } from "react-router-dom";

// Configure socket with path option
const socket = io("http://localhost:5000", {
  path: "/socket.io/",
  transports: ["websocket", "polling"],
});

const ChatWithMember = () => {
  const { user } = useContext(AuthContext);
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const { id } = useParams();

  // Get trainer data
  const { data: volunteer = {} } = useQuery({
    queryKey: ["volunteer", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axios.get(
        `http://localhost:5000/volunteer-by-email/${user?.email}`
      );
      return res.data;
    },
  });

  // Get member data
  const { data: member = {} } = useQuery({
    queryKey: ["member", id],
    enabled: !!id,
    queryFn: async () => {
      const res = await axios.get(`http://localhost:5000/users/${id}`);
      return res.data;
    },
  });

  // Get chat messages with refetch
  const { data: initialMessages = [], refetch: refetchMessages } = useQuery({
    queryKey: ["messages", id, volunteer._id],
    enabled: !!volunteer._id && !!id,
    queryFn: async () => {
      const res = await axios.get(
        `http://localhost:5000/messages/${id}/${volunteer._id}`
      );
      return res.data;
    },
    staleTime: 0,
    cacheTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    onSuccess: (data) => {
      setChatMessages(data);
    },
  });

  useEffect(() => {
    if (volunteer._id && id) {
      // Join both possible room combinations
      const room1 = `${volunteer._id}-${id}`;
      const room2 = `${id}-${volunteer._id}`;
      socket.emit("join_room", room1);
      socket.emit("join_room", room2);
      
      // Initial fetch of messages
      refetchMessages();
    }

    socket.on("receive_message", (message) => {
      setChatMessages((prev) => [...prev, message]);
      // Refetch messages when new message received
      refetchMessages();
    });

    return () => {
      socket.off("receive_message");
    };
  }, [volunteer._id, id, refetchMessages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const messageData = {
      sender: volunteer._id,
      senderName: volunteer?.fullName,
      senderImage: volunteer?.profileImage,
      receiver: id,
      receiverName: member?.name,
      receiverImage: member?.photoURL,
      content: message,
      timestamp: new Date(),
    };

    const room = `${volunteer._id}-${id}`;
    socket.emit("send_message", { message: messageData, room });

    try {
      await axios.post("http://localhost:5000/messages", messageData);
      setMessage("");
      // Refetch messages after sending
      refetchMessages();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    const chatBox = document.getElementById("chatBox");
    if (chatBox) {
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  }, [chatMessages]);

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl">
        <div className="grid md:grid-cols-4 h-[80vh]">
          {/* Member Details */}
          <div className="border-r border-gray-200 p-4">
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-[#FF640D] to-orange-600 bg-clip-text text-transparent">
              Member Details
            </h2>
            <div className="space-y-4">
              <div className="flex flex-col items-center p-6 border border-gray-200 rounded-xl">
                <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
                  <img
                    src={
                      member?.photoURL || "https://i.ibb.co/MgsTCcv/avater.jpg"
                    }
                    alt="Member"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">
                  {member?.name}
                </h3>
                <p className="text-gray-600 mt-1">{member?.email}</p>
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="col-span-3 flex flex-col h-[80vh] bg-gray-50">
            {/* Chat Header */}
            <div className="p-4 border-b bg-white shadow-sm">
              <div className="flex items-center gap-3">
                <img 
                  src={member?.photoURL || "https://i.ibb.co/MgsTCcv/avater.jpg"}
                  alt="Member"
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h3 className="font-semibold">{member?.name}</h3>
                  <p className="text-sm text-gray-500">Active Now</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div id="chatBox" className="flex-1 p-4 overflow-y-auto">
              {chatMessages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-start gap-2 mb-4 ${
                    msg.sender === volunteer._id ? "flex-row-reverse" : ""
                  }`}
                >
                  <img
                    src={msg.sender === volunteer._id ? msg.senderImage : msg.receiverImage}
                    alt="Profile"
                    className="w-8 h-8 rounded-full"
                  />
                  <div
                    className={`max-w-[60%] rounded-2xl p-3 ${
                      msg.sender === volunteer._id
                        ? "bg-orange-500 text-white rounded-tr-none"
                        : "bg-white shadow-md rounded-tl-none"
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <p className={`text-xs mt-1 ${msg.sender === volunteer._id ? "text-orange-100" : "text-gray-500"}`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 bg-white border-t">
              <form onSubmit={handleSendMessage} className="flex gap-2 items-center">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 rounded-full border focus:outline-none focus:border-orange-500"
                />
                <button
                  type="submit"
                  className="p-2 rounded-full bg-orange-500 text-white hover:bg-orange-600 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWithMember;
