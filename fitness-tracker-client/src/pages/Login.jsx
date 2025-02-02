import React, { useState } from "react";
import { useAuth } from "../context/AuthContext"; 
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import loginAnimation from "../assets/Lottie/login.json";
import { toast } from 'react-toastify';
import { Helmet } from "react-helmet-async";
const Login = () => {
  const { login, signInWithGoogle } = useAuth(); // Changed to signInWithGoogle
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const email = e.target.email.value;
      const password = e.target.password.value;
      await login(email, password);
      toast.success('Successfully logged in!');
      navigate("/");
    } catch (error) {
      console.error("Error logging in:", error);
      toast.error('Failed to log in. Please check your credentials.');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithGoogle(); // Using signInWithGoogle from AuthContext
      if (result) {
        toast.success('Successfully logged in with Google!');
        navigate("/", { replace: true });
      }
    } catch (error) {
      console.error("Error signing in with Google:", error);
      toast.error('Failed to log in with Google. Please try again.');
    }
  };

  return (
    <div className="hero bg-gradient-to-br from-orange-50 to-white min-h-screen p-4 sm:p-6 lg:p-8">
      <Helmet>
        <title>Fitverse | Login</title>
      </Helmet>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="hero-content flex-col lg:flex-row-reverse gap-8 lg:gap-16 my-28"
      >
        <motion.div 
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center lg:text-left relative"
        >
          <motion.div
            className="relative h-[400px] w-full rounded-2xl overflow-hidden"
          >
            <Lottie className="h-[400px] w-full" animationData={loginAnimation} loop={true}></Lottie>
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="card bg-white w-full max-w-sm shrink-0 shadow-2xl hover:shadow-3xl transition-all duration-300 border border-orange-100"
        >
          <form onSubmit={handleLogin} className="card-body">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="form-control"
            >
              <h1 className="zen-dots text-4xl font-bold text-center mb-10 text-[#FF640D]">Login now!</h1>
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                name="email"
                type="email"
                placeholder="email"
                className="input input-bordered focus:ring-2 focus:ring-[#FF640D] focus:border-transparent transition-all duration-300"
                required
              />
            </motion.div>

            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="form-control"
            >
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                name="password"
                type="password"
                placeholder="password"
                className="input input-bordered focus:ring-2 focus:ring-[#FF640D] focus:border-transparent transition-all duration-300"
                required
              />
              <label className="label">
                <motion.a 
                  whileHover={{ scale: 1.05, color: '#FF640D' }}
                  href="#" 
                  className="label-text-alt link link-hover"
                >
                  Forgot password?
                </motion.a>
              </label>
            </motion.div>

            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="form-control mt-6"
            >
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn bg-gradient-to-r from-[#FF640D] to-orange-600 text-white border-none hover:shadow-lg transition-all duration-300"
              >
                Login
              </motion.button>
            </motion.div>

            <div className="divider">OR</div>

            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="form-control"
            >
              <motion.button
                type="button"
                onClick={handleGoogleSignIn}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn btn-outline flex items-center gap-2 border-[#FF640D] text-[#FF640D] hover:bg-[#FF640D] hover:text-white transition-all duration-300"
              >
                <FcGoogle className="text-xl" />
                Continue with Google
              </motion.button>
            </motion.div>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;