import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FaShoppingBag, FaCreditCard, FaLock, FaShieldAlt } from "react-icons/fa";

const ProductPayment = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const { data: product } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:5000/products/${id}`);
      return res.data;
    },
  });

  const [formData, setFormData] = useState({
    name: user?.displayName || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postcode: "",
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const initPaymentMutation = useMutation({
    mutationFn: async (paymentData) => {
      const response = await axios.post(
        "http://localhost:5000/ssl-payment",
        paymentData
      );
      return response.data;
    },
    onSuccess: (data) => {
      if (data.status === "success") {
        localStorage.setItem(
          "paymentInfo",
          JSON.stringify({
            productId: product._id,
            productName: product.name,
            amount: product.price,
            customerName: formData.name,
            customerEmail: formData.email,
            transactionId: data.tran_id,
          })
        );
        toast.success("Payment initiated successfully");
        window.location.href = data.GatewayPageURL;
      } else {
        toast.error("Payment initialization failed");
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Payment initialization failed");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!product || !user) {
      toast.error("Missing product or user information");
      return;
    }

    const paymentData = {
      total_amount: product.price,
      currency: "BDT",
      product_name: product.name,
      product_category: "Products",
      cus_name: formData.name,
      cus_email: formData.email,
      cus_add1: formData.address,
      cus_city: formData.city,
      cus_state: formData.state,
      cus_postcode: formData.postcode,
      cus_country: "Bangladesh",
      cus_phone: formData.phone,
      userId: user.uid,
      productId: product._id,
      product_profile: "general",
      shipping_method: "NO",
    };

    initPaymentMutation.mutate(paymentData);
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100">
        <span className="loading loading-spinner loading-lg text-orange-500"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 py-12 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Summary Card */}
          <div className="space-y-8">
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <FaShoppingBag className="text-orange-500" />
                Order Summary
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-center gap-6">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-24 h-24 object-cover rounded-xl"
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{product.name}</h3>
                    <p className="text-gray-500">{product.category}</p>
                  </div>
                </div>

                <div className="border-t border-dashed pt-6">
                  <div className="flex justify-between text-lg">
                    <span className="font-medium text-gray-600">Subtotal</span>
                    <span className="font-bold text-gray-800">${product.price}</span>
                  </div>
                  <div className="flex justify-between text-lg mt-2">
                    <span className="font-medium text-gray-600">Shipping</span>
                    <span className="font-medium text-green-500">Free</span>
                  </div>
                  <div className="flex justify-between text-xl mt-4 pt-4 border-t">
                    <span className="font-semibold text-gray-800">Total</span>
                    <span className="font-bold text-orange-500">${product.price}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Secure Payment</h3>
              <div className="flex items-center gap-4 text-gray-600">
                <FaLock className="text-orange-500" />
                <span>Your payment information is encrypted</span>
              </div>
              <div className="flex items-center gap-4 text-gray-600 mt-3">
                <FaShieldAlt className="text-orange-500" />
                <span>Protected by SSL security</span>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
              <FaCreditCard className="text-orange-500" />
              Payment Details
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Postal Code</label>
                  <input
                    type="text"
                    name="postcode"
                    value={formData.postcode}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-orange-500 text-white py-4 rounded-xl hover:bg-orange-600 transition-colors duration-300 font-semibold text-lg mt-6 flex items-center justify-center gap-2"
                disabled={initPaymentMutation.isLoading}
              >
                {initPaymentMutation.isLoading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  <>
                    <FaCreditCard />
                    Proceed to Payment
                  </>
                )}
              </motion.button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProductPayment;
