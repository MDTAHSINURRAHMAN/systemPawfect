import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const PaymentSuccess = () => {
  return (
    <>
      <Helmet>
        <title>Pawfect | Payment Success</title>
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-28">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl p-8 md:p-12"
          >
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-24 h-24 mx-auto mb-8 bg-green-100 rounded-full flex items-center justify-center"
            >
              <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>

            {/* Success Message */}
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-bold text-center mb-6 bg-gradient-to-r from-black to-orange-500 bg-clip-text text-transparent"
            >
              Payment Successful!
            </motion.h1>

            {/* Thank You Message */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-center mb-12 space-y-4"
            >
              <p className="text-xl text-gray-700">
                Thank you for choosing Pawfect for your pet's training needs!
              </p>
              <p className="text-gray-600">
                "A well-trained pet is a happy pet. Your furry friend will thank you for this investment!"
              </p>
            </motion.div>

            {/* What's Next Section */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-blue-50 rounded-2xl p-6 mb-8"
            >
              <h2 className="text-2xl font-semibold text-black mb-4">What's Next?</h2>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-black rounded-full mr-3"></span>
                  Check your email for booking confirmation
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-black rounded-full mr-3"></span>
                  Your volunteer will contact you within 24 hours
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-black rounded-full mr-3"></span>
                  Get ready for your pet's first training session!
                </li>
              </ul>
            </motion.div>

            {/* Return Home Button */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-center"
            >
              <Link
                to="/"
                className="inline-block px-8 py-3 bg-black text-white rounded-full hover:bg-orange-600 transition duration-300"
              >
                Return Home
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default PaymentSuccess;
