import { useContext, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { FaArrowUp, FaArrowDown, FaPlus, FaTimes } from "react-icons/fa";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

const Forum = () => {
  const { user } = useContext(AuthContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
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

  const createForumMutation = useMutation({
    mutationFn: async (forumData) => {
      const response = await axios.post("http://localhost:5000/forums", forumData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["forums"]);
      toast.success("Forum post created successfully!");
      setShowModal(false);
      setTitle("");
      setContent("");
    },
    onError: () => {
      toast.error("Failed to create forum post. Please try again.");
    }
  });

  const handleCreateForum = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    createForumMutation.mutate({
      title,
      content,
      authorId: user?._id,
      authorName: user?.name,
      authorEmail: user?.email,
      createdAt: new Date(),
      votes: [],
      comments: [],
    });
  };

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
          className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-black to-orange-500 bg-clip-text text-transparent"
        >
          Pet Community Forums
        </motion.h1>

        {user && (
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors gap-2"
          >
            <FaPlus /> Create Post
          </button>
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 w-full max-w-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Create New Forum Post</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleCreateForum} className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter post title"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Content</label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent h-40"
                    placeholder="Enter post content"
                  />
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                    disabled={createForumMutation.isLoading}
                  >
                    {createForumMutation.isLoading ? "Creating..." : "Create Post"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {currentPosts.slice(0, 3).map((forum, index) => {
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
