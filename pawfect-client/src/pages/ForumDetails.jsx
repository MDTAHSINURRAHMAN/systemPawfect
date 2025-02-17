import { useContext, useState } from "react";
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
  const [comment, setComment] = useState("");

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

  const { data: comments = [] } = useQuery({
    queryKey: ["comments", id],
    queryFn: async () => {
      const response = await axios.get(`http://localhost:5000/forums/${id}/comments`);
      return response.data;
    }
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

  const commentMutation = useMutation({
    mutationFn: async (commentData) => {
      const response = await axios.post(
        `http://localhost:5000/forums/${id}/comments`,
        commentData
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["forum", id]);
      queryClient.invalidateQueries(["comments", id]);
      setComment("");
      toast.success("Comment added successfully!");
    },
    onError: () => {
      toast.error("Failed to add comment. Please try again.");
    },
  });

  const commentVoteMutation = useMutation({
    mutationFn: async ({ commentId, voteType }) => {
      const response = await axios.post(
        `http://localhost:5000/forums/${id}/comments/${commentId}/vote`,
        {
          userId: user?._id,
          voteType,
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["forum", id]);
      queryClient.invalidateQueries(["comments", id]);
      toast.success("Comment vote recorded!");
    },
    onError: () => {
      toast.error("Failed to vote on comment.");
    },
  });

  const handleVote = (voteType) => {
    if (!user) {
      toast.error("Please log in to vote");
      return;
    }
    voteMutation.mutate({ voteType });
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please log in to comment");
      return;
    }
    if (!comment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }
    commentMutation.mutate({
      content: comment,
      forumId: id,
      authorId: user?._id,
      authorEmail: user?.email,
      createdAt: new Date(),
    });
  };

  const handleCommentVote = (commentId, voteType) => {
    if (!user) {
      toast.error("Please log in to vote");
      return;
    }
    commentVoteMutation.mutate({ commentId, voteType });
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
                  {/* <img
                    src={`https://ui-avatars.com/api/?name=${forum.authorName}&background=random`}
                    alt={forum.authorName}
                    className="w-6 h-6 rounded-full"
                  /> */}
                  <span>{forum.authorEmail}</span>
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
                    {comments.length || 0} comments
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

          {/* Comments Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-12"
          >
            <h2 className="text-2xl font-bold mb-6">Comments</h2>

            {/* Comments List */}
            <div className="space-y-6 mb-8">
              {comments.map((comment) => {
                const commentUpvotes = comment.votes?.filter((v) => v.type === "upvote").length || 0;
                const commentDownvotes = comment.votes?.filter((v) => v.type === "downvote").length || 0;
                const commentTotalVotes = commentUpvotes - commentDownvotes;

                return (
                  <motion.div
                    key={comment._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-4 bg-gray-50 p-4 rounded-lg"
                  >
                    <div className="flex flex-col items-center">
                      <button
                        onClick={() => handleCommentVote(comment._id, "upvote")}
                        className={`p-1 rounded-full ${
                          comment.votes?.find(
                            (v) => v.userId === user?._id && v.type === "upvote"
                          )
                            ? "text-orange-500"
                            : "text-gray-400 hover:text-orange-500"
                        }`}
                      >
                        <FaArrowUp />
                      </button>
                      <span className="text-sm font-semibold">{commentTotalVotes}</span>
                      <button
                        onClick={() => handleCommentVote(comment._id, "downvote")}
                        className={`p-1 rounded-full ${
                          comment.votes?.find(
                            (v) => v.userId === user?._id && v.type === "downvote"
                          )
                            ? "text-orange-500"
                            : "text-gray-400 hover:text-orange-500"
                        }`}
                      >
                        <FaArrowDown />
                      </button>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {/* <img
                          src={comment.authorEmail}
                          alt={comment.authorName}
                          className="w-5 h-5 rounded-full"
                        /> */}
                        <span className="font-medium text-sm">{comment.authorEmail}</span>
                        <span className="text-gray-500 text-sm">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700">{comment.content}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            
            {/* Comment Form */}
            <form onSubmit={handleCommentSubmit} className="mb-8">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write a comment..."
                className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent min-h-[100px]"
              />
              <button
                type="submit"
                className="mt-2 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                disabled={commentMutation.isLoading}
              >
                {commentMutation.isLoading ? "Posting..." : "Post Comment"}
              </button>
            </form>
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
