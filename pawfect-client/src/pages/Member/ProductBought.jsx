import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { motion } from "framer-motion";
import { format } from "date-fns";

const ProductBought = () => {
  const { user } = useContext(AuthContext);

  const { data: purchases = [], isLoading } = useQuery({
    queryKey: ["purchases", user?.uid],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:5000/product-payments/${user?.uid}`);
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-orange-500"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Purchase History</h2>
        
        <div className="grid grid-cols-1 gap-6">
          {purchases.map((purchase) => (
            <motion.div
              key={purchase._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{purchase.product_name}</h3>
                    <p className="text-gray-600">Category: {purchase.product_category}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-gray-700">
                      <span className="font-medium">Transaction ID:</span> {purchase.tran_id}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Amount:</span> {purchase.total_amount} {purchase.currency}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Status:</span>{" "}
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        purchase.status === "completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {purchase.status}
                      </span>
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Purchase Date:</span>{" "}
                      {format(new Date(purchase.createdAt), "PPP")}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-800">Shipping Details</h4>
                    <p className="text-gray-600">{purchase.cus_name}</p>
                    <p className="text-gray-600">{purchase.cus_add1}</p>
                    <p className="text-gray-600">
                      {purchase.cus_city}, {purchase.cus_state} {purchase.cus_postcode}
                    </p>
                    <p className="text-gray-600">{purchase.cus_country}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-800">Contact Information</h4>
                    <p className="text-gray-600">{purchase.cus_email}</p>
                    <p className="text-gray-600">{purchase.cus_phone}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {purchases.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No purchase history found.</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ProductBought;
