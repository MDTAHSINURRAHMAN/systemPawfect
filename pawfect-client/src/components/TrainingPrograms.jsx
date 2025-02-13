import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { BsArrowRight } from "react-icons/bs";
import { Link } from "react-router-dom";

const TrainingPrograms = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true
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
    <div className="bg-[#0F1413] text-white py-12 sm:py-16 md:py-20">
      <div className="w-11/12 mx-auto px-4 sm:px-6">
        {/* Header */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="zen-dots text-3xl sm:text-4xl md:text-5xl text-[#FF640D] font-bold mb-4">
            MEET OUR BEST PROGRAM
          </h2>
        </motion.div>

        {/* Training Programs Grid */}

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="grid md:grid-cols-2 gap-6 sm:gap-8"
        >
          {/* Group Training */}
          <motion.div
            variants={itemVariants}
            className="relative group overflow-hidden rounded-xl shadow-xl"
          >
            <div className="relative h-[400px] sm:h-[500px] md:h-[600px]">
              <motion.img
                src="https://images.pexels.com/photos/6246671/pexels-photo-6246671.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="Group Training"
                className="w-full h-full object-cover brightness-75 transition-all duration-700 group-hover:scale-105"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.5 }}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent">
                <motion.div 
                  className="absolute bottom-6 sm:bottom-8 left-6 sm:left-8 p-4"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
                    GROUP TRAINING
                  </h3>
                  <p className="mb-4 sm:mb-6 max-w-md text-gray-300 text-sm sm:text-base">
                    Join our energetic group sessions for motivation, community
                    support, and expert guidance.
                  </p>
                  <Link
                    to="/group-training"
                    className="inline-flex items-center gap-2 text-lg font-semibold text-white hover:text-orange-500 transition-colors group"
                  >
                    Learn More{" "}
                    <BsArrowRight className="text-orange-500 transition-transform group-hover:translate-x-2" />
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Personal Training */}
          <motion.div
            variants={itemVariants}
            className="relative group overflow-hidden rounded-xl shadow-xl"
          >
            <div className="relative h-[400px] sm:h-[500px] md:h-[600px]">
              <motion.img
                src="https://images.pexels.com/photos/7991634/pexels-photo-7991634.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1g"
                alt="Personal Training"
                className="w-full h-full object-cover brightness-75 transition-all duration-700 group-hover:scale-105"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.5 }}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent">
                <motion.div 
                  className="absolute bottom-6 sm:bottom-8 left-6 sm:left-8 p-4"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
                    PERSONAL TRAINING
                  </h3>
                  <p className="mb-4 sm:mb-6 max-w-md text-gray-300 text-sm sm:text-base">
                    Get customized workout plans and one-on-one attention from
                    our expert trainers.
                  </p>
                  <Link
                    to="/book-trainer"
                    className="inline-flex items-center gap-2 text-lg font-semibold text-white hover:text-orange-500 transition-colors group"
                  >
                    Book A Demo{" "}
                    <BsArrowRight className="text-orange-500 transition-transform group-hover:translate-x-2" />
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default TrainingPrograms;
