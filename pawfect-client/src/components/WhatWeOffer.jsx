import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaDog, FaHeart, FaHome, FaUserMd } from 'react-icons/fa';

const WhatWeOffer = () => {
    const [ref, inView] = useInView({
        threshold: 0.2,
        triggerOnce: true
    });

    const features = [
        {
            icon: <FaUserMd className="w-16 h-16" />,
            title: "Expert Veterinarians",
            description: "Our certified veterinarians provide comprehensive care with years of experience in treating all kinds of pets with love and expertise."
        },
        {
            icon: <FaHeart className="w-16 h-16" />,
            title: "Loving Care",
            description: "We treat every pet like family, providing personalized attention and ensuring they feel comfortable and safe throughout their stay."
        },
        {
            icon: <FaHome className="w-16 h-16" />,
            title: "Modern Facilities",
            description: "State-of-the-art pet care facilities with spacious areas, climate control, and the latest medical equipment for optimal care."
        },
        {
            icon: <FaDog className="w-16 h-16" />,
            title: "Pet Training",
            description: "Professional training programs to help your pets develop good behavior and social skills in a positive learning environment."
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: {
            opacity: 0,
            y: 20,
            scale: 0.95
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.8,
                ease: "easeOut"
            }
        }
    };

    return (
        <div className="bg-gradient-to-b from-white to-orange-50 py-16 sm:py-20 md:py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16 sm:mb-20"
                >
                    <motion.h3 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="text-orange-600 text-lg sm:text-xl font-semibold mb-4"
                    >
                        Our Services
                    </motion.h3>
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-gray-900"
                    >
                        Exceptional Pet Care Services
                    </motion.h2>
                </motion.div>

                {/* Features Grid */}
                <motion.div
                    ref={ref}
                    variants={containerVariants}
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10"
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            className="bg-white rounded-2xl p-6 sm:p-8 text-center transform hover:-translate-y-2 transition-all duration-300 hover:shadow-xl border border-orange-100"
                        >
                            <motion.div
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                transition={{ type: "spring", stiffness: 300 }}
                                className="inline-block text-orange-500 mb-6"
                            >
                                {feature.icon}
                            </motion.div>
                            <motion.h3 
                                className="text-xl sm:text-2xl font-bold mb-4 text-gray-900"
                            >
                                {feature.title}
                            </motion.h3>
                            <motion.p 
                                className="text-gray-600 leading-relaxed"
                            >
                                {feature.description}
                            </motion.p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default WhatWeOffer;