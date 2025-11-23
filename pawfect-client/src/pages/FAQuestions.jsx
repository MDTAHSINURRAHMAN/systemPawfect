import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import { useState } from "react";

const FAQuestions = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const { data: faqs = [] } = useQuery({
    queryKey: ["faqs"],
    queryFn: async () => {
      const res = await axios.get("https://pawfect-server-beige.vercel.app/faqs");
      return res.data;
    },
  });

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-600">
            Find answers to common questions about Pawfect's pet services
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="border border-orange-200 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full p-4 text-left bg-white hover:bg-orange-50 transition-colors duration-200 flex justify-between items-center"
              >
                <span className="text-lg font-medium text-gray-900">
                  {faq.question}
                </span>
                <span
                  className={`transform transition-transform duration-200 ${
                    activeIndex === index ? "rotate-180" : ""
                  }`}
                >
                  <i className="fas fa-chevron-down text-orange-500"></i>
                </span>
              </button>
              
              <div
                className={`transition-all duration-300 ease-in-out ${
                  activeIndex === index
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0"
                } overflow-hidden`}
              >
                <div className="p-4 bg-orange-50 text-gray-700">
                  {faq.answer}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p id="contact-us" className="text-gray-600">
            Can't find what you're looking for?{" "}
            <a
              href=""
              className="text-orange-500 hover:text-orange-600 font-medium"
            >
              Contact our support team
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FAQuestions;
