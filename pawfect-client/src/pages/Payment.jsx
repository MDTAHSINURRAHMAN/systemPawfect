import React from 'react';
import { useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

const Payment = () => {
    const location = useLocation();
    const { user } = useContext(AuthContext);
    const paymentData = location.state;

    // console.log(paymentData);
    

    return (
        <>
            <Helmet>
                <title>Fitverse | Payment</title>
            </Helmet>
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 py-8 md:py-12 lg:py-16"
            >
                <motion.div 
                    initial={{ y: 20 }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="container mx-auto px-4 sm:px-6 lg:px-8"
                >
                    <motion.div 
                        initial={{ scale: 0.95 }}
                        animate={{ scale: 1 }}
                        className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-6 md:p-8 lg:p-10 border border-orange-100 hover:shadow-2xl transition-shadow duration-300"
                    >
                        <motion.h2 
                            initial={{ y: -20 }}
                            animate={{ y: 0 }}
                            className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-6 md:mb-8 lg:mb-10 bg-gradient-to-r from-[#FF640D] to-orange-600 bg-clip-text text-transparent"
                        >
                            Payment Details
                        </motion.h2>

                        <div className="space-y-6 md:space-y-8">
                            <motion.div 
                                whileHover={{ scale: 1.02 }}
                                className="border-b border-orange-200 pb-6 bg-gradient-to-br from-orange-50 to-white p-4 sm:p-6 rounded-xl shadow-md"
                            >
                                <h3 className="text-lg md:text-xl font-semibold mb-4 text-gray-800">Trainer Information</h3>
                                <p className="text-gray-700"><span className="font-medium">Trainer Name:</span> {paymentData?.trainerName}</p>
                                <p className="text-gray-700 mt-2"><span className="font-medium">Selected Day:</span> {paymentData?.selectedDay}</p>
                            </motion.div>

                            <motion.div 
                                whileHover={{ scale: 1.02 }}
                                className="border-b border-orange-200 pb-6 bg-gradient-to-br from-orange-50 to-white p-4 sm:p-6 rounded-xl shadow-md"
                            >
                                <h3 className="text-lg md:text-xl font-semibold mb-4 text-gray-800">Package Details</h3>
                                <p className="text-gray-700"><span className="font-medium">Package:</span> {paymentData?.packageName}</p>
                                <p className="text-gray-700 mt-2"><span className="font-medium">Price:</span> ${paymentData?.packagePrice}</p>
                            </motion.div>

                            <motion.div 
                                whileHover={{ scale: 1.02 }}
                                className="border-b border-orange-200 pb-6 bg-gradient-to-br from-orange-50 to-white p-4 sm:p-6 rounded-xl shadow-md"
                            >
                                <h3 className="text-lg md:text-xl font-semibold mb-4 text-gray-800">Your Information</h3>
                                <p className="text-gray-700"><span className="font-medium">Email:</span> {user?.email}</p>
                            </motion.div>

                            <motion.div 
                                initial={{ y: 20 }}
                                animate={{ y: 0 }}
                                className="text-center pt-6"
                            >
                                <Link to="/final-payment" state={paymentData}>
                                    <motion.button 
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="bg-gradient-to-r from-[#FF640D] to-orange-600 text-white px-8 py-4 rounded-xl font-semibold text-lg md:text-xl hover:shadow-lg transition-all duration-300"
                                    >
                                        Proceed to Payment
                                    </motion.button>
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>
                </motion.div>
            </motion.div>
        </>
        
    );
};

export default Payment;