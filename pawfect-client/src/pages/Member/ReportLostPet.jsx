import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

const ReportLostPet = () => {
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const [location, setLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 23.8103, lng: 90.4125 }); // Default to Dhaka
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);

  const [formData, setFormData] = useState({
    petName: "",
    petType: "",
    breed: "",
    color: "", 
    lastSeenDate: "",
    lastSeenLocation: "",
    description: "",
    contactNumber: "",
    reward: "",
    petImage: "",
    lat: "",
    lng: "",
  });

  useEffect(() => {
    const loadGoogleMaps = () => {
      const existingScript = document.getElementById("googleMapsScript");
      if (!existingScript) {
        const script = document.createElement("script");
        script.id = "googleMapsScript";
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyC5s89_KsT2NG6DawsfH_Ju__2Yp4oKh8I&callback=initMap`;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);

        window.initMap = () => {
          const mapInstance = new window.google.maps.Map(
            document.getElementById("map"),
            {
              center: mapCenter,
              zoom: 14,
            }
          );

          setMap(mapInstance);

          mapInstance.addListener("click", (e) => {
            const clickedLocation = {
              lat: e.latLng.lat(),
              lng: e.latLng.lng(),
            };
            handleMapClick(clickedLocation);
          });
        };
      }
    };

    loadGoogleMaps();

    return () => {
      const script = document.getElementById("googleMapsScript");
      if (script) {
        document.head.removeChild(script);
      }
      delete window.initMap;
    };
  }, []);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setLocation(newLocation);
        setMapCenter(newLocation);
        setFormData((prev) => ({
          ...prev,
          lastSeenLocation: `${position.coords.latitude}, ${position.coords.longitude}`,
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }));

        if (map) {
          map.setCenter(newLocation);
          if (marker) {
            marker.setMap(null);
          }
          const newMarker = new window.google.maps.Marker({
            position: newLocation,
            map: map,
          });
          setMarker(newMarker);
        }
      });
    }
  };

  const handleMapClick = (clickedLocation) => {
    setLocation(clickedLocation);
    setFormData((prev) => ({
      ...prev,
      lastSeenLocation: `${clickedLocation.lat}, ${clickedLocation.lng}`,
      lat: clickedLocation.lat,
      lng: clickedLocation.lng,
    }));

    if (marker) {
      marker.setMap(null);
    }
    const newMarker = new window.google.maps.Marker({
      position: clickedLocation,
      map: map,
    });
    setMarker(newMarker);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.lat || !formData.lng) {
      toast.error("Please select a location on the map");
      return;
    }

    try {
      const reportData = {
        petName: formData.petName,
        petType: formData.petType,
        breed: formData.breed,
        color: formData.color,
        lastSeenDate: formData.lastSeenDate,
        description: formData.description,
        contactNumber: formData.contactNumber,
        reward: formData.reward,
        petImage: formData.petImage,
        ownerEmail: user?.email,
        ownerName: user?.displayName,
        lat: Number(formData.lat),
        lng: Number(formData.lng),
        status: "lost",
        approved: false,
        reportDate: new Date(),
      };

      const response = await axios.post(
        "http://localhost:5000/lost-pets",
        reportData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success("Lost pet report submitted successfully");
        queryClient.invalidateQueries(["lostPets"]);
        setFormData({
          petName: "",
          petType: "",
          breed: "",
          color: "",
          lastSeenDate: "",
          lastSeenLocation: "",
          description: "",
          contactNumber: "",
          reward: "",
          petImage: "",
          lat: "",
          lng: "",
        });
      }
    } catch (error) {
      toast.error("Failed to submit report. Please try again.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          petImage: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Report Lost Pet
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pet Name
              </label>
              <input
                type="text"
                name="petName"
                value={formData.petName}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:border-orange-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pet Type
              </label>
              <select
                name="petType"
                value={formData.petType}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:border-orange-500"
                required
              >
                <option value="">Select Pet Type</option>
                <option value="dog">Dog</option>
                <option value="cat">Cat</option>
                <option value="bird">Bird</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Breed
              </label>
              <input
                type="text"
                name="breed"
                value={formData.breed}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color
              </label>
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:border-orange-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Seen Date
              </label>
              <input
                type="datetime-local"
                name="lastSeenDate"
                value={formData.lastSeenDate}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:border-orange-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Seen Location
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="lastSeenLocation"
                  value={formData.lastSeenLocation}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:border-orange-500"
                  required
                  readOnly
                />
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                >
                  📍 Current
                </button>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Location on Map
              </label>
              <div
                id="map"
                className="w-full h-[400px] rounded-lg border border-gray-300 mb-4"
              ></div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:border-orange-500"
                rows="4"
                required
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Number
              </label>
              <input
                type="tel"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:border-orange-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reward (optional)
              </label>
              <input
                type="text"
                name="reward"
                value={formData.reward}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:border-orange-500"
                placeholder="Enter reward amount if any"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pet Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:border-orange-500"
                required
              />
              {formData.petImage && (
                <img
                  src={formData.petImage}
                  alt="Pet preview"
                  className="mt-2 w-32 h-32 object-cover rounded-lg"
                />
              )}
            </div>
          </div>

          <div className="flex justify-center">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="px-8 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors"
            >
              Submit Report
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportLostPet;
