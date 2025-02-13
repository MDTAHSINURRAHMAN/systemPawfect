import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";

const FeaturedClasses = () => {
  const { data: featuredClasses = [], isLoading } = useQuery({
    queryKey: ["featuredClasses"],
    queryFn: async () => {
      const response = await axios.get("http://localhost:5000/classes");
      // Add random booking numbers to each class
      const classesWithBookings = response.data.map((classItem) => ({
        ...classItem,
        totalBookings: Math.floor(Math.random() * 100) + 1, // Random number between 1-100
      }));
      return classesWithBookings;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="py-16 bg-gradient-to-br from-orange-50 to-white">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-[#FF640D] to-orange-600 bg-clip-text text-transparent"
        >
          Featured Classes
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredClasses.slice(0, 6).map((classItem, index) => (
            <motion.div
              key={classItem._id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-orange-100"
            >
              <div className="relative">
                <img
                  src={classItem.image}
                  alt={classItem.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {classItem.totalBookings} Bookings
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-800">
                  {classItem.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {classItem.description}
                </p>

                <div className="flex justify-between items-center">
                  <span className="text-orange-500 font-semibold">
                    {classItem.trainer}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    Learn More
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedClasses;
