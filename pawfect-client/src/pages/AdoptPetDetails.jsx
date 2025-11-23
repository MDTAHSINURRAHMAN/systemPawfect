import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaPaw, FaHeart, FaVenusMars, FaBirthdayCake, FaRuler, FaPalette, FaHeartbeat, FaDollarSign, FaSyringe, FaCut } from "react-icons/fa";

const AdoptPetDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const { data: pet = {}, isLoading } = useQuery({
    queryKey: ["pet", id],
    queryFn: async () => {
      const res = await axios.get(`https://pawfect-server-beige.vercel.app/pets/${id}`);
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
        <span className="loading loading-spinner loading-lg text-orange-500"></span>
      </div>
    );
  }

  const handleAdopt = async () => {
    try {
      navigate(`/adopt-pet-payment/${id}`);
    } catch (error) {
      console.error("Error adopting pet:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50/30 py-12 sm:py-16 md:py-24 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto max-w-7xl"
      >
        <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-orange-100">
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 p-6 sm:p-8 lg:p-10">
            {/* Left Column - Image Gallery & Details */}
            <div className="space-y-6 sm:space-y-8">
              <div className="relative group">
                <motion.div 
                  className="relative h-[300px] sm:h-[400px] lg:h-[500px] rounded-2xl overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src={pet.image}
                    alt={pet.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
                </motion.div>
                <div className="absolute top-4 right-4">
                  <span className={`px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold backdrop-blur-md ${
                    pet.status === 'adopted' 
                      ? 'bg-red-500/90 text-white'
                      : 'bg-green-500/90 text-white'
                  }`}>
                    {pet.status === 'adopted' ? 'Adopted' : 'Available'}
                  </span>
                </div>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <div className="bg-gradient-to-br from-orange-50/80 to-orange-100/50 p-4 sm:p-6 rounded-2xl border border-orange-100">
                  <h3 className="text-xl sm:text-2xl font-bold text-orange-600 mb-3 sm:mb-4">About {pet.name}</h3>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{pet.description}</p>
                </div>

                <div className="bg-gradient-to-br from-orange-50/80 to-orange-100/50 p-4 sm:p-6 rounded-2xl border border-orange-100">
                  <h3 className="text-xl sm:text-2xl font-bold text-orange-600 mb-3 sm:mb-4">Personality & Behavior</h3>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{pet.behavior}</p>
                </div>

                <div className="bg-gradient-to-br from-orange-50/80 to-orange-100/50 p-4 sm:p-6 rounded-2xl border border-orange-100">
                  <h3 className="text-xl sm:text-2xl font-bold text-orange-600 mb-3 sm:mb-4">Care Requirements</h3>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{pet.specialNeeds || "No special needs - just lots of love!"}</p>
                </div>
              </div>
            </div>

            {/* Right Column - Pet Information */}
            <div className="space-y-6 sm:space-y-8">
              <div className="space-y-3 sm:space-y-4">
                <motion.h1 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent"
                >
                  {pet.name}
                </motion.h1>
                <div className="w-16 sm:w-24 h-1 sm:h-1.5 bg-gradient-to-r from-orange-500 to-orange-700 rounded-full" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <InfoCard icon={<FaPaw />} label="Species" value={pet.species} />
                <InfoCard icon={<FaHeart />} label="Breed" value={pet.breed} />
                <InfoCard icon={<FaBirthdayCake />} label="Age" value={`${pet.age} years`} />
                <InfoCard icon={<FaVenusMars />} label="Gender" value={pet.gender} />
                <InfoCard icon={<FaRuler />} label="Size" value={pet.size} />
                <InfoCard icon={<FaPalette />} label="Color" value={pet.color} />
                <InfoCard icon={<FaHeartbeat />} label="Health" value={pet.healthStatus} />
                <InfoCard icon={<FaDollarSign />} label="Adoption Fee" value={`$${pet.adoptionFee}`} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <StatusCard 
                  icon={<FaSyringe />}
                  label="Vaccinated"
                  status={pet.vaccinated}
                />
                <StatusCard 
                  icon={<FaCut />}
                  label="Spayed/Neutered"
                  status={pet.spayedNeutered}
                />
              </div>

              {pet.status === "adopted" ? (
                <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 p-6 sm:p-8 rounded-2xl border border-orange-200">
                  <h3 className="text-xl sm:text-2xl font-bold text-orange-600 mb-4 sm:mb-6">Adoption Details</h3>
                  <div className="space-y-3 sm:space-y-4">
                    <DetailRow label="Adopted By" value={pet.adoptionDetails.customerName} />
                    <DetailRow label="Email" value={pet.adoptionDetails.customerEmail} />
                    <DetailRow 
                      label="Adoption Date" 
                      value={new Date(pet.adoptionDetails.adoptionDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })} 
                    />
                  </div>
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: "0 10px 20px rgba(251, 146, 60, 0.2)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAdopt}
                  className="w-full py-3 sm:py-4 px-6 sm:px-8 text-base sm:text-lg font-semibold bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg"
                >
                  Adopt {pet.name}
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const InfoCard = ({ icon, label, value }) => (
  <div className="bg-gradient-to-br from-orange-50/80 to-orange-100/50 p-3 sm:p-4 rounded-xl border border-orange-100">
    <div className="flex items-center gap-2 sm:gap-3">
      <div className="text-orange-500 text-lg sm:text-xl">
        {icon}
      </div>
      <div>
        <p className="text-xs sm:text-sm text-orange-600 font-medium">{label}</p>
        <p className="text-sm sm:text-base text-gray-700 font-semibold">{value}</p>
      </div>
    </div>
  </div>
);

const StatusCard = ({ icon, label, status }) => (
  <div className="bg-gradient-to-br from-orange-50/80 to-orange-100/50 p-3 sm:p-4 rounded-xl border border-orange-100">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="text-orange-500 text-lg sm:text-xl">
          {icon}
        </div>
        <p className="text-sm sm:text-base text-gray-700 font-medium">{label}</p>
      </div>
      <span className={`${status ? "text-green-500" : "text-red-500"} text-sm sm:text-base font-semibold`}>
        {status ? "Yes" : "No"}
      </span>
    </div>
  </div>
);

const DetailRow = ({ label, value }) => (
  <div className="flex justify-between items-center text-sm sm:text-base">
    <span className="text-orange-600 font-medium">{label}:</span>
    <span className="text-gray-700">{value}</span>
  </div>
);

export default AdoptPetDetails;
