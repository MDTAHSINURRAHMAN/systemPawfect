import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

const PetSalesReport = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: adoptionPayments = [], isLoading } = useQuery({
    queryKey: ["adoptionPayments"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:5000/adopt-pet-payments");
      return res.data;
    }
  });

  const filteredPayments = adoptionPayments.filter(payment => 
    payment.petName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.cus_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const completedPayments = adoptionPayments.filter(p => p.status === "completed");
  const totalEarnings = completedPayments.reduce((sum, payment) => sum + parseFloat(payment.total_amount), 0);
  const totalCompletedCount = completedPayments.length;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-orange-500"></span>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-100 text-white min-h-screen">
      <h2 className="text-4xl font-bold text-orange-500 mb-8 text-center">Pet Sales Report</h2>
      
      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Search by pet or customer name..."
          className="input input-bordered bg-gray-800 text-white w-full max-w-md focus:border-orange-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-gray-800 rounded-xl p-6 shadow-xl">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="bg-gray-700">
                <th className="text-orange-400">Date</th>
                <th className="text-orange-400">Transaction ID</th>
                <th className="text-orange-400">Pet Name</th>
                <th className="text-orange-400">Customer Name</th>
                <th className="text-orange-400">Amount</th>
                <th className="text-orange-400">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment) => (
                <tr key={payment.tran_id} className="hover:bg-gray-700 transition-colors">
                  <td>{new Date(payment.createdAt).toLocaleDateString()}</td>
                  <td>{payment.tran_id}</td>
                  <td>{payment.petName}</td>
                  <td>{payment.cus_name}</td>
                  <td>${payment.total_amount}</td>
                  <td>
                    <span className={`badge ${
                      payment.status === "completed" 
                        ? "bg-green-500 text-white" 
                        : payment.status === "pending"
                        ? "bg-yellow-500 text-black"
                        : "bg-red-500 text-white"
                    }`}>
                      {payment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 space-y-4 bg-gray-800 p-6 rounded-xl shadow-xl">
        <div className="flex justify-between items-center">
          <p className="text-xl text-gray-300">Total Completed Sales:</p>
          <p className="text-2xl font-bold text-orange-500">{totalCompletedCount}</p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-xl text-gray-300">Total Earnings:</p>
          <p className="text-2xl font-bold text-orange-500">${totalEarnings.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default PetSalesReport;
