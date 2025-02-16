import { useState, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaStar } from "react-icons/fa";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const BookedTrainers = () => {
  const { user } = useContext(AuthContext);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [hover, setHover] = useState(null);
  const queryClient = useQueryClient();

  const { data: bookedTrainers, isLoading } = useQuery({
    queryKey: ["bookedTrainers", user?.email],
    queryFn: async () => {
      const response = await axios.get(
        `http://localhost:5000/booked-volunteers`
      );
      return response.data;
    },
  });

  // find the user name and photoURL using the user email
  const { data: userData } = useQuery({
    queryKey: ["user", user?.email],
    queryFn: async () => {
      const response = await axios.get(
        `http://localhost:5000/users/${user?.email}`
      );
      return response.data;
    },
  });

  console.log(userData);

  const submitReview = useMutation({
    mutationFn: async (reviewData) => {
      const response = await axios.post(
        "http://localhost:5000/reviews",
        reviewData
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["reviews"]);
      setSelectedTrainer(null);
      setRating(0);
      setReview("");
    },
  });

  const handleReviewSubmit = (e) => {
    e.preventDefault();

    submitReview.mutate({
      trainerId: selectedTrainer.trainerId,
      trainerName: selectedTrainer.trainerName,
      rating,
      review,
      userEmail: user?.email,
      userName: userData?.name,
      userImage: userData?.photoURL,
      date: new Date(),
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <motion.h1
        initial={{ x: -50 }}
        animate={{ x: 0 }}
        className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent"
      >
        My Booked Volunteers
      </motion.h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {bookedTrainers?.map((booking, index) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            key={booking._id}
            className="bg-gradient-to-br from-gray-50 to-white text-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 hover:shadow-orange-500/20 transition-all duration-300"
          >
            {/* Booking Info Section */}
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                {booking.trainerName}
              </h2>
              <div className="space-y-3">
                <p className="text-gray-600 flex items-center gap-2">
                  <i className="fas fa-box text-orange-500"></i>
                  Package: {booking.packageName}
                </p>
                <p className="text-gray-600 flex items-center gap-2">
                  <i className="fas fa-dollar-sign text-orange-500"></i>
                  Amount Paid: ${booking.amount}
                </p>
                <p className="text-gray-600 flex items-center gap-2">
                  <i className="fas fa-calendar text-orange-500"></i>
                  Booking Date: {new Date(booking.date).toLocaleDateString()}
                </p>
                <p className="text-gray-600 flex items-center gap-2">
                  <i className="fas fa-clock text-orange-500"></i>
                  Selected Day: {booking.selectedDay}
                </p>
                <p className="text-gray-600 flex items-center gap-2">
                  <i className="fas fa-check-circle text-orange-500"></i>
                  Status:
                  <span className="ml-2 px-3 py-1 rounded-full text-white bg-gradient-to-r from-orange-500 to-orange-600 text-sm">
                    {booking.status}
                  </span>
                </p>
              </div>
            </div>

            {/* Transaction Info */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3 text-orange-400">
                Transaction Details
              </h3>
              <p className="text-gray-600 text-sm break-all">
                ID: {booking.transactionId}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* <Link
                  to={`/trainer/${booking.trainerId}`}
                  className="block w-auto text-center bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-1.5 rounded-xl hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-300 text-sm"
                >
                  View Volunteer
                </Link> */}
              </motion.div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedTrainer(booking)}
                className="w-auto bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-1.5 rounded-xl hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-300 text-sm"
              >
                Write Review
              </motion.button>
            </div>
          </motion.div>
        ))}

        {(!bookedTrainers || bookedTrainers.length === 0) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-full text-center py-12"
          >
            <p className="text-gray-500 text-lg">No bookings found</p>
          </motion.div>
        )}
      </motion.div>

      {/* Review Modal */}
      {selectedTrainer && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-2xl p-8 max-w-md w-full shadow-2xl border border-gray-700"
          >
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
              Write a Review for {selectedTrainer.trainerName}
            </h2>

            <form onSubmit={handleReviewSubmit} className="space-y-6">
              <div className="flex gap-2 justify-center">
                {[...Array(5)].map((_, index) => {
                  const ratingValue = index + 1;
                  return (
                    <motion.label
                      key={index}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <input
                        type="radio"
                        name="rating"
                        className="hidden"
                        value={ratingValue}
                        onClick={() => setRating(ratingValue)}
                      />
                      <FaStar
                        className="cursor-pointer"
                        color={
                          ratingValue <= (hover || rating)
                            ? "#f97316"
                            : "#4b5563"
                        }
                        size={32}
                        onMouseEnter={() => setHover(ratingValue)}
                        onMouseLeave={() => setHover(null)}
                      />
                    </motion.label>
                  );
                })}
              </div>

              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                className="w-full p-4 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 h-32 resize-none"
                placeholder="Write your review here..."
                required
              />

              <div className="flex flex-col sm:flex-row justify-end gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => setSelectedTrainer(null)}
                  className="px-6 py-2 bg-gray-700 rounded-xl hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-300"
                >
                  Submit Review
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default BookedTrainers;
