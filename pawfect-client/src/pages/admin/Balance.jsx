import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";

const Balance = () => {
  // Fetch dashboard stats
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: async () => {
      const { data } = await axios.get(
        "https://pawfect-server-beige.vercel.app/admin/dashboard-stats"
      );
      return data;
    },
  });

  console.log(dashboardData);

  // Calculate total balance
  const totalBalance =
    dashboardData?.bookings?.reduce(
      (total, booking) => total + booking.amount,
      0
    ) || 0;

  // Get last 6 transactions
  const recentTransactions = dashboardData?.bookings?.slice(-6).reverse() || [];

  // Prepare data for pie chart
  const chartData = [
    {
      name: "Newsletter Subscribers",
      value: dashboardData?.stats?.length || 0,
      color: "#F97316",
    },
    {
      name: "Paid Members",
      value: dashboardData?.bookings?.length || 0,
      color: "#FB923C",
    },
  ];

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.02 }}
        className="bg-gradient-to-br from-white to-orange-50 rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6 lg:mb-8 hover:shadow-2xl transition-all duration-300"
      >
        <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent mb-4">
          Financial Overview
        </h2>
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-gradient-to-r from-orange-500 via-orange-400 to-orange-600 rounded-xl p-4 sm:p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <p className="text-base sm:text-lg opacity-90">Total Balance</p>
          <h3 className="text-2xl sm:text-4xl font-bold">
            ${totalBalance.toFixed(2)}
          </h3>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        whileHover={{ scale: 1.02 }}
        className="bg-gradient-to-br from-white to-orange-50 rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6 lg:mb-8 hover:shadow-2xl transition-all duration-300"
      >
        <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent mb-4 sm:mb-6">
          Member Distribution
        </h3>
        <div className="w-full h-[200px] sm:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        whileHover={{ scale: 1.02 }}
        className="bg-gradient-to-br from-white to-orange-50 rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 hover:shadow-2xl transition-all duration-300"
      >
        <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent mb-4 sm:mb-6">
          Recent Transactions
        </h3>
        <div className="space-y-3 sm:space-y-4">
          {recentTransactions.map((transaction, index) => (
            <motion.div
              key={transaction._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, backgroundColor: "#FFF7ED" }}
              className="flex items-center justify-between p-3 sm:p-4 rounded-xl bg-gradient-to-r from-gray-50 to-orange-50 hover:shadow-md transition-all duration-300"
            >
              <div>
                <p className="font-semibold text-gray-800 text-sm sm:text-base">
                  {transaction.userEmail}
                </p>
                <p className="text-xs sm:text-sm text-gray-500">
                  {new Date(transaction.date).toLocaleDateString()}
                </p>
              </div>
              <motion.p
                whileHover={{ scale: 1.1 }}
                className="text-base sm:text-lg font-bold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent"
              >
                ${transaction.amount}
              </motion.p>
            </motion.div>
          ))}
          {recentTransactions.length === 0 && (
            <p className="text-center text-gray-500">No transactions found</p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Balance;
