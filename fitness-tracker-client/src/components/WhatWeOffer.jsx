import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaDumbbell, FaShower } from 'react-icons/fa';
import { GiGymBag } from 'react-icons/gi';
import { IoFastFood } from 'react-icons/io5';  // Changed this import

const WhatWeOffer = () => {
    const [ref, inView] = useInView({
        threshold: 0.2,
        triggerOnce: true
    });

    const features = [
        {
            icon: <GiGymBag className="w-16 h-16" />,
            title: "Expert Trainers",
            description: "Our certified trainers bring years of experience and personalized attention to help you achieve your fitness goals safely and effectively."
        },
        {
            icon: <FaDumbbell className="w-16 h-16" />,
            title: "Modern Equipment",
            description: "Access state-of-the-art fitness equipment and machines, regularly maintained to ensure your workout experience is both safe and effective."
        },
        {
            icon: <FaShower className="w-16 h-16" />,
            title: "Premium Facilities",
            description: "Enjoy clean, modern shower facilities and changing rooms equipped with lockers, making it convenient to fit workouts into your busy schedule."
        },
        {
            icon: <IoFastFood className="w-16 h-16" />,
            title: "Nutrition Guidance",
            description: "Receive expert nutrition advice and personalized meal plans to complement your fitness routine and maximize your results."
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
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    return (
        <div className="bg-white py-12 sm:py-16 md:py-20 w-11/12 mx-auto">
            <div className="container mx-auto px-4 sm:px-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12 sm:mb-16"
                >
                    <motion.h3 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="text-[#FF640D] text-base sm:text-lg font-semibold mb-3 sm:mb-4"
                    >
                        What We Offer
                    </motion.h3>
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="zen-dots text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight"
                    >
                        THE BEST STANDARDS ANYWHERE
                    </motion.h2>
                </motion.div>

                {/* Features Grid */}
                <motion.div
                    ref={ref}
                    variants={containerVariants}
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            className="text-center p-4 sm:p-6 rounded-xl hover:bg-gray-50 transition-all duration-300 hover:shadow-lg"
                        >
                            <motion.div
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                transition={{ type: "spring", stiffness: 300 }}
                                className="inline-block text-[#FF640D] mb-4 sm:mb-6"
                            >
                                {feature.icon}
                            </motion.div>
                            <motion.h3 
                                className="text-lg sm:text-xl font-bold mb-3 sm:mb-4"
                            >
                                {feature.title}
                            </motion.h3>
                            <motion.p 
                                className="text-gray-600 leading-relaxed text-sm sm:text-base"
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