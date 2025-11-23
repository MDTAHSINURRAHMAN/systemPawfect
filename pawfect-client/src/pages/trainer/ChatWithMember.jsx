import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import io from "socket.io-client";
import { useParams } from "react-router-dom";
import { FaLocationArrow, FaPaw, FaArrowDown } from "react-icons/fa";

// Configure socket with path option
const socket = io("https://pawfect-server-beige.vercel.app", {
  path: "/socket.io/",
  transports: ["websocket", "polling"],
});

const ChatWithMember = () => {
  const { user } = useContext(AuthContext);
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const { id } = useParams();
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Get trainer data
  const { data: volunteer = {} } = useQuery({
    queryKey: ["volunteer", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axios.get(
        `https://pawfect-server-beige.vercel.app/volunteer-by-email/${user?.email}`
      );
      return res.data;
    },
  });

  // Get member data
  const { data: member = {} } = useQuery({
    queryKey: ["member", id],
    enabled: !!id,
    queryFn: async () => {
      const res = await axios.get(`https://pawfect-server-beige.vercel.app/users/${id}`);
      return res.data;
    },
  });

  // Get chat messages with refetch
  const { data: initialMessages = [], refetch: refetchMessages } = useQuery({
    queryKey: ["messages", id, volunteer._id],
    enabled: !!volunteer._id && !!id,
    queryFn: async () => {
      const res = await axios.get(
        `https://pawfect-server-beige.vercel.app/messages/${id}/${volunteer._id}`
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

  // Get shared locations
  const { data: sharedLocations = [] } = useQuery({
    queryKey: ["locations", id, volunteer._id],
    enabled: !!volunteer._id && !!id,
    queryFn: async () => {
      const res = await axios.get(
        `https://pawfect-server-beige.vercel.app/locations/${id}/${volunteer._id}`
      );
      return res.data;
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
      await axios.post("https://pawfect-server-beige.vercel.app/messages", messageData);
      setMessage("");
      // Refetch messages after sending
      refetchMessages();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleScroll = (e) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight < 100;
    setShowScrollButton(!bottom);
  };

  const scrollToBottom = () => {
    const chatBox = document.getElementById("chatBox");
    if (chatBox) {
      chatBox.scrollTo({
        top: chatBox.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const chatBox = document.getElementById("chatBox");
    if (chatBox) {
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  }, [chatMessages]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-8"
        >
          <FaPaw className="text-4xl text-orange-500" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
            Chat with {member?.name}
          </h1>
        </motion.div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid md:grid-cols-4 h-[75vh]">
            {/* Member Details */}
            <div className="border-r border-gray-200 p-6 bg-gradient-to-b from-orange-50 to-white">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-lg">
                  <div className="w-24 h-24 rounded-full overflow-hidden mb-4 ring-4 ring-orange-100">
                    <img
                      src={
                        member?.photoURL ||
                        "https://i.ibb.co/MgsTCcv/avater.jpg"
                      }
                      alt="Member"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {member?.name}
                  </h3>
                  <p className="text-gray-600 text-sm">{member?.email}</p>
                </div>

                {sharedLocations[0] && (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-6 bg-white rounded-2xl shadow-lg"
                  >
                    <h4 className="font-bold text-gray-800 mb-3">
                      Last Known Location
                    </h4>
                    <a
                      href={`https://www.google.com/maps?q=${sharedLocations[0].latitude},${sharedLocations[0].longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-orange-500 hover:text-orange-600 transition-colors"
                    >
                      <FaLocationArrow className="text-lg" />
                      <span className="underline">View on Map</span>
                    </a>
                    <p className="text-sm text-gray-500 mt-2">
                      {new Date(sharedLocations[0].timestamp).toLocaleString()}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            </div>

            {/* Chat Area */}
            <div className="col-span-3 flex flex-col h-full bg-gradient-to-br from-orange-50 to-white">
              {/* Messages */}
              <div
                id="chatBox"
                onScroll={handleScroll}
                className="flex-1 p-6 overflow-y-auto space-y-4 h-[calc(100vh-16rem)] scrollbar-thin scrollbar-thumb-orange-200 scrollbar-track-transparent relative"
                style={{
                  overscrollBehavior: "contain",
                  scrollBehavior: "smooth",
                }}
              >
                {chatMessages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-start gap-3 ${
                      msg.sender === volunteer._id ? "flex-row-reverse" : ""
                    }`}
                  >
                    <img
                      src={
                        msg.sender === volunteer._id
                          ? msg.senderImage
                          : msg.receiverImage
                      }
                      alt="Profile"
                      className="w-10 h-10 rounded-full ring-2 ring-orange-100"
                    />
                    <div
                      className={`max-w-[70%] rounded-2xl p-4 ${
                        msg.sender === volunteer._id
                          ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-tr-none"
                          : "bg-white shadow-lg rounded-tl-none"
                      }`}
                    >
                      {msg.isLocation ? (
                        <a
                          href={msg.content.split(": ")[1]}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-orange-500"
                        >
                          <FaLocationArrow />
                          <span className="underline">
                            View Member's Location
                          </span>
                        </a>
                      ) : (
                        <p className="text-sm">{msg.content}</p>
                      )}
                      <p
                        className={`text-xs mt-2 ${
                          msg.sender === volunteer._id
                            ? "text-orange-100"
                            : "text-gray-500"
                        }`}
                      >
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </motion.div>
                ))}

                {showScrollButton && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={scrollToBottom}
                    className="absolute bottom-4 right-4 p-2 bg-orange-500 text-white rounded-full shadow-lg hover:bg-orange-600 transition-colors"
                  >
                    <FaArrowDown className="w-4 h-4" />
                  </motion.button>
                )}
              </div>

              {/* Message Input */}
              <div className="p-6 bg-white border-t border-gray-100">
                <form onSubmit={handleSendMessage} className="flex gap-3">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-6 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg"
                  >
                    Send
                  </motion.button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWithMember;
