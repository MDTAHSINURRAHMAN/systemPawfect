import { useContext, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { FaArrowUp, FaArrowDown, FaPlus } from "react-icons/fa";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

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
      queryClient.setQueryData(["forums"], (oldData) => {
        return oldData.map((forum) => {
          if (forum._id === variables.forumId) {
            const existingVote = forum.votes?.find(
              (v) => v.userId === user?._id
            );
            let newVotes = forum.votes || [];

            if (existingVote) {
              newVotes = newVotes.filter((v) => v.userId !== user?._id);
            }

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
      toast.success("Vote recorded successfully");
      queryClient.invalidateQueries(["forums"]);
    },
    onError: () => {
      toast.error("Failed to record vote. Please try again.");
    }
  });

  const handleVote = (forumId, voteType) => {
    if (!user) {
      toast.error("Please log in to vote");
      return;
    }
    voteMutation.mutate({ forumId, voteType });
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
          Error loading forums. Please try again later.
        </div>
      </div>
    );
  }

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = forums.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(forums.length / postsPerPage);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-28 max-w-7xl"
    >
      <Helmet>
        <title>Pawfect | Forums</title>
      </Helmet>

      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <motion.h1
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-3xl md:text-4xl font-bold text-gray-800"
        >
          Pet Community Forums
        </motion.h1>

        {/* {user && (
          <Link
            to="/dashboard/forums"
            className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors gap-2"
          >
            <FaPlus /> Create Post
          </Link>
        )} */}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {currentPosts.map((forum, index) => {
          const upvotes = forum.votes?.filter((v) => v.type === "upvote").length || 0;
          const downvotes = forum.votes?.filter((v) => v.type === "downvote").length || 0;
          const totalVotes = upvotes - downvotes;

          return (
            <motion.div
              key={forum._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-6"
            >
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => handleVote(forum._id, "upvote")}
                    className={`p-2 rounded-full transition-colors ${
                      forum.votes?.find(v => v.userId === user?._id && v.type === "upvote")
                        ? "bg-orange-100 text-orange-500"
                        : "text-gray-400 hover:text-orange-500"
                    }`}
                    disabled={voteMutation.isLoading}
                  >
                    <FaArrowUp className="w-5 h-5" />
                  </button>
                  <span className="font-semibold text-lg">{totalVotes}</span>
                  <button
                    onClick={() => handleVote(forum._id, "downvote")}
                    className={`p-2 rounded-full transition-colors ${
                      forum.votes?.find(v => v.userId === user?._id && v.type === "downvote")
                        ? "bg-orange-100 text-orange-500"
                        : "text-gray-400 hover:text-orange-500"
                    }`}
                    disabled={voteMutation.isLoading}
                  >
                    <FaArrowDown className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex-1 space-y-3">
                  <h2 className="text-xl font-semibold text-gray-800 line-clamp-2">
                    {forum.title}
                  </h2>
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {forum.content}
                  </p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>{forum.authorName}</span>
                    <span>{new Date(forum.createdAt).toLocaleDateString()}</span>
                  </div>
                  <Link
                    to={`/forums/${forum._id}`}
                    className="inline-block w-full text-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    View Discussion
                  </Link>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                currentPage === index + 1
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Forum;
