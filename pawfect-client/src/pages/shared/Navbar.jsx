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
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.email) return;
      
      try {
        const response = await fetch(`https://pawfect-server-beige.vercel.app/users/${user.email}`);
        if (response.ok) {
          const data = await response.json();
          setUserData({
            ...data,
            name: data.name || user.displayName,
            photoURL: data.photoURL || user.photoURL,
            email: data.email || user.email,
          });
        } else {
          setUserData({
            name: user.displayName || "",
            photoURL: user.photoURL || "",
            email: user.email || "",
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUserData({
          name: user.displayName || "",
          photoURL: user.photoURL || "",
          email: user.email || "",
        });
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
            `text-base font-medium tracking-wide border border-transparent hover:border-[#FF640D] rounded-md px-3 py-1.5 ${
              isActive
                ? "text-orange-500 font-bold border-orange-500"
                : "text-gray- hover:text-[#FF640D] transition-all duration-300"
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
            `text-base font-medium tracking-wide border border-transparent hover:border-[#FF640D] rounded-md px-3 py-1.5 ${
              isActive
                ? "text-orange-500 font-bold border-orange-500"
                : "text-gray-700 hover:text-[#FF640D] transition-all duration-300"
            }`
          }
        >
          Volunteers
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/adopt-pet"
          className={({ isActive }) =>
            `text-base font-medium tracking-wide border border-transparent hover:border-[#FF640D] rounded-md px-3 py-1.5 ${
              isActive
                ? "text-orange-500 font-bold border-orange-500"
                : "text-gray-700 hover:text-[#FF640D] transition-all duration-300"
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
            `text-base font-medium tracking-wide border border-transparent hover:border-[#FF640D] rounded-md px-3 py-1.5 ${
              isActive
                ? "text-orange-500 font-bold border-orange-500"
                : "text-gray-700 hover:text-[#FF640D] transition-all duration-300"
            }`
          }
        >
          Lost Pets
        </NavLink>
      </li>

      <li>
        <NavLink
          to="/all-vets"
          className={({ isActive }) =>
            `text-base font-medium tracking-wide border border-transparent hover:border-[#FF640D] rounded-md px-3 py-1.5 ${
              isActive
                ? "text-orange-500 font-bold border-orange-500"
                : "text-gray-700 hover:text-[#FF640D] transition-all duration-300"
            }`
          }
        >
          Vets
        </NavLink>
      </li>

      <li>
        <NavLink
          to="/all-products"
          className={({ isActive }) =>
            `text-base font-medium tracking-wide border border-transparent hover:border-[#FF640D] rounded-md px-3 py-1.5 ${
              isActive
                ? "text-orange-500 font-bold border-orange-500"
                : "text-gray-700 hover:text-[#FF640D] transition-all duration-300"
            }`
          }
        >
          Shop
        </NavLink>
      </li>
      {user && (
        <li>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `text-base font-medium tracking-wide border border-transparent hover:border-[#FF640D] rounded-md px-3 py-1.5 ${
                isActive
                  ? "text-orange-500 font-bold border-orange-500"
                  : "text-gray-700 hover:text-[#FF640D] transition-all duration-300"
              }`
            }
          >
            Dashboard
          </NavLink>
        </li>
      )}
    </>
  );

  return (
    <>
      <nav
        className={`sticky top-0 w-full z-[1000] transition-all duration-500 ${
          isScrolled 
            ? "bg-white/95 backdrop-blur-md shadow-lg py-2" 
            : "bg-white py-4"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <Link to="/" className="flex-shrink-0">
                  <img
                    src={logo}
                    alt="Pawfect Logo"
                    className="w-20 md:w-24 hover:brightness-110 transition-all duration-300"
                  />
                </Link>
              </motion.div>

              <ul className="hidden lg:flex items-center gap-8">
                {links}
              </ul>
            </div>

            <div className="hidden lg:flex items-center gap-6">
              {user ? (
                <div className="flex items-center gap-4">
                  {/* <img
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-orange-200 ring-offset-2"
                    src={userData?.photoURL}
                    alt={userData?.name}
                  /> */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleLogout}
                    className="px-6 py-2.5 text-[#FF640D]/90 border-2 border-[#FF640D]/90 rounded-lg font-medium hover:bg-[#FF640D]/90 hover:text-white transition-all duration-300"
                  >
                    Logout
                  </motion.button>
                </div>
              ) : (
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-2.5 bg-[#FF640D]/90 text-white rounded-lg font-medium hover:bg-[#ff5500]/90 transition-all duration-300"
                  >
                    Sign In
                  </motion.button>
                </Link>
              )}
            </div>

            {/* Mobile Menu */}
            <div className="lg:hidden">
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
              </motion.button>
            </div>
          </div>
        </div>
      </nav>
      {/* <div className="h-[72px]"></div> */}
    </>
  );
};

export default Navbar;
