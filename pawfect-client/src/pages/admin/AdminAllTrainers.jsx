import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { FaTrash } from "react-icons/fa";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const AdminAllTrainers = () => {
  const queryClient = useQueryClient();

  const {
    data: volunteers = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["volunteers"],
    queryFn: async () => {
      const { data } = await axios.get("https://pawfect-server-beige.vercel.app/volunteers");
      return data;
    },
  });

  const deleteVolunteerMutation = useMutation({
    mutationFn: async (volunteerId) => {
      await axios.delete(`https://pawfect-server-beige.vercel.app/volunteers/${volunteerId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["volunteers"]);
    },
  });

  const handleDeleteVolunteer = async (volunteerId) => {
    if (
      window.confirm(
        "Are you sure you want to remove this volunteer? They will be converted back to a member."
      )
    ) {
      try {
        await deleteVolunteerMutation.mutateAsync(volunteerId);
      } catch (err) {
        console.error("Error deleting volunteer:", err);
        toast.error("Error deleting volunteer");
      }
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-error">Error loading volunteers</div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-4 md:p-8 max-w-7xl mx-auto"
    >
      <motion.h2
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 text-center bg-gradient-to-r from-[#FF640D] to-orange-600 bg-clip-text text-transparent"
      >
        All Volunteers
      </motion.h2>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="overflow-x-auto bg-white rounded-xl shadow-xl"
      >
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden ring-1 ring-black ring-opacity-5 rounded-xl">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gradient-to-r from-orange-50 to-white">
                <tr>
                  <th
                    scope="col"
                    className="py-4 pl-4 pr-3 text-left text-sm font-semibold sm:pl-6 text-[#FF640D]"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-4 text-left text-sm font-semibold text-[#FF640D]"
                  >
                    Experience
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-4 text-left text-sm font-semibold hidden md:table-cell text-[#FF640D]"
                  >
                    Age
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-4 text-left text-sm font-semibold hidden lg:table-cell text-[#FF640D]"
                  >
                    Skills
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-4 text-left text-sm font-semibold hidden sm:table-cell text-[#FF640D]"
                  >
                    Available Time
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-4 text-left text-sm font-semibold text-[#FF640D]"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-4 text-left text-sm font-semibold text-[#FF640D]"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {volunteers.map((volunteer, index) => (
                  <motion.tr
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    key={volunteer._id}
                    className="hover:bg-orange-50 transition-colors duration-200"
                  >
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                      <div className="flex items-center">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className="h-10 w-10 flex-shrink-0"
                        >
                          <img
                            className="h-10 w-10 rounded-full object-cover shadow-lg"
                            src={volunteer.profileImage}
                            alt=""
                          />
                        </motion.div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">
                            {volunteer.fullName}
                          </div>
                          <div className="text-gray-500 sm:hidden">
                            {volunteer.availableTime}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {volunteer.experience} years
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 hidden md:table-cell">
                      {volunteer.age}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 hidden lg:table-cell">
                      {volunteer.skills.join(", ")}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 hidden sm:table-cell">
                      {volunteer.availableTime}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <motion.span
                        whileHover={{ scale: 1.05 }}
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          volunteer.status === "active"
                            ? "bg-gradient-to-r from-green-100 to-green-200 text-green-800"
                            : "bg-gradient-to-r from-red-100 to-red-200 text-red-800"
                        }`}
                      >
                        {volunteer.status || "active"}
                      </motion.span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDeleteVolunteer(volunteer._id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                        title="Delete Volunteer"
                      >
                        <FaTrash />
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-6 text-sm text-gray-500 bg-gradient-to-r from-orange-50 to-white p-4 rounded-lg shadow-inner flex justify-between items-center"
      >
        <span>Total Volunteers: {volunteers.length}</span>
        <span className="text-[#FF640D] font-semibold">Active Members</span>
      </motion.div>
    </motion.div>
  );
};

export default AdminAllTrainers;
