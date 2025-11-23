import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import { toast } from "react-hot-toast";

const TrainerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: volunteer,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["volunteer", id],
    queryFn: async () => {
      try {
        const response = await axios.get(
          `https://pawfect-server-beige.vercel.app/volunteers/${id}`
        );
        return response.data.data;
      } catch (error) {
        console.error("API Error:", error);
        toast.error("Failed to fetch volunteer details.");
        throw new Error(
          error.response?.data?.message || "Failed to fetch volunteer details"
        );
      }
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg text-[#FF640D]"></div>
      </div>
    );
  }

  if (error) {
    toast.error("Failed to fetch volunteer details.");
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-xl font-semibold">
          Error: {error.message}
        </div>
      </div>
    );
  }

  if (!volunteer) {
    toast.error("No volunteer data found");
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl font-semibold">No volunteer data found</div>
      </div>
    );
  }

  const handleSlotSelect = (slotId) => {
    navigate(`/booking/${id}/${slotId}`);
  };

  return (
    <>
      <Helmet>
        <title>Pawfect | Volunteer Details</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        {/* Hero Section */}
        <div className="relative h-[300px] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-black to-orange-100 opacity-90"></div>
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1450778869180-41d0601e046e')] bg-cover bg-center mix-blend-overlay"></div>
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent"></div>
        </div>

        {/* Profile Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10 pb-16">
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Left Column - Profile Info */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-orange-100">
                <div className="text-center">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="relative inline-block"
                  >
                    <div className="w-40 h-40 mx-auto rounded-full overflow-hidden border-4 border-[#FF640D] shadow-lg">
                      <img
                        src={volunteer.profileImage || "https://i.ibb.co/MgsTCcv/avater.jpg"}
                        alt={volunteer.fullName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute bottom-2 right-2 bg-green-500 w-5 h-5 rounded-full border-2 border-white"></div>
                  </motion.div>
                  
                  <h1 className="mt-4 text-2xl font-bold text-gray-900">{volunteer.fullName}</h1>
                  <p className="text-[#FF640D] font-medium">{volunteer.role || "Pet Care Volunteer"}</p>
                </div>

                <div className="mt-8 space-y-6">
                  <div className="flex items-center justify-between p-4 bg-orange-50 rounded-xl">
                    <span className="text-gray-600">Experience</span>
                    <span className="font-semibold text-[#FF640D]">{volunteer.experience} years</span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-orange-50 rounded-xl">
                    <span className="text-gray-600">Available Time</span>
                    <span className="font-semibold text-[#FF640D]">{volunteer.availableTime}</span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-orange-50 rounded-xl">
                    <span className="text-gray-600">Age</span>
                    <span className="font-semibold text-[#FF640D]">{volunteer.age} years</span>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="font-semibold text-gray-900 mb-4">Preferred Animals</h3>
                  <div className="flex flex-wrap gap-2">
                    {volunteer.preferredAnimals?.map((animal, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-orange-100 text-[#FF640D] rounded-full text-sm"
                      >
                        {animal}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="font-semibold text-gray-900 mb-4">Skills & Expertise</h3>
                  <div className="flex flex-wrap gap-2">
                    {volunteer.skills?.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-orange-100 text-[#FF640D] rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-8 flex justify-center space-x-4">
                  {volunteer.socialLinks?.facebook && (
                    <motion.a
                      whileHover={{ scale: 1.1 }}
                      href={volunteer.socialLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#FF640D] hover:text-[#FF8B3D]"
                    >
                      <FaFacebook size={24} />
                    </motion.a>
                  )}
                  {volunteer.socialLinks?.twitter && (
                    <motion.a
                      whileHover={{ scale: 1.1 }}
                      href={volunteer.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#FF640D] hover:text-[#FF8B3D]"
                    >
                      <FaTwitter size={24} />
                    </motion.a>
                  )}
                  {volunteer.socialLinks?.instagram && (
                    <motion.a
                      whileHover={{ scale: 1.1 }}
                      href={volunteer.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#FF640D] hover:text-[#FF8B3D]"
                    >
                      <FaInstagram size={24} />
                    </motion.a>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Slots & Chat */}
            <div className="lg:col-span-2 space-y-8">
              {/* Available Slots */}
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-orange-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Time Slots</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {volunteer.availableDays?.map((slot, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSlotSelect(slot.slotId)}
                      disabled={slot.isBooked}
                      className={`group relative overflow-hidden rounded-xl p-6 ${
                        slot.isBooked 
                          ? "bg-gray-100" 
                          : "bg-gradient-to-r from-[#FF640D] to-[#FF8B3D]"
                      }`}
                    >
                      <div className={`relative z-10 ${slot.isBooked ? "text-gray-500" : "text-white"}`}>
                        <h3 className="text-lg font-semibold">{slot.day}</h3>
                        <p className="mt-2">{volunteer.availableTime}</p>
                        {slot.isBooked && (
                          <span className="inline-block mt-2 px-3 py-1 bg-gray-200 text-gray-600 rounded-full text-sm">
                            Booked
                          </span>
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Chat Section */}
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-orange-100">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Chat with {volunteer.fullName}</h2>
                  <Link
                    to={`/user-chat/${id}`}
                    className="inline-flex items-center px-6 py-3 bg-[#FF640D] text-white rounded-xl hover:bg-[#FF8B3D] transition-colors duration-300"
                  >
                    <span>Start Chat</span>
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
                <p className="text-gray-600">
                  Have questions about pet care or want to discuss volunteering opportunities? Start a conversation with {volunteer.fullName} now!
                </p>
              </div>

              {/* Become a Volunteer CTA */}
              <div className="bg-gradient-to-r from-[#FF640D] to-[#FF8B3D] rounded-2xl shadow-xl p-8 text-white">
                <h2 className="text-2xl font-bold mb-4">Want to Join Our Team?</h2>
                <p className="mb-6">Make a difference in pets' lives by becoming a volunteer today!</p>
                <Link
                  to="/be-a-volunteer"
                  className="inline-block px-8 py-3 bg-white text-[#FF640D] rounded-xl font-semibold hover:bg-orange-50 transition-colors duration-300"
                >
                  Become a Volunteer
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default TrainerDetails;
