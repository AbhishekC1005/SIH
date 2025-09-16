import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppState } from "@/context/app-state";
import { CheckCircle2, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
    setCurrentUser({
      id: doctorId,
      name: `Dr. ${name}`,
      email,
      role: "doctor",
    });
    setDoctorProfile({
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
    });
    localStorage.setItem(`app:doctor-map:${doctorId}`, doctorId);
    window.location.assign("/doctor");
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-emerald-50 p-4 sm:p-8">
      <div className="mx-auto w-full max-w-3xl">
        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle>Register as Doctor</CardTitle>
            <CardDescription>
              Provide your professional details. We will verify your license
              number.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive"
              >
                {error}
              </motion.div>
            )}
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Full Name</Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Dr. A. B. Sharma"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Age</Label>
                  <Input
                    type="number"
                    min={0}
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="35"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Gender</Label>
                  <Select
                    value={gender}
                    onValueChange={(v: any) => setGender(v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Phone</Label>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div className="grid gap-2 sm:col-span-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@hospital.org"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Hospital/Clinic</Label>
                  <Input
                    value={hospital}
                    onChange={(e) => setHospital(e.target.value)}
                    placeholder="City Care Hospital"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Specialty</Label>
                  <Input
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    placeholder="Ayurvedic Diet, Digestive Health"
                  />
                </div>
                <div className="grid gap-2 sm:col-span-2">
                  <Label>Location / Address</Label>
                  <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Bengaluru, India"
                  />
                </div>
                <div className="grid gap-2 sm:col-span-2">
                  <Label>License Number</Label>
                  <div className="flex gap-2">
                    <Input
                      value={licenseNo}
                      onChange={(e) => {
                        setLicenseNo(e.target.value);
                        setVerified(false);
                      }}
                      placeholder="e.g. IN-MED-123456"
                    />
                    <Button
                      type="button"
                      onClick={onVerify}
                      disabled={!canVerify || verifying}
                      className="whitespace-nowrap"
                    >
                      {verifying ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                          Verifying...
                        </>
                      ) : verified ? (
                        <>
                          <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" />{" "}
                          Verified
                        </>
                      ) : (
                        "Verify License"
                      )}
                    </Button>
                  </div>
                  {verified && (
                    <div className="mt-2 inline-flex items-center gap-2 rounded-md border border-green-200 bg-green-50 px-2.5 py-1.5 text-sm text-green-700">
                      <CheckCircle2 className="h-4 w-4" /> License verified. You
                      can submit the form.
                    </div>
                  )}
                </div>
                <div className="grid gap-2 sm:col-span-2">
                  <Label>Short Bio (optional)</Label>
                  <Input
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="10+ years in ayurveda and nutrition..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => window.history.back()}
                >
                  Back
                </Button>
                <Button type="submit" disabled={!canSubmit}>
                  Create Doctor Account
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
