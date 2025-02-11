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
                className="w-8 h-8 sm:w-12 sm:h-12 text-[#FF640D]" 
                viewBox="0 0 24 24"
              >
                <path 
                  fill="currentColor" 
                  d="M12,0L12,24L11,24L11,0L12,0Z M0,12L24,12L24,11L0,11L0,12Z"
                />
              </svg>
            </motion.div>
            
            <motion.img
              src="https://images.pexels.com/photos/1904105/pexels-photo-1904105.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              alt="Pet Care Professional"
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
            className="zen-dots text-3xl sm:text-4xl md:text-5xl font-bold tracking-wider text-[#0F1413]"
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
              Pawfect started as a small animal welfare initiative in 2025, 
              dedicated to helping stray and abandoned animals find loving homes. 
              Our mission quickly expanded as we recognized the need for a more 
              comprehensive approach to animal welfare.
            </p>
            
            <p className="text-base sm:text-lg leading-relaxed">
              Today, we offer a complete platform for pet adoption, volunteer 
              coordination, and community engagement. We connect animals in need 
              with caring families, support animal welfare through our volunteer 
              network, and provide essential pet care products and services.
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