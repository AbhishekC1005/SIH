import Hero from "@/components/app/Hero";
import NavBar from "@/components/app/NavBar";
import Footer from "@/components/app/Footer";
import Features from "@/components/app/Features";

export default function Index() {
  const bgUrl =
    "https://images.pexels.com/photos/3621234/pexels-photo-3621234.jpeg";
  
  return (
    <div className="min-h-screen w-full">
      {/* Hero Section with Static Background */}
      <div
        className="min-h-screen w-full bg-cover bg-center bg-no-repeat relative"
        style={{ backgroundImage: `url(${bgUrl})` }}
      >
        {/* Clean overlay for readability */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
        
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
