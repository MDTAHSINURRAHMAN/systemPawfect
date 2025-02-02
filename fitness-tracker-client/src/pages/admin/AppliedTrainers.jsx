import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { FaCheck, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
const AppliedTrainers = () => {
  const queryClient = useQueryClient();
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [rejectionFeedback, setRejectionFeedback] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");

  const { data: volunteers = [], isLoading } = useQuery({
    queryKey: ["pending-volunteer"],
    queryFn: async () => {
      const { data } = await axios.get(
        "http://localhost:5000/pending-volunteers"
      );
      return data;
    },
  });

  const updateVolunteerStatusMutation = useMutation({
    mutationFn: async ({ volunteerId, status }) => {
      await axios.patch(`http://localhost:5000/volunteers/${volunteerId}`, {
        status,
      });
    },
    onSuccess: () => {
      // Immediately update the local state to remove the trainer
      queryClient.setQueryData(["pending-volunteers"], (oldData) => {
        return oldData.filter((volunteer) => volunteer._id !== selectedVolunteer._id);
      });

      // Also invalidate the query to ensure data consistency
      queryClient.invalidateQueries(["pending-volunteers"]);
      setShowModal(false);
      setRejectionFeedback("");
      setSelectedVolunteer(null);
    },
  });

  const rejectVolunteerMutation = useMutation({
    mutationFn: async ({ volunteerId, feedback }) => {
      try {
        const response = await axios.patch(
          `http://localhost:5000/volunteers/${volunteerId}/reject`,
          {
            feedback,
          }
        );
        return response.data;
      } catch (error) {
        // Extract meaningful error message from the response
        const errorMessage =
          error.response?.data?.message ||
          "Failed to reject trainer. Please try again.";
        throw new Error(errorMessage);
      }
    },
    onSuccess: () => {
      queryClient.setQueryData(["pending-volunteer"], (oldData) => {
        return oldData.filter((volunteer) => volunteer._id !== selectedVolunteer._id);
      });

      queryClient.invalidateQueries(["pending-volunteer"]);
      setShowModal(false);
      setRejectionFeedback("");
      setSelectedVolunteer(null);
      setError("");
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const handleUpdateStatus = async (volunteerId, status) => {
    if (status === "active") {
      if (window.confirm("Are you sure you want to approve this volunteer?")) {
        try {
          const volunteer = volunteers.find((v) => v._id === volunteerId);
          setSelectedVolunteer(volunteer);
          await updateVolunteerStatusMutation.mutateAsync({ volunteerId, status });
        } catch (err) {
          console.error("Error updating volunteer status:", err);
        }
      }
    } else {
      const volunteer = volunteers.find((v) => v._id === volunteerId);
      setSelectedVolunteer(volunteer);
      setShowModal(true);
    }
  };

  const handleReject = async () => {
    setError(""); // Clear any previous errors
    try {
      await rejectVolunteerMutation.mutateAsync({
        volunteerId: selectedVolunteer._id,
        feedback: rejectionFeedback,
      });
    } catch (err) {
      // Error will be handled by onError callback
      console.error("Error rejecting volunteer:", err);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-4 md:p-6 lg:p-8"
    >
      <motion.h2
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 md:mb-8 text-center bg-gradient-to-r from-[#FF640D] to-orange-600 bg-clip-text text-transparent"
      >
        Applied Volunteers
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
      >
        {volunteers.map((volunteer, index) => (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            key={volunteer._id}
            className="bg-gradient-to-br from-white to-orange-50 rounded-xl shadow-lg overflow-hidden border border-orange-100 hover:shadow-xl transition-all duration-300"
          >
            <div className="relative">
              <motion.img
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                src={volunteer.profileImage}
                alt={volunteer.fullName}
                className="w-full h-48 sm:h-56 object-cover"
                onError={(e) => {
                  e.target.src = "https://i.ibb.co/MgsTCcv/avater.jpg";
                }}
              />
            </div>

            <div className="p-4 md:p-6">
              <h3 className="text-lg md:text-xl font-semibold mb-3 text-gray-800">
                {volunteer.fullName}
              </h3>
              <div className="space-y-2 text-gray-600 mb-4">
                <p className="flex items-center">
                  <span className="font-medium mr-2">Age:</span> {volunteer.age}{" "}
                  years
                </p>
                <p className="flex items-center">
                  <span className="font-medium mr-2">Experience:</span>{" "}
                  {volunteer.experience} years
                </p>
                <p className="flex items-center">
                  <span className="font-medium mr-2">Available Time:</span>{" "}
                  {volunteer.availableTime}
                </p>
                <p className="flex items-center flex-wrap">
                  <span className="font-medium mr-2">Skills:</span>{" "}
                  {volunteer.skills.join(", ")}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleUpdateStatus(volunteer._id, "active")}
                  className="flex-1 flex items-center justify-center px-4 py-2 bg-gradient-to-r from-[#FF640D] to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <FaCheck className="mr-2" />
                  Approve
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleUpdateStatus(volunteer._id, "rejected")}
                  className="flex-1 flex items-center justify-center px-4 py-2 bg-gradient-to-r from-[#FF640D] to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <FaTimes className="mr-2" />
                  Reject
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {volunteers.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-gray-500 mt-8 p-8 bg-gradient-to-r from-orange-50 to-white rounded-xl shadow-inner"
        >
          No pending trainer applications
        </motion.div>
      )}

      {/* Rejection Modal */}
      {showModal && selectedVolunteer && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-br from-white to-orange-50 rounded-xl max-w-2xl w-full p-6 shadow-2xl"
          >
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-[#FF640D] to-orange-600 bg-clip-text text-transparent">
              Reject Volunteer Application
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <motion.div whileHover={{ scale: 1.02 }}>
                <img
                  src={selectedVolunteer.profileImage}
                  alt={selectedVolunteer.fullName}
                  className="w-full h-48 object-cover rounded-lg shadow-md"
                  onError={(e) => {
                    e.target.src = "https://i.ibb.co/MgsTCcv/avater.jpg";
                  }}
                />
              </motion.div>
              <div className="space-y-2 text-gray-700">
                <p>
                  <span className="font-semibold text-orange-600">Name:</span>{" "}
                  {selectedVolunteer.fullName}
                </p>
                <p>
                  <span className="font-semibold text-orange-600">Age:</span>{" "}
                  {selectedVolunteer.age} years
                </p>
                <p>
                  <span className="font-semibold text-orange-600">
                    Experience:
                  </span>{" "}
                  {selectedVolunteer.experience} years
                </p>
                <p>
                  <span className="font-semibold text-orange-600">Skills:</span>{" "}
                  {selectedVolunteer.skills.join(", ")}
                </p>
                <p>
                  <span className="font-semibold text-orange-600">
                    Available Time:
                  </span>{" "}
                  {selectedVolunteer.availableTime}
                </p>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg"
              >
                {error}
              </motion.div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-orange-600">
                Rejection Feedback
              </label>
              <textarea
                value={rejectionFeedback}
                onChange={(e) => setRejectionFeedback(e.target.value)}
                className="w-full p-3 border border-orange-200 rounded-lg h-32 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                placeholder="Please provide feedback for rejection..."
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowModal(false)}
                className="px-6 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleReject}
                className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-lg"
                disabled={!rejectionFeedback.trim()}
              >
                Confirm Rejection
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AppliedTrainers;
