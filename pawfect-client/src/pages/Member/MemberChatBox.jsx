import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import io from "socket.io-client";
import { useParams } from "react-router-dom";
import { FaLocationArrow, FaPaperPlane, FaSmile, FaImage } from "react-icons/fa";

const GOOGLE_MAPS_API_KEY = "AIzaSyC5s89_KsT2NG6DawsfH_Ju__2Yp4oKh8I";

const socket = io("http://localhost:5000", {
  path: "/socket.io/",
  transports: ["websocket", "polling"],
});

const MemberChatBox = () => {
  const { user } = useContext(AuthContext);
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [showSidebar, setShowSidebar] = useState(true);
  const { id } = useParams();

  const { data: userData = {} } = useQuery({
    queryKey: ["user", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axios.get(`http://localhost:5000/users/${user?.email}`);
      return res.data;
    },
  });

  const { data: volunteer = [] } = useQuery({
    queryKey: ["volunteer", id],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:5000/chat-with-volunteer/${id}`);
      return res.data[0];
    },
  });

  const { data: initialMessages = [], refetch: refetchMessages } = useQuery({
    queryKey: ["messages", user?.email, id],
    enabled: !!user?.email && !!id,
    queryFn: async () => {
      const res = await axios.get(`http://localhost:5000/messages/${user?.email}/${id}`);
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
    if (user?.email && id) {
      const room1 = `${user.email}-${id}`;
      const room2 = `${id}-${user.email}`;
      socket.emit("join_room", room1);
      socket.emit("join_room", room2);
      refetchMessages();
    }

    socket.on("receive_message", (message) => {
      setChatMessages((prev) => [...prev, message]);
      refetchMessages();
    });

    return () => {
      socket.off("receive_message");
    };
  }, [user?.email, id, refetchMessages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const messageData = {
      sender: user?.email,
      senderId: userData?._id,
      senderName: userData?.name,
      senderImage: userData?.photoURL,
      receiver: id,
      receiverName: volunteer?.fullName,
      receiverImage: volunteer?.profileImage,
      content: message,
      timestamp: new Date(),
    };

    const room = `${user.email}-${id}`;
    socket.emit("send_message", { message: messageData, room });

    try {
      await axios.post("http://localhost:5000/messages", messageData);
      setMessage("");
      refetchMessages();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleShareLocation = async () => {
    if ("geolocation" in navigator) {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        const { latitude, longitude } = position.coords;
        const locationData = {
          senderId: userData?._id,
          senderEmail: user?.email,
          senderName: userData?.name,
          receiverId: id,
          latitude,
          longitude,
          timestamp: new Date(),
        };

        await axios.post("http://localhost:5000/locations", locationData);

        const messageData = {
          sender: user?.email,
          senderId: userData?._id,
          senderName: userData?.name,
          senderImage: userData?.photoURL,
          receiver: id,
          receiverName: volunteer?.fullName,
          receiverImage: volunteer?.profileImage,
          content: `📍 Shared Location: https://www.google.com/maps?q=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`,
          isLocation: true,
          latitude,
          longitude,
          timestamp: new Date(),
        };

        const room = `${user.email}-${id}`;
        socket.emit("send_message", { message: messageData, room });
        await axios.post("http://localhost:5000/messages", messageData);
        refetchMessages();
      } catch (error) {
        console.error("Error getting location:", error);
      }
    }
  };

  useEffect(() => {
    const chatBox = document.getElementById("chatBox");
    if (chatBox) {
      chatBox.scrollTop = chatBox.scrollHeight;
    }

    // Handle responsive sidebar
    const handleResize = () => {
      setShowSidebar(window.innerWidth >= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [chatMessages]);

  return (
    <div className="py-24 bg-gradient-to-br from-orange-50 via-white to-orange-50/30 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-orange-100 h-[calc(100vh-4rem)]">
        <div className="grid md:grid-cols-3 h-full">
          {/* Volunteer Profile Sidebar - Hidden on mobile by default */}
          {showSidebar && (
            <div className="bg-gradient-to-b from-orange-50 to-white p-4 md:p-8 border-r border-orange-100 overflow-y-auto">
              <div className="space-y-6 md:space-y-8">
                <div className="text-center">
                  <div className="relative w-24 h-24 md:w-40 md:h-40 mx-auto mb-4 md:mb-6">
                    <img
                      src={volunteer?.profileImage || "https://i.ibb.co/MgsTCcv/avater.jpg"}
                      alt="Volunteer"
                      className="w-full h-full object-cover rounded-2xl shadow-lg ring-4 ring-white"
                    />
                    <div className="absolute bottom-4 right-4 w-4 h-4 bg-green-500 rounded-full ring-2 ring-white"></div>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-800">{volunteer?.fullName}</h3>
                  <p className="text-sm md:text-base text-gray-600 mt-2">{volunteer?.email}</p>
                </div>

                <div className="space-y-4 md:space-y-6">
                  <div className="bg-white p-4 md:p-6 rounded-2xl shadow-md">
                    <h4 className="font-semibold text-gray-700 mb-4">Profile Info</h4>
                    <div className="space-y-3 md:space-y-4">
                      <div className="flex justify-between items-center text-sm md:text-base">
                        <span className="text-gray-600">Age</span>
                        <span className="font-medium">{volunteer?.age} years</span>
                      </div>
                      <div className="flex justify-between items-center text-sm md:text-base">
                        <span className="text-gray-600">Experience</span>
                        <span className="font-medium">{volunteer?.experience || "N/A"}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm md:text-base">
                        <span className="text-gray-600">Location</span>
                        <span className="font-medium">{volunteer?.location || "N/A"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Chat Section */}
          <div className={`${showSidebar ? 'col-span-2' : 'col-span-3'} flex flex-col h-full`}>
            {/* Chat Header */}
            <div className="p-4 md:p-6 border-b bg-white shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Toggle Sidebar Button on Mobile */}
                <button 
                  className="md:hidden p-2 rounded-lg hover:bg-gray-100"
                  onClick={() => setShowSidebar(!showSidebar)}
                >
                  ☰
                </button>
                <h2 className="text-lg md:text-2xl font-bold text-gray-800">Chat with {volunteer?.fullName}</h2>
              </div>
              <div className="flex gap-2 md:gap-4">
                <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                  <FaImage className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
                </button>
                <button 
                  onClick={handleShareLocation}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <FaLocationArrow className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div id="chatBox" className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4 md:space-y-6">
              {chatMessages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.sender === user?.email ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex items-end gap-2 md:gap-4 max-w-[85%] md:max-w-[80%] ${msg.sender === user?.email ? "flex-row-reverse" : "flex-row"}`}>
                    <img
                      src={msg.sender === user?.email ? msg.senderImage : msg.receiverImage}
                      alt="Profile"
                      className="w-6 h-6 md:w-8 md:h-8 rounded-full ring-2 ring-white"
                    />
                    <div className={`
                      ${msg.sender === user?.email 
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-t-2xl rounded-bl-2xl" 
                        : "bg-gray-100 rounded-t-2xl rounded-br-2xl"}
                      p-3 md:p-4 shadow-md
                    `}>
                      <p className="text-xs md:text-sm">{msg.content}</p>
                      <p className={`text-[10px] md:text-xs mt-1 md:mt-2 ${msg.sender === user?.email ? "text-orange-100" : "text-gray-500"}`}>
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="p-4 md:p-6 bg-white border-t">
              <div className="flex items-center gap-2 md:gap-4 bg-gray-50 rounded-2xl p-2">
                <button type="button" className="p-1.5 md:p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <FaSmile className="w-5 h-5 md:w-6 md:h-6 text-gray-500" />
                </button>
                <button 
                  type="button"
                  onClick={handleShareLocation}
                  className="p-1.5 md:p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FaLocationArrow className="w-5 h-5 md:w-6 md:h-6 text-gray-500" />
                </button>
                
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 bg-transparent px-3 md:px-4 py-2 text-sm md:text-base focus:outline-none"
                />

                <button
                  type="submit"
                  className="p-2 md:p-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:shadow-lg transition-all duration-300"
                >
                  <FaPaperPlane className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberChatBox;
