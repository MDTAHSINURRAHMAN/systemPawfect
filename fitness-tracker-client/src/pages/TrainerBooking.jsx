import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const TrainerBooking = () => {
  const [trainer, setTrainer] = useState(null);
  const [classes, setClasses] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const { id, slotIndex } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch trainer data
    fetch(`http://localhost:5000/trainers/${id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Trainer data:", data); // Debug log
        setTrainer(data);
      })
      .catch((err) => console.error(err));

    // Fetch classes data
    fetch("http://localhost:5000/classes")
      .then((res) => res.json())
      .then((data) => setClasses(data))
      .catch((err) => console.error(err));
  }, [id]);

  const packages = [
    {
      name: "Basic Membership",
      price: 10,
      benefits: [
        "Access to gym facilities during regular operating hours",
        "Use of cardio and strength training equipment",
        "Access to locker rooms and showers",
      ],
    },
    {
      name: "Standard Membership",
      price: 50,
      benefits: [
        "All benefits of the basic membership",
        "Access to group fitness classes such as yoga, spinning, and Zumba",
        "Use of additional amenities like a sauna or steam room",
      ],
    },
    {
      name: "Premium Membership",
      price: 100,
      benefits: [
        "All benefits of the standard membership",
        "Access to personal training sessions with certified trainers",
        "Discounts on additional services such as massage therapy or nutrition counseling",
      ],
    },
  ];

  const handleJoinNow = () => {
    if (!selectedPackage) {
      alert("Please select a membership package");
      return;
    }
    navigate(`/payment/${id}/${slotIndex}/${selectedPackage}`);
  };

  if (!trainer) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const selectedDay = trainer.availableDays[Math.floor(slotIndex / 3)];
  const selectedTime = trainer.availableTime.split(",")[slotIndex % 3].trim();
  const selectedSlot = `${selectedDay} - ${selectedTime}`;

  return (
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
        className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8 hover:shadow-xl transition-all duration-300"
      >
        <motion.h2
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 text-[#383838] hover:text-[#FF640D] transition-colors duration-300"
        >
          Booking Details
        </motion.h2>

        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <h3 className="text-lg sm:text-xl font-semibold mb-2">
            Trainer Information
          </h3>
          <p className="text-gray-700 text-sm sm:text-base">
            Name: {trainer.name || trainer.fullName}
          </p>
          <p className="text-gray-700 text-sm sm:text-base">
            Selected Slot: {selectedSlot}
          </p>
        </motion.div>

        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <h3 className="text-lg sm:text-xl font-semibold mb-2">
            Available Classes
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {classes.map((cls, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                className="bg-gray-50 p-3 sm:p-4 rounded-lg hover:shadow-md transition-all duration-300"
              >
                <h4 className="font-semibold text-sm sm:text-base">
                  {cls.name}
                </h4>
                <p className="text-gray-600 text-xs sm:text-sm">
                  {cls.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-6 sm:mb-8"
        >
          <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
            Membership Packages
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {packages.map((pkg, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.03 }}
                className={`border rounded-lg p-4 sm:p-6 cursor-pointer transition-all duration-300 ${
                  selectedPackage === index
                    ? "border-[#FF640D] bg-orange-50"
                    : "border-gray-200 hover:border-[#FF640D]"
                }`}
                onClick={() => setSelectedPackage(index)}
              >
                <h4 className="text-base sm:text-lg font-semibold mb-2">
                  {pkg.name}
                </h4>
                <p className="text-xl sm:text-2xl font-bold text-[#FF640D] mb-3 sm:mb-4">
                  ${pkg.price}/month
                </p>
                <ul className="space-y-1 sm:space-y-2">
                  {pkg.benefits.map((benefit, i) => (
                    <li key={i} className="text-gray-600 text-xs sm:text-sm">
                      • {benefit}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleJoinNow}
            className="bg-[#FF640D] text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg hover:bg-[#ff7a33] transition duration-300 text-sm sm:text-base"
          >
            Join Now
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default TrainerBooking;
