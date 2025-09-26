import React from "react";
import { motion } from "framer-motion";
import { User as UserIcon, Stethoscope, ArrowRight } from "lucide-react";

export const Hero: React.FC<{
  onLoginUser?: () => void;
  onRegisterUser?: () => void;
  onLoginDoctor?: () => void;
  onRegisterDoctor?: () => void;
}> = ({ onLoginUser, onRegisterUser, onLoginDoctor, onRegisterDoctor }) => {

  return (
    <section
      aria-label="Hero"
      className="relative min-h-screen w-full flex items-center"
    >
      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-20">
        <div className="flex flex-col items-center text-center text-white">

          {/* Brand Name - Clean & Minimal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-12"
          >
            <h1 className="text-5xl md:text-7xl font-light text-white mb-2 tracking-tight">
              Swasthsetu
            </h1>
            <p className="text-white/70 text-lg font-light tracking-wide">
              स्वास्थ्य सेतु
            </p>
          </motion.div>

          {/* Main Heading - Google-like Typography */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="text-3xl md:text-5xl font-normal leading-tight mb-6 max-w-4xl text-white/95"
          >
            Your bridge to holistic wellness
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
            className="text-lg md:text-xl text-white/80 max-w-2xl mb-16 leading-relaxed font-light"
          >
            Combining ancient Ayurvedic wisdom with modern technology
            to guide your personalized journey to optimal health.
          </motion.p>

          {/* Action Cards - Clean & Minimal */}
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl w-full">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.6 }}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={onRegisterUser}
              className="group cursor-pointer bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 text-gray-900"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-gray-100 group-hover:bg-gray-200 transition-colors duration-300">
                  <UserIcon className="h-6 w-6 text-gray-700" />
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-300" />
              </div>

              <h3 className="text-xl font-medium text-gray-900 mb-2">
                For Patients
              </h3>
              <p className="text-gray-600 leading-relaxed font-light">
                Personalized wellness plans and expert guidance for your health journey.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.8 }}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={onRegisterDoctor}
              className="group cursor-pointer bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 text-gray-900"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-gray-100 group-hover:bg-gray-200 transition-colors duration-300">
                  <Stethoscope className="h-6 w-6 text-gray-700" />
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-300" />
              </div>

              <h3 className="text-xl font-medium text-gray-900 mb-2">
                For Doctors
              </h3>
              <p className="text-gray-600 leading-relaxed font-light">
                Comprehensive platform for patient management and treatment planning.
              </p>
            </motion.div>
          </div>

          {/* Login Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="mt-12"
          >
            <button
              onClick={onLoginUser}
              className="text-white/70 hover:text-white transition-colors duration-300 text-base font-light"
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
