import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { FaStar } from "react-icons/fa";
import { motion } from "framer-motion";

const MyReviews = () => {
  const { user } = useContext(AuthContext);

  const { data: reviews, isLoading } = useQuery({
    queryKey: ["reviews", user?.email],
    queryFn: async () => {
      const response = await axios.get(
        `http://localhost:5000/reviews/${user?.email}`
      );
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8 min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50"
    >
      <motion.h1
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 text-center bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent"
      >
        My Reviews
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews?.map((review, index) => (
          <motion.div
            key={review._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-center gap-4 mb-4">
              <img
                src={review.userImage}
                alt={review.userName}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold text-lg">{review.trainerName}</h3>
                <p className="text-gray-500 text-sm">
                  {new Date(review.date).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex mb-3">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={`${
                    i < review.rating ? "text-yellow-400" : "text-gray-300"
                  } w-5 h-5`}
                />
              ))}
            </div>

            <p className="text-gray-700 mb-4">{review.review}</p>

            <div className="pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-500">
                Reviewed by: {review.userName}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {reviews?.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          You haven't written any reviews yet.
        </div>
      )}
    </motion.div>
  );
};

export default MyReviews;
