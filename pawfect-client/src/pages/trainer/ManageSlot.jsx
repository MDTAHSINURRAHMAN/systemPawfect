import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const ManageSlot = () => {
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const [slotToDelete, setSlotToDelete] = useState(null);

  const { data: trainerSlots, isLoading } = useQuery({
    queryKey: ["trainerSlots", user?.email],
    queryFn: async () => {
      const response = await axios.get(`http://localhost:5000/all-slots`);
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  const handleDelete = async (slotId) => {
    setSlotToDelete(slotId);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/slots/${slotToDelete}`);
      queryClient.invalidateQueries(["trainerSlots"]);
      setSlotToDelete(null);
    } catch (error) {
      console.error("Error deleting slot:", error);
      toast.error("Error deleting slot");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-4 sm:p-6 lg:p-8 min-h-screen bg-gradient-to-br from-orange-50 to-white"
    >
      <motion.h2
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8 lg:mb-12 text-center bg-gradient-to-r from-[#FF640D] to-orange-600 bg-clip-text text-transparent"
      >
        Manage Your Slots
      </motion.h2>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="overflow-x-auto rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-orange-100"
      >
        <table className="min-w-full bg-gradient-to-br from-white to-orange-50">
          <thead className="bg-gradient-to-r from-[#FF640D]/10 to-orange-100/20">
            <tr>
              <th className="px-4 sm:px-6 py-3 text-left text-sm sm:text-base font-semibold text-gray-700">
                Day
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-sm sm:text-base font-semibold text-gray-700">
                Time
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-sm sm:text-base font-semibold text-gray-700">
                Status
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-sm sm:text-base font-semibold text-gray-700">
                Booked By
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-sm sm:text-base font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-orange-100">
            {trainerSlots?.map((slot, index) => (
              <motion.tr
                key={slot._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{
                  scale: 1.01,
                  backgroundColor: "rgba(255,255,255,0.6)",
                }}
                className="hover:bg-orange-50/30 transition-colors duration-200"
              >
                <td className="px-4 sm:px-6 py-4 text-sm sm:text-base">
                  {slot.day}
                </td>
                <td className="px-4 sm:px-6 py-4 text-sm sm:text-base">
                  {slot.time}
                </td>
                <td className="px-4 sm:px-6 py-4">
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    className={`px-3 py-1 rounded-full text-sm ${
                      slot.isBooked
                        ? "bg-gradient-to-r from-red-100 to-red-200 text-red-800"
                        : "bg-gradient-to-r from-green-100 to-green-200 text-green-800"
                    }`}
                  >
                    {slot.isBooked ? "Booked" : "Available"}
                  </motion.span>
                </td>
                <td className="px-4 sm:px-6 py-4 text-sm sm:text-base">
                  {slot.bookedBy || "N/A"}
                </td>
                <td className="px-4 sm:px-6 py-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={slot.isBooked}
                    onClick={() => handleDelete(slot._id)}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-medium shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Delete
                  </motion.button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {(!trainerSlots || trainerSlots.length === 0) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center py-8 sm:py-12"
        >
          <p className="text-gray-500 text-lg sm:text-xl">No slots available</p>
        </motion.div>
      )}

      {/* Delete Confirmation Modal */}
      {slotToDelete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-gradient-to-br from-white to-orange-50 p-6 sm:p-8 rounded-2xl max-w-md w-full mx-4 shadow-2xl border border-orange-100"
          >
            <h3 className="text-xl sm:text-2xl font-bold mb-4 bg-gradient-to-r from-[#FF640D] to-orange-600 bg-clip-text text-transparent">
              Confirm Delete
            </h3>
            <p className="mb-6 text-gray-600">
              Are you sure you want to delete this slot?
            </p>
            <div className="flex justify-end gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSlotToDelete(null)}
                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors duration-300"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white font-medium shadow-md hover:shadow-lg transition-all duration-300"
              >
                Delete
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ManageSlot;
