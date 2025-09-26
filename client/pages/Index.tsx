import Hero from "@/components/app/Hero";
import NavBar from "@/components/app/NavBar";
import Footer from "@/components/app/Footer";
import Features from "@/components/app/Features";
import { motion } from "framer-motion";

export default function Index() {
  const bgUrl =
    "https://images.pexels.com/photos/3621234/pexels-photo-3621234.jpeg";
  
  return (
    <div className="min-h-screen w-full">
      {/* Hero Section with Background */}
      <div
        className="min-h-screen w-full bg-fixed bg-cover bg-center text-white relative"
        style={{ backgroundImage: `url(${bgUrl})` }}
      >
        {/* Enhanced gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        <div className="relative z-10">
          <NavBar
            onGetStarted={() => window.location.assign("/login")}
            onSignIn={() => window.location.assign("/login")}
          />

          <Hero
            onLoginUser={() => window.location.assign("/login?role=patient")}
            onRegisterUser={() => window.location.assign("/register-user")}
            onLoginDoctor={() => window.location.assign("/login?role=doctor")}
            onRegisterDoctor={() => window.location.assign("/register-doctor")}
          />
        </div>
      </div>

      {/* Features Section */}
      <Features />

      {/* Footer */}
      <Footer />
    </div>
  );
}
