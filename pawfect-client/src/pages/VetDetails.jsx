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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Vet Profile Header */}
          <div className="relative h-64 sm:h-80">
            <div className="absolute inset-0 bg-gradient-to-r from-black to-orange-500"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <div className="flex items-center gap-6">
                <img 
                  src={vet.image} 
                  alt={vet.name}
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
                />
                <div>
                  <h1 className="text-3xl font-bold">{vet.name}</h1>
                  <p className="text-lg opacity-90">{vet.specialization}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            {/* Vet Information */}
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                <h2 className="text-2xl font-semibold text-gray-800">Professional Information</h2>
                <div className="grid gap-4">
                  <div className="flex items-center gap-3">
                    <FaGraduationCap className="text-orange-500 text-xl" />
                    <span>{vet.degrees}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaUserMd className="text-orange-500 text-xl" />
                    <span>{vet.experience} years of experience</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaClock className="text-orange-500 text-xl" />
                    <span>Available Hours: {vet.availableHours}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaDollarSign className="text-orange-500 text-xl" />
                    <span>Consultation Fee: ${vet.consultationFees}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaLanguage className="text-orange-500 text-xl" />
                    <span>Languages: {vet.languages}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                <h2 className="text-2xl font-semibold text-gray-800">Contact Information</h2>
                <div className="grid gap-4">
                  <div className="flex items-center gap-3">
                    <FaPhone className="text-orange-500 text-xl" />
                    <span>{vet.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaEnvelope className="text-orange-500 text-xl" />
                    <span>{vet.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaMapMarkerAlt className="text-orange-500 text-xl" />
                    <span>{vet.address}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Appointment Booking Form */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Book an Appointment</h2>
              <form onSubmit={handleAppointmentSubmit} className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Pet Name</span>
                  </label>
                  <input 
                    type="text"
                    value={petName}
                    onChange={(e) => setPetName(e.target.value)}
                    className="input input-bordered"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Pet Age</span>
                  </label>
                  <input 
                    type="text"
                    value={petAge}
                    onChange={(e) => setPetAge(e.target.value)}
                    className="input input-bordered"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Pet Type</span>
                  </label>
                  <select
                    value={petType}
                    onChange={(e) => setPetType(e.target.value)}
                    className="select select-bordered"
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
                    <span className="label-text">Reason for Visit</span>
                  </label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="textarea textarea-bordered"
                    required
                  ></textarea>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Select Date</span>
                  </label>
                  <input 
                    type="date" 
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="input input-bordered"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Select Time</span>
                  </label>
                  <select 
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="select select-bordered"
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

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="btn btn-block bg-orange-500 hover:bg-orange-600 text-white border-none"
                >
                  Book Appointment
                </motion.button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default VetDetails;
