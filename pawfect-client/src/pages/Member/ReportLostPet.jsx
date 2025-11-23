import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { FaPaw, FaMapMarkerAlt, FaCamera } from "react-icons/fa";

const ReportLostPet = () => {
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const [location, setLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 23.8103, lng: 90.4125 });
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
              styles: [
                {
                  featureType: "all",
                  elementType: "geometry",
                  stylers: [{ color: "#f5f5f5" }]
                },
                {
                  featureType: "water",
                  elementType: "geometry",
                  stylers: [{ color: "#e9e9e9" }]
                }
              ]
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
            icon: {
              url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
              scaledSize: new window.google.maps.Size(40, 40)
            }
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
      icon: {
        url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
        scaledSize: new window.google.maps.Size(40, 40)
      }
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
        "https://pawfect-server-beige.vercel.app/lost-pets",
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 py-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-800 flex items-center justify-center gap-3">
            <FaPaw className="text-orange-500" />
            Report Lost Pet
          </h2>
          <p className="mt-4 text-gray-600">Help us reunite you with your beloved pet</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Pet Name
                  </label>
                  <input
                    type="text"
                    name="petName"
                    value={formData.petName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Pet Type
                  </label>
                  <select
                    name="petType"
                    value={formData.petType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
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
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Breed
                  </label>
                  <input
                    type="text"
                    name="breed"
                    value={formData.breed}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Color
                  </label>
                  <input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                    required
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Last Seen Date
                  </label>
                  <input
                    type="datetime-local"
                    name="lastSeenDate"
                    value={formData.lastSeenDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Reward (optional)
                  </label>
                  <input
                    type="text"
                    name="reward"
                    value={formData.reward}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                    placeholder="Enter reward amount if any"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Pet Image
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="pet-image"
                      required
                    />
                    <label
                      htmlFor="pet-image"
                      className="flex items-center justify-center w-full px-4 py-3 rounded-xl border border-gray-200 cursor-pointer hover:bg-orange-50 transition-all duration-200"
                    >
                      <FaCamera className="mr-2 text-orange-500" />
                      Upload Photo
                    </label>
                  </div>
                  {formData.petImage && (
                    <img
                      src={formData.petImage}
                      alt="Pet preview"
                      className="mt-4 w-full h-40 object-cover rounded-xl"
                    />
                  )}
                </div>
              </div>

              <div className="md:col-span-2 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Last Seen Location
                  </label>
                  <div className="flex gap-4">
                    <input
                      type="text"
                      name="lastSeenLocation"
                      value={formData.lastSeenLocation}
                      onChange={handleChange}
                      className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                      required
                      readOnly
                    />
                    <button
                      type="button"
                      onClick={getCurrentLocation}
                      className="px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors flex items-center gap-2"
                    >
                      <FaMapMarkerAlt />
                      Current Location
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Select Location on Map
                  </label>
                  <div
                    id="map"
                    className="w-full h-[400px] rounded-xl border border-gray-200 overflow-hidden"
                  ></div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                    rows="4"
                    required
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="px-12 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold text-lg"
              >
                Submit Report
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ReportLostPet;
