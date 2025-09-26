import React from "react";
import { motion } from "framer-motion";
import { User as UserIcon, Stethoscope, Sparkles, ArrowRight } from "lucide-react";

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
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-20">
        <div className="flex flex-col items-center text-center text-white">
          
          {/* Brand Logo/Name */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8"
          >
            <div className="relative">
              {/* Glowing effect */}
              <div className="absolute inset-0 blur-2xl bg-gradient-to-r from-emerald-400/30 to-teal-400/30 rounded-full" />
              
              {/* Main logo */}
              <h1 className="relative text-6xl md:text-8xl font-bold bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent">
                SwasthaSetu
              </h1>
              
              {/* Subtitle */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex items-center justify-center gap-2 mt-2"
              >
                <Sparkles className="w-4 h-4 text-emerald-300" />
                <span className="text-emerald-200 text-lg font-medium tracking-wider">
                  स्वास्थ्य सेतु
                </span>
                <Sparkles className="w-4 h-4 text-emerald-300" />
              </motion.div>
            </div>
          </motion.div>

          {/* Main Heading */}
          <motion.h2
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold leading-tight mb-6 max-w-4xl"
            style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}
          >
            Your Bridge to{" "}
            <span className="bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">
              Holistic Wellness
            </span>
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
            className="text-xl md:text-2xl text-white/90 max-w-3xl mb-12 leading-relaxed"
            style={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)" }}
          >
            Experience the perfect harmony of ancient Ayurvedic wisdom and modern wellness technology. 
            Your personalized journey to optimal health starts here.
          </motion.p>

          {/* Action Cards */}
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl w-full">
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.6 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={onRegisterUser}
              className="group cursor-pointer relative overflow-hidden rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 p-8 shadow-2xl hover:bg-white/15 transition-all duration-300"
            >
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-2xl bg-emerald-500/20 backdrop-blur-sm">
                    <UserIcon className="h-8 w-8 text-emerald-300" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-2">
                  Start as Patient
                </h3>
                <p className="text-white/80 leading-relaxed">
                  Get personalized wellness plans, track your progress, and connect with expert practitioners.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.8 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={onRegisterDoctor}
              className="group cursor-pointer relative overflow-hidden rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 p-8 shadow-2xl hover:bg-white/15 transition-all duration-300"
            >
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-2xl bg-blue-500/20 backdrop-blur-sm">
                    <Stethoscope className="h-8 w-8 text-blue-300" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-2">
                  Join as Doctor
                </h3>
                <p className="text-white/80 leading-relaxed">
                  Manage patients, create treatment plans, and provide expert guidance through our platform.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Login Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="mt-8"
          >
            <button
              onClick={onLoginUser}
              className="text-white/80 hover:text-white transition-colors duration-300 text-lg font-medium underline underline-offset-4 decoration-emerald-300/50 hover:decoration-emerald-300"
            >
              Already have an account? Sign in
            </button>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
            >
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-1 h-3 bg-white/60 rounded-full mt-2"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
