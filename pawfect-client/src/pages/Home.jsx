import React, { useState, useEffect } from "react";
import WhatWeOffer from "../components/WhatWeOffer";
import TrainingPrograms from "../components/TrainingPrograms";
import Banner from "../components/Banner";
import About from "../components/About";
import Newsletter from "../components/Newsletter";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaExclamationTriangle,
  FaMapMarkerAlt,
  FaPhone,
  FaCalendarAlt,
  FaPaw,
  FaPalette,
  FaGift,
  FaUserAlt,
  FaClock,
  FaHeart,
  FaPrint,
  FaShare,
} from "react-icons/fa";
import FAQuestions from "./FAQuestions";
import Forum from "./Forum";
const Home = () => {
  const [showModal, setShowModal] = useState(true);
  const [currentPetIndex, setCurrentPetIndex] = useState(0);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);

  const { data: lostPets = [] } = useQuery({
    queryKey: ["lostPets"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:5000/lost-pets");
      return res.data;
    },
  });

  useEffect(() => {
    if (lostPets.length > 0 && showModal) {
      const initMap = () => {
        const location = {
          lat: parseFloat(lostPets[currentPetIndex].lat),
          lng: parseFloat(lostPets[currentPetIndex].lng),
        };

        const mapInstance = new window.google.maps.Map(
          document.getElementById("map"),
          {
            center: location,
            zoom: 15,
            styles: [
              {
                featureType: "all",
                elementType: "geometry",
                stylers: [{ color: "#f5f5f5" }],
              },
              {
                featureType: "water",
                elementType: "geometry",
                stylers: [{ color: "#e9e9e9" }],
              },
            ],
          }
        );

        const newMarker = new window.google.maps.Marker({
          position: location,
          map: mapInstance,
          title: "Last Seen Here",
          animation: window.google.maps.Animation.DROP,
          icon: {
            url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
            scaledSize: new window.google.maps.Size(40, 40),
          },
        });

        setMap(mapInstance);
        setMarker(newMarker);
      };

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyC5s89_KsT2NG6DawsfH_Ju__2Yp4oKh8I`;
      script.async = true;
      script.onload = initMap;
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [currentPetIndex, lostPets, showModal]);

  const handleNext = () => {
    if (currentPetIndex < lostPets.length - 1) {
      setCurrentPetIndex((prev) => prev + 1);
    } else {
      setShowModal(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="relative">
      <Helmet>
        <title>Pawfect | Home</title>
      </Helmet>

      <AnimatePresence>
        {showModal && lostPets.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 mt-16 overflow-y-auto bg-black/50 backdrop-blur-sm"
          >
            <div className="min-h-full flex items-start justify-center p-4">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gradient-to-br from-white to-orange-50 rounded-3xl shadow-2xl border-2 border-orange-500/30 w-full max-w-4xl my-8"
                style={{
                  backgroundImage:
                    "url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FFA500' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
                }}
              >
                <div className="sticky top-0 bg-white/95 backdrop-blur-sm p-6 border-b border-orange-100">
                  <div className="flex items-center justify-between gap-3 bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-2xl shadow-inner">
                    <div className="flex items-center gap-3">
                      <FaExclamationTriangle className="text-orange-500 text-3xl animate-pulse" />
                      <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 text-transparent bg-clip-text">
                        URGENT: Lost Pet Alert!
                      </h2>
                    </div>
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05, rotate: 5 }}
                        className="p-2 bg-white rounded-xl hover:bg-orange-50 transition-colors shadow-md"
                      >
                        <FaPrint className="text-orange-500" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05, rotate: -5 }}
                        className="p-2 bg-white rounded-xl hover:bg-orange-50 transition-colors shadow-md"
                      >
                        <FaShare className="text-orange-500" />
                      </motion.button>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  <div className="relative group">
                    <motion.img
                      whileHover={{ scale: 1.02 }}
                      src={lostPets[currentPetIndex].petImage}
                      alt="Lost Pet"
                      className="w-full h-96 object-cover rounded-2xl shadow-lg transform transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4 flex gap-2">
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg backdrop-blur-sm"
                      >
                        {lostPets[currentPetIndex].status}
                      </motion.span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <h3 className="text-3xl font-bold text-gray-800">
                      {lostPets[currentPetIndex].petName}
                    </h3>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-3 bg-red-50 rounded-full hover:bg-red-100 transition-colors shadow-md"
                    >
                      <FaHeart className="text-red-500 text-xl" />
                    </motion.button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <InfoCard
                      icon={<FaPaw />}
                      text={lostPets[currentPetIndex].petType}
                    />
                    <InfoCard
                      icon={<FaPalette />}
                      text={lostPets[currentPetIndex].color}
                    />
                    <InfoCard
                      icon={<FaCalendarAlt />}
                      text={formatDate(lostPets[currentPetIndex].lastSeenDate)}
                    />
                    <InfoCard
                      icon={<FaGift />}
                      text={`$${lostPets[currentPetIndex].reward} Reward`}
                    />
                  </div>

                  <div className="space-y-4">
                    <div
                      id="map"
                      className="w-full h-[300px] rounded-2xl shadow-lg"
                    ></div>

                    <InfoCard
                      icon={<FaMapMarkerAlt />}
                      text={`${lostPets[currentPetIndex].lastSeenLocation}`}
                    />
                    <InfoCard
                      icon={<FaUserAlt />}
                      text={lostPets[currentPetIndex].ownerEmail}
                    />
                    <InfoCard
                      icon={<FaPhone />}
                      text={lostPets[currentPetIndex].contactNumber}
                    />

                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-2xl border border-orange-200 shadow-inner">
                      <p className="text-gray-700 leading-relaxed">
                        {lostPets[currentPetIndex].description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm p-6 border-t border-orange-100">
                  <div className="flex justify-between items-center">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setShowModal(false)}
                      className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all shadow-lg"
                    >
                      Close Alert
                    </motion.button>
                    <span className="text-sm text-gray-500 font-medium">
                      Alert {currentPetIndex + 1} of {lostPets.length}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      onClick={handleNext}
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all shadow-lg"
                    >
                      {currentPetIndex === lostPets.length - 1
                        ? "Finish"
                        : "Next Alert"}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Banner />
      <About />
      <WhatWeOffer />
      <TrainingPrograms />
      <Forum />
      <FAQuestions />
      <Newsletter />
    </div>
  );
};

const InfoCard = ({ icon, text }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="flex items-center gap-3 bg-gradient-to-r from-gray-50 to-orange-50 p-4 rounded-xl transition-all shadow-sm hover:shadow-md"
  >
    <div className="text-orange-500">{icon}</div>
    <p className="text-gray-700 font-medium">{text}</p>
  </motion.div>
);

export default Home;
