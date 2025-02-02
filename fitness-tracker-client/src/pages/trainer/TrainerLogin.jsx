import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import trainer from "../../assets/Lottie/trainer.json";
import Lottie from "lottie-react";
import { toast } from "react-toastify";

const TrainerLogin = () => {
  const { login, logout } = useAuth();
  const navigate = useNavigate();

  const handleTrainerLogin = async (e) => {
    e.preventDefault();
    try {
      const email = e.target.email.value;
      const password = e.target.password.value;

      await login(email, password);

      // Then verify trainer role in MongoDB
      const { data: userData } = await axios.get(
        `http://localhost:5000/users/${email}`
      );

      console.log(userData);

      if (userData && userData.role === "volunteer") {
        navigate("/dashboard");
      } else {
        await logout(); // Logout from Firebase if not trainer
        toast.error("You don't have volunteer access");
        navigate("/");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      toast.error("Invalid credentials");
    }
  };

  return (
    <div className="hero bg-gradient-to-br from-orange-50 to-white min-h-screen p-4 sm:p-6 lg:p-8">
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
          className="text-center lg:text-left max-w-md"
        >
          <Lottie
            className="h-[400px] w-full"
            animationData={trainer}
            loop={true}
          ></Lottie>
        </motion.div>

        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="card bg-white w-full max-w-sm shadow-2xl hover:shadow-3xl transition-all duration-300 border border-orange-100"
        >
          <form onSubmit={handleTrainerLogin} className="card-body">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="form-control"
            >
              <h2 className="zen-dots text-3xl font-bold text-center mb-6 hover:text-[#FF640D] transition-colors duration-300 leading-[4rem] text-[#FF640D]">
                Trainer Login
              </h2>
              <label className="label">
                <span className="label-text font-medium">Trainer Email</span>
              </label>
              <input
                name="email"
                type="email"
                placeholder="trainer@email.com"
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
                <span className="label-text font-medium">Password</span>
              </label>
              <input
                name="password"
                type="password"
                placeholder="Enter your password"
                className="input input-bordered focus:ring-2 focus:ring-[#FF640D] focus:border-transparent transition-all duration-300"
                required
              />
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
                type="submit"
                className="btn bg-gradient-to-r from-[#FF640D] to-orange-600 text-white border-none hover:shadow-lg transition-all duration-300"
              >
                Login as Trainer
              </motion.button>
            </motion.div>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default TrainerLogin;
