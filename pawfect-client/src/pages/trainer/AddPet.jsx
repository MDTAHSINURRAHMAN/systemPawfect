import { useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

const AddPet = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch user data from MongoDB
  const { data: userData } = useQuery({
    queryKey: ["user", user?.email],
    queryFn: async () => {
      const res = await axios.get(`https://pawfect-server-beige.vercel.app/users/${user?.email}`);
      return res.data;
    }
  });

  const [petData, setPetData] = useState({
    name: "",
    age: "",
    breed: "",
    species: "",
    gender: "",
    size: "",
    color: "",
    healthStatus: "",
    vaccinated: false,
    spayedNeutered: false,
    description: "",
    image: "",
    behavior: "",
    specialNeeds: "",
    adoptionFee: "",
    status: "available",
    addedBy: user?.email // Just store email, we'll get full user data from backend
  });

  const { mutate: addPet, isLoading } = useMutation({
    mutationFn: async (petData) => {
      // Get full user data from MongoDB and add it to pet data
      const petWithUserData = {
        ...petData,
        addedBy: userData // Add full user data from MongoDB
      };
      const response = await axios.post("https://pawfect-server-beige.vercel.app/pets", petWithUserData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["pets"]);
      toast.success("Pet added successfully!");
      navigate("/dashboard/all-pets");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add pet");
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addPet(petData);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-gradient-to-br from-gray-50 to-gray-100">
      <motion.h2 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent"
      >
        Add a Pet for Adoption
      </motion.h2>
      
      <motion.form 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        onSubmit={handleSubmit} 
        className="space-y-6 bg-white p-8 rounded-xl shadow-lg"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold text-gray-700">Pet Name</span>
            </label>
            <input
              type="text"
              required
              className="input input-bordered focus:border-orange-500 transition-colors"
              value={petData.name}
              onChange={(e) => setPetData({...petData, name: e.target.value})}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold text-gray-700">Species</span>
            </label>
            <select 
              className="select select-bordered focus:border-orange-500 transition-colors"
              value={petData.species}
              onChange={(e) => setPetData({...petData, species: e.target.value})}
              required
            >
              <option value="">Select Species</option>
              <option value="dog">Dog</option>
              <option value="cat">Cat</option>
              <option value="bird">Bird</option>
              <option value="rabbit">Rabbit</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold text-gray-700">Breed</span>
            </label>
            <input
              type="text"
              className="input input-bordered focus:border-orange-500 transition-colors"
              value={petData.breed}
              onChange={(e) => setPetData({...petData, breed: e.target.value})}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold text-gray-700">Age</span>
            </label>
            <input
              type="text"
              className="input input-bordered focus:border-orange-500 transition-colors"
              value={petData.age}
              onChange={(e) => setPetData({...petData, age: e.target.value})}
              placeholder="e.g. 2 years"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold text-gray-700">Gender</span>
            </label>
            <select 
              className="select select-bordered focus:border-orange-500 transition-colors"
              value={petData.gender}
              onChange={(e) => setPetData({...petData, gender: e.target.value})}
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold text-gray-700">Size</span>
            </label>
            <select 
              className="select select-bordered focus:border-orange-500 transition-colors"
              value={petData.size}
              onChange={(e) => setPetData({...petData, size: e.target.value})}
            >
              <option value="">Select Size</option>
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold text-gray-700">Color</span>
            </label>
            <input
              type="text"
              className="input input-bordered focus:border-orange-500 transition-colors"
              value={petData.color}
              onChange={(e) => setPetData({...petData, color: e.target.value})}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold text-gray-700">Adoption Fee ($)</span>
            </label>
            <input
              type="number"
              className="input input-bordered focus:border-orange-500 transition-colors"
              value={petData.adoptionFee}
              onChange={(e) => setPetData({...petData, adoptionFee: e.target.value})}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold text-gray-700">Image URL</span>
            </label>
            <input
              type="url"
              className="input input-bordered focus:border-orange-500 transition-colors"
              value={petData.image}
              onChange={(e) => setPetData({...petData, image: e.target.value})}
              required
            />
          </div>

          <div className="form-control">
            <label className="label cursor-pointer hover:text-orange-500 transition-colors">
              <span className="label-text font-semibold text-gray-700">Vaccinated</span>
              <input
                type="checkbox"
                className="checkbox checkbox-warning"
                checked={petData.vaccinated}
                onChange={(e) => setPetData({...petData, vaccinated: e.target.checked})}
              />
            </label>
          </div>

          <div className="form-control">
            <label className="label cursor-pointer hover:text-orange-500 transition-colors">
              <span className="label-text font-semibold text-gray-700">Spayed/Neutered</span>
              <input
                type="checkbox"
                className="checkbox checkbox-warning"
                checked={petData.spayedNeutered}
                onChange={(e) => setPetData({...petData, spayedNeutered: e.target.checked})}
              />
            </label>
          </div>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold text-gray-700">Health Status</span>
          </label>
          <textarea
            className="textarea textarea-bordered focus:border-orange-500 transition-colors h-24"
            value={petData.healthStatus}
            onChange={(e) => setPetData({...petData, healthStatus: e.target.value})}
            placeholder="Describe the pet's current health condition..."
          ></textarea>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold text-gray-700">Behavior</span>
          </label>
          <textarea
            className="textarea textarea-bordered focus:border-orange-500 transition-colors h-24"
            value={petData.behavior}
            onChange={(e) => setPetData({...petData, behavior: e.target.value})}
            placeholder="Describe the pet's behavior and temperament..."
          ></textarea>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold text-gray-700">Special Needs</span>
          </label>
          <textarea
            className="textarea textarea-bordered focus:border-orange-500 transition-colors h-24"
            value={petData.specialNeeds}
            onChange={(e) => setPetData({...petData, specialNeeds: e.target.value})}
            placeholder="Any special care requirements..."
          ></textarea>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold text-gray-700">Description</span>
          </label>
          <textarea
            className="textarea textarea-bordered focus:border-orange-500 transition-colors h-32"
            value={petData.description}
            onChange={(e) => setPetData({...petData, description: e.target.value})}
            placeholder="General description about the pet..."
            required
          ></textarea>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="btn bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 w-full border-none"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="loading loading-spinner"></span>
          ) : (
            "Add Pet for Adoption"
          )}
        </motion.button>
      </motion.form>
    </div>
  );
};

export default AddPet;
