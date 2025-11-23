import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaMapMarkerAlt, FaStar } from "react-icons/fa";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";

const AllTrainer = () => {
  const [volunteers, setVolunteers] = useState([]);

  useEffect(() => {
    fetch("https://pawfect-server-beige.vercel.app/volunteers")
      .then((res) => res.json())
      .then((data) => setVolunteers(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      <Helmet>
        <title>Pawfect | Our Volunteers</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-orange-50/50 via-white to-orange-50/30">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative h-[70vh] flex items-center justify-center bg-gradient-to-r from-black to-orange-100 overflow-hidden"
        >
          <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/7468980/pexels-photo-7468980.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')] bg-cover bg-center mix-blend-overlay"></div>
          <div className="relative z-10 text-center space-y-6 px-4">
            <motion.h1 
              initial={{ y: -50 }}
              animate={{ y: 0 }}
              className="satoshi text-5xl md:text-6xl lg:text-7xl font-bold text-white drop-shadow-lg"
            >
              Our Dedicated Volunteers
            </motion.h1>
            <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto font-light">
              Meet our passionate team of animal lovers who dedicate their time to make a difference
            </p>
          </div>
        </motion.div>

        {/* Volunteers Grid */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {volunteers.map((volunteer, index) => (
              <motion.div
                key={volunteer._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
              >
                <div className="relative h-96">
                  <img
                    src={volunteer.profileImage || volunteer.image}
                    alt={volunteer.name || volunteer.fullName}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      e.target.src = "https://i.ibb.co/MgsTCcv/avater.jpg";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-24 group-hover:translate-y-0 transition-transform duration-500">
                  {/* <div className="flex items-center gap-2 mb-3">
                    <FaMapMarkerAlt className="text-[#FF640D]" />
                    <span className="text-sm">New York, USA</span>
                  </div> */}

                  <h3 className="text-2xl font-bold mb-2">{volunteer.name || volunteer.fullName}</h3>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className="text-yellow-400 w-4 h-4" />
                      ))}
                    </div>
                    <span className="text-sm">({volunteer.experience} years exp.)</span>
                  </div>

                  <div className="space-y-3 mb-6">
                    <p className="text-sm text-gray-200">Available: {volunteer.availableTime}</p>
                    <div className="flex flex-wrap gap-2">
                      {volunteer.skills?.slice(0, 3).map((skill, index) => (
                        <span key={index} className="px-3 py-1 bg-white/20 rounded-full text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex gap-4">
                      <motion.a whileHover={{ y: -2 }} href={volunteer.socialLinks?.facebook || volunteer.facebook}>
                        <FaFacebook className="w-5 h-5 hover:text-[#FF640D]" />
                      </motion.a>
                      <motion.a whileHover={{ y: -2 }} href={volunteer.socialLinks?.twitter || volunteer.twitter}>
                        <FaTwitter className="w-5 h-5 hover:text-[#FF640D]" />
                      </motion.a>
                      <motion.a whileHover={{ y: -2 }} href={volunteer.socialLinks?.instagram || volunteer.instagram}>
                        <FaInstagram className="w-5 h-5 hover:text-[#FF640D]" />
                      </motion.a>
                    </div>
                    
                    <Link 
                      to={`/volunteer/${volunteer._id}`}
                      className="px-6 py-2 bg-[#FF640D] text-white rounded-full text-sm font-medium hover:bg-[#ff5500] transition-colors duration-300"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default AllTrainer;
