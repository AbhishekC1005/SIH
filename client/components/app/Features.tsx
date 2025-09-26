import React from "react";
import { motion } from "framer-motion";
import {
    Heart,
    Brain,
    Leaf,
    Activity,
    Users,
    Shield,
    Sparkles,
    Target,
    Clock
} from "lucide-react";

const features = [
    {
        icon: Heart,
        title: "Holistic Wellness",
        description: "Combine modern fitness tracking with ancient Ayurvedic wisdom for complete mind-body balance.",
        color: "from-red-500 to-pink-500"
    },
    {
        icon: Brain,
        title: "AI-Powered Insights",
        description: "Get personalized recommendations based on your dosha, lifestyle, and health goals.",
        color: "from-purple-500 to-indigo-500"
    },
    {
        icon: Leaf,
        title: "Ayurvedic Nutrition",
        description: "Discover foods that align with your constitution and seasonal needs for optimal health.",
        color: "from-green-500 to-emerald-500"
    },
    {
        icon: Activity,
        title: "Smart Tracking",
        description: "Monitor your progress with intuitive dashboards and meaningful health metrics.",
        color: "from-blue-500 to-cyan-500"
    },
    {
        icon: Users,
        title: "Expert Guidance",
        description: "Connect with certified Ayurvedic practitioners and wellness coaches for personalized care.",
        color: "from-orange-500 to-yellow-500"
    },
    {
        icon: Shield,
        title: "Privacy First",
        description: "Your health data is encrypted and secure, with complete control over your information.",
        color: "from-gray-600 to-gray-800"
    }
];

const stats = [
    { number: "10K+", label: "Happy Users" },
    { number: "500+", label: "Expert Doctors" },
    { number: "95%", label: "Success Rate" },
    { number: "24/7", label: "Support" }
];

export const Features: React.FC = () => {
    return (
        <section className="py-20 bg-gradient-to-br from-slate-50 to-white">
            <div className="max-w-7xl mx-auto px-6">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-4"
                    >
                        <Sparkles className="w-4 h-4" />
                        Why Choose SwasthaSetu
                    </motion.div>

                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        Your Journey to{" "}
                        <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                            Complete Wellness
                        </span>
                    </h2>

                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Experience the perfect blend of modern technology and ancient wisdom.
                        SwasthaSetu guides you towards optimal health through personalized,
                        science-backed approaches rooted in Ayurvedic principles.
                    </p>
                </motion.div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ y: -5, transition: { duration: 0.2 } }}
                            className="group relative"
                        >
                            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 h-full">
                                {/* Icon */}
                                <div className="relative mb-6">
                                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} p-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                        <feature.icon className="w-full h-full text-white" />
                                    </div>
                                    <div className={`absolute inset-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} opacity-20 blur-xl group-hover:opacity-30 transition-opacity duration-300`} />
                                </div>

                                {/* Content */}
                                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-emerald-700 transition-colors duration-300">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {feature.description}
                                </p>

                                {/* Hover Effect */}
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Stats Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6 }}
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-8 md:p-12 text-white"
                >
                    <div className="text-center mb-8">
                        <h3 className="text-3xl md:text-4xl font-bold mb-4">
                            Trusted by Thousands
                        </h3>
                        <p className="text-emerald-100 text-lg">
                            Join our growing community of wellness enthusiasts
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="text-center"
                            >
                                <div className="text-3xl md:text-4xl font-bold mb-2">
                                    {stat.number}
                                </div>
                                <div className="text-emerald-100 font-medium">
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* CTA Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mt-20"
                >
                    <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                        Ready to Transform Your Health?
                    </h3>
                    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                        Start your personalized wellness journey today with SwasthaSetu's
                        comprehensive approach to mind-body balance.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => window.location.assign("/register-user")}
                            className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            Start Your Journey
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => window.location.assign("/login")}
                            className="px-8 py-4 border-2 border-emerald-600 text-emerald-600 font-semibold rounded-full hover:bg-emerald-50 transition-all duration-300"
                        >
                            Sign In
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Features;