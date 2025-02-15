import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { FaPaw, FaClock, FaCalendarAlt, FaUserAlt } from "react-icons/fa";

const TrainerBookingPage = () => {
  const { id, slotId } = useParams();
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] = useState(null);

  const {
    data: trainer,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["trainer", id],
    queryFn: async () => {
      const response = await axios.get(`http://localhost:5000/volunteers/${id}`);
      return response.data.data;
    },
  });

  const selectedDay =
    trainer?.availableDays?.find((day) => day.slotId === slotId)?.day ||
    "Not specified";

  const packages = [
    {
      name: "Essential Care",
      price: 29,
      duration: "1 Month",
      features: [
        "Professional pet handling",
        "Basic training techniques",
        "Behavior assessment",
        "Weekly progress reports",
      ],
      icon: "🐾",
      color: "from-blue-500 to-blue-600"
    },
    {
      name: "Premium Training",
      price: 49,
      duration: "1 Month", 
      features: [
        "Advanced training methods",
        "Personalized care plan",
        "Nutrition guidance",
        "Bi-weekly consultations",
        "24/7 support access"
      ],
      icon: "⭐",
      color: "from-purple-500 to-purple-600",
      popular: true
    },
    {
      name: "Elite Package",
      price: 79,
      duration: "3 Months",
      features: [
        "VIP training sessions",
        "Behavioral therapy",
        "Health monitoring",
        "Emergency support",
        "Monthly assessments",
        "Training certification"
      ],
      icon: "👑",
      color: "from-amber-500 to-amber-600"
    }
  ];

  const handleJoinNow = async () => {
    if (!selectedPackage) {
      toast.error("Please select a training package to continue");
      return;
    }

    try {
      const paymentData = {
        trainerId: id,
        trainerName: trainer?.fullName,
        slotId: slotId,
        selectedDay: selectedDay,
        packageName: selectedPackage.name,
        amount: selectedPackage.price,
      };

      navigate("/payment", { state: paymentData });
    } catch (error) {
      toast.error("Failed to proceed to payment. Please try again.");
      console.error("Payment navigation error:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#FF640D]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 font-semibold">
        Error loading trainer details. Please try again.
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Pawfect | Training Booking</title>
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50/30">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4 py-12"
        >
          {/* Hero Section */}
          <div className="text-center my-16">
            <motion.h1 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-4xl md:text-5xl font-bold text-gray-800 mb-4"
            >
              Book Your Volunteer
            </motion.h1>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-gray-600 text-lg"
            >
              Choose the perfect training package for your beloved pet
            </motion.p>
          </div>

          {/* Trainer Info Card */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white rounded-2xl shadow-xl p-8 mb-12 border border-orange-100"
          >
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-orange-200">
                <img 
                  src={trainer?.profileImage || "https://via.placeholder.com/128"} 
                  alt={trainer?.fullName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{trainer?.fullName}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <FaUserAlt className="text-[#FF640D]" />
                    <span>Experience: {trainer?.experience} years</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-[#FF640D]" />
                    <span>Day: {selectedDay}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaClock className="text-[#FF640D]" />
                    <span>Time: {trainer?.availableTime}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Packages Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {packages.map((pkg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 cursor-pointer
                  ${selectedPackage?.name === pkg.name ? 'ring-2 ring-[#FF640D] transform scale-105' : 'hover:shadow-xl'}
                `}
                onClick={() => setSelectedPackage(pkg)}
              >
                {pkg.popular && (
                  <div className="absolute top-4 right-4 bg-[#FF640D] text-white px-3 py-1 rounded-full text-sm">
                    Popular Choice
                  </div>
                )}
                
                <div className="p-8">
                  <div className="text-4xl mb-4">{pkg.icon}</div>
                  <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                  <div className="flex items-baseline mb-6">
                    <span className="text-4xl font-bold text-[#FF640D]">${pkg.price}</span>
                    <span className="text-gray-500 ml-2">/{pkg.duration.toLowerCase()}</span>
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <FaPaw className="text-[#FF640D]" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <button 
                    className={`w-full py-3 rounded-xl font-semibold transition-all duration-300
                      ${selectedPackage?.name === pkg.name 
                        ? 'bg-[#FF640D] text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                    `}
                  >
                    {selectedPackage?.name === pkg.name ? 'Selected' : 'Select Package'}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Action Button */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center"
          >
            <button
              onClick={handleJoinNow}
              disabled={!selectedPackage}
              className={`
                px-12 py-4 rounded-xl font-bold text-lg transition-all duration-300
                ${selectedPackage 
                  ? 'bg-gradient-to-r from-[#FF640D] to-orange-500 text-white hover:shadow-lg transform hover:scale-105' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'}
              `}
            >
              {selectedPackage ? 'Proceed to Payment' : 'Select a Package'}
            </button>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default TrainerBookingPage;
