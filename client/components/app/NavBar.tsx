import React from "react";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";

export const NavBar: React.FC<{
  onGetStarted?: () => void;
  onSignIn?: () => void;
}> = ({ onGetStarted, onSignIn }) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="absolute top-0 left-0 right-0 z-50 w-full"
    >
      <nav className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex items-center justify-between">
          {/* Logo - Clean & Minimal */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-white"
          >
            <h1 className="text-2xl font-light tracking-tight">Swasthsetu</h1>
          </motion.div>

          {/* Navigation Links - Clean */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden md:flex items-center gap-8"
          >
            <a href="#features" className="text-white/80 hover:text-white transition-colors duration-300 font-light text-sm">
              Features
            </a>
            <a href="#about" className="text-white/80 hover:text-white transition-colors duration-300 font-light text-sm">
              About
            </a>
            <a href="#contact" className="text-white/80 hover:text-white transition-colors duration-300 font-light text-sm">
              Contact
            </a>
          </motion.div>

          {/* Action Buttons - Minimal */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center gap-6"
          >
            <button
              onClick={onSignIn}
              className="hidden sm:block text-white/80 hover:text-white transition-colors duration-300 font-light text-sm"
            >
              Sign in
            </button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onGetStarted}
              className="px-6 py-2 bg-white/90 text-gray-900 font-normal text-sm rounded-full hover:bg-white transition-all duration-300 shadow-sm"
            >
              Get started
            </motion.button>

            {/* Mobile menu button */}
            <button className="md:hidden p-2 text-white/80 hover:text-white transition-colors duration-300">
              <Menu className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </nav>
    </motion.header>
  );
};

export default NavBar;
