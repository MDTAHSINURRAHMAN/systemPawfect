import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const LatestCommunity = () => {
  const {
    data: posts,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["latestPosts"],
    queryFn: async () => {
      const { data } = await axios.get("https://pawfect-server-beige.vercel.app/forums?limit=6");
      return data;
    },
  });

  if (isLoading) return <div className="text-center">Loading...</div>;
  if (error)
    return <div className="text-center text-red-500">Error loading posts</div>;

  return (
    <div className="p-4 sm:p-8 md:p-12 bg-gradient-to-br from-orange-50 to-white">
      <motion.h2
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-3xl sm:text-4xl font-bold mb-8 text-center bg-gradient-to-r from-[#FF640D] to-orange-600 bg-clip-text text-transparent"
      >
        Latest Community Posts
      </motion.h2>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 w-11/12 mx-auto"
      >
        {posts?.map((post, index) => (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            key={post._id}
          >
            <Link
              to={`/community/posts/${post._id}`}
              className="block p-6 rounded-2xl bg-white hover:shadow-xl transition-all duration-300 border border-orange-100 hover:-translate-y-1 group"
            >
              <h3 className="font-bold text-xl mb-3 text-gray-800 group-hover:text-[#FF640D] transition-colors duration-300">
                {post.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2 group-hover:text-gray-700">
                {post.content}
              </p>
              <div className="flex justify-between items-center text-sm border-t pt-4 border-orange-100">
                <span className="font-medium text-[#FF640D]">
                  {post.author}
                </span>
                <span className="bg-orange-50 px-3 py-1 rounded-full text-orange-600">
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center mt-8"
      >
        <Link
          to="/forums"
          className="inline-block px-8 py-3 bg-gradient-to-r from-[#FF640D] to-orange-500 text-white rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
        >
          Explore All Community Posts →
        </Link>
      </motion.div>
    </div>
  );
};

export default LatestCommunity;
