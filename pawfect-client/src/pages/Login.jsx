import React, { useState } from "react";
import { useAuth } from "../context/AuthContext"; 
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import loginAnimation from "../assets/Lottie/login.json";
import { toast } from 'react-toastify';
import { Helmet } from "react-helmet-async";

const Login = () => {
  const { login, signInWithGoogle } = useAuth();
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
      const result = await signInWithGoogle();
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50/30 p-4">
      <Helmet>
        <title>Pawfect | Login</title>
      </Helmet>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto flex flex-col lg:flex-row items-center justify-center gap-12 py-16 px-4"
      >
        <motion.div 
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="lg:w-1/2 max-w-xl"
        >
          <div className="relative h-[500px] w-full">
            <Lottie className="h-full w-full" animationData={loginAnimation} loop={true} />
          </div>
          <div className="zen-dots text-center lg:text-left mt-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Welcome Back to Pawfect!</h2>
            <p className="text-gray-600">Your trusted platform for all pet care needs.</p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-md"
        >
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-orange-100">
            <h1 className="text-4xl font-bold text-center mb-8 text-[#FF640D]">Login</h1>
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Email</label>
                <input
                  name="email"
                  type="email"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FF640D] focus:border-transparent transition-all duration-300"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Password</label>
                <input
                  name="password"
                  type="password"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FF640D] focus:border-transparent transition-all duration-300"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <Link to="/forgot-password" className="text-sm text-[#FF640D] hover:underline">
                  Forgot password?
                </Link>
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 bg-gradient-to-r from-[#FF640D] to-orange-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Sign In
              </motion.button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <motion.button
                type="button"
                onClick={handleGoogleSignIn}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 px-4 flex items-center justify-center gap-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-300"
              >
                <FcGoogle className="text-xl" />
                <span>Continue with Google</span>
              </motion.button>

              <p className="text-center text-gray-600 mt-8">
                Don't have an account?{" "}
                <Link to="/register" className="text-[#FF640D] font-medium hover:underline">
                  Sign up
                </Link>
              </p>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;