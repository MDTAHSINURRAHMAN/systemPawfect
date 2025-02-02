import { useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import axios from "axios";

const Newsletter = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [status, setStatus] = useState("");
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/newsletter/subscribe",
        formData
      );
      if (response.status === 201) {
        setStatus("Successfully subscribed to newsletter!");
        setFormData({ name: "", email: "" });
      }
    } catch (error) {
      setStatus("Failed to subscribe. Please try again.");
      console.error("Newsletter subscription error:", error);
    }
  };

  return (
    <motion.div
      ref={ref}
      className="bg-base-200 py-12 sm:py-16"
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div
          className="text-center mb-8 sm:mb-12"
          initial={{ y: 20, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="zen-dots text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Stay updated with our latest fitness tips and news!
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          className="max-w-md mx-auto space-y-4 sm:space-y-6"
          initial={{ y: 20, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <motion.div
            className="form-control"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="input input-bordered w-full p-3 rounded-lg focus:ring-2 focus:ring-[#FF640D] transition-all duration-300"
              required
            />
          </motion.div>

          <motion.div
            className="form-control"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="input input-bordered w-full p-3 rounded-lg focus:ring-2 focus:ring-[#FF640D] transition-all duration-300"
              required
            />
          </motion.div>

          <motion.button
            type="submit"
            className="btn w-full bg-[#FF640D] hover:bg-[#ff7a33] text-white transition-colors duration-300 py-3 rounded-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Subscribe Now
          </motion.button>

          {status && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-center mt-4 text-sm sm:text-base ${
                status.includes("Failed") ? "text-red-500" : "text-green-500"
              }`}
            >
              {status}
            </motion.div>
          )}
        </motion.form>
      </div>
    </motion.div>
  );
};

export default Newsletter;
