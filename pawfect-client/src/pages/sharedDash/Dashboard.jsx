import { useEffect, useState, useContext } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [userRole, setUserRole] = useState(null);

  // Fetch user role from database
  const { data: userData } = useQuery({
    queryKey: ["user", user?.email],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:5000/users/${user?.email}`);
      setUserRole(res.data.role);
      return res.data;
    },
  });

  // Fetch vet data
  // const { data: vetData } = useQuery({
  //   queryKey: ["vet", user?.email],
  //   queryFn: async () => {
  //     const res = await axios.get(`http://localhost:5000/vets/${user?.email}`);
  //     return res.data;
  //   },
  // });

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
    <div className="satoshi flex flex-col lg:flex-row min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
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
            className="w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center mb-4 shadow-lg"
          >
            <span className="text-2xl font-bold">PH</span>
          </motion.div>
          <motion.h2
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold text-center bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent"
          >
            Welcome 
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

              {/* lost pet */}
              <motion.li whileHover={{ scale: 1.02 }}>
                <NavLink
                  to="/dashboard/lost-pet"
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg"
                        : "hover:bg-gray-700"
                    }`
                  }
                >
                  <i className="fas fa-paw"></i>
                  Lost Pet
                </NavLink>
              </motion.li>
              
              {/* vets */}
              <motion.li whileHover={{ scale: 1.02 }}>
                <NavLink
                  to="/dashboard/vets"
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg"
                        : "hover:bg-gray-700"
                    }`
                  }
                >
                  <i className="fas fa-user-md"></i>
                  All Vets
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
              {/* pet sales report */}
              <motion.li whileHover={{ scale: 1.02 }}>
                <NavLink
                  to="/dashboard/pet-sales-report"
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg"
                        : "hover:bg-gray-700"
                    }`
                  }
                >
                  <i className="fas fa-chart-line"></i>
                  Pet Sales Report
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

              {/* faq */}
              <motion.li whileHover={{ scale: 1.02 }}>
                <NavLink
                  to="/dashboard/faq"
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg"
                        : "hover:bg-gray-700"
                    }`
                  }
                >
                  <i className="fas fa-question-circle"></i>
                  FAQ
                </NavLink>
              </motion.li>
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
              <motion.li whileHover={{ scale: 1.02 }}>
                <NavLink
                  to={`/dashboard/trainer-chat/${user?.email}`}
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg"
                        : "hover:bg-gray-700"
                    }`
                  }
                >
                  <i className="fas fa-comment-medical"></i>
                  Trainer Chat
                </NavLink>
              </motion.li>
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
              {/* all pets */}
              <motion.li whileHover={{ scale: 1.02 }}>
                <NavLink
                  to="/dashboard/all-pets"
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg"
                        : "hover:bg-gray-700"
                    }`
                  }
                >
                  <i className="fas fa-paw"></i>
                  All Pets
                </NavLink>
              </motion.li>
              {/* add pet */}
              <motion.li whileHover={{ scale: 1.02 }}>
                <NavLink
                  to="/dashboard/add-pet"
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg"
                        : "hover:bg-gray-700"
                    }`
                  }
                >
                  <i className="fas fa-paw"></i>
                  Add New Pet
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
            {/* <motion.li whileHover={{ scale: 1.02 }}>
                <NavLink
                  to="/dashboard/member"
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg"
                        : "hover:bg-gray-700"
                    }`
                  }
                >
                  <i className="fas fa-comment-medical"></i>
                  User Chat
                </NavLink>
              </motion.li> */}
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
                  to="/dashboard/booked-volunteers"
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg"
                        : "hover:bg-gray-700"
                    }`
                  }
                >
                  <i className="fas fa-bookmark"></i>
                  Booked Volunteers
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

          {userRole === "vet" && (
            <>
              <motion.li whileHover={{ scale: 1.02 }}>
                <NavLink
                  to="/dashboard/vet-appointments"
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg"
                        : "hover:bg-gray-700"
                    }`
                  }
                >
                  <i className="fas fa-calendar-check"></i>
                  Appointments
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
              className="w-full flex items-center gap-3 p-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all duration-300"
            >
              <i className="fas fa-sign-out-alt"></i>
              <span className="text-lg font-semibold">Logout</span>
            </motion.button>
          </div>
        </motion.ul>
      </motion.div>

      {/* Main Content Area */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex-1 p-8 relative bg-white/50 backdrop-blur-sm"
      >
        <Outlet />
      </motion.div>
    </div>
  );
};

export default Dashboard;
