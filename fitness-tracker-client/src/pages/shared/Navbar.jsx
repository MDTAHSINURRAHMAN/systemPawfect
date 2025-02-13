import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../../assets/Logo/bg_nai_1.png";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useAuth();
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      if (user?.email) {
        try {
          const response = await fetch(
            `http://localhost:5000/users/${user.email}`
          );
          if (response.ok) {
            const data = await response.json();
            setUserData({
              ...data,
              name: data.name || user.displayName,
              photoURL: data.photoURL || user.photoURL,
              email: data.email || user.email,
            });
          } else {
            // Fallback to Firebase user data if server fetch fails
            setUserData({
              name: user.displayName || "",
              photoURL: user.photoURL || "",
              email: user.email || "",
            });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          // Fallback to Firebase user data if fetch fails
          setUserData({
            name: user.displayName || "",
            photoURL: user.photoURL || "",
            email: user.email || "",
          });
        }
      }
    };

    fetchUserData();
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      setUserData(null);
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const links = (
    <>
      <li>
        <NavLink
          to="/"
          className={({ isActive }) =>
            `text-sm tracking-[0.1rem] ${
              isActive
                ? "text-[#FF640D] font-bold"
                : "text-[#0F1413]font-medium hover:text-[#FF640D] transition-colors"
            }`
          }
        >
          Home
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/all-volunteer"
          className={({ isActive }) =>
            `text-sm tracking-[0.1rem] ${
              isActive
                ? "text-[#FF640D] font-bold"
                : "text-[#0F1413]font-medium hover:text-[#FF640D] transition-colors"
            }`
          }
        >
          All Volunteers
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/adopt-pet"
          className={({ isActive }) =>
            `text-sm tracking-[0.1rem] ${
              isActive
                ? "text-[#FF640D] font-bold"
                : "text-[#0F1413]font-medium hover:text-[#FF640D] transition-colors"
            }`
          }
        >
          Adopt Pet
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/lost-pets"
          className={({ isActive }) =>
            `text-sm tracking-[0.1rem] ${
              isActive
                ? "text-[#FF640D] font-bold"
                : "text-[#0F1413]font-medium hover:text-[#FF640D] transition-colors"
            }`
          }
        >
          Lost Pets
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/all-products"
          className={({ isActive }) =>
            `text-sm tracking-[0.1rem] ${
              isActive
                ? "text-[#FF640D] font-bold"
                : "text-[#0F1413]font-medium hover:text-[#FF640D] transition-colors"
            }`
          }
        >
          All Products
        </NavLink>
      </li>
      {user && (
        <li>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `text-sm tracking-[0.1rem] ${
                isActive
                  ? "text-[#FF640D] font-bold"
                  : "text-[#0F1413]font-medium hover:text-[#FF640D] transition-colors"
              }`
            }
          >
            Dashboard
          </NavLink>
        </li>
      )}
      {/* <li>
        <NavLink
          to="/forums"
          className={({ isActive }) =>
            `text-sm tracking-[0.1rem] ${
              isActive
                ? "text-[#FF640D] font-bold"
                : "text-[#0F1413]font-medium hover:text-[#FF640D] transition-colors"
            }`
          }
        >
          Community
        </NavLink>
      </li> */}
      {/* Rescue a pet */}
    </>
  );

  return (
    <nav
      className={`w-full z-[1000] transition-all duration-500 ${
        isScrolled ? "bg-white/90 backdrop-blur-md shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="navbar container mx-auto px-4 py-4">
        <div className="navbar-start">
          <div className="dropdown">
            <motion.div
              whileTap={{ scale: 0.95 }}
              tabIndex={0}
              role="button"
              className="btn btn-ghost lg:hidden"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke={isScrolled ? "#1f2937" : "black"}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </motion.div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1001] p-6 shadow-xl bg-white/90 backdrop-blur-md rounded-xl w-60 space-y-4 absolute left-0"
            >
              {links}
              {user ? (
                <>
                  <div className="pt-4 border-t border-gray-100">
                    <li className="px-4 py-2 text-sm font-medium text-gray-700">
                      {userData?.name || "User"}
                    </li>
                    <li className="px-4 py-2 text-sm text-gray-500">
                      {userData?.email || ""}
                    </li>
                    <motion.li whileTap={{ scale: 0.95 }}>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-all duration-300"
                      >
                        Logout
                      </button>
                    </motion.li>
                  </div>
                </>
              ) : (
                <div className="pt-4 border-t border-gray-100">
                  <motion.li
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link
                      to="/login"
                      className="block px-4 py-2 text-sm hover:bg-orange-50 rounded-lg transition-all duration-300"
                    >
                      Member Login
                    </Link>
                  </motion.li>
                  <motion.li
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link
                      to="/trainer-login"
                      className="block px-4 py-2 text-sm hover:bg-orange-50 rounded-lg transition-all duration-300"
                    >
                      Trainer Login
                    </Link>
                  </motion.li>
                  <motion.li
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link
                      to="/admin-login"
                      className="block px-4 py-2 text-sm hover:bg-orange-50 rounded-lg transition-all duration-300"
                    >
                      Admin Login
                    </Link>
                  </motion.li>
                  <motion.li
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link
                      to="/register"
                      className="block px-4 py-2 text-sm hover:bg-orange-50 rounded-lg transition-all duration-300"
                    >
                      Register
                    </Link>
                  </motion.li>
                </div>
              )}
            </ul>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <Link to="/" className="flex-shrink-0">
              <img
                src={logo}
                alt="FitVerse Logo"
                className="w-20 md:w-24 hover:brightness-110 transition-all duration-300"
              />
            </Link>
          </motion.div>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 space-x-8">{links}</ul>
        </div>
        <div className="navbar-end space-x-4 hidden lg:flex">
          {user ? (
            <div className="flex items-center gap-6">
              <motion.div
                className="dropdown dropdown-end tooltip tooltip-bottom"
                data-tip={userData?.name || "User"}
              >
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle avatar ring-2 ring-orange-100 ring-offset-2"
                >
                  <div className="w-10 rounded-full">
                    <img
                      alt="User Profile"
                      src={
                        userData?.photoURL ||
                        "https://i.ibb.co/MgsTCcv/avater.jpg"
                      }
                    />
                  </div>
                </div>
                <ul
                  tabIndex={0}
                  className="mt-3 z-[1001] p-4 shadow-xl menu menu-sm dropdown-content bg-white/90 backdrop-blur-md rounded-xl w-60 absolute right-0"
                >
                  <li className="px-4 py-2 text-sm font-medium text-gray-700">
                    {userData?.name || "User"}
                  </li>
                  <li className="px-4 py-2 text-sm text-gray-500">
                    {userData?.email || ""}
                  </li>
                </ul>
              </motion.div>
              <motion.button
                // whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="satoshi bg-gradient-to-r from-[#FF640D] to-orange-600 text-white px-8 py-2.5 rounded-lg text-lg font-semibold tracking-wide hover:shadow-lg hover:shadow-orange-200 transition-all duration-300"
              >
                Logout
              </motion.button>
            </div>
          ) : (
            <>
              <motion.div className="dropdown dropdown-end">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  tabIndex={0}
                  className="satoshi bg-gradient-to-r from-[#FF640D] to-orange-600 text-white px-8 py-2.5 rounded-lg text-lg font-semibold tracking-wide hover:shadow-lg hover:shadow-orange-200 transition-all duration-300"
                >
                  Login
                </motion.button>
                <ul
                  tabIndex={0}
                  className="dropdown-content z-[1] menu p-4 shadow-xl bg-white/90 backdrop-blur-md rounded-xl w-60 mt-2 space-y-1"
                >
                  <motion.li
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link
                      to="/login"
                      className="block px-4 py-2 hover:bg-orange-50 rounded-lg transition-all duration-300"
                    >
                      Member Login
                    </Link>
                  </motion.li>
                  <motion.li
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link
                      to="/trainer-login"
                      className="block px-4 py-2 hover:bg-orange-50 rounded-lg transition-all duration-300"
                    >
                      Trainer Login
                    </Link>
                  </motion.li>
                  <motion.li
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link
                      to="/admin-login"
                      className="block px-4 py-2 hover:bg-orange-50 rounded-lg transition-all duration-300"
                    >
                      Admin Login
                    </Link>
                  </motion.li>
                </ul>
              </motion.div>
              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="satoshi bg-gradient-to-r from-gray-800 to-gray-900 text-white px-8 py-2.5 rounded-lg text-lg font-semibold tracking-wide hover:shadow-lg hover:shadow-gray-200 transition-all duration-300"
                >
                  Register
                </motion.button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
