import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaPaw, FaHeart, FaVenusMars, FaBirthdayCake } from "react-icons/fa";

const AdoptPet = () => {
  const { data: pets = [], isLoading } = useQuery({
    queryKey: ["pets"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:5000/pets");
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
{/* Hero Section */}
<motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative h-[70vh] flex items-center justify-center bg-gradient-to-r from-black to-orange-100 overflow-hidden"
        >
          <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')] bg-cover bg-center mix-blend-overlay"></div>
          <div className="relative z-10 text-center space-y-6 px-4">
            <motion.h1 
              initial={{ y: -50 }}
              animate={{ y: 0 }}
              className="satoshi text-5xl md:text-6xl lg:text-7xl font-bold text-white drop-shadow-lg"
            >
              Find Your Perfect Companion
            </motion.h1>
            <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto font-light">
            Give a loving home to our adorable pets waiting for their forever families
            </p>
          </div>
        </motion.div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {pets.map((pet) => (
            <motion.div
              key={pet._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden group"
            >
              <div className="relative h-72 overflow-hidden">
                <img
                  src={pet.image}
                  alt={pet.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 z-10">
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-md ${
                    pet.status === 'adopted' 
                      ? 'bg-red-500/90 text-white'
                      : 'bg-green-500/90 text-white'
                  }`}>
                    {pet.status === 'adopted' ? 'Adopted' : 'Available'}
                  </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-gray-800">{pet.name}</h3>
                  <FaHeart className="text-2xl text-orange-500" />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-600">
                    <FaPaw className="text-orange-500" />
                    <span>{pet.breed}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <FaBirthdayCake className="text-orange-500" />
                    <span>{pet.age} years</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <FaVenusMars className="text-orange-500" />
                    <span>{pet.gender}</span>
                  </div>
                </div>
                
                <Link to={`/adopt-pet/${pet._id}`} className="block mt-6">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-400 to-orange-600 text-white font-semibold hover:from-orange-500 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-orange-300/50"
                  >
                    Meet {pet.name}
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdoptPet;
