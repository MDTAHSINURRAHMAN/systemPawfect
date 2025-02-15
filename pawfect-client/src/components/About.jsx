import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const About = () => {
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true
  });

  return (
    <section ref={ref} className="bg-gradient-to-b from-white to-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left Column with Image */}
          <motion.div 
            className="lg:w-1/2"
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="relative">
              {/* Decorative Elements */}
              <div className="absolute -top-8 -left-8 w-40 h-40 bg-orange-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
              <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
              
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <motion.img
                  src="https://images.pexels.com/photos/6235106/pexels-photo-6235106.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                  alt="Pet Care Professional"
                  className="w-full h-[500px] object-cover"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.7 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </div>
          </motion.div>

          {/* Right Column with Content */}
          <motion.div 
            className="lg:w-1/2 space-y-8"
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            <div className="space-y-4">
              <motion.h2 
                className="text-sm font-semibold text-orange-600 tracking-widest uppercase"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6 }}
              >
                Our Story
              </motion.h2>
              <motion.h1 
                className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Making Pet Care <br/>
                <span className="text-orange-500">Extraordinary</span>
              </motion.h1>
            </div>

            <motion.div 
              className="space-y-6 text-lg text-gray-600"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <p className="leading-relaxed">
                Pawfect emerged in 2025 as a passionate initiative for animal welfare, 
                focusing on providing homes for stray and abandoned animals. What began 
                as a small mission has blossomed into a comprehensive platform for pet care excellence.
              </p>
              
              <p className="leading-relaxed">
                Today, we're proud to be a complete ecosystem connecting pets, families, 
                and caregivers. Our platform facilitates adoptions, coordinates volunteers, 
                and provides premium pet care services - all while building a community of 
                animal lovers.
              </p>
            </motion.div>

            {/* Social Links */}
            <motion.div 
              className="flex gap-6 pt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {['Facebook', 'Twitter', 'Instagram'].map((platform, index) => (
                <motion.a
                  key={platform}
                  href="#"
                  className="px-6 py-3 rounded-full text-sm font-semibold bg-gray-100 text-gray-700 hover:bg-orange-500 hover:text-white transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {platform}
                </motion.a>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;