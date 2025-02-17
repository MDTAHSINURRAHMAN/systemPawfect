import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import { FaQuoteLeft, FaStar, FaPaw } from "react-icons/fa";

const FeedbackHome = () => {
  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:5000/reviews");
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg text-orange-500"></span>
      </div>
    );
  }

  return (
    <div className="py-20 bg-gradient-to-br from-gray-50 to-orange-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-black to-orange-500 bg-clip-text text-transparent">
            What Pet Parents Say
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover what our community has to say about their experience with our dedicated volunteers
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.slice(0, 6).map((review, index) => (
            <motion.div
              key={review._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <img
                    src={review.userImage || "https://i.ibb.co/7CL7JfV/user-placeholder.png"}
                    alt={review.userName}
                    className="w-16 h-16 rounded-full object-cover border-4 border-orange-100"
                  />
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800">
                      {review.userName}
                    </h3>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <FaQuoteLeft className="text-3xl text-orange-200" />
              </div>

              <div className="mb-4">
                <p className="text-gray-600 line-clamp-4">{review.review}</p>
              </div>

              <div className="flex items-center gap-2 text-gray-500">
                <FaPaw className="text-orange-400" />
                <span className="text-sm">Volunteer: {review.trainerName}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-12"
        >
          <button className="px-8 py-3 bg-gradient-to-r from-black to-orange-500 text-white rounded-full hover:from-orange-600 hover:to-orange-700 transition duration-300">
            View All Reviews
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default FeedbackHome;
