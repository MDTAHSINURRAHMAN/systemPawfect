import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useLocation } from "react-router-dom";
import CheckoutForm from "./CheckoutForm";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";

// Load stripe outside of component to avoid recreating stripe object
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const FinalPayment = () => {
  const { user } = useContext(AuthContext);
  const { state: paymentData } = useLocation();

  const enhancedPaymentData = {
    ...paymentData,
    transactionId: "",
    date: new Date(),
    status: "paid",
    userEmail: user?.email,
    userName: user?.name,
  };

  // console.log(enhancedPaymentData);

  const handlePaymentSuccess = async (transactionId) => {
    try {
      const paymentDetails = {
        ...enhancedPaymentData,
        transactionId,
        date: new Date().toISOString(), // Ensure date is in proper format
      };

      console.log("Sending payment details to server:", paymentDetails); // Debug log

      const response = await axios.post(
        "http://localhost:5000/payments",
        paymentDetails
      );

      if (response.data) {
        console.log("Payment saved successfully:", response.data);
        toast.success("Payment completed and saved successfully!");
      }
    } catch (error) {
      console.error("Error saving payment:", error);
      toast.error("Failed to save payment details. Please contact support.");
    }
  };

  if (!paymentData) {
    toast.error("No payment data found");
    return <div className="text-center py-8">No payment data found</div>;
  }

  return (
    <>
      <Helmet>
        <title>Fitverse | Final Payment</title>
      </Helmet>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 py-8 md:py-12 lg:py-16"
      >
        <motion.div
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <motion.h2
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-6 md:mb-8 lg:mb-10 bg-gradient-to-r from-[#FF640D] to-orange-600 bg-clip-text text-transparent"
          >
            Complete Your Payment
          </motion.h2>

          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-xl p-6 md:p-8 lg:p-10 border border-orange-100 hover:shadow-2xl transition-shadow duration-300"
          >
            <Elements stripe={stripePromise}>
              <CheckoutForm
                paymentData={enhancedPaymentData}
                onPaymentSuccess={handlePaymentSuccess}
              />
            </Elements>
          </motion.div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default FinalPayment;
