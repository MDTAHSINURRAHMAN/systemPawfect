import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";

const UserProfile = () => {
  const { user } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const {
    data: userData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["user", user?.email],
    queryFn: async () => {
      const { data } = await axios.get(
        `http://localhost:5000/users/${user?.email}`
      );
      return data;
    },
  });

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`http://localhost:5000/users/${user?.email}`, formData);
      setShowModal(false);
      refetch();
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  const handleModalOpen = () => {
    setFormData({
      name: userData?.name || user?.displayName || "",
      phone: userData?.phone || "",
      address: userData?.address || "",
    });
    setShowModal(true);
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto">
      <motion.h2
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-3xl sm:text-4xl font-bold mb-8 sm:mb-10 text-center sm:text-left bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent"
      >
        User Profile
      </motion.h2>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl p-6 sm:p-8 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] transition-all duration-500 border border-gray-100"
      >
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 mb-8 sm:mb-10"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden ring-4 ring-orange-500 ring-offset-4 shadow-lg transform hover:rotate-6 transition-all duration-300"
          >
            <img
              src={userData?.photoURL || "https://i.ibb.co/MgsTCcv/avater.jpg"}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </motion.div>
          <div className="text-center sm:text-left">
            <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              {userData?.name || user?.displayName}
            </h3>
            <p className="text-gray-600 mt-2">{userData?.email}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-6 divide-y divide-gray-100"
        >
          <motion.div
            whileHover={{ x: 5 }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-3 py-4"
          >
            <span className="font-semibold min-w-[120px] text-gray-700">
              Role:
            </span>
            <span className="capitalize bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-1.5 rounded-full text-sm font-medium shadow-md">
              {userData?.role || "Member"}
            </span>
          </motion.div>

          {userData?.address && (
            <motion.div
              whileHover={{ x: 5 }}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-3 py-4"
            >
              <span className="font-semibold min-w-[120px] text-gray-700">
                Address:
              </span>
              <span className="text-gray-600 bg-orange-50 px-4 py-2 rounded-lg">
                {userData.address}
              </span>
            </motion.div>
          )}

          {userData?.phone && (
            <motion.div
              whileHover={{ x: 5 }}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-3 py-4"
            >
              <span className="font-semibold min-w-[120px] text-gray-700">
                Phone:
              </span>
              <span className="text-gray-600 bg-orange-50 px-4 py-2 rounded-lg">
                {userData.phone}
              </span>
            </motion.div>
          )}

          {userData?.joinDate && (
            <motion.div
              whileHover={{ x: 5 }}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-3 py-4"
            >
              <span className="font-semibold min-w-[120px] text-gray-700">
                Member Since:
              </span>
              <span className="text-gray-600 bg-orange-50 px-4 py-2 rounded-lg">
                {new Date(userData.joinDate).toLocaleDateString()}
              </span>
            </motion.div>
          )}

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="pt-8 flex justify-center sm:justify-start"
          >
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow:
                  "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
              whileTap={{ scale: 0.95 }}
              onClick={handleModalOpen}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 font-semibold"
            >
              Update Profile
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Update Profile Modal */}
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-6 sm:p-8 rounded-2xl max-w-md w-full shadow-2xl"
          >
            <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
              Update Profile
            </h3>
            <form onSubmit={handleUpdateProfile} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={userData?.email}
                  disabled
                  className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                />
              </div>
              <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-300 font-medium"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{
                    scale: 1.02,
                    boxShadow:
                      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 shadow-md hover:shadow-xl transition-all duration-300 font-medium"
                >
                  Save Changes
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default UserProfile;
