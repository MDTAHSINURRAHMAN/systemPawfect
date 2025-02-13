import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import io from "socket.io-client";
import { useParams } from "react-router-dom";
import { FaLocationArrow } from "react-icons/fa";

// Google Maps API Key
const GOOGLE_MAPS_API_KEY = "AIzaSyC5s89_KsT2NG6DawsfH_Ju__2Yp4oKh8I";

// Configure socket with path option
const socket = io("http://localhost:5000", {
  path: "/socket.io/",
  transports: ["websocket", "polling"],
});

const MemberChatBox = () => {
  const { user } = useContext(AuthContext);
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const { id } = useParams();

  // Get user data
  const { data: userData = {} } = useQuery({
    queryKey: ["user", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axios.get(`http://localhost:5000/users/${user?.email}`);
      return res.data;
    },
  });

  // Get volunteer data
  const { data: volunteer = [] } = useQuery({
    queryKey: ["volunteer", id],
    queryFn: async () => {
      const res = await axios.get(
        `http://localhost:5000/chat-with-volunteer/${id}`
      );
      return res.data[0];
    },
  });

  // Get chat messages with refetch
  const { data: initialMessages = [], refetch: refetchMessages } = useQuery({
    queryKey: ["messages", user?.email, id],
    enabled: !!user?.email && !!id,
    queryFn: async () => {
      const res = await axios.get(
        `http://localhost:5000/messages/${user?.email}/${id}`
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
    if (user?.email && id) {
      // Join both possible room combinations
      const room1 = `${user.email}-${id}`;
      const room2 = `${id}-${user.email}`;
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
      // Refetch messages after sending
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

        // Save location to MongoDB
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

        // Send location as a message in chat
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
    } else {
      console.error("Geolocation is not supported by this browser.");
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
        <div className="grid md:grid-cols-3 h-[80vh]">
          {/* Volunteer Details */}
          <div className="bg-gray-50 p-6 rounded-l-2xl">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Volunteer Profile
            </h2>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 rounded-full overflow-hidden mb-4 ring-4 ring-orange-100">
                  <img
                    src={
                      volunteer?.profileImage ||
                      "https://i.ibb.co/MgsTCcv/avater.jpg"
                    }
                    alt="Volunteer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {volunteer?.fullName}
                </h3>
                <p className="text-gray-600 mb-4">{volunteer?.email}</p>
                <div className="w-full space-y-3">
                  <div className="flex items-center gap-3 text-gray-600">
                    <span className="font-medium">Age:</span>
                    <span>{volunteer?.age} years</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <span className="font-medium">Experience:</span>
                    <span>{volunteer?.experience || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <span className="font-medium">Location:</span>
                    <span>{volunteer?.location || "N/A"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-2 flex flex-col bg-gray-50 rounded-r-2xl">
            <div className="p-6 border-b bg-white rounded-tr-2xl">
              <h2 className="text-2xl font-bold text-gray-800">Messages</h2>
            </div>

            <div
              id="chatBox"
              className="flex-1 p-6 overflow-y-auto w-full max-h-[calc(80vh-160px)]"
            >
              {chatMessages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${
                    msg.sender === user?.email ? "justify-end" : "justify-start"
                  } mb-4`}
                >
                  <div
                    className={`flex items-start gap-3 max-w-[70%] ${
                      msg.sender === user?.email
                        ? "flex-row-reverse"
                        : "flex-row"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-orange-100">
                      <img
                        src={
                          msg.sender === user?.email
                            ? msg.senderImage
                            : msg.receiverImage
                        }
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div
                      className={`${
                        msg.sender === user?.email
                          ? "bg-orange-500 text-white rounded-l-2xl rounded-br-2xl"
                          : "bg-white rounded-r-2xl rounded-bl-2xl shadow-md"
                      } px-4 py-2`}
                    >
                      <p className="text-sm">
                        {msg.isLocation ? (
                          <a
                            href={msg.content.split(": ")[1]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline"
                          >
                            📍 View Shared Location
                          </a>
                        ) : (
                          msg.content
                        )}
                      </p>
                      <p
                        className={`text-xs mt-1 ${
                          msg.sender === user?.email
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
                  </div>
                </motion.div>
              ))}
            </div>

            <form
              onSubmit={handleSendMessage}
              className="p-6 bg-white rounded-br-2xl"
            >
              <div className="flex gap-4 items-center">
                <button
                  type="button"
                  onClick={handleShareLocation}
                  className="p-2 rounded-full bg-orange-500 text-white hover:bg-orange-600 transition-colors"
                  title="Share Location"
                >
                  <FaLocationArrow className="h-5 w-5" />
                </button>

                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500"
                />

                <button
                  type="submit"
                  className="p-2 rounded-full bg-orange-500 text-white hover:bg-orange-600 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
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
