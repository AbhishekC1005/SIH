import React from "react";
import { motion } from "framer-motion";
import { 
  Heart, 
  Brain, 
  Leaf, 
  Activity, 
  Users, 
  Shield
} from "lucide-react";

const features = [
  {
    icon: Heart,
    title: "Holistic Wellness",
    description: "Combine modern fitness tracking with ancient Ayurvedic wisdom for complete mind-body balance."
  },
  {
    icon: Brain,
    title: "AI-Powered Insights",
    description: "Get personalized recommendations based on your dosha, lifestyle, and health goals."
  },
  {
    icon: Leaf,
    title: "Ayurvedic Nutrition",
    description: "Discover foods that align with your constitution and seasonal needs for optimal health."
  },
  {
    icon: Activity,
    title: "Smart Tracking",
    description: "Monitor your progress with intuitive dashboards and meaningful health metrics."
  },
  {
    icon: Users,
    title: "Expert Guidance",
    description: "Connect with certified Ayurvedic practitioners and wellness coaches for personalized care."
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "Your health data is encrypted and secure, with complete control over your information."
  }
];

export const Features: React.FC = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6 tracking-tight">
            Built for your wellness journey
          </h2>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed font-light">
            Experience the perfect blend of modern technology and ancient wisdom 
            through our comprehensive wellness platform.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="group"
            >
              <div className="text-center">
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 group-hover:bg-gray-200 transition-colors duration-300 mb-6">
                  <feature.icon className="w-7 h-7 text-gray-700" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-medium text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed font-light">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="text-center mt-24"
        >
          <h3 className="text-3xl md:text-4xl font-light text-gray-900 mb-6 tracking-tight">
            Ready to get started?
          </h3>
          <p className="text-lg text-gray-600 mb-12 max-w-xl mx-auto font-light">
            Join thousands of users who have transformed their health 
            with our personalized wellness approach.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.location.assign("/register-user")}
              className="px-8 py-3 bg-gray-900 text-white font-normal rounded-full hover:bg-gray-800 transition-all duration-300"
            >
              Get started
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.location.assign("/login")}
              className="px-8 py-3 border border-gray-300 text-gray-700 font-normal rounded-full hover:border-gray-400 hover:bg-gray-50 transition-all duration-300"
            >
              Sign in
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;