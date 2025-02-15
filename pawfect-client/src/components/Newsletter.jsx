import { useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import emailjs from '@emailjs/browser';
import axios from "axios";
import { FaPaw, FaEnvelope, FaUser } from 'react-icons/fa';

const Newsletter = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    try {
      // Send email using EmailJS
      await emailjs.send(
        'service_836k5dk',
        'template_bhczoyo',
        {
          to_name: 'Admin',
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
        },
        'lLc34fENlSbQG8IkO'
      );

      // Save to MongoDB
      const response = await axios.post(
        "http://localhost:5000/newsletter/subscribe",
        formData
      );

      if (response.status === 201) {
        setStatus("Thank you for subscribing! We'll be in touch soon.");
        setFormData({ name: "", email: "", message: "" });
      }
    } catch (error) {
      setStatus("Something went wrong. Please try again.");
      console.error("Subscription error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      ref={ref}
      className="bg-gradient-to-b from-orange-50 to-white py-16 sm:py-20"
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ y: 20, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex justify-center mb-4">
            <FaPaw className="text-4xl text-orange-500 animate-bounce" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Join Our <span className="text-orange-500">Pawsome</span> Community
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Subscribe to receive exclusive pet care tips, special offers, and heartwarming stories from our furry friends!
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-xl space-y-6"
          initial={{ y: 20, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <motion.div className="relative" whileHover={{ scale: 1.01 }}>
            <FaUser className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300"
              required
            />
          </motion.div>

          <motion.div className="relative" whileHover={{ scale: 1.01 }}>
            <FaEnvelope className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email"
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300"
              required
            />
          </motion.div>

          <motion.div whileHover={{ scale: 1.01 }}>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your Message (Optional)"
              className="w-full p-4 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300 h-32 resize-none"
            />
          </motion.div>

          <motion.button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-xl font-semibold shadow-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 disabled:opacity-70"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="loading loading-spinner loading-sm"></span>
                Subscribing...
              </span>
            ) : (
              "Subscribe Now"
            )}
          </motion.button>

          {status && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-center p-4 rounded-lg ${
                status.includes("wrong") ? "bg-red-50 text-red-500" : "bg-green-50 text-green-500"
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
