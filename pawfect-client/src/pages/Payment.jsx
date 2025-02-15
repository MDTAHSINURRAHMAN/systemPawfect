import React from 'react';
import { useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FaUser, FaCalendar, FaBox, FaDollarSign, FaEnvelope } from 'react-icons/fa';

const Payment = () => {
    const location = useLocation();
    const { user } = useContext(AuthContext);
    const paymentData = location.state;

    return (
        <>
            <Helmet>
                <title>Pawfect | Payment</title>
            </Helmet>
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50/30 pt-24 pb-12"
            >
                <div className="container mx-auto px-4">
                    {/* Header Section */}
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-center mb-12"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                            Complete Your <span className="text-[#FF640D]">Booking</span>
                        </h1>
                        <p className="text-gray-600 text-lg">Secure your training session with our trusted professionals</p>
                    </motion.div>

                    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
                        {/* Payment Summary Card */}
                        <motion.div 
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="lg:w-2/3 bg-white rounded-3xl shadow-xl p-8 border border-orange-100"
                        >
                            <h2 className="text-2xl font-bold mb-8 text-gray-800">Booking Summary</h2>
                            
                            {/* Trainer Info */}
                            <div className="space-y-6">
                                <div className="flex items-start gap-6 p-6 bg-orange-50 rounded-2xl">
                                    <div className="p-3 bg-[#FF640D] text-white rounded-xl">
                                        <FaUser size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800">Trainer Details</h3>
                                        <p className="text-gray-600">{paymentData?.trainerName}</p>
                                    </div>
                                </div>

                                {/* Schedule */}
                                <div className="flex items-start gap-6 p-6 bg-orange-50 rounded-2xl">
                                    <div className="p-3 bg-[#FF640D] text-white rounded-xl">
                                        <FaCalendar size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800">Training Schedule</h3>
                                        <p className="text-gray-600">{paymentData?.selectedDay}</p>
                                    </div>
                                </div>

                                {/* Package Details */}
                                <div className="flex items-start gap-6 p-6 bg-orange-50 rounded-2xl">
                                    <div className="p-3 bg-[#FF640D] text-white rounded-xl">
                                        <FaBox size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800">Selected Package</h3>
                                        <p className="text-gray-600">{paymentData?.packageName}</p>
                                    </div>
                                </div>

                                {/* Client Info */}
                                <div className="flex items-start gap-6 p-6 bg-orange-50 rounded-2xl">
                                    <div className="p-3 bg-[#FF640D] text-white rounded-xl">
                                        <FaEnvelope size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800">Your Contact</h3>
                                        <p className="text-gray-600">{user?.email}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Price Summary Card */}
                        <motion.div 
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="lg:w-1/3"
                        >
                            <div className="bg-white rounded-3xl shadow-xl p-8 border border-orange-100 sticky top-8">
                                <h2 className="text-2xl font-bold mb-8 text-gray-800">Price Details</h2>
                                
                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Package Price</span>
                                        <span className="font-semibold">${paymentData?.amount}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Service Fee</span>
                                        <span className="font-semibold">$0</span>
                                    </div>
                                    <div className="border-t border-dashed border-gray-200 pt-4">
                                        <div className="flex justify-between items-center">
                                            <span className="font-bold text-lg">Total</span>
                                            <span className="font-bold text-lg text-[#FF640D]">${paymentData?.amount}</span>
                                        </div>
                                    </div>
                                </div>

                                <Link to="/final-payment" state={paymentData}>
                                    <motion.button 
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full bg-gradient-to-r from-[#FF640D] to-orange-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-orange-200 transition-all duration-300 flex items-center justify-center gap-2"
                                    >
                                        <FaDollarSign />
                                        Proceed to Payment
                                    </motion.button>
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </>
    );
};

export default Payment;