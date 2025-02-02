import { useEffect, useRef } from 'react';
import Slider from 'react-slick';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './Banner.css';

const Banner = () => {
    const controls = useAnimation();
    const [ref, inView] = useInView();
    const sliderRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (inView) {
            controls.start('visible');
        }
    }, [controls, inView]);

    const bannerData = [
        {
            title: "GIVE YOUR BODY THE BEST FORM",
            subtitle: "SHAPING YOUR MUSCLES",
            image: "https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Replace with your image URL
            buttonText: "Get Started"
        },
        {
            title: "TRANSFORM YOUR BODY",
            subtitle: "ACHIEVE YOUR GOALS",
            image: "https://images.pexels.com/photos/414029/pexels-photo-414029.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Replace with your image URL
            buttonText: "Join Now"
        },
        {
            title: "STRENGTH & CONDITIONING",
            subtitle: "BUILD YOUR POWER",
            image: "https://images.pexels.com/photos/4164459/pexels-photo-4164459.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Replace with your image URL
            buttonText: "Start Training"
        }
    ];

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        fade: true,
        cssEase: 'linear'
    };

    const goToPrev = () => {
        sliderRef.current.slickPrev();
    };

    const goToNext = () => {
        sliderRef.current.slickNext();
    };

    const handleNavigateToClasses = () => {
        navigate('/classes');
    };

    return (
        <div className="relative">
            <Slider ref={sliderRef} {...settings}>
                {bannerData.map((banner, index) => (
                    <div key={index} className="relative h-screen">
                        {/* Background Image */}
                        <div 
                            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                            style={{
                                backgroundImage: `url(${banner.image})`,
                            }}
                        >
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                        </div>

                        {/* Content */}
                        <div className="relative h-full flex items-center">
                            <div className="w-full px-4 sm:px-8 md:px-12 lg:pl-48">
                                <motion.div
                                    ref={ref}
                                    initial="hidden"
                                    animate={controls}
                                    variants={{
                                        hidden: { opacity: 0, y: 20 },
                                        visible: {
                                            opacity: 1,
                                            y: 0,
                                            transition: {
                                                duration: 0.6,
                                                delay: 0.3
                                            }
                                        }
                                    }}
                                    className="max-w-3xl mx-auto lg:mx-0"
                                >
                                    <h2 className="text-white text-sm md:text-2xl lg:text-lg font-medium mb-2 sm:mb-4 tracking-[0.2rem]">
                                        {banner.title}
                                    </h2>
                                    <h1 className="text-white text-2xl sm:text-3xl md:text-5xl tracking-wide font-bold leading-tight my-10">
                                        {Array.from(banner.subtitle).map((letter, index) => (
                                            <motion.span
                                                key={index}
                                                initial={{ opacity: 0, y: -50 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{
                                                    duration: 0.5,
                                                    delay: index * 0.1,
                                                    type: "spring",
                                                    stiffness: 120
                                                }}
                                                className="inline-block"
                                            >
                                                {letter === " " ? "\u00A0" : letter}
                                            </motion.span>
                                        ))}
                                    </h1>
                                    <motion.button
                                        onClick={handleNavigateToClasses}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="bg-[#FF640D] text-white px-6 sm:px-8 py-2 sm:py-3 rounded-sm text-base sm:text-lg font-semibold 
                                                 hover:bg-[#FF640D]/90 transition-colors duration-300 flex items-center gap-2"
                                    >
                                        {banner.buttonText}
                                        <svg 
                                            className="w-4 h-4 sm:w-5 sm:h-5" 
                                            fill="none" 
                                            stroke="currentColor" 
                                            viewBox="0 0 24 24"
                                        >
                                            <path 
                                                strokeLinecap="round" 
                                                strokeLinejoin="round" 
                                                strokeWidth={2} 
                                                d="M17 8l4 4m0 0l-4 4m4-4H3" 
                                            />
                                        </svg>
                                    </motion.button>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                ))}
            </Slider>

            {/* Custom Navigation Arrows */}
            <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 lg:bottom-10 right-4 sm:right-6 md:right-8 lg:right-10 flex items-center gap-2 sm:gap-4">
                <button 
                    className="prev-arrow bg-white/10 hover:bg-[#FF640D] p-2 sm:p-3 rounded-full transition-colors duration-300"
                    onClick={goToPrev}
                >
                    <svg 
                        className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M15 19l-7-7 7-7" 
                        />
                    </svg>
                </button>
                <button 
                    className="next-arrow bg-white/10 hover:bg-[#FF640D] p-2 sm:p-3 rounded-full transition-colors duration-300"
                    onClick={goToNext}
                >
                    <svg 
                        className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M9 5l7 7-7 7" 
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default Banner;