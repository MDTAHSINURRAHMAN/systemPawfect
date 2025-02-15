import { useEffect, useRef } from "react";
import Slider from "react-slick";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Banner.css";

const Banner = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView();
  const sliderRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const bannerData = [
    {
      title: "FIND YOUR NEW BEST FRIEND",
      subtitle: "ADOPT A PET TODAY",
      image:
        "https://images.pexels.com/photos/16366944/pexels-photo-16366944/free-photo-of-puppy-in-cage.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      buttonText: "Adopt Now",
      path: "/adopt-pet",
      description: "Give a loving home to a pet in need. Start your journey today."
    },
    {
      title: "GIVE A SECOND CHANCE",
      subtitle: "RESCUE A PET IN NEED", 
      image:
        "https://images.pexels.com/photos/20176157/pexels-photo-20176157/free-photo-of-two-puppies-are-looking-through-a-fence.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      buttonText: "Rescue a Pet",
      path: "/all-volunteer",
      description: "Every pet deserves a second chance at happiness. Be their hero."
    },
    {
      title: "HELP US SAVE LIVES",
      subtitle: "SUPPORT ANIMAL RESCUES",
      image:
        "https://images.pexels.com/photos/14096854/pexels-photo-14096854.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      buttonText: "Get Involved",
      path: "/all-volunteer",
      description: "Join our mission to protect and care for animals in need."
    },
  ];

  const settings = {
    dots: false,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 6000,
    fade: true,
    cssEase: "cubic-bezier(0.4, 0, 0.2, 1)",
  };

  const goToPrev = () => {
    sliderRef.current.slickPrev();
  };

  const goToNext = () => {
    sliderRef.current.slickNext();
  };

  return (
    <div className="relative satoshi">
      <Slider ref={sliderRef} {...settings}>
        {bannerData.map((banner, index) => (
          <div key={index} className="relative h-[90vh]">
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105 transition-transform duration-[2s]"
              style={{
                backgroundImage: `url(${banner.image})`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40"></div>
            </div>

            <div className="relative h-full flex items-center">
              <div className="container mx-auto px-4 lg:px-12">
                <motion.div
                  ref={ref}
                  initial="hidden"
                  animate={controls}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: 0.8,
                        ease: "easeOut",
                      },
                    },
                  }}
                  className="max-w-4xl"
                >
                  <h2 className="text-[#FF640D] text-lg md:text-xl font-bold mb-4 tracking-[0.3em] animate-fadeIn">
                    {banner.title}
                  </h2>
                  <h1 className="text-white text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6">
                    {Array.from(banner.subtitle).map((letter, index) => (
                      <motion.span
                        key={index}
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.6,
                          delay: index * 0.05,
                          type: "spring",
                          stiffness: 100,
                        }}
                        className="inline-block"
                      >
                        {letter === " " ? "\u00A0" : letter}
                      </motion.span>
                    ))}
                  </h1>
                  <p className="text-gray-200 text-lg md:text-xl mb-8 max-w-2xl">
                    {banner.description}
                  </p>
                  <motion.button
                    onClick={() => navigate(banner.path)}
                    whileHover={{ scale: 1.05, backgroundColor: "#ff4d00" }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-[#FF640D] text-white px-8 py-4 rounded-lg text-lg font-semibold 
                             shadow-lg hover:shadow-[#FF640D]/30 transition-all duration-300 
                             flex items-center gap-3 group"
                  >
                    {banner.buttonText}
                    <svg
                      className="w-6 h-6 transform group-hover:translate-x-1 transition-transform duration-300"
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

      <div className="absolute bottom-8 right-8 flex items-center gap-4 z-10">
        <button
          className="p-4 rounded-full bg-white/10 backdrop-blur-sm hover:bg-[#FF640D] 
                     transition-all duration-300 group"
          onClick={goToPrev}
        >
          <svg
            className="w-6 h-6 text-white transform group-hover:scale-110 transition-transform duration-300"
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
          className="p-4 rounded-full bg-white/10 backdrop-blur-sm hover:bg-[#FF640D]
                     transition-all duration-300 group"
          onClick={goToNext}
        >
          <svg
            className="w-6 h-6 text-white transform group-hover:scale-110 transition-transform duration-300"
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
