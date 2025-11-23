import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { BsArrowRight } from "react-icons/bs";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const TrainingPrograms = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true
  });

  const { data: vets = [] } = useQuery({
    queryKey: ['vets'],
    queryFn: async () => {
      const res = await axios.get('https://pawfect-server-beige.vercel.app/vets');
      return res.data;
    }
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="bg-gradient-to-b from-[#0F1413] to-gray-900 text-white py-16 md:py-24">
      <div className="w-11/12 mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl text-[#FF640D] font-bold mb-4 tracking-widest">
            MEET OUR EXPERT VETS
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Our highly qualified veterinarians are here to provide the best care for your beloved pets
          </p>
        </motion.div>

        {/* Vets Grid */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {vets.slice(0, 6).map((vet, index) => (
            <motion.div
              key={vet._id}
              variants={itemVariants}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 group"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={vet.image || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d"}
                  alt={vet.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              </div>
              
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2 text-white">{vet.name}</h3>
                <p className="text-orange-400 font-semibold mb-3">{vet.specialization}</p>
                <div className="space-y-2 text-gray-300">
                  <p className="flex items-center gap-2">
                    <span className="text-orange-400">Experience:</span> {vet.experience} years
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-orange-400">Languages:</span> {vet.languages}
                  </p>
                </div>
                
                <Link
                  to={`/vets/${vet._id}`}
                  className="mt-6 inline-flex items-center gap-2 text-white hover:text-orange-400 transition-colors group"
                >
                  Book Appointment
                  <BsArrowRight className="text-orange-400 transition-transform group-hover:translate-x-2" />
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* View All Button */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-center mt-12"
        >
          <Link
            to="/all-vets"
            className="inline-flex items-center gap-2 px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-full transition-colors text-lg font-semibold"
          >
            View All Vets
            <BsArrowRight className="text-white transition-transform group-hover:translate-x-2" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default TrainingPrograms;
