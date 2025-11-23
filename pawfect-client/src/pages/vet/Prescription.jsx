import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";
import { jsPDF } from "jspdf";

const Prescription = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [prescriptionData, setPrescriptionData] = useState({
    diagnosis: "",
    medications: "",
    instructions: "",
    notes: "",
    followUpDate: "",
  });

  const { data: appointment } = useQuery({
    queryKey: ["appointment", appointmentId],
    queryFn: async () => {
      const res = await axios.get(
        `https://pawfect-server-beige.vercel.app/appointments/${appointmentId}`
      );
      return res.data;
    },
  });

  const prescriptionMutation = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post(
        `https://pawfect-server-beige.vercel.app/prescriptions/${appointmentId}`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["appointment", appointmentId]);
      toast.success("Prescription saved successfully");
      generateAndSavePDF();
      navigate("/dashboard/vet-appointments");
    },
    onError: (error) => {
      toast.error("Failed to save prescription");
      console.error("Prescription error:", error);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    prescriptionMutation.mutate({
      prescriptionData,
    });
  };

  const generateAndSavePDF = async () => {
    try {
      if (!appointment) {
        toast.error("Appointment data not found");
        return;
      }

      const doc = new jsPDF();

      // Add header with styling
      doc.setFontSize(20);
      doc.text("Medical Prescription", 105, 20, { align: "center" });

      // Add patient info with error checking
      doc.setFontSize(12);
      doc.text(`Patient: ${appointment.petName || "N/A"}`, 20, 40);
      doc.text(`Owner: ${appointment.ownerName || "N/A"}`, 20, 50);
      doc.text(`Vet: ${appointment.vetName || "N/A"}`, 20, 60);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 70);

      // Add prescription content with sections
      const addSection = (title, content, yStart) => {
        doc.setFontSize(14);
        doc.text(title, 20, yStart);
        doc.setFontSize(12);
        const lines = doc.splitTextToSize(content, 170);
        doc.text(lines, 30, yStart + 10);
        return yStart + 10 + lines.length * 7;
      };

      let yPosition = 80;
      yPosition = addSection(
        "Diagnosis:",
        prescriptionData.diagnosis,
        yPosition
      );
      yPosition = addSection(
        "Medications:",
        prescriptionData.medications,
        yPosition + 10
      );
      yPosition = addSection(
        "Instructions:",
        prescriptionData.instructions,
        yPosition + 10
      );

      if (prescriptionData.notes) {
        yPosition = addSection(
          "Additional Notes:",
          prescriptionData.notes,
          yPosition + 10
        );
      }

      if (prescriptionData.followUpDate) {
        doc.setFontSize(12);
        doc.text(
          `Follow-up Date: ${new Date(
            prescriptionData.followUpDate
          ).toLocaleDateString()}`,
          20,
          yPosition + 10
        );
      }

      // Convert PDF to base64 with data URI
      const pdfData = doc.output("datauristring");

      // Save PDF data to server
      await axios.patch(
        `https://pawfect-server-beige.vercel.app/prescriptions/${appointmentId}/pdf`,
        {
          pdfData: pdfData,
        }
      );

      toast.success("PDF generated successfully");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">Write Prescription</h2>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Diagnosis</label>
            <textarea
              value={prescriptionData.diagnosis}
              onChange={(e) =>
                setPrescriptionData({
                  ...prescriptionData,
                  diagnosis: e.target.value,
                })
              }
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:border-primary"
              rows="3"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Medications
            </label>
            <textarea
              value={prescriptionData.medications}
              onChange={(e) =>
                setPrescriptionData({
                  ...prescriptionData,
                  medications: e.target.value,
                })
              }
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:border-primary"
              rows="3"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Instructions
            </label>
            <textarea
              value={prescriptionData.instructions}
              onChange={(e) =>
                setPrescriptionData({
                  ...prescriptionData,
                  instructions: e.target.value,
                })
              }
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:border-primary"
              rows="3"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Additional Notes
            </label>
            <textarea
              value={prescriptionData.notes}
              onChange={(e) =>
                setPrescriptionData({
                  ...prescriptionData,
                  notes: e.target.value,
                })
              }
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:border-primary"
              rows="2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Follow-up Date
            </label>
            <input
              type="date"
              value={prescriptionData.followUpDate}
              onChange={(e) =>
                setPrescriptionData({
                  ...prescriptionData,
                  followUpDate: e.target.value,
                })
              }
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:border-primary"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="btn btn-outline text-orange-500"
              disabled={prescriptionMutation.isLoading}
            >
              {prescriptionMutation.isLoading
                ? "Saving..."
                : "Save Prescription"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Prescription;
