import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";   

const PetDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const queryClient = useQueryClient();

  const { data: userData } = useQuery({
    queryKey: ["user", user?.email],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:5000/users/${user?.email}`);
      return res.data;
    }
  });

  const { data: pet = {}, isLoading } = useQuery({
    queryKey: ["pet", id],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:5000/pets/${id}`);
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
        <span className="loading loading-spinner loading-lg text-orange-500"></span>
      </div>
    );
  }

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/pets/${id}`);
      setShowDeleteModal(false);
      // Handle successful deletion (e.g., redirect)
    } catch (error) {
      console.error("Error deleting pet:", error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const form = e.target;
    const updatedPet = {
      name: form.name.value,
      species: form.species.value,
      breed: form.breed.value,
      age: form.age.value,
      gender: form.gender.value,
      size: form.size.value,
      color: form.color.value,
      healthStatus: form.healthStatus.value,
      vaccinated: form.vaccinated.checked,
      spayedNeutered: form.spayedNeutered.checked,
      adoptionFee: form.adoptionFee.value,
      description: form.description.value,
      behavior: form.behavior.value,
      specialNeeds: form.specialNeeds.value,
    };

    try {
      await axios.patch(`http://localhost:5000/pets/${id}`, updatedPet);
      await queryClient.invalidateQueries(["pet", id]);
      setShowUpdateModal(false);
    } catch (error) {
      console.error("Error updating pet:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto max-w-6xl"
      >
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden backdrop-blur-sm bg-opacity-90">
          <div className="flex flex-col">
            {/* Image Section with Buttons */}
            <div className="relative h-[400px] w-full group">
              <motion.img
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                src={pet.image}
                alt={pet.name}
                className="w-full h-full object-cover transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            {/* Details Section */}
            <div className="p-10 space-y-8">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6">
                <motion.h2 
                  initial={{ x: -20 }}
                  animate={{ x: 0 }}
                  className="text-4xl font-extrabold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent"
                >
                  {pet.name}
                </motion.h2>

                <div className="inline-block px-4 py-2 bg-orange-100 rounded-full">
                  <span className="font-semibold text-orange-700">Added By: </span>
                  <span className="text-orange-600">{pet.addedBy?.name || "Unknown"}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {[
                  { label: "Species", value: pet.species },
                  { label: "Breed", value: pet.breed },
                  { label: "Age", value: `${pet.age} years` },
                  { label: "Gender", value: pet.gender },
                  { label: "Size", value: pet.size },
                  { label: "Color", value: pet.color },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-orange-50 p-4 rounded-xl hover:shadow-md transition-shadow duration-300"
                  >
                    <span className="font-semibold text-orange-700">{item.label}:</span>
                    <span className="ml-2 text-gray-700">{item.value}</span>
                  </motion.div>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-orange-50 p-6 rounded-xl">
                  <h3 className="font-bold text-orange-700 mb-3">Health Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-700">Health Status:</span>
                      <span className={`px-3 py-1 rounded-full ${pet.healthStatus === 'Healthy' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {pet.healthStatus}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className={`px-4 py-2 rounded-full ${pet.vaccinated ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {pet.vaccinated ? '✓ Vaccinated' : '✗ Not Vaccinated'}
                      </div>
                      <div className={`px-4 py-2 rounded-full ${pet.spayedNeutered ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {pet.spayedNeutered ? '✓ Spayed/Neutered' : '✗ Not Spayed/Neutered'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50 p-6 rounded-xl">
                  <h3 className="font-bold text-orange-700 mb-3">Adoption Fee</h3>
                  <span className="text-2xl font-bold text-orange-600">${pet.adoptionFee}</span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { title: "Description", content: pet.description },
                  { title: "Behavior", content: pet.behavior },
                  { title: "Special Needs", content: pet.specialNeeds }
                ].map((section, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 + (index * 0.1) }}
                    className="bg-orange-50 p-6 rounded-xl"
                  >
                    <h3 className="font-bold text-orange-700 mb-2">{section.title}:</h3>
                    <p className="text-gray-700 leading-relaxed">{section.content}</p>
                  </motion.div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center gap-4 mt-8">
                {pet.addedBy._id === userData?._id || userData?.role === "admin" || userData?.role === "volunteer" ? (
                  <>
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowUpdateModal(true)}
                      className="btn bg-gradient-to-r from-blue-500 to-blue-600 text-white border-none hover:from-blue-600 hover:to-blue-700 shadow-lg"
                    >
                      Update
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowDeleteModal(true)}
                      className="btn bg-gradient-to-r from-red-500 to-red-600 text-white border-none hover:from-red-600 hover:to-red-700 shadow-lg"
                    >
                      Delete
                    </motion.button>
                  </>
                ) : (
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn bg-gradient-to-r from-orange-500 to-orange-600 text-white border-none hover:from-orange-600 hover:to-orange-700 shadow-lg"
                  >
                    Adopt Now
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Update Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg">Update Pet Information</h3>
              <button onClick={() => setShowUpdateModal(false)} className="btn btn-ghost btn-sm">×</button>
            </div>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="space-y-4">
                <input type="text" name="name" defaultValue={pet.name} placeholder="Pet Name" className="input input-bordered w-full" />
                <input type="text" name="species" defaultValue={pet.species} placeholder="Species" className="input input-bordered w-full" />
                <input type="text" name="breed" defaultValue={pet.breed} placeholder="Breed" className="input input-bordered w-full" />
                <input type="number" name="age" defaultValue={pet.age} placeholder="Age" className="input input-bordered w-full" />
                <select name="gender" defaultValue={pet.gender} className="select select-bordered w-full">
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                <input type="text" name="size" defaultValue={pet.size} placeholder="Size" className="input input-bordered w-full" />
                <input type="text" name="color" defaultValue={pet.color} placeholder="Color" className="input input-bordered w-full" />
                <select name="healthStatus" defaultValue={pet.healthStatus} className="select select-bordered w-full">
                  <option value="Healthy">Healthy</option>
                  <option value="Needs Attention">Needs Attention</option>
                </select>
                <div className="flex items-center gap-4">
                  <label className="cursor-pointer label">
                    <span className="label-text mr-2">Vaccinated</span>
                    <input type="checkbox" name="vaccinated" defaultChecked={pet.vaccinated} className="checkbox" />
                  </label>
                  <label className="cursor-pointer label">
                    <span className="label-text mr-2">Spayed/Neutered</span>
                    <input type="checkbox" name="spayedNeutered" defaultChecked={pet.spayedNeutered} className="checkbox" />
                  </label>
                </div>
                <input type="number" name="adoptionFee" defaultValue={pet.adoptionFee} placeholder="Adoption Fee" className="input input-bordered w-full" />
                <textarea name="description" defaultValue={pet.description} placeholder="Description" className="textarea textarea-bordered w-full h-24"></textarea>
                <textarea name="behavior" defaultValue={pet.behavior} placeholder="Behavior" className="textarea textarea-bordered w-full h-24"></textarea>
                <textarea name="specialNeeds" defaultValue={pet.specialNeeds} placeholder="Special Needs" className="textarea textarea-bordered w-full h-24"></textarea>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button type="submit" className="btn btn-primary">Update</button>
                <button type="button" onClick={() => setShowUpdateModal(false)} className="btn">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="font-bold text-lg">Confirm Deletion</h3>
            <p className="py-4">Are you sure you want to delete this pet? This action cannot be undone.</p>
            <div className="flex justify-end gap-2">
              <button onClick={handleDelete} className="btn btn-error">Delete</button>
              <button onClick={() => setShowDeleteModal(false)} className="btn">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PetDetails;
