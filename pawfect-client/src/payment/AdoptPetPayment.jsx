import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaPaw, FaMoneyBillWave, FaCreditCard, FaShieldAlt } from "react-icons/fa";

const AdoptPetPayment = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: pet = {}, isLoading } = useQuery({
    queryKey: ["pet", id],
    queryFn: async () => {
      const res = await axios.get(`https://pawfect-server-beige.vercel.app/pets/${id}`);
      return res.data;
    },
  });

  const processingFee = 25;
  const totalAmount = parseInt(pet.adoptionFee) + processingFee;

  const [formData, setFormData] = useState({
    cus_name: user?.displayName || "",
    cus_email: user?.email || "",
    cus_phone: "",
    cus_add1: "",
    cus_city: "",
    cus_state: "",
    cus_postcode: "",
    petId: pet._id,
    product_name: pet.name,
    total_amount: pet.adoptionFee,
    currency: "BDT",
  });

  const initPaymentMutation = useMutation({
    mutationFn: async (paymentData) => {
      const response = await axios.post(
        "https://pawfect-server-beige.vercel.app/adopt-pet-payment",
        paymentData
      );
      return response.data;
    },
    onSuccess: (data) => {
      if (data.status === "success") {
        localStorage.setItem(
          "adoptPaymentInfo",
          JSON.stringify({
            petId: pet._id,
            petName: pet.name,
            amount: pet.adoptionFee,
            transactionId: data.tran_id,
          })
        );
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
    initPaymentMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
        <div className="loading loading-spinner loading-lg text-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-2xl p-8 md:p-12"
        >
          <div className="flex items-center justify-center gap-3 mb-12">
            <FaPaw className="text-4xl text-orange-500" />
            <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
              Complete Your Adoption
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Pet Details Card */}
            <div className="space-y-8">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="relative rounded-2xl overflow-hidden shadow-lg group"
              >
                <img
                  src={pet.image}
                  alt={pet.name}
                  className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>

              <div className="bg-orange-50 rounded-2xl p-6 space-y-4">
                <h3 className="text-3xl font-bold text-gray-800">{pet.name}</h3>
                <div className="grid grid-cols-2 gap-4 text-gray-700">
                  <div>
                    <p className="font-medium">Species</p>
                    <p>{pet.species}</p>
                  </div>
                  <div>
                    <p className="font-medium">Breed</p>
                    <p>{pet.breed}</p>
                  </div>
                  <div>
                    <p className="font-medium">Age</p>
                    <p>{pet.age} years</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Summary Card */}
            <div className="bg-gradient-to-br from-orange-50 to-white rounded-2xl p-8 shadow-lg space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <FaMoneyBillWave className="text-orange-500" />
                  Payment Summary
                </h3>

                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-white rounded-xl">
                    <span className="text-gray-600">Adoption Fee</span>
                    <span className="font-semibold">${pet.adoptionFee}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-white rounded-xl">
                    <span className="text-gray-600">Processing Fee</span>
                    <span className="font-semibold">${processingFee}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-orange-100 rounded-xl">
                    <span className="font-bold text-lg">Total Amount</span>
                    <span className="font-bold text-2xl text-orange-600">${totalAmount}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <FaShieldAlt className="text-green-500" />
                  <span>Secure Payment Processing</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <FaCreditCard className="text-blue-500" />
                  <span>Multiple Payment Options Available</span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsModalOpen(true)}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-400 to-orange-600 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Proceed to Payment
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Enhanced Payment Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-4xl w-full mx-4 relative z-50 shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-8">
                <FaCreditCard className="text-3xl text-orange-500" />
                <h3 className="text-3xl font-bold">Complete Payment</h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-gray-700 font-medium">Full Name</label>
                    <input
                      type="text"
                      name="cus_name"
                      value={formData.cus_name}
                      onChange={(e) => setFormData({ ...formData, cus_name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all duration-300"
                      required
                    />
                  </div>
                  
                  {/* Repeat similar styling for other input fields */}
                  {/* Email */}
                  <div className="space-y-2">
                    <label className="block text-gray-700 font-medium">Email</label>
                    <input
                      type="email"
                      name="cus_email"
                      value={formData.cus_email}
                      onChange={(e) => setFormData({ ...formData, cus_email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all duration-300"
                      required
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <label className="block text-gray-700 font-medium">Phone</label>
                    <input
                      type="tel"
                      name="cus_phone"
                      value={formData.cus_phone}
                      onChange={(e) => setFormData({ ...formData, cus_phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all duration-300"
                      required
                    />
                  </div>

                  {/* Address */}
                  <div className="space-y-2">
                    <label className="block text-gray-700 font-medium">Address</label>
                    <input
                      type="text"
                      name="cus_add1"
                      value={formData.cus_add1}
                      onChange={(e) => setFormData({ ...formData, cus_add1: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all duration-300"
                      required
                    />
                  </div>

                  {/* City */}
                  <div className="space-y-2">
                    <label className="block text-gray-700 font-medium">City</label>
                    <input
                      type="text"
                      name="cus_city"
                      value={formData.cus_city}
                      onChange={(e) => setFormData({ ...formData, cus_city: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all duration-300"
                      required
                    />
                  </div>

                  {/* State */}
                  <div className="space-y-2">
                    <label className="block text-gray-700 font-medium">State</label>
                    <input
                      type="text"
                      name="cus_state"
                      value={formData.cus_state}
                      onChange={(e) => setFormData({ ...formData, cus_state: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all duration-300"
                      required
                    />
                  </div>

                  {/* Postcode */}
                  <div className="space-y-2">
                    <label className="block text-gray-700 font-medium">Postcode</label>
                    <input
                      type="text"
                      name="cus_postcode"
                      value={formData.cus_postcode}
                      onChange={(e) => setFormData({ ...formData, cus_postcode: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all duration-300"
                      required
                    />
                  </div>

                  {/* Total Amount (Disabled) */}
                  <div className="space-y-2">
                    <label className="block text-gray-700 font-medium">Total Amount</label>
                    <input
                      type="text"
                      value={`$${totalAmount}`}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 font-semibold text-gray-700"
                      disabled
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3 rounded-xl border-2 border-gray-200 font-semibold text-gray-700 hover:bg-gray-50 transition-all duration-300"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-orange-400 to-orange-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Confirm Payment
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdoptPetPayment;
