import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

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
        name: "Rescue Package",
        price: 19,
        duration: "1 Month",
        features: [
          "Pet rescue and transport",
          "Temporary foster care",
          "Initial health checkup",
          "Basic vaccinations",
        ],
      },
      {
        name: "Daily Care Package", 
        price: 39,
        duration: "1 Month",
        features: [
          "Daily feeding and care",
          "Regular health monitoring",
          "Grooming services",
          "Deworming and flea treatment",
          "Routine vet check-ups",
        ],
      },
      {
        name: "Training & Socialization Package",
        price: 59, 
        duration: "3 Months",
        features: [
          "Basic obedience training",
          "Advanced behavior correction",
          "Socialization with other pets",
          "Pet enrichment activities",
          "24/7 trainer support",
        ],
      },
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

      console.log(paymentData);

      navigate("/payment", { state: paymentData });
    } catch (error) {
      toast.error("Failed to proceed to payment. Please try again.");
      console.error("Payment navigation error:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Error loading trainer details
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Pawfect | Trainer Booking</title>
      </Helmet>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8"
      >
        <motion.div
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.6 }}
          className=""
        >
          <motion.h2
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="zen-dots text-2xl sm:text-3xl lg:text-4xl font-bold mb-8 text-center text-[#383838] hover:text-[#FF640D] transition-colors duration-300"
          >
            Choose Your Training Package
          </motion.h2>

          {/* Trainer and Slot Info */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-white to-orange-50 rounded-2xl shadow-lg p-6 sm:p-8 lg:p-10 mb-8 hover:shadow-2xl transition-all duration-300 border border-orange-100"
          >
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <div className="w-full sm:w-2/3">
                <h3 className="text-xl sm:text-2xl font-bold mb-6 text-gray-800 border-b border-orange-200 pb-2">
                  Volunteer Information
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-700 min-w-[120px]">
                      Volunteer:
                    </span>
                    <span className="text-[#FF640D] font-semibold">
                      {trainer?.fullName}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-700 min-w-[120px]">
                      Selected Day:
                    </span>
                    <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
                      {selectedDay}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-700 min-w-[120px]">
                      Available Times:
                    </span>
                    <span className="text-gray-600">
                      {trainer?.availableTime}
                    </span>
                  </div>
                </div>
              </div>

              <div className="w-full sm:w-1/3 bg-gradient-to-br from-white to-orange-50 rounded-xl p-6 shadow-lg border border-orange-100">
                <h4 className="font-bold text-xl text-gray-800 mb-4 pb-2 border-b border-orange-200">
                  Volunteer Specialties
                </h4>
                <div className="flex flex-wrap gap-3">
                  {trainer?.skills?.map((skill, index) => (
                    <motion.span
                      key={index}
                      whileHover={{
                        scale: 1.05,
                        boxShadow: "0 4px 12px rgba(255, 100, 13, 0.15)",
                      }}
                      className="bg-gradient-to-r from-orange-500 to-[#FF640D] text-white px-5 py-2 rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-all duration-300 backdrop-blur-sm"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Package Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8">
            {packages.map((pkg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.03 }}
                className={`relative overflow-hidden bg-gradient-to-br from-white to-orange-50 rounded-2xl shadow-lg p-6 sm:p-8 cursor-pointer transition-all duration-300 border border-orange-100 ${
                  selectedPackage === pkg
                    ? "ring-2 ring-[#FF640D] transform scale-[1.02] shadow-2xl bg-orange-50"
                    : "hover:shadow-xl hover:border-orange-200"
                }`}
                onClick={() => setSelectedPackage(pkg)}
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-200 to-orange-100 rounded-bl-full opacity-20" />

                <h3 className="text-xl sm:text-2xl font-bold mb-3 text-gray-800">
                  {pkg.name}
                </h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-3xl sm:text-4xl font-bold text-[#FF640D]">
                    ${pkg.price}
                  </span>
                  <span className="text-gray-600 ml-2">
                    /{pkg.duration.toLowerCase()}
                  </span>
                </div>

                <div className="h-px bg-gradient-to-r from-orange-200 via-orange-100 to-transparent mb-6" />

                <ul className="space-y-3">
                  {pkg.features.map((feature, idx) => (
                    <motion.li
                      key={idx}
                      whileHover={{ x: 5 }}
                      className="flex items-center gap-3 text-gray-700"
                    >
                      <span className="flex-shrink-0 w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center">
                        <span className="text-[#FF640D] text-sm">✓</span>
                      </span>
                      <span className="text-sm sm:text-base">{feature}</span>
                    </motion.li>
                  ))}
                </ul>

                {selectedPackage === pkg && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-4 right-4"
                  >
                    <span className="bg-gradient-to-r from-[#FF640D] to-orange-500 text-white px-3 py-1.5 rounded-full text-sm font-medium shadow-md">
                      Selected
                    </span>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Book Now Button */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleJoinNow}
              disabled={!selectedPackage}
              className={`px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold transition duration-300 ${
                selectedPackage
                  ? "bg-[#FF640D] text-white hover:bg-[#ff7a33]"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {selectedPackage ? "Proceed to Payment" : "Select a Package"}
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default TrainerBookingPage;
