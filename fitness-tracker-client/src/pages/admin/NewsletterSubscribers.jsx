import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";

const NewsletterSubscribers = () => {
  const {
    data: subscribers = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["subscribers"],
    queryFn: async () => {
      const { data } = await axios.get(
        "http://localhost:5000/newsletter/subscribers"
      );
      return data;
    },
  });

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-error">
        Error loading subscribers
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 text-center bg-gradient-to-r from-[#FF640D] to-orange-600 bg-clip-text text-transparent"
      >
        Newsletter Subscribers
      </motion.h2>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="overflow-x-auto bg-white rounded-xl shadow-xl"
      >
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden ring-1 ring-black ring-opacity-5 rounded-xl">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gradient-to-r from-orange-50 to-white">
                <tr>
                  <th
                    scope="col"
                    className="py-4 pl-4 pr-3 text-left text-sm font-semibold sm:pl-6 text-[#FF640D]"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-4 text-left text-sm font-semibold hidden sm:table-cell text-[#FF640D]"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-4 text-left text-sm font-semibold hidden md:table-cell text-[#FF640D]"
                  >
                    Subscription Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {subscribers.map((subscriber, index) => (
                  <motion.tr
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    key={subscriber._id || index}
                    className="hover:bg-orange-50 transition-colors duration-200"
                  >
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                      <div className="font-medium text-gray-900">
                        {subscriber.name}
                      </div>
                      <div className="text-gray-500 sm:hidden">
                        {subscriber.email}
                      </div>
                      <div className="text-gray-500 sm:hidden">
                        {new Date(subscriber.date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 hidden sm:table-cell">
                      {subscriber.email}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 hidden md:table-cell">
                      {new Date(subscriber.date).toLocaleDateString()}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-6 text-sm text-gray-500 bg-gradient-to-r from-orange-50 to-white p-4 rounded-lg shadow-inner flex justify-between items-center"
      >
        <span>Total Subscribers: {subscribers.length}</span>
        <span className="text-[#FF640D] font-semibold">Active Members</span>
      </motion.div>
    </div>
  );
};

export default NewsletterSubscribers;
