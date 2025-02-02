import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AdoptPetPayment = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: pet = {}, isLoading } = useQuery({
    queryKey: ["pet", id],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:5000/pets/${id}`);
      return res.data;
    },
  });

//   console.log(pet);

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
    petName: pet.name,
    adoptionFee: totalAmount,
    currency: "BDT",
  });

  const initPaymentMutation = useMutation({
    mutationFn: async (paymentData) => {
      console.log(paymentData);
      const response = await axios.post(
        "http://localhost:5000/adopt-pet-payment",
        paymentData
      );
      return response.data;
    },
    onSuccess: (data) => {
      if (data.status === "success") {
        // Store payment info in localStorage if needed
        localStorage.setItem(
          "adoptPaymentInfo",
          JSON.stringify({
            petId: pet._id,
            petName: pet.name,
            amount: pet.adoptionFee,
            transactionId: data.tran_id,
          })
        );

        // Redirect to SSL Commerz payment interface
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
        <span className="loading loading-spinner loading-lg text-orange-500"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
            Payment Details
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Pet Details */}
            <div className="space-y-6">
              <div className="relative h-64 rounded-xl overflow-hidden">
                <img
                  src={pet.image}
                  alt={pet.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-gray-800">
                  {pet.name}
                </h3>
                <div className="space-y-2">
                  <p className="text-gray-600">
                    <span className="font-medium">Species:</span> {pet.species}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Breed:</span> {pet.breed}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Age:</span> {pet.age} years
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="bg-orange-50 rounded-xl p-6 space-y-6">
              <h3 className="text-2xl font-semibold text-gray-800">
                Payment Summary
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Adoption Fee</span>
                  <span className="font-semibold">${pet.adoptionFee}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Processing Fee</span>
                  <span className="font-semibold">${processingFee}</span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total Amount</span>
                    <span className="font-bold text-xl">${totalAmount}</span>
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsModalOpen(true)}
                className="w-full btn bg-gradient-to-r from-orange-400 to-orange-600 text-white border-none hover:from-orange-500 hover:to-orange-700"
              >
                Proceed to Payment
              </motion.button>

              <p className="text-sm text-gray-500 text-center mt-4">
                By proceeding, you agree to our terms and conditions
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg p-8 max-w-3xl w-full mx-4 relative z-50"
          >
            <h3 className="text-2xl font-bold mb-6">Enter Payment Details</h3>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-gray-700">Name</label>
                  <input
                    type="text"
                    name="cus_name"
                    value={formData.cus_name}
                    onChange={(e) =>
                      setFormData({ ...formData, cus_name: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-gray-700">Email</label>
                  <input
                    type="email"
                    name="cus_email"
                    value={formData.cus_email}
                    onChange={(e) =>
                      setFormData({ ...formData, cus_email: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-gray-700">Phone</label>
                  <input
                    type="tel"
                    name="cus_phone"
                    value={formData.cus_phone}
                    onChange={(e) =>
                      setFormData({ ...formData, cus_phone: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-gray-700">Address</label>
                  <input
                    type="text"
                    name="cus_add1"
                    value={formData.cus_add1}
                    onChange={(e) =>
                      setFormData({ ...formData, cus_add1: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-gray-700">City</label>
                  <input
                    type="text"
                    name="cus_city"
                    value={formData.cus_city}
                    onChange={(e) =>
                      setFormData({ ...formData, cus_city: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-gray-700">State</label>
                  <input
                    type="text"
                    name="cus_state"
                    value={formData.cus_state}
                    onChange={(e) =>
                      setFormData({ ...formData, cus_state: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-gray-700">Postcode</label>
                  <input
                    type="text"
                    name="cus_postcode"
                    value={formData.cus_postcode}
                    onChange={(e) =>
                      setFormData({ ...formData, cus_postcode: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-gray-700">Total Amount</label>
                  <input
                    type="text"
                    value={`$${totalAmount}`}
                    className="w-full px-4 py-2 border rounded-lg bg-gray-100"
                    disabled
                  />
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn bg-gradient-to-r from-orange-400 to-orange-600 text-white border-none hover:from-orange-500 hover:to-orange-700"
                >
                  Confirm Payment
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdoptPetPayment;
