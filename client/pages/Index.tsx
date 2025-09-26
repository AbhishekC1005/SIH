import Hero from "@/components/app/Hero";
import Footer from "@/components/app/Footer";
import Features from "@/components/app/Features";

export default function Index() {
  const bgUrl =
    "https://images.pexels.com/photos/3621234/pexels-photo-3621234.jpeg";
  
  return (
    <div className="min-h-screen w-full">
      {/* Hero Section with Clean Background */}
      <div
        className="min-h-screen w-full bg-cover bg-center bg-no-repeat relative"
        style={{ backgroundImage: `url(${bgUrl})` }}
      >
        {/* Refined overlay for better readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />
        <div className="absolute inset-0 bg-black/20" />
        
        <div className="relative z-10">
          <Hero
            onLoginUser={() => window.location.assign("/login?role=patient")}
            onRegisterUser={() => window.location.assign("/register-user")}
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
