import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const AllPets = () => {
  const { data: pets = [], isLoading } = useQuery({
    queryKey: ["pets"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:5000/pets");
      return res.data;
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg text-orange-500"></span>
      </div>
    );
  }

  return (
    <div className="p-8">
      <motion.h2
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent"
      >
        All Available Pets
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pets.map((pet) => (
          <motion.div
            key={pet._id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <img
              src={pet.image}
              alt={pet.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{pet.name}</h3>
              <div className="space-y-2 mb-4">
                <p className="text-gray-600">
                  <span className="font-medium">Breed:</span> {pet.breed}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Age:</span> {pet.age}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Gender:</span> {pet.gender}
                </p>
              </div>
              <Link
                to={`/dashboard/pet/${pet._id}`}
                className="btn btn-block bg-gradient-to-r from-orange-500 to-orange-600 text-white border-none hover:from-orange-600 hover:to-orange-700"
              >
                View Details
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AllPets;
