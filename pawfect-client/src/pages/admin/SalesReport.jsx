import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const SalesReport = () => {
  const { data: payments = [], isLoading } = useQuery({
    queryKey: ["payments"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:5000/product-payments");
      return res.data;
    }
  });

  // Calculate total earnings from completed payments
  const totalEarnings = payments
    .filter(payment => payment.status === "completed")
    .reduce((total, payment) => total + Number(payment.total_amount), 0);

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-[400px]">
      <span className="loading loading-spinner loading-lg"></span>
    </div>;
  }

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-8">Sales Report</h2>
      
      <div className="stats shadow">
        <div className="stat">
          <div className="stat-title">Total Sales</div>
          <div className="stat-value text-orange-500">${totalEarnings.toFixed(2)}</div>
          <div className="stat-desc">From all completed payments</div>
        </div>
      </div>

      <div className="overflow-x-auto mt-8">
        <table className="table">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.tran_id}>
                <td>{payment.tran_id}</td>
                <td>${Number(payment.total_amount).toFixed(2)}</td>
                <td>
                  <span className={`badge ${
                    payment.status === "completed" ? "badge-success" : 
                    payment.status === "pending" ? "badge-warning" : "badge-error"
                  }`}>
                    {payment.status}
                  </span>
                </td>
                <td>{new Date(payment.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesReport;
