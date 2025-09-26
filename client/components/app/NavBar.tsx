import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Menu } from "lucide-react";

export const NavBar: React.FC<{
  onGetStarted?: () => void;
  onSignIn?: () => void;
}> = ({ onGetStarted, onSignIn }) => {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="absolute top-0 left-0 right-0 z-50 w-full"
    >
      <nav className="mx-auto max-w-7xl px-6 py-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-center gap-3"
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="absolute inset-0 w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 opacity-30 blur-lg" />
            </div>
            <div className="text-white">
              <h1 className="text-xl font-bold">SwasthaSetu</h1>
              <p className="text-xs text-white/70 -mt-1">स्वास्थ्य सेतु</p>
            </div>
          </motion.div>

          {/* Navigation Links - Hidden on mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden md:flex items-center gap-8"
          >
            <a href="#features" className="text-white/80 hover:text-white transition-colors duration-300 font-medium">
              Features
            </a>
            <a href="#about" className="text-white/80 hover:text-white transition-colors duration-300 font-medium">
              About
            </a>
            <a href="#contact" className="text-white/80 hover:text-white transition-colors duration-300 font-medium">
              Contact
            </a>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center gap-4"
          >
            <button
              onClick={onSignIn}
              className="hidden sm:block text-white/80 hover:text-white transition-colors duration-300 font-medium"
            >
              Sign In
            </button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onGetStarted}
              className="px-6 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 text-white font-medium rounded-full hover:bg-white/20 transition-all duration-300 shadow-lg"
            >
              Get Started
            </motion.button>

            {/* Mobile menu button */}
            <button className="md:hidden p-2 text-white/80 hover:text-white transition-colors duration-300">
              <Menu className="w-6 h-6" />
            </button>
          </motion.div>
        </div>
      </nav>
    </motion.header>
  );
};

export default NavBar;
