import { useContext, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
const Forum = () => {
  const { user } = useContext(AuthContext);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;
  const queryClient = useQueryClient();

  const {
    data: forums = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["forums"],
    queryFn: async () => {
      const response = await axios.get("http://localhost:5000/forums");
      return response.data;
    },
  });

  const voteMutation = useMutation({
    mutationFn: async ({ forumId, voteType }) => {
      const response = await axios.post(
        `http://localhost:5000/forums/${forumId}/vote`,
        {
          userId: user?._id,
          voteType,
        }
      );
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Optimistically update the UI
      queryClient.setQueryData(["forums"], (oldData) => {
        return oldData.map((forum) => {
          if (forum._id === variables.forumId) {
            const existingVote = forum.votes?.find(
              (v) => v.userId === user?._id
            );
            let newVotes = forum.votes || [];

            if (existingVote) {
              // Remove existing vote
              newVotes = newVotes.filter((v) => v.userId !== user?._id);
            }

            // Add new vote
            newVotes.push({
              userId: user?._id,
              type: variables.voteType,
            });

            return {
              ...forum,
              votes: newVotes,
            };
          }
          return forum;
        });
      });
      toast.success("Vote successful!");

      // Refetch to ensure server sync
      queryClient.invalidateQueries(["forums"]);
    },
  });

  const handleVote = (forumId, voteType) => {
    if (!user) {
      toast.error("Please log in to vote");
      return;
    }
    voteMutation.mutate({ forumId, voteType });
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500">Error loading forums</div>
    );
  }

  // Calculate pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = forums.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(forums.length / postsPerPage);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8"
    >
      <motion.div
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0"
      >
        <motion.h1
          whileHover={{ scale: 1.05 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-bold zen-dots text-[#383838] hover:text-[#FF640D] transition-colors duration-300"
        >
          Fitness Forums
        </motion.h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      >
        {currentPosts.map((forum, index) => {
          const upvotes =
            forum.votes?.filter((v) => v.type === "upvote").length || 0;
          const downvotes =
            forum.votes?.filter((v) => v.type === "downvote").length || 0;
          const totalVotes = upvotes - downvotes;

          return (
            <>
              <Helmet>
                <title>Fitverse | Forum</title>
              </Helmet>
              <motion.div
                key={forum._id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-orange-100"
              >
                <div className="flex items-start gap-4">
                  <motion.div
                    className="flex flex-col items-center gap-2"
                    whileHover={{ scale: 1.1 }}
                  >
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleVote(forum._id, "upvote")}
                      className={`p-2 rounded-full transition-colors duration-300 ${
                        forum.votes?.find(
                          (v) => v.userId === user?._id && v.type === "upvote"
                        )
                          ? "bg-orange-100 text-[#FF640D]"
                          : "text-gray-400 hover:bg-orange-50 hover:text-[#FF640D]"
                      }`}
                      disabled={voteMutation.isLoading}
                    >
                      <FaArrowUp size={24} />
                    </motion.button>
                    <span className="font-bold text-lg">{totalVotes}</span>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleVote(forum._id, "downvote")}
                      className={`p-2 rounded-full transition-colors duration-300 ${
                        forum.votes?.find(
                          (v) => v.userId === user?._id && v.type === "downvote"
                        )
                          ? "bg-orange-100 text-[#FF640D]"
                          : "text-gray-400 hover:bg-orange-50 hover:text-[#FF640D]"
                      }`}
                      disabled={voteMutation.isLoading}
                    >
                      <FaArrowDown size={24} />
                    </motion.button>
                  </motion.div>
                  <div className="flex-1 space-y-4">
                    <motion.h2
                      whileHover={{ scale: 1.02 }}
                      className="text-xl sm:text-2xl font-bold text-gray-800 hover:text-[#FF640D] transition-colors duration-300"
                    >
                      {forum.title}
                    </motion.h2>
                    <motion.p
                      initial={{ opacity: 0.8 }}
                      whileHover={{ opacity: 1 }}
                      className="text-gray-600 line-clamp-3 text-sm sm:text-base"
                    >
                      {forum.content}
                    </motion.p>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-sm text-gray-500">
                      <span className="font-medium">{forum.authorName}</span>
                      <span className="text-orange-400">
                        {new Date(forum.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        to={`/forums/${forum._id}`}
                        className="inline-block w-full sm:w-auto text-center px-6 py-3 bg-gradient-to-r from-[#FF640D] to-orange-500 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        Forum Details
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </>
          );
        })}
      </motion.div>

      {/* Pagination */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-wrap justify-center gap-2 mt-8"
      >
        {[...Array(totalPages)].map((_, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setCurrentPage(index + 1);
              // Reset form fields after successful forum creation
              if (formRef.current) {
                formRef.current.reset();
              }
            }}
            className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
              currentPage === index + 1
                ? "bg-gradient-to-r from-[#FF640D] to-orange-500 text-white shadow-lg"
                : "bg-orange-50 text-gray-700 hover:bg-orange-100"
            }`}
          >
            {index + 1}
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default Forum;
