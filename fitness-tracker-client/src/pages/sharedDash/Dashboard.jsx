import { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [userRole, setUserRole] = useState(null);

  console.log(user);

  // Fetch user role from database
  const { data: userData } = useQuery({
    queryKey: ["user", user?.email],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:5000/users/${user?.email}`);
      setUserRole(res.data.role);
      return res.data;
    },
  });

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = "/";
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Error logging out");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar Navigation */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full lg:w-72 bg-gradient-to-b from-gray-900 to-gray-800 text-white p-6 shadow-xl"
      >
        <div className="flex flex-col items-center mb-8">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center mb-4"
          >
            <span className="text-2xl font-bold">FT</span>
          </motion.div>
          <motion.h2
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold text-center"
          >
            Dashboard
          </motion.h2>
        </div>
        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          {userRole === "admin" && (
            <>
              <motion.li whileHover={{ scale: 1.02 }}>
                <NavLink
                  to="/dashboard/subscribers"
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg"
                        : "hover:bg-gray-700"
                    }`
                  }
                >
                  <i className="fas fa-users"></i>
                  All Newsletter Subscribers
                </NavLink>
              </motion.li>
              <motion.li whileHover={{ scale: 1.02 }}>
                <NavLink
                  to="/dashboard/all-trainers"
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg"
                        : "hover:bg-gray-700"
                    }`
                  }
                >
                  <i className="fas fa-dumbbell"></i>
                  All Volunteers
                </NavLink>
              </motion.li>
              <motion.li whileHover={{ scale: 1.02 }}>
                <NavLink
                  to="/dashboard/applied-trainers"
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg"
                        : "hover:bg-gray-700"
                    }`
                  }
                >
                  <i className="fas fa-user-plus"></i>
                  Applied Volunteers
                </NavLink>
              </motion.li>
              <motion.li whileHover={{ scale: 1.02 }}>
                <NavLink
                  to="/dashboard/balance"
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg"
                        : "hover:bg-gray-700"
                    }`
                  }
                >
                  <i className="fas fa-wallet"></i>
                  Balance
                </NavLink>
              </motion.li>
              <motion.li whileHover={{ scale: 1.02 }}>
                <NavLink
                  to="/dashboard/all-products"
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg"
                        : "hover:bg-gray-700"
                    }`
                  }
                >
                  <i className="fas fa-box"></i>
                  All Products
                </NavLink>
              </motion.li>
              <motion.li whileHover={{ scale: 1.02 }}>
                <NavLink
                  to="/dashboard/add-product"
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg"
                        : "hover:bg-gray-700"
                    }`
                  }
                >
                  <i className="fas fa-plus-circle"></i>
                  Add New Product
                </NavLink>
              </motion.li>
              <motion.li whileHover={{ scale: 1.02 }}>
                <NavLink
                  to="/dashboard/forums"
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg"
                        : "hover:bg-gray-700"
                    }`
                  }
                >
                  <i className="fas fa-comments"></i>
                  Add New Forum
                </NavLink>
              </motion.li>
              <motion.li whileHover={{ scale: 1.02 }}>
                <NavLink
                  to="/dashboard/sales-report"
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg"
                        : "hover:bg-gray-700"
                    }`
                  }
                >
                  <i className="fas fa-chart-line"></i>
                  Sales Report
                </NavLink>
              </motion.li>
              <motion.li whileHover={{ scale: 1.02 }}>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg"
                        : "hover:bg-gray-700"
                    }`
                  }
                >
                  <i className="fas fa-home"></i>
                  Home
                </NavLink>
              </motion.li>
            </>
          )}

          {userRole === "volunteer" && (
            <>
              {/* all products */}
              <motion.li whileHover={{ scale: 1.02 }}>
                <NavLink
                  to="/dashboard/all-products"
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg"
                        : "hover:bg-gray-700"
                    }`
                  }
                >
                  <i className="fas fa-box"></i>
                  All Products
                </NavLink>
              </motion.li>
              {/* add product */}
              <motion.li whileHover={{ scale: 1.02 }}>
                <NavLink
                  to="/dashboard/add-product"
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg"
                        : "hover:bg-gray-700"
                    }`
                  }
                >
                  <i className="fas fa-plus-circle"></i>
                  Add New Product
                </NavLink>
              </motion.li>
              <motion.li whileHover={{ scale: 1.02 }}>
                <NavLink
                  to="/dashboard/manage-slot"
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg"
                        : "hover:bg-gray-700"
                    }`
                  }
                >
                  <i className="fas fa-calendar-alt"></i>
                  Manage Slots
                </NavLink>
              </motion.li>
              <motion.li whileHover={{ scale: 1.02 }}>
                <NavLink
                  to="/dashboard/add-slot"
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg"
                        : "hover:bg-gray-700"
                    }`
                  }
                >
                  <i className="fas fa-plus"></i>
                  Add New Slot
                </NavLink>
              </motion.li>
              <motion.li whileHover={{ scale: 1.02 }}>
                <NavLink
                  to="/dashboard/forums"
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg"
                        : "hover:bg-gray-700"
                    }`
                  }
                >
                  <i className="fas fa-comment-medical"></i>
                  Add New Forum
                </NavLink>
              </motion.li>
              <motion.li whileHover={{ scale: 1.02 }}>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg"
                        : "hover:bg-gray-700"
                    }`
                  }
                >
                  <i className="fas fa-home"></i>
                  Home
                </NavLink>
              </motion.li>
            </>
          )}

          {userRole === "member" && (
            <>
              <motion.li whileHover={{ scale: 1.02 }}>
                <NavLink
                  to="/dashboard/activity-logs"
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg"
                        : "hover:bg-gray-700"
                    }`
                  }
                >
                  <i className="fas fa-chart-line"></i>
                  Activity Log
                </NavLink>
              </motion.li>
              <motion.li whileHover={{ scale: 1.02 }}>
                <NavLink
                  to="/dashboard/profile"
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg"
                        : "hover:bg-gray-700"
                    }`
                  }
                >
                  <i className="fas fa-user"></i>
                  Profile
                </NavLink>
              </motion.li>
              <motion.li whileHover={{ scale: 1.02 }}>
                <NavLink
                  to="/dashboard/booked-trainers"
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg"
                        : "hover:bg-gray-700"
                    }`
                  }
                >
                  <i className="fas fa-bookmark"></i>
                  Booked Trainers
                </NavLink>
              </motion.li>
              <motion.li whileHover={{ scale: 1.02 }}>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg"
                        : "hover:bg-gray-700"
                    }`
                  }
                >
                  <i className="fas fa-home"></i>
                  Home
                </NavLink>
              </motion.li>
            </>
          )}

          {/* User Profile and Logout */}
          <div className="mt-auto pt-6 border-t border-gray-700">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className="zen-dots tracking-[0.1rem] w-full flex items-center gap-3 p-3 rounded-xl text-3xl text-red-400 hover:bg-red-500/10 transition-all duration-300"
            >
              <i className="fas fa-sign-out-alt"></i>
              Logout
            </motion.button>
          </div>
        </motion.ul>
      </motion.div>

      {/* Main Content Area */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex-1 p-8 relative"
      >
        <Outlet />
      </motion.div>
    </div>
  );
};

export default Dashboard;
