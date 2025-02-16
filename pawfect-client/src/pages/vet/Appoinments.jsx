import { useContext } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";

const Appointments = () => {
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const { data: appointments, isLoading } = useQuery({
    queryKey: ["appointments", user?.email],
    queryFn: async () => {
      const res = await axios.get(
        `http://localhost:5000/appointments/${user?.email}`
      );
      return res.data;
    },
  });

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      await axios.patch(`http://localhost:5000/appointments/${appointmentId}`, {
        status: newStatus,
      });
      queryClient.invalidateQueries(["appointments", user?.email]);
    } catch (error) {
      console.error("Error updating appointment status:", error);
    }
  };

  const initiateCall = async (appointment) => {
    try {
      // Create a call session
      const response = await axios.post(
        `http://localhost:5000/video-calls/initiate`,
        {
          appointmentId: appointment._id,
          vetId: user?.email,
          userId: appointment.ownerEmail,
          petName: appointment.petName,
        }
      );

      // Notify the user about incoming call
      await axios.patch(
        `http://localhost:5000/appointments/${appointment._id}`,
        {
          status: "calling",
          videoCallStatus: "initiated",
          roomId: `pawfect-${appointment._id}`,
        }
      );

      // Redirect vet to video call room
      window.location.href = `/video-call/${appointment._id}`;
    } catch (error) {
      toast.error("Failed to initiate call");
      console.error("Call initiation error:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg text-orange-500"></span>
      </div>
    );
  }

  const pendingAppointments = appointments?.filter(
    (app) => app.status === "pending"
  );
  const otherAppointments = appointments?.filter(
    (app) => app.status !== "pending"
  );

  console.log(otherAppointments);

  return (
    <div className="container mx-auto px-4 space-y-8">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-gray-800 mb-8"
      >
        Pending Appointments
      </motion.h2>

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-3">Pet Owner</th>
              <th className="px-4 py-3">Pet Name</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Time</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingAppointments?.map((appointment) => (
              <motion.tr
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                key={appointment._id}
                className="border-b hover:bg-gray-50"
              >
                <td className="px-4 py-3">{appointment.ownerEmail}</td>
                <td className="px-4 py-3">{appointment.petName}</td>
                <td className="px-4 py-3">{appointment.date}</td>
                <td className="px-4 py-3">{appointment.time}</td>
                <td className="px-4 py-3">
                  <span className="badge badge-warning">
                    {appointment.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() =>
                      handleStatusChange(appointment._id, "confirmed")
                    }
                    className="btn btn-success btn-sm mr-2"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() =>
                      handleStatusChange(appointment._id, "rejected")
                    }
                    className="btn btn-error btn-sm"
                  >
                    Reject
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-gray-800 mt-12 mb-8"
      >
        Other Appointments
      </motion.h2>

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-3">Pet Owner</th>
              <th className="px-4 py-3">Pet Name</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Time</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {otherAppointments?.map((appointment) => (
              <motion.tr
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                key={appointment._id}
                className="border-b hover:bg-gray-50"
              >
                <td className="px-4 py-3">{appointment.ownerEmail}</td>
                <td className="px-4 py-3">{appointment.petName}</td>
                <td className="px-4 py-3">{appointment.date}</td>
                <td className="px-4 py-3">{appointment.time}</td>
                <td className="px-4 py-3">
                  <span
                    className={`badge ${
                      appointment.status === "confirmed"
                        ? "badge-success"
                        : "badge-error"
                    }`}
                  >
                    {appointment.status}
                  </span>
                </td>
                <td className="px-4 py-3 space-x-2">
                  {appointment.status === "confirmed" && (
                    <button
                      onClick={() => initiateCall(appointment)}
                      className="btn btn-primary btn-sm"
                    >
                      Make Call
                    </button>
                  )}
                  <Link
                    to={`/dashboard/write-prescription/${appointment._id}`}
                    className="btn btn-secondary btn-sm"
                  >
                    Generate Prescription
                  </Link>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Appointments;
