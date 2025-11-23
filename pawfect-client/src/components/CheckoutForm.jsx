import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CheckoutForm = ({ paymentData }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [cardError, setCardError] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Only create payment intent if we have valid payment data
    const createPaymentIntent = async () => {
      if (paymentData?.packagePrice && paymentData.packagePrice > 0) {
        try {
          const { data } = await axios.post(
            "https://pawfect-server-beige.vercel.app/create-payment-intent",
            {
              price: paymentData.packagePrice,
            }
          );

          setClientSecret(data.clientSecret);
          setCardError(""); // Clear any previous errors
        } catch (err) {
          console.error("Payment Intent Error:", err);
          // Don't show the error immediately to the user unless it's a real attempt
          // setCardError('Failed to initialize payment. Please try again.');
        }
      }
    };

    createPaymentIntent();
  }, [paymentData?.packagePrice]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    const card = elements.getElement(CardElement);
    if (!card) {
      return;
    }

    setProcessing(true);
    setCardError("");

    try {
      const { paymentIntent, error: confirmError } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: card,
            billing_details: {
              name: paymentData.trainerName,
            },
          },
        });

      if (confirmError) {
        setCardError(confirmError.message);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        // Save payment information
        const payment = {
          trainerId: paymentData.trainerId,
          trainerName: paymentData.trainerName,
          packageName: paymentData.packageName,
          amount: paymentData.packagePrice,
          transactionId: paymentIntent.id,
          date: new Date(),
          slotId: paymentData.slotId,
          selectedDay: paymentData.selectedDay,
          status: "paid",
        };

        try {
          await axios.post("http://localhost:5000/payments", payment);
          navigate("/payment-success", {
            state: {
              transactionId: paymentIntent.id,
              packageName: paymentData.packageName,
            },
          });
        } catch (err) {
          setCardError(
            "Payment recorded but failed to save details. Please contact support."
          );
        }
      }
    } catch (error) {
      console.error("Payment Error:", error);
      setCardError("Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Payment Details</h3>
        <p className="mb-2">Package: {paymentData?.packageName}</p>
        <p className="mb-4">Amount: ${paymentData?.packagePrice}</p>

        <div className="border rounded-md p-4 bg-white">
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
        </div>
      </div>

      {cardError && <div className="text-red-500 mb-4">{cardError}</div>}

      <button
        type="submit"
        disabled={!stripe || !clientSecret || processing}
        className={`w-full py-2 px-4 rounded-md text-white font-semibold
          ${
            processing || !stripe || !clientSecret
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
      >
        {processing ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
};

export default CheckoutForm;
