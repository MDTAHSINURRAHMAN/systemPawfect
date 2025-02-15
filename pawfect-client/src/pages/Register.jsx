import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import registerAnimation from "../assets/Lottie/register.json";
import Lottie from "lottie-react";
import { toast } from 'react-toastify';
import { Helmet } from "react-helmet-async";

const Register = () => {
  const { register, login } = useAuth();
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
      toast.success('Registration successful! Logging you in...');
      
      // Attempt to login after successful registration
      try {
        await login(email, password);
        navigate("/");
      } catch (loginError) {
        toast.error('Registration successful but login failed. Please login manually.');
        navigate("/login");
      }
    } catch (error) {
      toast.error(error?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50/30 p-4">
      <Helmet>
        <title>Pawfect | Register</title>
      </Helmet>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto flex flex-col lg:flex-row-reverse items-center justify-center gap-12 py-16 px-4"
      >
        <motion.div 
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="lg:w-1/2 max-w-xl"
        >
          <div className="relative h-[500px] w-full">
            <Lottie className="h-full w-full" animationData={registerAnimation} loop={true} />
          </div>
          <div className="zen-dots text-center lg:text-left mt-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Join Pawfect Today!</h2>
            <p className="text-gray-600">Create an account to access all our pet care services.</p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="card bg-white/90 backdrop-blur-sm w-full max-w-md shadow-2xl hover:shadow-3xl transition-all duration-300 border border-orange-100"
        >
          <form onSubmit={handleRegister} className="card-body p-8">
            <h2 className="text-4xl font-bold text-center text-[#FF640D] mb-8">Create Account</h2>

            {/* Name Field */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="form-control"
            >
              <label className="label">
                <span className="label-text text-gray-700 font-semibold">Full Name</span>
              </label>
              <input
                name="name"
                type="text"
                placeholder="John Doe"
                className="input input-bordered bg-white/50 focus:ring-2 focus:ring-[#FF640D] focus:border-transparent transition-all duration-300"
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
                <span className="label-text text-gray-700 font-semibold">Email</span>
              </label>
              <input
                name="email"
                type="email"
                placeholder="example@email.com"
                className="input input-bordered bg-white/50 focus:ring-2 focus:ring-[#FF640D] focus:border-transparent transition-all duration-300"
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
                <span className="label-text text-gray-700 font-semibold">Profile Picture URL</span>
              </label>
              <input
                name="photoURL"
                type="url"
                placeholder="https://your-photo-url.com"
                className="input input-bordered bg-white/50 focus:ring-2 focus:ring-[#FF640D] focus:border-transparent transition-all duration-300"
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
                <span className="label-text text-gray-700 font-semibold">Password</span>
              </label>
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                className="input input-bordered bg-white/50 focus:ring-2 focus:ring-[#FF640D] focus:border-transparent transition-all duration-300"
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
                className="btn bg-gradient-to-r from-[#FF640D] to-orange-600 text-white border-none hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 py-3 text-lg font-semibold"
                disabled={!!passwordError}
              >
                Create Account
              </motion.button>
              <p className="text-center mt-4 text-gray-600">
                Already have an account? {" "}
                <Link to="/login" className="text-[#FF640D] hover:underline font-semibold">
                  Login here
                </Link>
              </p>
            </motion.div>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Register;