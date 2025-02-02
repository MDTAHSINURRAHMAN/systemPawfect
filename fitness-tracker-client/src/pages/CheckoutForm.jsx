import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const CheckoutForm = ({ paymentData, onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [cardError, setCardError] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    if (paymentData.amount) {
      // Changed from packagePrice to amount since that's what's being passed
      axios
        .post("http://localhost:5000/create-payment-intent", {
          price: paymentData.amount,
          trainerId: paymentData.trainerId,
          slotId: paymentData.slotId,
          email: user?.email,
        })
        .then((res) => {
          console.log("Client secret received:", res.data.clientSecret); // Debug log
          setClientSecret(res.data.clientSecret);
        })
        .catch((err) => {
          console.error("Payment Intent Error:", err);
          toast.error("Failed to initialize payment. Please try again.");
          setCardError("Failed to initialize payment. Please try again.");
        });
    }
  }, [
    paymentData.amount,
    paymentData.trainerId,
    paymentData.slotId,
    user?.email,
  ]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const card = elements.getElement(CardElement);
    if (!card) {
      return;
    }

    setProcessing(true);
    setCardError("");

    try {
      // Confirm payment
      const { paymentIntent, error: confirmError } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: card,
            billing_details: {
              name: paymentData.trainerName,
              email: user?.email,
            },
          },
        });

      if (confirmError) {
        setCardError(confirmError.message);
        toast.error(confirmError.message);
        setProcessing(false);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        // Call onPaymentSuccess with the transaction ID
        await onPaymentSuccess(paymentIntent.id);

        // Navigate to success page
        navigate("/payment-success", {
          state: {
            transactionId: paymentIntent.id,
            packageName: paymentData.packageName,
          },
        });

        toast.success("Payment successful!");
      }
    } catch (error) {
      console.error("Payment Error:", error);
      toast.error("Payment failed. Please try again.");
      setCardError("Payment failed. Please try again.");
    }

    setProcessing(false);
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-4 sm:p-6 md:p-8 lg:p-10"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-8 space-y-6"
      >
        <motion.h3
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-2xl sm:text-3xl font-bold mb-4 bg-gradient-to-r from-[#FF640D] to-orange-600 bg-clip-text text-transparent"
        >
          Payment Details
        </motion.h3>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-orange-50 to-white p-4 sm:p-6 rounded-xl shadow-md space-y-3"
        >
          <p className="text-gray-700 text-sm sm:text-base">
            <span className="font-medium">Package:</span>{" "}
            {paymentData.packageName}
          </p>
          <p className="text-gray-700 text-sm sm:text-base">
            <span className="font-medium">Amount:</span> ${paymentData.amount}
          </p>
          <p className="text-gray-700 text-sm sm:text-base">
            <span className="font-medium">Paying as:</span> {user?.email}
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="border border-orange-200 rounded-xl p-6 bg-white shadow-sm"
        >
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#424770",
                  "::placeholder": {
                    color: "#aab7c4",
                  },
                },
                invalid: {
                  color: "#9e2146",
                },
              },
            }}
          />
        </motion.div>
      </motion.div>

      {cardError && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-red-500 mb-6 text-center font-medium"
        >
          {cardError}
        </motion.div>
      )}

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={!stripe || !clientSecret || processing}
        className={`w-full py-3 px-6 rounded-xl text-white font-semibold text-lg transition-all duration-300
          ${
            processing || !stripe || !clientSecret
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-[#FF640D] to-orange-600 hover:shadow-lg"
          }`}
      >
        {processing ? "Processing..." : "Pay Now"}
      </motion.button>
    </motion.form>
  );
};

export default CheckoutForm;
