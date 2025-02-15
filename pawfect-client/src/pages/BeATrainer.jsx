import React, { useState, useContext } from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaPaw, FaHeart, FaHandHoldingHeart } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const BeATrainer = () => {
  const { user } = useContext(AuthContext);
  const initialFormData = {
    fullName: "",
    email: user?.email || "",
    age: "",
    profileImage: "",
    experience: "",
    facebook: "",
    twitter: "", 
    instagram: "",  
    skills: [],
    availableDays: [],
    availableTime: "",
    preferredAnimals: [],
  };

  const [formData, setFormData] = useState(initialFormData);

  const skillsList = [
    "Animal Care",
    "Pet First Aid", 
    "Animal Behavior",
    "Pet Grooming",
    "Animal Training",
    "Transportation",
    "Foster Care Experience",
  ];

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const animalsList = [
    "Dogs",
    "Cats",
    "Birds", 
    "Rabbits",
    "Other"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e, type) => {
    const { value, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [type]: checked
        ? [...prevState[type], value]
        : prevState[type].filter((item) => item !== value),
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      profileImage: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (
        !formData.fullName ||
        !formData.age ||
        !formData.experience ||
        !formData.profileImage
      ) {
        toast.error("Please fill in all required fields");
        return;
      }

      if (formData.skills.length === 0) {
        toast.error("Please select at least one skill");
        return;
      }

      if (formData.availableDays.length === 0) {
        toast.error("Please select at least one available day");
        return;
      }

      if (!formData.availableTime) {
        toast.error("Please select your available time");
        return;
      }

      const response = await fetch("http://localhost:5000/volunteers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          status: "pending",
        }),
      });

      if (response.ok) {
        toast.success("Volunteer application submitted successfully!");
        setFormData(initialFormData);
      } else {
        const errorData = await response.json();
        toast.error(
          errorData.message || "Failed to submit volunteer application"
        );
      }
    } catch (error) {
      toast.error("Failed to submit volunteer application. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-orange-50">
      {/* Hero Section */}
      <div className="relative h-[500px] overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/7474859/pexels-photo-7474859.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')] bg-cover bg-center bg-fixed"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Make a Difference</h1>
            <p className="text-xl md:text-2xl max-w-2xl mx-auto">Join our community of passionate volunteers and help create better lives for animals in need</p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-orange-50 to-transparent"></div>
      </div>

      {/* Benefits Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <motion.div
            whileHover={{ y: -10 }}
            className="text-center p-6 bg-white rounded-2xl shadow-xl border border-orange-100"
          >
            <FaPaw className="text-5xl text-[#FF640D] mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Help Animals</h3>
            <p className="text-gray-600">Make a direct impact on animals' lives through care and support</p>
          </motion.div>
          <motion.div
            whileHover={{ y: -10 }}
            className="text-center p-6 bg-white rounded-2xl shadow-xl border border-orange-100"
          >
            <FaHeart className="text-5xl text-[#FF640D] mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Build Connections</h3>
            <p className="text-gray-600">Join a community of like-minded animal lovers</p>
          </motion.div>
          <motion.div
            whileHover={{ y: -10 }}
            className="text-center p-6 bg-white rounded-2xl shadow-xl border border-orange-100"
          >
            <FaHandHoldingHeart className="text-5xl text-[#FF640D] mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Gain Experience</h3>
            <p className="text-gray-600">Develop valuable skills in animal care and welfare</p>
          </motion.div>
        </div>

        {/* Application Form */}
        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="max-w-6xl mx-auto space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-orange-100"
        >
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Volunteer Application</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <motion.div whileHover={{ scale: 1.02 }} className="space-y-2">
              <label className="block text-sm font-medium text-orange-600">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName || ""}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                required
              />
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} className="space-y-2">
              <label className="block text-sm font-medium text-orange-600">
                Email
              </label>
              <input
                type="email"
                value={formData.email || ""}
                className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50"
                readOnly
              />
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} className="space-y-2">
              <label className="block text-sm font-medium text-orange-600">
                Age
              </label>
              <input
                type="number"
                name="age"
                value={formData.age || ""}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                required
              />
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} className="space-y-2">
              <label className="block text-sm font-medium text-orange-600">
                Profile Image URL
              </label>
              <input
                type="url"
                name="profileImage"
                value={formData.profileImage}
                onChange={handleChange}
                placeholder="Enter image URL"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                required
              />
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} className="space-y-2">
              <label className="block text-sm font-medium text-orange-600">
                Years of Pet Care Experience
              </label>
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                required
              />
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} className="space-y-2">
              <label className="block text-sm font-medium text-orange-600">
                Available Time
              </label>
              <input
                type="time"
                name="availableTime"
                value={formData.availableTime}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                required
              />
            </motion.div>
          </div>

          <motion.div
            whileHover={{ scale: 1.01 }}
            className="space-y-3 bg-gradient-to-r from-orange-50 to-white p-6 rounded-xl"
          >
            <label className="block text-sm font-medium text-orange-600">
              Social Media Links
            </label>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2 bg-white p-3 rounded-xl shadow-sm">
                <FaFacebook className="text-blue-600 text-xl" />
                <input
                  type="url"
                  name="facebook"
                  value={formData.facebook}
                  onChange={handleChange}
                  placeholder="Facebook URL"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center gap-2 bg-white p-3 rounded-xl shadow-sm">
                <FaTwitter className="text-blue-400 text-xl" />
                <input
                  type="url"
                  name="twitter"
                  value={formData.twitter}
                  onChange={handleChange}
                  placeholder="Twitter URL"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                />
              </div>
              <div className="flex items-center gap-2 bg-white p-3 rounded-xl shadow-sm">
                <FaInstagram className="text-pink-600 text-xl" />
                <input
                  type="url"
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleChange}
                  placeholder="Instagram URL"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="space-y-3 bg-gradient-to-r from-orange-50 to-white p-6 rounded-xl"
            >
              <label className="block text-sm font-medium text-orange-600">
                Skills & Experience
              </label>
              <div className="grid grid-cols-2 gap-3">
                {skillsList.map((skill) => (
                  <motion.label
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    key={skill}
                    className="flex items-center gap-2 bg-white p-2 rounded-lg shadow-sm cursor-pointer hover:bg-orange-50 transition-colors duration-200"
                  >
                    <input
                      type="checkbox"
                      value={skill}
                      checked={formData.skills.includes(skill)}
                      onChange={(e) => handleCheckboxChange(e, "skills")}
                      className="w-4 h-4 text-orange-500"
                    />
                    <span className="text-sm">{skill}</span>
                  </motion.label>
                ))}
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.01 }}
              className="space-y-3 bg-gradient-to-r from-orange-50 to-white p-6 rounded-xl"
            >
              <label className="block text-sm font-medium text-orange-600">
                Preferred Animals
              </label>
              <div className="grid grid-cols-2 gap-3">
                {animalsList.map((animal) => (
                  <motion.label
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    key={animal}
                    className="flex items-center gap-2 bg-white p-2 rounded-lg shadow-sm cursor-pointer hover:bg-orange-50 transition-colors duration-200"
                  >
                    <input
                      type="checkbox"
                      value={animal}
                      checked={formData.preferredAnimals.includes(animal)}
                      onChange={(e) => handleCheckboxChange(e, "preferredAnimals")}
                      className="w-4 h-4 text-orange-500"
                    />
                    <span className="text-sm">{animal}</span>
                  </motion.label>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div
            whileHover={{ scale: 1.01 }}
            className="bg-gradient-to-r from-orange-50 to-white p-6 rounded-xl"
          >
            <label className="block text-sm font-medium text-orange-600 mb-4">
              Available Days
            </label>
            <div className="flex flex-wrap gap-3">
              {daysOfWeek.map((day) => (
                <motion.label
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  key={day}
                  className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm cursor-pointer hover:bg-orange-50 transition-colors duration-200"
                >
                  <input
                    type="checkbox"
                    value={day}
                    checked={formData.availableDays.includes(day)}
                    onChange={(e) => handleCheckboxChange(e, "availableDays")}
                    className="w-4 h-4 text-orange-500"
                  />
                  <span className="text-sm font-medium">{day}</span>
                </motion.label>
              ))}
            </div>
          </motion.div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02, backgroundColor: "#ff4d00" }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-[#FF640D] text-white py-4 px-6 rounded-xl 
                     transition-all duration-300 shadow-lg hover:shadow-orange-200/50
                     text-lg font-semibold tracking-wide"
          >
            Submit Volunteer Application
          </motion.button>
        </motion.form>
      </div>
    </div>
  );
};

export default BeATrainer;
