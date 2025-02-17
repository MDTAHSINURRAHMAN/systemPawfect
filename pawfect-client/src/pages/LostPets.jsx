import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { FaPaw, FaSearch, FaMapMarkerAlt, FaPhone, FaEnvelope, FaUser, FaCalendarAlt, FaGift } from "react-icons/fa";

const LostPets = () => {
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [maps, setMaps] = useState({});
  const [markers, setMarkers] = useState({});

  const { data: lostPets = [], isLoading } = useQuery({
    queryKey: ["lostPets"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:5000/lost-pets");
      return res.data;
    },
  });

  const filteredPets = lostPets.filter((pet) => {
    const matchesFilter =
      filter === "all" || pet.petType.toLowerCase() === filter.slice(0, -1);
    const matchesSearch =
      pet.petName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.breed.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
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
          filteredPets.forEach(pet => {
            const mapElement = document.getElementById(`map-${pet._id}`);
            if (mapElement) {
              const location = {
                lat: parseFloat(pet.lat),
                lng: parseFloat(pet.lng)
              };

              const mapInstance = new window.google.maps.Map(mapElement, {
                center: location,
                zoom: 15,
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
              });

              const marker = new window.google.maps.Marker({
                position: location,
                map: mapInstance,
                title: "Last Seen Here",
                icon: {
                  url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
                  scaledSize: new window.google.maps.Size(40, 40)
                }
              });

              setMaps(prev => ({...prev, [pet._id]: mapInstance}));
              setMarkers(prev => ({...prev, [pet._id]: marker}));
            }
          });
        };
      }
    };
    loadGoogleMaps();
  }, [filteredPets]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex justify-center items-center">
        <div className="loading loading-spinner loading-lg text-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-3">
            <FaPaw className="text-orange-500" />
            <span>Lost Pets Directory</span>
          </h1>
          <p className="text-gray-600 text-lg mb-8">Help reunite lost pets with their families</p>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = '/report-lost-pet'}
            className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
          >
            Report a Lost Pet
          </motion.button>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-6 mb-12">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or breed..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-6 py-4 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300"
          >
            <option value="all">All Pets</option>
            <option value="dogs">Dogs</option>
            <option value="cats">Cats</option>
            <option value="others">Others</option>
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredPets.map((pet) => (
            <motion.div
              key={pet._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300"
            >
              <div className="relative">
                <img
                  src={pet.petImage}
                  alt={pet.petName}
                  className="w-full h-72 object-cover"
                />
                <div className="absolute top-4 right-4">
                  <span className="bg-red-500/90 text-white px-6 py-2 rounded-full text-sm font-semibold backdrop-blur-md shadow-lg">
                    {pet.status}
                  </span>
                </div>
              </div>
              
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-3xl font-bold text-gray-800 mb-2">
                      {pet.petName}
                    </h3>
                    <p className="text-gray-600 text-lg">
                      {pet.breed} • {pet.color}
                    </p>
                  </div>
                  {pet.reward && (
                    <div className="flex items-center gap-2 bg-green-100 text-green-600 px-6 py-3 rounded-xl font-semibold">
                      <FaGift />
                      <span>Reward: ${pet.reward}</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-orange-50 p-4 rounded-xl">
                    <p className="text-gray-700 flex items-center gap-2">
                      <FaPaw className="text-orange-500" />
                      <span className="font-medium">{pet.petType}</span>
                    </p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-xl">
                    <p className="text-gray-700 flex items-center gap-2">
                      <FaCalendarAlt className="text-orange-500" />
                      <span>{new Date(pet.lastSeenDate).toLocaleDateString()}</span>
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <div id={`map-${pet._id}`} className="w-full h-[200px] rounded-xl overflow-hidden shadow-md mb-4"></div>
                  <p className="text-gray-600 flex items-center gap-2">
                    <FaMapMarkerAlt className="text-orange-500" />
                    <span>Location: {pet.lat}, {pet.lng}</span>
                  </p>
                </div>

                <div className="space-y-4 mb-6">
                  <p className="text-gray-600 flex items-center gap-2">
                    <FaUser className="text-orange-500" />
                    <span>{pet.ownerName}</span>
                  </p>
                  <p className="text-gray-600 flex items-center gap-2">
                    <FaPhone className="text-orange-500" />
                    <span>{pet.contactNumber}</span>
                  </p>
                  <p className="text-gray-600 flex items-center gap-2">
                    <FaEnvelope className="text-orange-500" />
                    <span>{pet.ownerEmail}</span>
                  </p>
                </div>

                <div className="bg-orange-50 p-6 rounded-xl border border-orange-100">
                  <p className="text-gray-700 leading-relaxed">{pet.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LostPets;