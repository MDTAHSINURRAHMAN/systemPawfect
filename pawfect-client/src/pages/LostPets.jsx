import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const LostPets = () => {
  const [filter, setFilter] = useState("all"); // all, dogs, cats, others
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
          // Initialize maps for each pet
          filteredPets.forEach(pet => {
            const mapElement = document.getElementById(`map-${pet._id}`);
            if (mapElement) {
              const location = {
                lat: parseFloat(pet.lat),
                lng: parseFloat(pet.lng)
              };

              const mapInstance = new window.google.maps.Map(mapElement, {
                center: location,
                zoom: 15
              });

              const marker = new window.google.maps.Marker({
                position: location,
                map: mapInstance,
                title: "Last Seen Here"
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
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">
            Lost Pets
          </h2>
          <button
            onClick={() => window.location.href = '/report-lost-pet'}
            className="px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors"
          >
            Report Lost Pet
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="Search by name or breed..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg border focus:outline-none focus:border-orange-500"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 rounded-lg border focus:outline-none focus:border-orange-500"
          >
            <option value="all">All Pets</option>
            <option value="dogs">Dogs</option>
            <option value="cats">Cats</option>
            <option value="others">Others</option>
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredPets.map((pet) => (
            <motion.div
              key={pet._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div className="relative">
                <img
                  src={pet.petImage}
                  alt={pet.petName}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg">
                  {pet.status}
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">
                      {pet.petName}
                    </h3>
                    <p className="text-gray-600">
                      {pet.breed} • {pet.color}
                    </p>
                  </div>
                  {pet.reward && (
                    <div className="bg-green-100 text-green-600 px-4 py-2 rounded-lg">
                      Reward: ${pet.reward}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-gray-600">
                      <span className="font-medium">Type:</span> {pet.petType}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-gray-600">
                      <span className="font-medium">Last Seen:</span>{" "}
                      {new Date(pet.lastSeenDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <div id={`map-${pet._id}`} className="w-full h-[200px] rounded-lg mb-4"></div>
                  <p className="text-gray-600">
                    <span className="font-medium">Location:</span> {pet.lat}, {pet.lng}
                  </p>
                </div>

                <div className="space-y-3 mb-4">
                  <p className="text-gray-600">
                    <span className="font-medium">Owner:</span> {pet.ownerName}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Contact:</span> {pet.contactNumber}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Email:</span> {pet.ownerEmail}
                  </p>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <p className="text-gray-700">{pet.description}</p>
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