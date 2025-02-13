import { useState, useEffect, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Select from "react-select";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";

const AddNewSlot = () => {
  const queryClient = useQueryClient();
  const [trainerData, setTrainerData] = useState(null);
  const [selectedDays, setSelectedDays] = useState([]);
  const [slotTime, setSlotTime] = useState("");
  const [selectedClasses, setSelectedClasses] = useState([]);

  const { user } = useContext(AuthContext);

  // Fetch trainer data
  const { data: trainer } = useQuery({
    queryKey: ["trainerProfile"],
    queryFn: async () => {
      const { data } = await axios.get(
        `http://localhost:5000/trainer-profile/${user.email}`
      );
      setTrainerData(data);
      return data;
    },
  });

  // Fetch available classes
  const { data: classes = [] } = useQuery({
    queryKey: ["adminClasses"],
    queryFn: async () => {
      const { data } = await axios.get("http://localhost:5000/classes");
      return data;
    },
  });

  // Days options for react-select
  const daysOptions = [
    { value: "monday", label: "Monday" },
    { value: "tuesday", label: "Tuesday" },
    { value: "wednesday", label: "Wednesday" },
    { value: "thursday", label: "Thursday" },
    { value: "friday", label: "Friday" },
    { value: "saturday", label: "Saturday" },
    { value: "sunday", label: "Sunday" },
  ];

  // Add new slot mutation
  const addSlotMutation = useMutation({
    mutationFn: async (slotData) => {
      const response = await axios.post(
        `http://localhost:5000/trainer-slots/${user.email}`,
        slotData
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["trainerSlots"]);
      toast.success("Slot added successfully!");
      // Reset form
      setSlotTime("");
      setSelectedDays([]);
      setSelectedClasses([]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to add slot");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const slotData = {
      days: selectedDays.map((day) => day.value),
      slotTime,
      classes: selectedClasses.map((cls) => cls.value),
    };

    addSlotMutation.mutate(slotData);
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-xl p-8"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Add New Slot</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Trainer Info (Read-only) */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={trainerData?.fullName || ""}
                readOnly
                className="w-full p-3 bg-gray-100 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={trainerData?.email || ""}
                readOnly
                className="w-full p-3 bg-gray-100 rounded-xl"
              />
            </div>
          </div>

          {/* Slot Details */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 mb-2">Available Time</label>
              <input
                type="text"
                value={slotTime}
                onChange={(e) => setSlotTime(e.target.value)}
                placeholder="e.g. 9:00 AM - 10:00 AM"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Days Selection */}
          <div>
            <label className="block text-gray-700 mb-2">Available Days</label>
            <Select
              isMulti
              options={daysOptions}
              value={selectedDays}
              onChange={setSelectedDays}
              className="rounded-xl"
              classNamePrefix="select"
            />
          </div>

          {/* Classes Selection */}
          <div>
            <label className="block text-gray-700 mb-2">Classes</label>
            <Select
              isMulti
              options={classes.map((cls) => ({
                value: cls.name,
                label: cls.name,
              }))}
              value={selectedClasses}
              onChange={setSelectedClasses}
              className="rounded-xl"
              classNamePrefix="select"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-3 px-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Add Slot
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default AddNewSlot;
