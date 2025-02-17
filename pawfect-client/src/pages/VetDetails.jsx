import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { FaUserMd, FaPhone, FaEnvelope, FaMapMarkerAlt, FaGraduationCap, FaClock, FaDollarSign, FaLanguage } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';

const VetDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [petName, setPetName] = useState('');
  const [petAge, setPetAge] = useState('');
  const [petType, setPetType] = useState('');
  const [reason, setReason] = useState('');

  const { data: vet, isLoading } = useQuery({
    queryKey: ['vet', id],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:5000/vets/${id}`);
      return res.data;
    }
  });

  const handleAppointmentSubmit = async (e) => {
    e.preventDefault();
    try {
      const appointmentData = {
        vetId: id,
        vetName: vet.name,
        vetEmail: vet.email,
        vetSpecialization: vet.specialization,
        vetPhone: vet.phone,
        consultationFee: vet.consultationFees,
        ownerName: user.name,
        ownerEmail: user.email,
        ownerPhone: user.phone,
        petName,
        petAge,
        petType,
        reason,
        date: selectedDate,
        time: selectedTime,
        status: 'pending',
        createdAt: new Date()
      };

      await axios.post('http://localhost:5000/appointments', appointmentData);
      alert('Appointment booked successfully!');
      
      // Reset form
      setSelectedDate('');
      setSelectedTime('');
      setPetName('');
      setPetAge('');
      setPetType('');
      setReason('');
      
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('Failed to book appointment');
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex justify-center items-center">
      <span className="loading loading-spinner loading-lg text-orange-500"></span>
    </div>;
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Vet Details */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-xl p-6 lg:p-8"
          >
            <div className="flex flex-col items-center text-center mb-8">
              <img 
                src={vet.image} 
                alt={vet.name}
                className="w-48 h-48 rounded-full object-cover mb-4 border-4 border-orange-500"
              />
              <h1 className="text-3xl font-bold text-gray-900">{vet.name}</h1>
              <p className="text-xl text-orange-500 mt-2">{vet.specialization}</p>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Professional Information</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <FaGraduationCap className="text-orange-500 text-xl" />
                    <span className="text-gray-700">{vet.degrees}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaUserMd className="text-orange-500 text-xl" />
                    <span className="text-gray-700">{vet.experience} years of experience</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaClock className="text-orange-500 text-xl" />
                    <span className="text-gray-700">Available: {vet.availableHours}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaDollarSign className="text-orange-500 text-xl" />
                    <span className="text-gray-700">Fee: ${vet.consultationFees}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaLanguage className="text-orange-500 text-xl" />
                    <span className="text-gray-700">{vet.languages}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact Information</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <FaPhone className="text-orange-500 text-xl" />
                    <span className="text-gray-700">{vet.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaEnvelope className="text-orange-500 text-xl" />
                    <span className="text-gray-700">{vet.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaMapMarkerAlt className="text-orange-500 text-xl" />
                    <span className="text-gray-700">{vet.address}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Booking Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-xl p-6 lg:p-8"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Book an Appointment</h2>
            <form onSubmit={handleAppointmentSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Pet Name</span>
                  </label>
                  <input 
                    type="text"
                    value={petName}
                    onChange={(e) => setPetName(e.target.value)}
                    className="input input-bordered focus:border-orange-500"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Pet Age</span>
                  </label>
                  <input 
                    type="text"
                    value={petAge}
                    onChange={(e) => setPetAge(e.target.value)}
                    className="input input-bordered focus:border-orange-500"
                    required
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Pet Type</span>
                </label>
                <select
                  value={petType}
                  onChange={(e) => setPetType(e.target.value)}
                  className="select select-bordered focus:border-orange-500 w-full"
                  required
                >
                  <option value="">Select pet type</option>
                  <option value="Dog">Dog</option>
                  <option value="Cat">Cat</option>
                  <option value="Bird">Bird</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Reason for Visit</span>
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="textarea textarea-bordered focus:border-orange-500 h-32"
                  required
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Select Date</span>
                  </label>
                  <input 
                    type="date" 
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="input input-bordered focus:border-orange-500"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Select Time</span>
                  </label>
                  <select 
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="select select-bordered focus:border-orange-500"
                    required
                  >
                    <option value="">Select a time slot</option>
                    <option value="09:00">09:00 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="14:00">02:00 PM</option>
                    <option value="15:00">03:00 PM</option>
                    <option value="16:00">04:00 PM</option>
                  </select>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="btn btn-block bg-orange-500 hover:bg-orange-600 text-white border-none mt-8"
              >
                Book Appointment
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default VetDetails;
