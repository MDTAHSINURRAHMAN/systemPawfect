import React, { useState, useContext, useEffect } from "react";
import { motion } from "framer-motion";
import { AuthContext } from "../../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";

const TrainerChat = () => {
  const { user } = useContext(AuthContext);
  const [uniqueUsers, setUniqueUsers] = useState([]);

  // get the id of the trainer through the email
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

  // Get all messages for this trainer
  const { data: messages = [] } = useQuery({
    queryKey: ["messages", volunteer._id],
    enabled: !!volunteer._id,
    queryFn: async () => {
      console.log("Fetching messages for volunteer ID:", volunteer._id);
      const res = await axios.get(
        `http://localhost:5000/messages`
      );
      // Filter messages where this volunteer is the receiver
      const filteredMessages = res.data.filter(msg => msg.receiver === volunteer._id);
      console.log("Filtered messages:", filteredMessages);
      
      // Get unique sender IDs
      const uniqueSenders = [...new Set(filteredMessages.map(msg => msg.sender))];
      setUniqueUsers(uniqueSenders);
      
      return filteredMessages;
    },
  });

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-bold text-lg">My Messages</h3>
          <p className="text-sm text-gray-500">Volunteer ID: {volunteer._id}</p>
        </div>

        <div className="p-4">
          {uniqueUsers.length === 0 ? (
            <p className="text-center text-gray-500">No messages yet</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {uniqueUsers.map((userId, idx) => {
                const userMessages = messages.filter(
                  (msg) => msg.sender === userId
                );
                const lastMessage = userMessages[userMessages.length - 1];

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="card bg-base-100 shadow-xl">
                      <div className="card-body">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="avatar">
                            <div className="w-12 h-12 rounded-full">
                              <img 
                                src={lastMessage?.senderImage || "https://i.ibb.co/MgsTCcv/avater.jpg"} 
                                alt="Sender"
                                className="object-cover"
                              />
                            </div>
                          </div>
                          <div>
                            <h4 className="card-title">{lastMessage?.senderName || "Unknown"}</h4>
                            <p className="text-sm text-gray-500">{userId}</p>
                          </div>
                        </div>
                        
                        {lastMessage?.content && (
                          <div className="bg-gray-50 p-4 rounded-lg mb-4">
                            <p className="text-sm text-gray-600">
                              Last message:{" "}
                              {lastMessage.content.substring(0, 30)}
                              {lastMessage.content.length > 30 ? "..." : ""}
                            </p>
                            <p className="text-xs text-gray-400 mt-2">
                              {new Date(lastMessage.timestamp).toLocaleString()}
                            </p>
                          </div>
                        )}
                        
                        <div className="card-actions justify-end">
                          <Link
                            to={`/dashboard/chat-with-member/${userId}`}
                            className="btn btn-primary bg-gradient-to-r from-[#FF640D] to-[#FF8B3D] border-none text-white"
                          >
                            Reply
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainerChat;
