import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import { FaVideo, FaUserMd, FaPaw } from "react-icons/fa";

const VideoCall = () => {
  const { appointmentId } = useParams();
  const [api, setApi] = useState(null);
  const [isCallStarted, setIsCallStarted] = useState(false);

  const { data: appointment, isLoading } = useQuery({
    queryKey: ["appointment", appointmentId],
    queryFn: async () => {
      const res = await axios.get(
        `http://localhost:5000/appointments/${appointmentId}`
      );
      return res.data;
    },
  });

  useEffect(() => {
    if (appointment) {
      const domain = "meet.jit.si";
      const options = {
        roomName: `pawfect-${appointmentId}`,
        width: "100%",
        height: "100%",
        parentNode: document.querySelector("#jitsi-container"),
        userInfo: {
          displayName: appointment.ownerName || appointment.vetName,
        },
        configOverwrite: {
          prejoinPageEnabled: false,
          startWithAudioMuted: false,
          startWithVideoMuted: false,
        },
        interfaceConfigOverwrite: {
          TOOLBAR_BUTTONS: [
            "microphone",
            "camera",
            "closedcaptions",
            "desktop",
            "fullscreen",
            "fodeviceselection",
            "hangup",
            "profile",
            "chat",
            "recording",
            "livestreaming",
            "settings",
            "raisehand",
            "videoquality",
            "filmstrip",
            "shortcuts",
            "tileview",
            "videobackgroundblur",
            "help",
          ],
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          DEFAULT_BACKGROUND: "#FFF7ED",
        },
      };

      const jitsiAPI = new window.JitsiMeetExternalAPI(domain, options);
      setApi(jitsiAPI);

      jitsiAPI.addEventListeners({
        videoConferenceJoined: () => {
          setIsCallStarted(true);
          axios.patch(`http://localhost:5000/appointments/${appointmentId}`, {
            status: "in-progress",
          });
        },
        videoConferenceLeft: () => {
          setIsCallStarted(false);
          axios.patch(`http://localhost:5000/appointments/${appointmentId}`, {
            status: "completed",
          });
        },
      });

      return () => {
        if (jitsiAPI) {
          jitsiAPI.dispose();
        }
      };
    }
  }, [appointment, appointmentId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-orange-500"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      <div className="container mx-auto px-4 py-6 md:py-8 lg:py-12">
        {appointment && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                <FaVideo className="text-orange-500" />
                Video Consultation
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4 text-gray-600">
                <div className="flex items-center gap-2">
                  <FaPaw className="text-orange-500" />
                  <span className="font-medium">Pet:</span> {appointment.petName}
                </div>
                <div className="flex items-center gap-2">
                  <FaUserMd className="text-orange-500" />
                  <span className="font-medium">Vet:</span> {appointment.vetName}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div
            id="jitsi-container"
            className="w-full h-[60vh] md:h-[70vh] lg:h-[80vh]"
          />
        </motion.div>
      </div>
    </div>
  );
};

export default VideoCall;
