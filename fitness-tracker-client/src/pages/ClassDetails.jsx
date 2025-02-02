import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";

const ClassDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch product details
  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:5000/products/${id}`);
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-orange-500"></span>
      </div>
    );
  }

  const handleBuy = () => {
    navigate(`/product-payment/${id}`);
  };

  return (
    <>
      <Helmet>
        <title>Pawfect | Product Details</title>
      </Helmet>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-orange-50 to-white"
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-orange-100"
        >
          <div className="flex flex-col md:flex-row">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="p-4 sm:p-6 lg:p-8 flex-1"
            >
              <div className="flex justify-between items-center mb-6">
                <motion.h1
                  whileHover={{ scale: 1.02 }}
                  className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#FF640D] to-orange-600 bg-clip-text text-transparent"
                >
                  {product?.name}
                </motion.h1>
                <motion.span
                  className="text-2xl font-bold text-[#FF640D]"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  ${product?.price}
                </motion.span>
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-gray-600 mb-6 text-sm sm:text-base"
              >
                {product?.description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="space-y-4 mb-8"
              >
                <div className="bg-orange-50 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                  <h3 className="font-semibold mb-2 text-[#FF640D]">
                    Product Details:
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <span className="font-medium text-gray-700">Category:</span>
                      <span>{product?.category}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="font-medium text-gray-700">Brand:</span>
                      <span>{product?.brand}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="font-medium text-gray-700">Stock:</span>
                      <span>{product?.stockQuantity} pieces</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-orange-50 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                  <h3 className="font-semibold mb-2 text-[#FF640D]">Features:</h3>
                  <span>{product?.benefits}</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex justify-center md:justify-start"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleBuy}
                  className="bg-gradient-to-r from-[#FF640D] to-orange-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Buy Now
                </motion.button>
              </motion.div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative w-full md:w-[45%] h-[400px] md:h-auto overflow-hidden"
            >
              <motion.img
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                src={product?.image}
                alt={product?.name}
                className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default ClassDetails;
