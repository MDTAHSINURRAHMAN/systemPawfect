import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import { FaStar, FaMapMarkerAlt, FaCalendarAlt, FaClock, FaPaw } from "react-icons/fa";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const VolunteerHome = () => {
  const navigate = useNavigate();
  const { data: volunteers = [], isLoading } = useQuery({
    queryKey: ["volunteers"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:5000/volunteers");
      return res.data.slice(0, 3); // Get only first 3 volunteers
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg text-orange-500"></span>
      </div>
    );
  }

  return (
    <div className="py-20 bg-gradient-to-br from-white to-orange-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-black to-orange-500 bg-clip-text text-transparent">
            Meet Our Volunteers
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our dedicated volunteers are passionate about helping pets and their owners live better lives together
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {volunteers.map((volunteer, index) => (
            <motion.div
              key={volunteer._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
            >
              <div className="relative">
                <img
                  src={volunteer.profileImage || "https://i.ibb.co/7CL7JfV/user-placeholder.png"}
                  alt={volunteer.fullName}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <h3 className="text-white text-xl font-semibold">{volunteer.fullName}</h3>
                  <p className="text-gray-200 text-sm">{volunteer.age} years old</p>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={`w-4 h-4 ${
                          i < volunteer.rating ? "text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaCalendarAlt className="text-orange-500" />
                    <span>{volunteer.experience} years experience</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaClock className="text-orange-500" />
                    <span>Available at {volunteer.availableTime}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaPaw className="text-orange-500" />
                    <span>Preferred: {volunteer.preferredAnimals?.join(", ")}</span>
                  </div>
                  <div className="flex items-center gap-4 mt-4">
                    <a href={volunteer.facebook} target="_blank" rel="noopener noreferrer">
                      <FaFacebook className="text-blue-600 text-xl hover:scale-110 transition-transform" />
                    </a>
                    <a href={volunteer.twitter} target="_blank" rel="noopener noreferrer">
                      <FaTwitter className="text-blue-400 text-xl hover:scale-110 transition-transform" />
                    </a>
                    <a href={volunteer.instagram} target="_blank" rel="noopener noreferrer">
                      <FaInstagram className="text-pink-600 text-xl hover:scale-110 transition-transform" />
                    </a>
                  </div>
                </div>

                <motion.button
                  onClick={() => navigate(`/volunteer/${volunteer._id}`)}
                  whileHover={{ scale: 1.02 }}
                  className="w-full py-3 bg-gradient-to-r from-black to-orange-500 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all mb-3"
                >
                  View Details
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-12"
        >
          <motion.button
            onClick={() => navigate("/be-a-volunteer")}
            whileHover={{ scale: 1.05 }}
            className="px-8 py-4 bg-gradient-to-r from-black to-orange-500 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg text-lg font-semibold"
          >
            Become a Volunteer
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default VolunteerHome;
