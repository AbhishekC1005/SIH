import React from "react";
import { motion } from "framer-motion";

// Updated Hero Component - v2.0

export const Hero: React.FC<{
  onLoginUser?: () => void;
  onRegisterUser?: () => void;
  onRegisterDoctor?: () => void;
}> = ({ onLoginUser, onRegisterUser, onRegisterDoctor }) => {

  return (
    <section
      key="hero-v2"
      aria-label="Hero"
      className="relative min-h-screen w-full flex items-end"
    >
      {/* Content positioned at bottom-left */}
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 pb-16 lg:pb-24">
        <div className="max-w-2xl">

          {/* Brand Name - With striking Marathi background effect */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mb-8 relative"
          >
            {/* Marathi text - Large background with stroke effect */}
            <motion.div
              initial={{ opacity: 0, scale: 1.2, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
              className="absolute -inset-8 flex items-center justify-center overflow-hidden"
            >
              <div
                className="font-serif text-7xl lg:text-8xl font-light select-none pointer-events-none transform -rotate-3"
                style={{
                  WebkitTextStroke: '1px rgba(255, 255, 255, 0.15)',
                  color: 'transparent',
                  textShadow: '0 0 30px rgba(255, 255, 255, 0.1)'
                }}
              >
                स्वास्थ्य सेतु
              </div>
            </motion.div>

            {/* Marathi text - Glowing effect layer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
              className="absolute -inset-8 flex items-center justify-center overflow-hidden"
            >
              <motion.div
                animate={{
                  opacity: [0.1, 0.3, 0.1],
                  scale: [1, 1.02, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="font-serif text-7xl lg:text-8xl font-light select-none pointer-events-none transform -rotate-3 text-white/20 blur-sm"
              >
                स्वास्थ्य सेतु
              </motion.div>
            </motion.div>

            {/* Marathi text - Animated particles effect */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2, delay: 0.8, ease: "easeOut" }}
              className="absolute -inset-8 flex items-center justify-center overflow-hidden"
            >
              <motion.div
                animate={{
                  backgroundPosition: ["0% 0%", "100% 100%"],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="font-serif text-7xl lg:text-8xl font-light select-none pointer-events-none transform -rotate-3"
                style={{
                  background: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%)',
                  backgroundSize: '200% 200%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                स्वास्थ्य सेतु
              </motion.div>
            </motion.div>

            {/* Main brand name with enhanced styling */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
              className="relative z-10 font-serif text-6xl lg:text-8xl font-light leading-tight"
              style={{
                color: 'white',
                textShadow: '0 2px 20px rgba(0, 0, 0, 0.5), 0 0 40px rgba(255, 255, 255, 0.1)'
              }}
            >
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
                className="inline-block"
              >
                Swasthsetu
              </motion.span>
            </motion.h1>

            {/* Enhanced accent elements */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 1, ease: "easeOut" }}
              className="relative z-10 mt-6 flex items-center space-x-4"
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "60px" }}
                transition={{ duration: 1, delay: 1.2, ease: "easeOut" }}
                className="h-px bg-gradient-to-r from-white/60 to-transparent"
              />
              <motion.div
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-2 h-2 bg-white/60 rounded-full"
              />
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "40px" }}
                transition={{ duration: 1, delay: 1.4, ease: "easeOut" }}
                className="h-px bg-gradient-to-r from-white/40 to-transparent"
              />
            </motion.div>
          </motion.div>

          {/* Main Message - Clean sans-serif */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="text-xl lg:text-2xl text-white/90 mb-12 font-sans font-light leading-relaxed"
          >
            Your bridge to holistic wellness through ancient Ayurvedic wisdom
          </motion.p>

          {/* Action Buttons - Clean minimal design */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
            className="space-y-4 mb-8"
          >
            {/* Patient Button - Clean white design */}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
              whileHover={{ x: 8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onRegisterUser}
              className="group w-full sm:w-auto flex items-center justify-between bg-white/90 backdrop-blur-sm hover:bg-white text-gray-900 px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/30"
            >
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
                <div className="text-left">
                  <div className="font-sans font-medium text-lg">Get Started</div>
                  <div className="font-sans text-sm text-gray-600">Begin your wellness journey</div>
                </div>
              </div>
              <div className="text-gray-400 group-hover:text-gray-600 transition-colors duration-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </motion.button>

            {/* Doctor Button - Subtle glass design */}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
              whileHover={{ x: 8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onRegisterDoctor}
              className="group w-full sm:w-auto flex items-center justify-between bg-white/10 backdrop-blur-md hover:bg-white/20 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20"
            >
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-white/80 rounded-full"></div>
                <div className="text-left">
                  <div className="font-sans font-medium text-lg">Join as Doctor</div>
                  <div className="font-sans text-sm text-white/70">Share your expertise</div>
                </div>
              </div>
              <div className="text-white/60 group-hover:text-white/90 transition-colors duration-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </motion.button>
          </motion.div>

          {/* Login Link - Subtle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
          >
            <button
              onClick={onLoginUser}
              className="text-white/60 hover:text-white/90 transition-colors duration-300 text-sm font-sans font-light"
            >
              Already have an account? <span className="underline underline-offset-4">Sign in</span>
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
