import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import registerAnimation from "../assets/Lottie/register.json";
import Lottie from "lottie-react";
import { toast } from 'react-toastify';


const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [passwordError, setPasswordError] = useState("");

  const validatePassword = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasMinLength = password.length >= 6;

    if (!hasUpperCase) {
      return "Password must contain at least one uppercase letter";
    }
    if (!hasLowerCase) {
      return "Password must contain at least one lowercase letter";
    }
    if (!hasMinLength) {
      return "Password must be at least 6 characters long";
    }
    return "";
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;
    const photoURL = e.target.photoURL.value;
    const password = e.target.password.value;

    const passwordValidationError = validatePassword(password);
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      toast.error(passwordValidationError);
      return;
    }

    try {
      await register(name, email, photoURL, password);
      toast.success('Registration successful!');
      navigate("/");
    } catch (error) {
      toast.error(error?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="hero bg-gradient-to-br from-orange-50 to-white min-h-screen p-4 sm:p-6 lg:p-8">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="hero-content flex-col lg:flex-row-reverse gap-8 lg:gap-16 my-10 lg:my-20"
      >
        <motion.div 
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center lg:text-left max-w-md"
        >
          <Lottie animationData={registerAnimation} loop={true} />
        </motion.div>

        <motion.div 
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="card bg-white/80 backdrop-blur-sm w-full max-w-sm shadow-xl hover:shadow-2xl transition-all duration-300 border border-orange-100"
        >
          <form onSubmit={handleRegister} className="card-body">
            {/* Name Field */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="form-control"
            >
              <h2 className="zen-dots card-title text-3xl font-bold mb-4 text-center text-[#FF640D]">Register</h2>
              <label className="label">
                <span className="label-text font-medium">Name</span>
              </label>
              <input
                name="name"
                type="text"
                placeholder="Enter your name"
                className="input input-bordered focus:ring-2 focus:ring-[#FF640D] focus:border-transparent transition-all duration-300"
                required
              />
            </motion.div>

            {/* Email Field */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="form-control"
            >
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <input
                name="email"
                type="email"
                placeholder="Enter your email"
                className="input input-bordered focus:ring-2 focus:ring-[#FF640D] focus:border-transparent transition-all duration-300"
                required
              />
            </motion.div>

            {/* Photo URL Field */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="form-control"
            >
              <label className="label">
                <span className="label-text font-medium">Photo URL</span>
              </label>
              <input
                name="photoURL"
                type="url"
                placeholder="Enter photo URL"
                className="input input-bordered focus:ring-2 focus:ring-[#FF640D] focus:border-transparent transition-all duration-300"
              />
            </motion.div>

            {/* Password Field */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="form-control"
            >
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <input
                name="password"
                type="password"
                placeholder="Enter password"
                className="input input-bordered focus:ring-2 focus:ring-[#FF640D] focus:border-transparent transition-all duration-300"
                required
                onChange={(e) => setPasswordError(validatePassword(e.target.value))}
              />
              {passwordError && (
                <motion.label 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="label"
                >
                  <span className="label-text-alt text-error">{passwordError}</span>
                </motion.label>
              )}
            </motion.div>

            {/* Register Button */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="form-control mt-6"
            >
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn bg-gradient-to-r from-[#FF640D] to-orange-600 text-white border-none hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                disabled={!!passwordError}
              >
                Register
              </motion.button>
            </motion.div>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Register;