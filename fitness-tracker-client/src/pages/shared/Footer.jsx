import React from "react";
import logo from '../../assets/Logo/logo.png'
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-[#0F1413] via-[#1F2937] to-[#111827] py-10 md:py-20 relative overflow-hidden">
      <motion.h1 
        className="edu-font text-center text-[#FF640D] text-4xl md:text-6xl lg:text-8xl font-bold px-4 leading-[4rem] relative"
      >
        {Array.from("Stronger EveryDay").map((letter, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, y: -50 }}
            whileInView={{ opacity: 1, y: 0 }}
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
      </motion.h1>

      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="w-11/12 mx-auto pt-10 md:pt-20 relative"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4 items-center">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex justify-center md:justify-start"
          >
            <img className="w-[150px] md:w-[200px] bg-white/90 rounded-full hover:shadow-lg hover:shadow-orange-500/20 transition-all duration-300" src={logo} alt="logo" />
          </motion.div>

          <motion.nav 
            initial={{ x: -50 }}
            whileInView={{ x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center md:text-left hover:translate-y-[-5px] transition-all duration-300"
          >
            <h6 className="zen-dots text-white text-2xl md:text-3xl tracking-[0.1rem] mb-3 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-[2px] after:bg-[#FF640D]">Call us</h6>
            <motion.p whileHover={{ x: 5 }} className="link link-hover text-gray-400 text-sm md:text-base tracking-[0.1rem] hover:text-[#FF640D] transition-colors">+1 345 678 9900</motion.p>
            <motion.p whileHover={{ x: 5 }} className="link link-hover text-gray-400 text-sm md:text-base tracking-[0.1rem] hover:text-[#FF640D] transition-colors">+1 345 678 9900</motion.p>
          </motion.nav>

          <motion.nav 
            initial={{ x: -50 }}
            whileInView={{ x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-center md:text-left hover:translate-y-[-5px] transition-all duration-300"
          >
            <h6 className="zen-dots text-white text-2xl md:text-3xl tracking-[0.1rem] mb-3 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-[2px] after:bg-[#FF640D]">we are open</h6>
            <motion.p whileHover={{ x: 5 }} className="link link-hover text-gray-400 text-sm md:text-base tracking-[0.1rem] hover:text-[#FF640D] transition-colors">Mon - Fri: 05:00 AM - 10:00 PM</motion.p>
            <motion.p whileHover={{ x: 5 }} className="link link-hover text-gray-400 text-sm md:text-base tracking-[0.1rem] hover:text-[#FF640D] transition-colors">Sat - Sun: 05:00 AM - 01:00 PM</motion.p>
          </motion.nav>

          <motion.nav 
            initial={{ x: -50 }}
            whileInView={{ x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center md:text-left hover:translate-y-[-5px] transition-all duration-300"
          >
            <h6 className="zen-dots text-white text-2xl md:text-3xl tracking-[0.1rem] mb-3 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-[2px] after:bg-[#FF640D]">we are here</h6>
            <motion.p whileHover={{ x: 5 }} className="link link-hover text-gray-400 text-sm md:text-base tracking-[0.1rem] hover:text-[#FF640D] transition-colors">27 West 24th St New Your,</motion.p>
            <motion.p whileHover={{ x: 5 }} className="link link-hover text-gray-400 text-sm md:text-base tracking-[0.1rem] hover:text-[#FF640D] transition-colors">NY 10010</motion.p>
          </motion.nav>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;
