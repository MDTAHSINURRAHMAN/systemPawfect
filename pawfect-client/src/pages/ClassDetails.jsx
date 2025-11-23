import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { FaShoppingCart, FaStar, FaTruck, FaShieldAlt, FaUndo } from "react-icons/fa";

const ClassDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const res = await axios.get(`https://pawfect-server-beige.vercel.app/products/${id}`);
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100">
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
        <title>Pawfect | {product?.name}</title>
      </Helmet>
      <div className="min-h-screen py-12 bg-gradient-to-br from-orange-50 via-white to-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Image Section */}
              <div className="p-8">
                <motion.div 
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className="relative group"
                >
                  <img
                    src={product?.image}
                    alt={product?.name}
                    className="w-full h-[500px] object-cover rounded-2xl shadow-lg transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* <div className="absolute top-4 right-4 space-y-2">
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      className="bg-white p-3 rounded-full shadow-lg hover:bg-orange-50"
                    >
                      <FaHeart className="text-orange-500 text-xl" />
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      className="bg-white p-3 rounded-full shadow-lg hover:bg-orange-50"
                    >
                      <FaShare className="text-orange-500 text-xl" />
                    </motion.button>
                  </div> */}
                </motion.div>
              </div>

              {/* Content Section */}
              <div className="p-8">
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm font-medium">
                        {product?.category}
                      </span>
                      <div className="flex items-center gap-1">
                        <FaStar className="text-yellow-400" />
                        <span className="text-gray-600 text-sm">4.8 (120 reviews)</span>
                      </div>
                    </div>
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">{product?.name}</h1>
                    <p className="text-3xl font-bold text-orange-500">${product?.price}</p>
                  </div>

                  <p className="text-gray-600 leading-relaxed">{product?.description}</p>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-orange-50 rounded-xl">
                      <FaTruck className="text-orange-500 text-2xl mx-auto mb-2" />
                      <p className="text-sm font-medium">Free Shipping</p>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-xl">
                      <FaShieldAlt className="text-orange-500 text-2xl mx-auto mb-2" />
                      <p className="text-sm font-medium">1 Year Warranty</p>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-xl">
                      <FaUndo className="text-orange-500 text-2xl mx-auto mb-2" />
                      <p className="text-sm font-medium">30 Days Return</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <span className="font-medium text-gray-700">Brand:</span>
                      <span className="text-gray-600">{product?.brand}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-medium text-gray-700">Stock:</span>
                      <span className="text-gray-600">{product?.stockQuantity} pieces</span>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleBuy}
                      className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 px-8 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <FaShoppingCart />
                      Buy Now
                    </motion.button>
                    {/* <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-6 py-4 border-2 border-orange-500 text-orange-500 rounded-xl font-semibold hover:bg-orange-50 transition-colors duration-300"
                    >
                      Add to Cart
                    </motion.button> */}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default ClassDetails;
