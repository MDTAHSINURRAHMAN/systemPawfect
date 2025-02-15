import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserMd, FaPhone, FaEnvelope, FaMapMarkerAlt, FaTrash, FaEdit, FaGraduationCap } from 'react-icons/fa';

const Vet = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: '',
    experience: '',
    address: '',
    image: '',
    degrees: '',
    licenseNumber: '',
    availableHours: '',
    consultationFees: '',
    languages: '',
    emergencyContact: ''
  });

  const queryClient = useQueryClient();

  const { data: vets = [], isLoading } = useQuery({
    queryKey: ['vets'],
    queryFn: async () => {
      const res = await axios.get('http://localhost:5000/vets');
      return res.data;
    }
  });

  const addVetMutation = useMutation({
    mutationFn: (newVet) => {
      return axios.post('http://localhost:5000/vets', newVet);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['vets']);
      setIsModalOpen(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        specialization: '',
        experience: '',
        address: '',
        image: '',
        degrees: '',
        licenseNumber: '',
        availableHours: '',
        consultationFees: '',
        languages: '',
        emergencyContact: ''
      });
    }
  });

  const deleteVetMutation = useMutation({
    mutationFn: (id) => {
      return axios.delete(`http://localhost:5000/vets/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['vets']);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addVetMutation.mutate(formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Veterinarian Management</h1>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsModalOpen(true)}
          className="btn bg-orange-500 hover:bg-orange-600 text-white border-none"
        >
          Add New Veterinarian
        </motion.button>
      </div>

      {/* Vets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vets.map((vet) => (
          <motion.div
            key={vet._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="relative h-48">
              <img
                src={vet.image || 'https://placehold.co/400x300?text=Vet+Image'}
                alt={vet.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">{vet.name}</h3>
              <p className="text-orange-500 font-medium mb-4">{vet.specialization}</p>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-600">
                  <FaGraduationCap className="text-orange-400" />
                  <span>{vet.degrees}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <FaEnvelope className="text-orange-400" />
                  <span>{vet.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <FaPhone className="text-orange-400" />
                  <span>{vet.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <FaMapMarkerAlt className="text-orange-400" />
                  <span>{vet.address}</span>
                </div>
                <div className="text-gray-600">
                  <p><strong>License:</strong> {vet.licenseNumber}</p>
                  <p><strong>Available Hours:</strong> {vet.availableHours}</p>
                  <p><strong>Consultation Fees:</strong> ${vet.consultationFees}</p>
                  <p><strong>Languages:</strong> {vet.languages}</p>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => deleteVetMutation.mutate(vet._id)}
                  className="btn btn-sm btn-error"
                >
                  <FaTrash />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-sm btn-primary"
                >
                  <FaEdit />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Vet Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Veterinarian</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Name</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input input-bordered"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Degrees (comma separated)</span>
                  </label>
                  <input
                    type="text"
                    name="degrees"
                    value={formData.degrees}
                    onChange={handleChange}
                    className="input input-bordered"
                    required
                    placeholder="DVM, PhD, MVSC"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">License Number</span>
                  </label>
                  <input
                    type="text"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    className="input input-bordered"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input input-bordered"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Phone</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="input input-bordered"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Emergency Contact</span>
                  </label>
                  <input
                    type="tel"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleChange}
                    className="input input-bordered"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Specialization</span>
                  </label>
                  <input
                    type="text"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    className="input input-bordered"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Experience (years)</span>
                  </label>
                  <input
                    type="number"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    className="input input-bordered"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Available Hours</span>
                  </label>
                  <input
                    type="text"
                    name="availableHours"
                    value={formData.availableHours}
                    onChange={handleChange}
                    className="input input-bordered"
                    placeholder="Mon-Fri: 9AM-5PM"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Consultation Fees ($)</span>
                  </label>
                  <input
                    type="number"
                    name="consultationFees"
                    value={formData.consultationFees}
                    onChange={handleChange}
                    className="input input-bordered"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Languages</span>
                  </label>
                  <input
                    type="text"
                    name="languages"
                    value={formData.languages}
                    onChange={handleChange}
                    className="input input-bordered"
                    placeholder="English, Spanish, etc."
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Address</span>
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="textarea textarea-bordered"
                    required
                  ></textarea>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Image URL</span>
                  </label>
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    className="input input-bordered"
                  />
                </div>

                <div className="flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="btn btn-ghost"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    Add Veterinarian
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Vet;
