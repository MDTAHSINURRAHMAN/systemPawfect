import { useContext, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const AddForum = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("general");

  const createForum = useMutation({
    mutationFn: async (forumData) => {
      const response = await axios.post(
        "https://pawfect-server-beige.vercel.app/forums",
        forumData
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["forums"]);
      toast.success("Forum created successfully!");
      navigate("/forums");
    },
    onError: (error) => {
      toast.error("Failed to create forum. Please try again.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    createForum.mutate({
      title,
      content,
      category,
      authorId: user?._id,
      authorName: user?.name,
      authorEmail: user?.email,
      createdAt: new Date(),
      votes: [],
      comments: [],
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8"
    >
      <motion.h1
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 md:mb-8 text-center bg-gradient-to-r from-[#FF640D] to-orange-600 bg-clip-text text-transparent"
      >
        Create New Forum Post
      </motion.h1>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        onSubmit={handleSubmit}
        className="space-y-4 md:space-y-6 bg-gradient-to-br from-white to-orange-50 p-6 rounded-xl shadow-lg"
      >
        <motion.div whileHover={{ scale: 1.02 }}>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-[#FF640D] focus:border-transparent transition-all duration-300"
            placeholder="Enter forum title"
          />
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }}>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-[#FF640D] focus:border-transparent transition-all duration-300"
          >
            <option value="general">General Discussion</option>
            <option value="pet-care">Pet Care</option>
            <option value="training">Training</option>
            <option value="health">Pet Health</option>
            <option value="adoption">Adoption</option>
            <option value="behavior">Pet Behavior</option>
            <option value="nutrition">Pet Nutrition</option>
            <option value="grooming">Grooming</option>
          </select>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }}>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Content
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows="8"
            className="w-full px-4 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-[#FF640D] focus:border-transparent transition-all duration-300"
            placeholder="Write your forum content here..."
          />
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row justify-end gap-4 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.button
            type="button"
            onClick={() => navigate(-1)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2 border border-orange-200 rounded-lg hover:bg-gradient-to-r hover:from-orange-50 hover:to-white transition-all duration-300"
          >
            Cancel
          </motion.button>
          <motion.button
            type="submit"
            disabled={createForum.isLoading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2 bg-gradient-to-r from-[#FF640D] to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 disabled:opacity-50 shadow-md hover:shadow-lg"
          >
            {createForum.isLoading ? "Creating..." : "Create Forum"}
          </motion.button>
        </motion.div>
      </motion.form>

      {createForum.isError && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg shadow-md"
        >
          Error creating forum post. Please try again.
        </motion.div>
      )}
    </motion.div>
  );
};

export default AddForum;
