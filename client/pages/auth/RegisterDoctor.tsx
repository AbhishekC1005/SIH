import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useAppState } from "@/context/app-state";
import { CheckCircle2, Loader2, Stethoscope, Award, MapPin } from "lucide-react";

// —— Clean Google-style UI Components ——
const Card = ({ children, className = "" }) => (
  <div className={`rounded-xl bg-white shadow-sm border border-gray-100 ${className}`}>
    {children}
  </div>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`p-8 lg:p-12 ${className}`}>
    {children}
  </div>
);

const Button = ({ children, className = "", variant = "primary", ...props }) => {
  const baseClasses = "px-6 py-3 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm";
  const variants = {
    primary: "bg-gray-900 text-white hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400",
    ghost: "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
    success: "bg-green-600 text-white hover:bg-green-700 hover:shadow-lg hover:-translate-y-0.5"
  };
  
  return (
    <motion.button
      whileHover={{ scale: props.disabled ? 1 : 1.02 }}
      whileTap={{ scale: props.disabled ? 1 : 0.98 }}
      className={`${baseClasses} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

const Input = ({ className = "", ...props }) => (
  <motion.input
    whileFocus={{ scale: 1.01 }}
    className={`w-full px-4 py-3 rounded-md border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-300 text-sm ${className}`}
    {...props}
  />
);

const Label = ({ children, className = "", ...props }) => (
  <label className={`block text-sm font-medium text-gray-700 mb-2 ${className}`} {...props}>
    {children}
  </label>
);

const Select = ({ children, value, onValueChange, className = "" }) => (
  <select
    value={value}
    onChange={(e) => onValueChange(e.target.value)}
    className={`w-full px-4 py-3 rounded-md border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-300 text-sm ${className}`}
  >
    {children}
  </select>
);

// —— Animation Variants ——
const fieldVariants = {
  initial: { opacity: 0, y: 10 },
  enter: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4 }
  })
};

export default function RegisterDoctor() {
  const { setCurrentUser, setDoctorProfile } = useAppState();

  const [name, setName] = useState("");
  const [age, setAge] = useState<string>("");
  const [gender, setGender] = useState<"Male" | "Female" | "Other" | "">("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [hospital, setHospital] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [location, setLocation] = useState("");
  const [licenseNo, setLicenseNo] = useState("");
  const [bio, setBio] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);

  const canVerify = useMemo(() => licenseNo.trim().length >= 6, [licenseNo]);
  const canSubmit = useMemo(
    () => !!name && !!email && !!hospital && !!licenseNo && verified,
    [name, email, hospital, licenseNo, verified],
  );

  const onVerify = () => {
    setError(null);
    if (!canVerify) {
      setError("Please enter a valid license number (min 6 characters)");
      return;
    }
    setVerifying(true);
    // Simulate async verification
    setTimeout(() => {
      const ok = /^[A-Za-z0-9-]{6,}$/.test(licenseNo.trim());
      setVerified(ok);
      setVerifying(false);
      if (!ok)
        setError(
          "License verification failed. Check the number and try again.",
        );
    }, 1200);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!canSubmit) {
      setError("Please complete the form and verify your license.");
      return;
    }
    const doctorId = `d_${Date.now()}`;
    const user = {
      id: doctorId,
      name: `Dr. ${name}`,
      email,
      role: "doctor" as const,
    };
    const doctorProfile = {
      id: doctorId,
      name,
      age: age ? Number(age) : null,
      gender: gender || null,
      licenseNo,
      hospital,
      specialty,
      phone,
      email,
      address: location,
      bio,
    };
    
    // Save to localStorage immediately before redirect
    localStorage.setItem("app:currentUser", JSON.stringify(user));
    localStorage.setItem(`app:doctorProfile:${doctorId}`, JSON.stringify(doctorProfile));
    localStorage.setItem(`app:doctor-map:${doctorId}`, doctorId);
    
    setCurrentUser(user);
    setDoctorProfile(doctorProfile);
    
    // Small delay to ensure localStorage is written before redirect
    setTimeout(() => {
      window.location.assign("/doctor");
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="flex min-h-screen">
        {/* Left Column - Professional Illustration */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-gray-100 to-gray-50 items-center justify-center p-12"
        >
          <div className="max-w-sm text-center">
            {/* Professional medical icons */}
            <div className="mb-8 flex justify-center space-x-4">
              <div className="p-4 bg-white rounded-full shadow-sm">
                <Stethoscope className="h-8 w-8 text-gray-700" />
              </div>
              <div className="p-4 bg-white rounded-full shadow-sm">
                <Award className="h-8 w-8 text-gray-600" />
              </div>
              <div className="p-4 bg-white rounded-full shadow-sm">
                <MapPin className="h-8 w-8 text-gray-500" />
              </div>
            </div>
            
            <h2 className="text-2xl font-light text-gray-800 mb-4">
              Join as a Healthcare Provider
            </h2>
            <p className="text-gray-600 leading-relaxed text-sm mb-6">
              Create your professional profile to connect with patients and 
              provide expert Ayurvedic care through our platform.
            </p>
            <div className="space-y-2 text-xs text-gray-500">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                <span>Verified medical license required</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                <span>Connect with patients seeking Ayurvedic care</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                <span>Professional practice management tools</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column - Registration Form */}
        <div className="w-full lg:w-3/5 flex items-center justify-center p-6 lg:p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full max-w-2xl"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-light text-gray-900 mb-2">
                Create doctor account
              </h1>
              <p className="text-gray-600 text-sm">
                Join our network of healthcare professionals
              </p>
            </div>

            <Card>
              <CardContent>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
                  >
                    <p className="text-sm text-red-700">{error}</p>
                  </motion.div>
                )}

                <form onSubmit={onSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="space-y-6">
                    <div className="border-b border-gray-100 pb-4">
                      <h3 className="text-base font-medium text-gray-900 mb-4">Personal Information</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <motion.div
                        variants={fieldVariants}
                        initial="initial"
                        animate="enter"
                        custom={0}
                        className="space-y-2"
                      >
                        <Label>Full name</Label>
                        <Input
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Dr. A. B. Sharma"
                          required
                        />
                      </motion.div>

                      <motion.div
                        variants={fieldVariants}
                        initial="initial"
                        animate="enter"
                        custom={1}
                        className="space-y-2"
                      >
                        <Label>Age</Label>
                        <Input
                          type="number"
                          min={0}
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                          placeholder="35"
                        />
                      </motion.div>

                      <motion.div
                        variants={fieldVariants}
                        initial="initial"
                        animate="enter"
                        custom={2}
                        className="space-y-2"
                      >
                        <Label>Gender</Label>
                        <Select
                          value={gender}
                          onValueChange={(v: any) => setGender(v)}
                        >
                          <option value="">Select gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </Select>
                      </motion.div>

                      <motion.div
                        variants={fieldVariants}
                        initial="initial"
                        animate="enter"
                        custom={3}
                        className="space-y-2"
                      >
                        <Label>Phone number</Label>
                        <Input
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                        />
                      </motion.div>
                    </div>

                    <motion.div
                      variants={fieldVariants}
                      initial="initial"
                      animate="enter"
                      custom={4}
                      className="space-y-2"
                    >
                      <Label>Email address</Label>
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@hospital.org"
                        required
                      />
                    </motion.div>
                  </div>

                  {/* Professional Information */}
                  <div className="space-y-6">
                    <div className="border-b border-gray-100 pb-4">
                      <h3 className="text-base font-medium text-gray-900 mb-4">Professional Information</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <motion.div
                        variants={fieldVariants}
                        initial="initial"
                        animate="enter"
                        custom={5}
                        className="space-y-2"
                      >
                        <Label>Hospital/Clinic</Label>
                        <Input
                          value={hospital}
                          onChange={(e) => setHospital(e.target.value)}
                          placeholder="City Care Hospital"
                          required
                        />
                      </motion.div>

                      <motion.div
                        variants={fieldVariants}
                        initial="initial"
                        animate="enter"
                        custom={6}
                        className="space-y-2"
                      >
                        <Label>Specialty</Label>
                        <Input
                          value={specialty}
                          onChange={(e) => setSpecialty(e.target.value)}
                          placeholder="Ayurvedic Medicine, Digestive Health"
                        />
                      </motion.div>
                    </div>

                    <motion.div
                      variants={fieldVariants}
                      initial="initial"
                      animate="enter"
                      custom={7}
                      className="space-y-2"
                    >
                      <Label>Location</Label>
                      <Input
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Bengaluru, India"
                      />
                    </motion.div>

                    <motion.div
                      variants={fieldVariants}
                      initial="initial"
                      animate="enter"
                      custom={8}
                      className="space-y-2"
                    >
                      <Label>Medical license number</Label>
                      <div className="flex gap-3">
                        <Input
                          value={licenseNo}
                          onChange={(e) => {
                            setLicenseNo(e.target.value);
                            setVerified(false);
                          }}
                          placeholder="e.g. IN-MED-123456"
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          onClick={onVerify}
                          disabled={!canVerify || verifying}
                          variant={verified ? "success" : "outline"}
                          className="whitespace-nowrap"
                        >
                          {verifying ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Verifying...
                            </>
                          ) : verified ? (
                            <>
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                              Verified
                            </>
                          ) : (
                            "Verify License"
                          )}
                        </Button>
                      </div>
                      {verified && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          License verified successfully. You can now submit the form.
                        </motion.div>
                      )}
                    </motion.div>

                    <motion.div
                      variants={fieldVariants}
                      initial="initial"
                      animate="enter"
                      custom={9}
                      className="space-y-2"
                    >
                      <Label>Professional bio (optional)</Label>
                      <Input
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Brief description of your experience and expertise..."
                      />
                      <p className="text-xs text-gray-500">
                        This will be displayed on your profile to help patients understand your background
                      </p>
                    </motion.div>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => window.history.back()}
                    >
                      Back
                    </Button>
                    <Button type="submit" disabled={!canSubmit}>
                      Create doctor account
                    </Button>
                  </div>
                </form>

                <div className="mt-8 text-center">
                  <p className="text-sm text-gray-500">
                    Already have an account?{" "}
                    <a
                      href="/login?role=doctor"
                      className="text-gray-900 hover:underline font-medium transition-colors duration-300"
                    >
                      Sign in
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}