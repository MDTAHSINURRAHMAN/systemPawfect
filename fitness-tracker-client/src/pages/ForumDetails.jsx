import { useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
const ForumDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const {
    data: forum,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["forum", id],
    queryFn: async () => {
      const response = await axios.get(`http://localhost:5000/forums/${id}`);
      return response.data;
    },
  });

  const voteMutation = useMutation({
    mutationFn: async ({ voteType }) => {
      const response = await axios.post(
        `http://localhost:5000/forums/${id}/vote`,
        {
          userId: user?._id,
          voteType,
        }
      );
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["forum", id]);
      toast.success("Vote successful!");
    },
    onError: (error) => {
      toast.error("Failed to vote. Please try again.");
    },
  });

  const handleVote = (voteType) => {
    if (!user) {
      toast.error("Please log in to vote");
      return;
    }
    voteMutation.mutate({ voteType });
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500">
        Error loading forum details
      </div>
    );
  }

  const upvotes = forum.votes?.filter((v) => v.type === "upvote").length || 0;
  const downvotes =
    forum.votes?.filter((v) => v.type === "downvote").length || 0;
  const totalVotes = upvotes - downvotes;

  return (
    <>
      <Helmet>
        <title>Fitverse | Forum Details</title>
      </Helmet>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="p-4 sm:p-6 lg:p-8"
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-white to-orange-50 rounded-2xl shadow-xl p-6 sm:p-8 lg:p-10 hover:shadow-2xl transition-all duration-300 border border-orange-100"
        >
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex sm:flex-col items-center gap-3 sm:gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleVote("upvote")}
                className={`p-3 rounded-full transition-colors duration-300 ${
                  forum.votes?.find(
                    (v) => v.userId === user?._id && v.type === "upvote"
                  )
                    ? "bg-orange-100 text-[#FF640D]"
                    : "text-gray-400 hover:bg-orange-50 hover:text-[#FF640D]"
                }`}
                disabled={voteMutation.isLoading}
              >
                <FaArrowUp size={28} />
              </motion.button>
              <motion.span
                whileHover={{ scale: 1.1 }}
                className="text-xl font-bold text-gray-700"
              >
                {totalVotes}
              </motion.span>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleVote("downvote")}
                className={`p-3 rounded-full transition-colors duration-300 ${
                  forum.votes?.find(
                    (v) => v.userId === user?._id && v.type === "downvote"
                  )
                    ? "bg-orange-100 text-[#FF640D]"
                    : "text-gray-400 hover:bg-orange-50 hover:text-[#FF640D]"
                }`}
                disabled={voteMutation.isLoading}
              >
                <FaArrowDown size={28} />
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex-1 space-y-6"
            >
              <motion.h1
                whileHover={{ scale: 1.02 }}
                className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#FF640D] to-orange-600 bg-clip-text text-transparent"
              >
                {forum.title}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-gray-600 text-sm sm:text-base lg:text-lg whitespace-pre-wrap"
              >
                {forum.content}
              </motion.p>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-sm text-gray-500 border-t border-orange-100 pt-4"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-full"
                >
                  <span className="font-semibold text-[#FF640D]">
                    Posted by:
                  </span>
                  <span className="text-gray-700">{forum.authorName}</span>
                </motion.div>
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  className="text-gray-500 bg-orange-50 px-4 py-2 rounded-full"
                >
                  {new Date(forum.createdAt).toLocaleString()}
                </motion.span>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default ForumDetails;
