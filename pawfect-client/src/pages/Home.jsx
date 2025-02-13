import React, { useState, useEffect } from "react";
import WhatWeOffer from "../components/WhatWeOffer";
import TrainingPrograms from "../components/TrainingPrograms";
import Banner from "../components/Banner";
import About from "../components/About";
import Newsletter from "../components/Newsletter";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FaExclamationTriangle, FaMapMarkerAlt, FaPhone, FaCalendarAlt, FaPaw, FaPalette, FaGift, FaUserAlt, FaClock } from "react-icons/fa";

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
    }
  });

  useEffect(() => {
    if (lostPets.length > 0 && showModal) {
      const initMap = () => {
        const location = {
          lat: parseFloat(lostPets[currentPetIndex].lat),
          lng: parseFloat(lostPets[currentPetIndex].lng)
        };

        const mapInstance = new window.google.maps.Map(
          document.getElementById("map"),
          {
            center: location,
            zoom: 15,
          }
        );

        const newMarker = new window.google.maps.Marker({
          position: location,
          map: mapInstance,
          title: "Last Seen Here"
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
      setCurrentPetIndex(prev => prev + 1);
    } else {
      setShowModal(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div>
      <Helmet>
        <title>Fitverse | Home</title>
      </Helmet>

      {/* Lost Pets Emergency Modal */}
      {showModal && lostPets.length > 0 && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl max-w-lg w-full mx-4 shadow-2xl border-2 border-red-500 max-h-[90vh] overflow-y-auto my-auto">
            <div className="flex items-center gap-3 bg-red-100 p-4 rounded-xl mb-6">
              <FaExclamationTriangle className="text-red-500 text-2xl animate-pulse" />
              <h2 className="text-xl font-bold text-red-500">URGENT: Lost Pet Alert!</h2>
            </div>
            
            <div className="relative">
              <img 
                src={lostPets[currentPetIndex].petImage} 
                alt="Lost Pet"
                className="w-full h-80 object-cover rounded-xl mb-4 border-4 border-gray-100 shadow-md"
              />
              <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg">
                {lostPets[currentPetIndex].status}
              </div>
            </div>

            <h3 className="text-2xl font-bold mb-4 text-gray-800">{lostPets[currentPetIndex].petName}</h3>
            
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                  <FaPaw className="text-gray-600" />
                  <p className="text-gray-700">{lostPets[currentPetIndex].petType}</p>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                  <FaPalette className="text-gray-600" />
                  <p className="text-gray-700">{lostPets[currentPetIndex].color}</p>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                  <FaCalendarAlt className="text-gray-600" />
                  <p className="text-gray-700">{formatDate(lostPets[currentPetIndex].lastSeenDate)}</p>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                  <FaGift className="text-gray-600" />
                  <p className="text-gray-700">${lostPets[currentPetIndex].reward}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                <FaMapMarkerAlt className="text-gray-600" />
                <p className="text-gray-700">Location: {lostPets[currentPetIndex].lat}, {lostPets[currentPetIndex].lng}</p>
              </div>

              <div id="map" className="w-full h-[250px] rounded-xl shadow-md"></div>

              <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                <FaUserAlt className="text-gray-600" />
                <p className="text-gray-700">{lostPets[currentPetIndex].ownerEmail}</p>
              </div>

              <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                <FaPhone className="text-gray-600" />
                <p className="text-gray-700">{lostPets[currentPetIndex].contactNumber}</p>
              </div>

              <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                <FaClock className="text-gray-600" />
                <p className="text-gray-700">Reported: {formatDate(lostPets[currentPetIndex].reportDate)}</p>
              </div>

              <p className="text-gray-700 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                {lostPets[currentPetIndex].description}
              </p>
            </div>

            <div className="flex justify-between items-center pt-2 border-t">
              <button 
                onClick={() => setShowModal(false)}
                className="btn btn-error btn-sm"
              >
                Close Alert
              </button>
              <div className="text-sm text-gray-500 font-medium">
                {currentPetIndex + 1} of {lostPets.length} alerts
              </div>
              <button 
                onClick={handleNext}
                className="btn btn-primary btn-sm"
              >
                {currentPetIndex === lostPets.length - 1 ? "Finish" : "Next Alert"}
              </button>
            </div>
          </div>
        </div>
      )}

      <Banner />
      <About />
      <WhatWeOffer />
      <TrainingPrograms />
      <Newsletter />
    </div>
  );
};

export default Home;
