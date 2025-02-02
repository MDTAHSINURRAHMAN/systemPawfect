import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const About = () => {
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true
  });

  return (
    <section ref={ref} className="w-11/12 mx-auto px-4 py-12 sm:py-16 md:py-20">
      <div className="flex flex-col lg:flex-row gap-8 md:gap-12">
        {/* Left Column with Image */}
        <motion.div 
          className="lg:w-1/2"
          initial={{ opacity: 0, x: -50 }}
          animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="relative overflow-hidden rounded-2xl shadow-xl">
            {/* Decorative Element */}
            <motion.div 
              className="absolute -top-6 -left-6 z-10"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <svg 
                className="w-8 h-8 sm:w-12 sm:h-12 text-black" 
                viewBox="0 0 24 24"
              >
                <path 
                  fill="currentColor" 
                  d="M12,0L12,24L11,24L11,0L12,0Z M0,12L24,12L24,11L0,11L0,12Z"
                />
              </svg>
            </motion.div>
            
            <motion.img
              src="https://images.unsplash.com/photo-1649789261044-0c6a9fb528ff?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Fitness Professional"
              className="w-full h-[300px] sm:h-[400px] md:h-[500px] object-cover hover:scale-105 transition-transform duration-700"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </motion.div>

        {/* Right Column with Content */}
        <motion.div 
          className="lg:w-1/2 flex flex-col justify-center space-y-6 md:space-y-8"
          initial={{ opacity: 0, x: 50 }}
          animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        >
          <motion.h1 
            className="zen-dots text-3xl sm:text-4xl md:text-5xl font-bold tracking-wider"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            ABOUT US
          </motion.h1>
          
          <motion.div 
            className="space-y-4 sm:space-y-6 text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <p className="text-base sm:text-lg leading-relaxed">
              FitTrack started as a small fitness tracking solution in 2023, 
              aiming to help fitness enthusiasts track and improve their workout 
              journey. It soon became obvious that we needed to expand our 
              services beyond just basic tracking.
            </p>
            
            <p className="text-base sm:text-lg leading-relaxed">
              Currently, we offer comprehensive fitness tracking, personalized 
              workout plans, and nutrition guidance to help our users achieve 
              their fitness goals seamlessly and effectively. We value our users 
              above everything else, ensuring that we provide the best possible 
              fitness experience.
            </p>
          </motion.div>

          {/* Social Media Links */}
          <motion.div 
            className="flex gap-4 sm:gap-6 mt-8 sm:mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {/* Social Icons with hover animations */}
            <motion.a 
              href="#" 
              className="text-black hover:text-[#FF640D] transform hover:scale-110 transition-all duration-300"
              whileHover={{ scale: 1.2, rotate: 5 }}
            >
              <svg className="w-6 h-6" fill="#FF640D" viewBox="0 0 24 24">
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
              </svg>
            </motion.a>
            <motion.a 
              href="#" 
              className="text-black hover:text-[#FF640D] transform hover:scale-110 transition-all duration-300"
              whileHover={{ scale: 1.2, rotate: -5 }}
            >
              <svg className="w-6 h-6" fill="#FF640D" viewBox="0 0 24 24">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </motion.a>
            <motion.a 
              href="#" 
              className="text-black hover:text-[#FF640D] transform hover:scale-110 transition-all duration-300"
              whileHover={{ scale: 1.2, rotate: 5 }}
            >
              <svg className="w-6 h-6" fill="#FF640D" viewBox="0 0 24 24">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z M2 9h4v12H2z M4 2a2 2 0 1 1-2 2 2 2 0 0 1 2-2z"/>
              </svg>
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;