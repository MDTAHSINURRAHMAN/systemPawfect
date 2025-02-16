import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";
import { FaEdit, FaTrash, FaPaw, FaMapMarkerAlt, FaPhoneAlt, FaUserAlt, FaCalendarAlt } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const LostPet = () => {
  const queryClient = useQueryClient();

  const { data: lostPets = [], isLoading } = useQuery({
    queryKey: ["lostPets"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:5000/lost-pets/admin");
      return res.data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (updatedPet) => {
      const res = await axios.patch(
        `http://localhost:5000/lost-pets/${updatedPet._id}`,
        updatedPet
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["lostPets"]);
      toast.success("Pet report updated successfully");
    },
    onError: () => {
      toast.error("Failed to update pet report");
    },
  });

  const statusMutation = useMutation({
    mutationFn: async (updatedPet) => {
      const res = await axios.patch(
        `http://localhost:5000/lost-pets/status/${updatedPet._id}`,
        { status: updatedPet.status }
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["lostPets"]);
      toast.success("Pet status updated successfully");
    },
    onError: () => {
      toast.error("Failed to update pet status");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (petId) => {
      const res = await axios.delete(`http://localhost:5000/lost-pets/${petId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["lostPets"]);
      toast.success("Pet report deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete pet report");
    },
  });

  const handleApprove = (pet) => {
    updateMutation.mutate({ ...pet, approved: true });
  };

  const handleStatusUpdate = (pet) => {
    const newStatus = pet.status === "lost" ? "found" : "lost";
    statusMutation.mutate({ ...pet, status: newStatus });
  };

  const handleDelete = (petId) => {
    if (window.confirm("Are you sure you want to delete this pet report?")) {
      deleteMutation.mutate(petId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 md:p-8 min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50"
    >
      <motion.h2
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="text-3xl md:text-4xl font-bold mb-8 text-center bg-gradient-to-r from-[#FF640D] to-orange-600 bg-clip-text text-transparent"
      >
        Lost Pet Reports
      </motion.h2>

      <AnimatePresence>
        <div className="grid gap-6">
          {lostPets.map((pet, index) => (
            <motion.div
              key={pet._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-orange-100"
            >
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="w-full lg:w-1/3">
                  <img
                    src={pet.petImage}
                    alt={pet.petName}
                    className="w-full h-64 lg:h-80 object-cover rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
                  />
                </div>
                
                <div className="flex-1 space-y-4">
                  <div className="flex justify-between items-start flex-wrap gap-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">{pet.petName}</h3>
                      <div className="flex items-center gap-2 text-gray-600">
                        <FaPaw className="text-orange-500" />
                        <span>{pet.breed}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                      {!pet.approved ? (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleApprove(pet)}
                          className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all shadow-md"
                        >
                          Approve
                        </motion.button>
                      ) : (
                        <>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleStatusUpdate(pet)}
                            className={`px-6 py-2 text-white rounded-xl shadow-md ${
                              pet.status === "lost" 
                                ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700" 
                                : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                            }`}
                          >
                            Mark as {pet.status === "lost" ? "Found" : "Lost"}
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDelete(pet._id)}
                            className="p-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all shadow-md"
                          >
                            <FaTrash />
                          </motion.button>
                        </>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-600 mt-2">{pet.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaUserAlt className="text-orange-500" />
                      <span>Owner: {pet.ownerName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaPhoneAlt className="text-orange-500" />
                      <span>Contact: {pet.contactNumber}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaCalendarAlt className="text-orange-500" />
                      <span>Last Seen: {new Date(pet.lastSeenDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        !pet.approved 
                          ? "bg-yellow-100 text-yellow-700"
                          : pet.status === "lost"
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}>
                        {!pet.approved ? "Pending Approval" : pet.status === "lost" ? "Lost" : "Found"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </motion.div>
  );
};

export default LostPet;
