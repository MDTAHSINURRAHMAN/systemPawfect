import { useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { FaArrowUp, FaArrowDown, FaComments, FaShare } from "react-icons/fa";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

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
    onSuccess: () => {
      queryClient.invalidateQueries(["forum", id]);
      toast.success("Vote recorded successfully!");
    },
    onError: () => {
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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-lg font-medium">
          Error loading forum details. Please try again later.
        </div>
      </div>
    );
  }

  const upvotes = forum.votes?.filter((v) => v.type === "upvote").length || 0;
  const downvotes = forum.votes?.filter((v) => v.type === "downvote").length || 0;
  const totalVotes = upvotes - downvotes;

  return (
    <>
      <Helmet>
        <title>Pawfect | {forum.title}</title>
      </Helmet>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-28 md:py-12 lg:py-16 max-w-6xl"
      >
        <motion.article
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-6 md:p-8 hover:shadow-2xl transition-all duration-300"
        >
          <header className="flex flex-col md:flex-row gap-6 mb-8">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex md:flex-col items-center gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleVote("upvote")}
                className={`p-3 rounded-full transition-colors ${
                  forum.votes?.find(
                    (v) => v.userId === user?._id && v.type === "upvote"
                  )
                    ? "bg-orange-100 text-orange-500"
                    : "text-gray-400 hover:bg-orange-50 hover:text-orange-500"
                }`}
                disabled={voteMutation.isLoading}
              >
                <FaArrowUp className="text-2xl" />
              </motion.button>

              <motion.span
                whileHover={{ scale: 1.1 }}
                className="text-xl font-bold text-gray-700"
              >
                {totalVotes}
              </motion.span>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleVote("downvote")}
                className={`p-3 rounded-full transition-colors ${
                  forum.votes?.find(
                    (v) => v.userId === user?._id && v.type === "downvote"
                  )
                    ? "bg-orange-100 text-orange-500"
                    : "text-gray-400 hover:bg-orange-50 hover:text-orange-500"
                }`}
                disabled={voteMutation.isLoading}
              >
                <FaArrowDown className="text-2xl" />
              </motion.button>
            </motion.div>

            <div className="flex-1 space-y-4">
              <motion.h1
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent"
              >
                {forum.title}
              </motion.h1>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap gap-4 text-sm text-gray-600"
              >
                <div className="flex items-center gap-2">
                  <img
                    src={`https://ui-avatars.com/api/?name=${forum.authorName}&background=random`}
                    alt={forum.authorName}
                    className="w-6 h-6 rounded-full"
                  />
                  <span>{forum.authorName}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span>
                    {new Date(forum.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaComments className="text-orange-500" />
                    {forum.comments?.length || 0} comments
                  </span>
                </div>
              </motion.div>
            </div>
          </header>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="prose prose-lg max-w-none"
          >
            <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {forum.content}
            </div>
          </motion.div>

          <motion.footer
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center"
          >
            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 text-gray-500 hover:text-orange-500"
              >
                <FaShare />
                Share
              </motion.button>
            </div>
          </motion.footer>
        </motion.article>
      </motion.div>
    </>
  );
};

export default ForumDetails;
