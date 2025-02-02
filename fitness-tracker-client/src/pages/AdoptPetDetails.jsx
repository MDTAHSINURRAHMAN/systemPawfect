import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AdoptPetDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const { data: pet = {}, isLoading } = useQuery({
    queryKey: ["pet", id],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:5000/pets/${id}`);
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
      // Add adoption logic here;
      navigate(`/adopt-pet-payment/${id}`);
    } catch (error) {
      console.error("Error adopting pet:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto max-w-6xl"
      >
        <div className="bg-white/90 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-sm border border-orange-100">
          <div className="grid md:grid-cols-2 gap-8 p-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Image Section */}
              <div className="relative h-[400px] overflow-hidden rounded-xl group">
                <motion.img
                  src={pet.image}
                  alt={pet.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Description, Behavior, Special Needs */}
              <div className="space-y-4">
                <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-100">
                  <h3 className="text-xl font-semibold mb-2 text-orange-600">Description</h3>
                  <p className="text-gray-600 leading-relaxed">{pet.description}</p>
                </div>
                
                <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-100">
                  <h3 className="text-xl font-semibold mb-2 text-orange-600">Behavior</h3>
                  <p className="text-gray-600 leading-relaxed">{pet.behavior}</p>
                </div>

                <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-100">
                  <h3 className="text-xl font-semibold mb-2 text-orange-600">Special Needs</h3>
                  <p className="text-gray-600 leading-relaxed">{pet.specialNeeds || "None"}</p>
                </div>

                <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-100">
                  <h3 className="text-xl font-semibold mb-2 text-orange-600">Added By</h3>
                  <p className="text-gray-600 leading-relaxed">{pet.addedBy.name || "Unknown"}</p>
                </div>
              </div>
            </div>

            {/* Right Column - Details Section */}
            <div className="space-y-6">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">{pet.name}</h1>
                <div className="w-20 h-1 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full" />
              </div>
              
              <div className="grid grid-cols-2 gap-4 p-6 bg-orange-50/50 rounded-xl border border-orange-100">
                <div className="space-y-3">
                  <p className="text-gray-700 flex items-center gap-2">
                    <span className="font-semibold text-orange-500">Species:</span> 
                    <span className="bg-white px-3 py-1 rounded-full shadow-sm">{pet.species}</span>
                  </p>
                  <p className="text-gray-700 flex items-center gap-2">
                    <span className="font-semibold text-orange-500">Breed:</span>
                    <span className="bg-white px-3 py-1 rounded-full shadow-sm">{pet.breed}</span>
                  </p>
                  <p className="text-gray-700 flex items-center gap-2">
                    <span className="font-semibold text-orange-500">Age:</span>
                    <span className="bg-white px-3 py-1 rounded-full shadow-sm">{pet.age} years</span>
                  </p>
                  <p className="text-gray-700 flex items-center gap-2">
                    <span className="font-semibold text-orange-500">Gender:</span>
                    <span className="bg-white px-3 py-1 rounded-full shadow-sm">{pet.gender}</span>
                  </p>
                </div>
                <div className="space-y-3">
                  <p className="text-gray-700 flex items-center gap-2">
                    <span className="font-semibold text-orange-500">Size:</span>
                    <span className="bg-white px-3 py-1 rounded-full shadow-sm">{pet.size}</span>
                  </p>
                  <p className="text-gray-700 flex items-center gap-2">
                    <span className="font-semibold text-orange-500">Color:</span>
                    <span className="bg-white px-3 py-1 rounded-full shadow-sm">{pet.color}</span>
                  </p>
                  <p className="text-gray-700 flex items-center gap-2">
                    <span className="font-semibold text-orange-500">Health:</span>
                    <span className="bg-white px-3 py-1 rounded-full shadow-sm">{pet.healthStatus}</span>
                  </p>
                  <p className="text-gray-700 flex items-center gap-2">
                    <span className="font-semibold text-orange-500">Fee:</span>
                    <span className="bg-white px-3 py-1 rounded-full shadow-sm">${pet.adoptionFee}</span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm">
                  <span className="text-orange-500 font-semibold mr-2">Vaccinated:</span>
                  <span className={`${pet.vaccinated ? "text-green-500" : "text-red-500"} font-medium`}>
                    {pet.vaccinated ? "Yes" : "No"}
                  </span>
                </div>
                <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm">
                  <span className="text-orange-500 font-semibold mr-2">Spayed/Neutered:</span>
                  <span className={`${pet.spayedNeutered ? "text-green-500" : "text-red-500"} font-medium`}>
                    {pet.spayedNeutered ? "Yes" : "No"}
                  </span>
                </div>
              </div>

              {pet.status === "adopted" ? (
                <div className="bg-orange-50/50 p-6 rounded-xl border border-orange-100">
                  <h3 className="text-xl font-semibold mb-4 text-orange-600">Adoption Details</h3>
                  <div className="space-y-3">
                    <p className="text-gray-700">
                      <span className="font-semibold text-orange-500">Adopted By:</span>{" "}
                      {pet.adoptionDetails.customerName}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold text-orange-500">Email:</span>{" "}
                      {pet.adoptionDetails.customerEmail}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold text-orange-500">Adoption Date:</span>{" "}
                      {new Date(pet.adoptionDetails.adoptionDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAdopt}
                  className="w-full btn bg-gradient-to-r from-orange-400 to-orange-600 text-white border-none hover:from-orange-500 hover:to-orange-700 shadow-lg"
                >
                  Adopt Me
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdoptPetDetails;
