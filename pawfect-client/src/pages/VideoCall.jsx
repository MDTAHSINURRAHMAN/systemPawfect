import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const VideoCall = () => {
  const { appointmentId } = useParams();
  const [api, setApi] = useState(null);
  const [isCallStarted, setIsCallStarted] = useState(false);

  const { data: appointment } = useQuery({
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
            "etherpad",
            "sharedvideo",
            "settings",
            "raisehand",
            "videoquality",
            "filmstrip",
            "feedback",
            "stats",
            "shortcuts",
            "tileview",
            "videobackgroundblur",
            "download",
            "help",
            "mute-everyone",
          ],
        },
      };

      // Initialize Jitsi Meet
      const jitsiAPI = new window.JitsiMeetExternalAPI(domain, options);
      setApi(jitsiAPI);

      // Handle video call events
      jitsiAPI.addEventListeners({
        videoConferenceJoined: () => {
          setIsCallStarted(true);
          // Update appointment status to "in-progress"
          axios.patch(`http://localhost:5000/appointments/${appointmentId}`, {
            status: "in-progress",
          });
        },
        videoConferenceLeft: () => {
          setIsCallStarted(false);
          // Update appointment status to "completed"
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

  return (
    <div className="h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-6">
        {appointment && (
          <div className="mb-4">
            <h2 className="text-2xl font-bold">
              Video Consultation: {appointment.petName}
            </h2>
            <p className="text-gray-600">
              {appointment.vetName} - {appointment.ownerName}
            </p>
          </div>
        )}

        <div
          id="jitsi-container"
          className="w-full h-[80vh] rounded-lg overflow-hidden shadow-lg"
        />
      </div>
    </div>
  );
};

export default VideoCall;
