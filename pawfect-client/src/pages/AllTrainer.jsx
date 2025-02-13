import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
const AllTrainer = () => {
  const [volunteers, setVolunteers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/volunteers")
      .then((res) => res.json())
      .then((data) => setVolunteers(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      <Helmet>
        <title>Fitverse | All Volunteers</title>
      </Helmet>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="px-4 py-12 bg-gradient-to-br from-orange-50 to-white min-h-screen p-4 sm:p-6 lg:p-8"
      >
        <motion.h2
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
          className="zen-dots text-4xl md:text-5xl font-bold text-center mb-12 text-[#383838] hover:text-[#FF640D] transition-colors duration-300 mt-32 leading-[4rem]"
        >
          Our Expert Volunteers
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-11/12 mx-auto">
          {volunteers.map((volunteer, index) => (
            <motion.div
              key={volunteer._id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.03 }}
              className="bg-gradient-to-br from-white to-orange-50 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-orange-100"
            >
              <div className="relative group">
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.4 }}
                  src={volunteer.profileImage || volunteer.image}
                  alt={volunteer.name || volunteer.fullName}
                  className="w-full h-80 object-cover transition-transform duration-300"
                  onError={(e) => {
                    e.target.src = "https://i.ibb.co/MgsTCcv/avater.jpg";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              <div className="p-8 relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-200 to-orange-100 rounded-bl-full opacity-20" />

                <motion.h3
                  whileHover={{ color: "#FF640D" }}
                  className="text-2xl font-bold mb-4 text-gray-800 border-b border-orange-200 pb-2 transition-colors duration-300"
                >
                  {volunteer.name || volunteer.fullName}
                </motion.h3>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3 bg-white/80 p-2 rounded-lg shadow-sm">
                    <span className="font-semibold text-gray-700">
                      Experience:
                    </span>
                    <span className="text-[#FF640D] font-medium">
                      {volunteer.experience} years
                    </span>
                  </div>

                  <div className="flex flex-col gap-3 bg-white/80 p-2 rounded-lg shadow-sm">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-gray-700">
                        Available Time:
                      </span>
                      <span className="bg-gradient-to-r from-orange-500 to-[#FF640D] text-white px-4 py-1 rounded-full text-sm">
                        {volunteer.availableTime}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">
                        Skills:
                      </span>
                      <ul className="list-disc ml-6 mt-1">
                        {volunteer.skills?.map((skill, index) => (
                          <li key={index} className="text-[#FF640D] text-sm">
                            {skill}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center space-x-6 mb-8">
                  <motion.a
                    whileHover={{ scale: 1.2, y: -2 }}
                    href={volunteer.socialLinks?.facebook || volunteer.facebook}
                    className="text-gray-600 hover:text-[#FF640D] transition-colors duration-300"
                  >
                    <FaFacebook size={24} />
                  </motion.a>
                  <motion.a
                    whileHover={{ scale: 1.2, y: -2 }}
                    href={volunteer.socialLinks?.twitter || volunteer.twitter}
                    className="text-gray-600 hover:text-[#FF640D] transition-colors duration-300"
                  >
                    <FaTwitter size={24} />
                  </motion.a>
                  <motion.a
                    whileHover={{ scale: 1.2, y: -2 }}
                    href={volunteer.socialLinks?.instagram || volunteer.instagram}
                    className="text-gray-600 hover:text-[#FF640D] transition-colors duration-300"
                  >
                    <FaInstagram size={24} />
                  </motion.a>
                </div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="relative z-10"
                >
                  <Link
                    to={`/volunteer/${volunteer._id}`}
                    className="block w-full text-center bg-gradient-to-r from-[#242424] to-[#3a3a3a] text-white px-6 py-3 rounded-xl hover:from-[#FF640D] hover:to-[#ff7a33] transition-all duration-300 font-semibold tracking-wide shadow-md hover:shadow-lg"
                  >
                    Know More
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </>
  );
};

export default AllTrainer;
