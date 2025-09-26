import React, { createContext, useContext, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Loader2, XCircle } from "lucide-react";
import axios from 'axios';

// --- START: Mocked Shadcn UI Components and App State Context ---
const Card = ({ children, className }) => (
  <div className={`rounded-2xl border bg-white shadow-sm ${className}`}>
    {children}
  </div>
);

const CardContent = ({ children, className }) => (
  <div className={`p-8 ${className}`}>
    {children}
  </div>
);

const Button = ({ children, className, onClick, disabled }) => (
  <button
    className={`h-10 w-full rounded-full bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);

const Input = ({ className, ...props }) => (
  <input
    className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
);

const Label = ({ children, className }) => (
  <label className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}>
    {children}
  </label>
);

const AppStateContext = createContext(null);

const AppStateProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  const value = useMemo(() => ({
    currentUser,
    setCurrentUser,
  }), [currentUser]);

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
};

const useAppState = () => {
  const context = useContext(AppStateContext);
  if (context === null) {
    throw new Error("useAppState must be used within an AppStateProvider");
  }
  return context;
};
// --- END: Mocked Shadcn UI Components and App State Context ---

const ErrorModal = ({ message, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
  >
    <motion.div
      initial={{ scale: 0.9, y: 50 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.9, y: 50 }}
      className="w-full max-w-sm rounded-lg bg-white p-6 text-center shadow-lg"
    >
      <div className="flex justify-center mb-4">
        <XCircle className="h-12 w-12 text-red-500" />
      </div>
      <h3 className="text-xl font-semibold mb-2 text-red-700">Login Error</h3>
      <p className="text-sm text-gray-600 mb-4">{message}</p>
      <Button onClick={onClose} className="w-1/2 rounded-full" disabled={undefined}>
        Close
      </Button>
    </motion.div>
  </motion.div>
);

export function Login() {
  const { setCurrentUser } = useAppState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // The backend server is running on port 8000
  const API_URL = "/api/patient";

  const role = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    const r = params.get("role");
    return r === "doctor" ? "doctor" : "user";
  }, []);

  async function handleLogin() {
    setError(null);
    setIsLoading(true);
    setShowModal(false);

    if (!email || !password) {
      setError("Please enter your email and password");
      setIsLoading(false);
      setShowModal(true);
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/login-patient`, { email, password });

      const data = response.data;
      setCurrentUser({
        id: data.data.user._id,
        name: data.data.user.name,
        email: data.data.user.email,
        role: data.data.user.role,
      });

      // Redirect to the dashboard page after successful login
      window.location.assign("/dashboard");

    } catch (err) {
      console.error("Login error:", err);
      if (err.response) {
        setError(err.response.data.message || "Login failed. Please check your credentials.");
      } else if (err.request) {
        setError("Could not connect to the backend server. Please ensure it is running.");
      } else {
        setError("An unexpected error occurred. Please try again later.");
      }
      setShowModal(true);
    } finally {
      setIsLoading(false);
    }
  }

  const bgUrl =
    "https://images.pexels.com/photos/3621234/pexels-photo-3621234.jpeg";

  return (
    <>
      <div
        className="min-h-screen w-full bg-fixed bg-cover bg-center font-sans text-gray-800"
        style={{ backgroundImage: `url(${bgUrl})` }}
      >
        <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.65)_0%,rgba(0,0,0,0.45)_28%,rgba(0,0,0,0.2)_52%,transparent_82%)]" />
        <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6 py-10">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md"
          >
            <Card className="rounded-2xl border bg-white shadow-lg ">
              <CardContent className="p-8">
                <div className="mb-6 text-center">
                  <h1 className="text-2xl font-semibold tracking-tight">
                    Welcome back {role === "doctor" ? "Doctor" : "User"}
                  </h1>
                  <p className="mt-1 text-sm text-gray-500">
                    Log in to your {role} account
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label className={undefined}>Email</Label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-9 focus-visible:ring-2"
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label className={undefined}>Password</Label>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <Input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-9 focus-visible:ring-2"
                      />
                    </div>
                  </div>

                  <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                    <Button
                      onClick={handleLogin}
                      disabled={isLoading} className={undefined}                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Logging in...
                        </>
                      ) : (
                        "Log in"
                      )}
                    </Button>
                  </motion.div>
                </div>

                <div className="mt-6 text-center text-sm text-gray-500">
                  Don’t have an account?{" "}
                  <a
                    className="underline-offset-4 hover:underline text-emerald-600 font-medium"
                    href={
                      role === "doctor" ? "/register-doctor" : "/register-user"
                    }
                  >
                    Register as {role}
                  </a>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
      <AnimatePresence>
        {showModal && <ErrorModal message={error} onClose={() => setShowModal(false)} />}
      </AnimatePresence>
    </>
  );
}

export default function App() {
  return (
    <AppStateProvider>
      <Login />
    </AppStateProvider>
  );
}
