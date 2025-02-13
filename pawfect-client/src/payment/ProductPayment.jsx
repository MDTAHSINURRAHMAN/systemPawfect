import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ProductPayment = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Get product details
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

  // Initialize payment mutation
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
        // Save payment info to localStorage with tran_id from backend response
        localStorage.setItem(
          "paymentInfo",
          JSON.stringify({
            productId: product._id,
            productName: product.name,
            amount: product.price,
            customerName: formData.name,
            customerEmail: formData.email,
            transactionId: data.tran_id, // Use tran_id from backend response
          })
        );

        console.log("Payment initiated with transaction ID:", data.tran_id);
        toast.success("Payment initiated successfully");
        window.location.href = data.GatewayPageURL;
      } else {
        toast.error("Payment initialization failed");
      }
    },
    onError: (error) => {
      console.error("Payment initialization error:", error);
      toast.error(
        error.response?.data?.message || "Payment initialization failed"
      );
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
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-orange-500"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Payment Details
        </h2>

        <div className="mb-8 p-4 bg-orange-50 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Product Summary</h3>
          <div className="flex justify-between items-center">
            <span>{product.name}</span>
            <span className="font-bold">${product.price}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Postal Code
              </label>
              <input
                type="text"
                name="postcode"
                value={formData.postcode}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors duration-300"
            disabled={initPaymentMutation.isLoading}
          >
            {initPaymentMutation.isLoading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              "Proceed to Payment"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductPayment;
