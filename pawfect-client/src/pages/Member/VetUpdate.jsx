import { useContext, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const VetUpdate = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const { data: appointments, isLoading } = useQuery({
    queryKey: ["userAppointments", user?.email],
    queryFn: async () => {
      const res = await axios.get(
        `http://localhost:5000/appointments/user/${user?.email}`
      );
      return res.data;
    },
  });

  // Poll for incoming calls
  useEffect(() => {
    const checkForCalls = setInterval(async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/appointments/active-calls/${user?.email}`
        );

        const incomingCall = response.data;
        if (incomingCall && incomingCall.videoCallStatus === "initiated") {
          // Show incoming call notification
          const accept = window.confirm(
            `Incoming call from Dr. ${incomingCall.vetName} for ${incomingCall.petName}`
          );

          if (accept) {
            // Update call status and redirect to video call
            await axios.patch(
              `http://localhost:5000/appointments/${incomingCall._id}`,
              { videoCallStatus: "accepted" }
            );
            navigate(`/video-call/${incomingCall._id}`);
          } else {
            // Decline the call
            await axios.patch(
              `http://localhost:5000/appointments/${incomingCall._id}`,
              { videoCallStatus: "declined" }
            );
            toast.error("Call declined");
          }
        }
      } catch (error) {
        console.error("Error checking for calls:", error);
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(checkForCalls);
  }, [user?.email, navigate]);

  const handleDownloadPDF = async (appointmentId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/prescriptions/${appointmentId}/pdf`
      );
      const { pdfData } = response.data;

      // Create a link element and trigger download
      const link = document.createElement("a");
      link.href = pdfData;
      link.download = `prescription_${appointmentId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      toast.error("Error downloading prescription");
      console.error("Download error:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg text-orange-500"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-gray-800 mb-8"
      >
        My Appointments
      </motion.h2>

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-3">Vet Name</th>
              <th className="px-4 py-3">Pet Name</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Time</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Prescription</th>
            </tr>
          </thead>
          <tbody>
            {appointments?.map((appointment) => (
              <motion.tr
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                key={appointment._id}
                className="border-b hover:bg-gray-50"
              >
                <td className="px-4 py-3">{appointment.vetName}</td>
                <td className="px-4 py-3">{appointment.petName}</td>
                <td className="px-4 py-3">{appointment.date}</td>
                <td className="px-4 py-3">{appointment.time}</td>
                <td className="px-4 py-3">
                  <span
                    className={`badge ${
                      appointment.status === "pending"
                        ? "badge-warning"
                        : appointment.status === "confirmed"
                        ? "badge-success"
                        : "badge-error"
                    }`}
                  >
                    {appointment.status}
                  </span>
                  {appointment.status === "confirmed" && (
                    <>
                      {appointment.videoCallStatus === "initiated" && (
                        <span className="ml-2 animate-pulse text-primary">
                          Incoming Call...
                        </span>
                      )}
                      {appointment.videoCallStatus === "in-progress" && (
                        <Link
                          to={`/video-call/${appointment._id}`}
                          className="btn btn-primary btn-sm ml-2"
                        >
                          Rejoin Call
                        </Link>
                      )}
                    </>
                  )}
                </td>
                <td className="px-4 py-3">
                  {appointment.hasPrescription && (
                    <button
                      onClick={() => handleDownloadPDF(appointment._id)}
                      className="btn btn-primary btn-sm"
                    >
                      Download Prescription
                    </button>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VetUpdate;
