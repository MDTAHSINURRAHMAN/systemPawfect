import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUserMd, FaMapMarkerAlt } from 'react-icons/fa';

const AllVets = () => {
  const { data: vets, isLoading } = useQuery({
    queryKey: ['vets'],
    queryFn: async () => {
      const res = await axios.get('https://pawfect-server-beige.vercel.app/vets');
      return res.data;
    }
  });

  if (isLoading) {
    return <div className="min-h-screen flex justify-center items-center">
      <span className="loading loading-spinner loading-lg text-orange-500"></span>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Veterinarians</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Meet our experienced and caring veterinarians who are dedicated to keeping your pets healthy and happy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vets?.map((vet) => (
            <motion.div
              key={vet._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden"
            >
              <div className="relative h-64">
                <img
                  src={vet.image}
                  alt={vet.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h2 className="text-2xl font-bold text-white mb-1">{vet.name}</h2>
                  <p className="text-gray-200">{vet.specialization}</p>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <FaUserMd className="text-orange-500 text-xl" />
                  <span className="text-gray-700">{vet.experience} years experience</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaMapMarkerAlt className="text-orange-500 text-xl" />
                  <span className="text-gray-700">{vet.address}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">
                    ${vet.consultationFees}/visit
                  </span>
                  <Link to={`/vets/${vet._id}`}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-2.5 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors duration-300"
                    >
                      Book Now
                    </motion.button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllVets;
