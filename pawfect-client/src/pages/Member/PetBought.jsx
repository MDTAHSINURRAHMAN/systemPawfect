import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";

const PetBought = () => {
  const { user } = useContext(AuthContext);

  const { data: adoptions = [], isLoading } = useQuery({
    queryKey: ["adoptPetPayments"],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:5000/adopt-pet-payments/${user?.email}`);
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <span className="loading loading-spinner loading-lg text-warning"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          My Adopted Pets
        </h2>

        <div className="space-y-6">
          {adoptions.map((adoption) => (
            <motion.div
              key={adoption._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white shadow rounded-lg overflow-hidden"
            >
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {adoption.petName}
                    </h3>
                    <p className="text-gray-700">
                      <span className="font-medium">Transaction ID:</span>{" "}
                      {adoption.tran_id}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Amount:</span>{" "}
                      {adoption.total_amount} {adoption.currency}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Status:</span>{" "}
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${
                          adoption.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {adoption.status}
                      </span>
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Adoption Date:</span>{" "}
                      {format(new Date(adoption.createdAt), "PPP")}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-800">Owner Details</h4>
                    <p className="text-gray-600">{adoption.cus_name}</p>
                    <p className="text-gray-600">{adoption.cus_add1}</p>
                    <p className="text-gray-600">
                      {adoption.cus_city}, {adoption.cus_state}{" "}
                      {adoption.cus_postcode}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-800">
                      Contact Information
                    </h4>
                    <p className="text-gray-600">{adoption.cus_email}</p>
                    <p className="text-gray-600">{adoption.cus_phone}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {adoptions.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                You haven't adopted any pets yet.
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default PetBought;
