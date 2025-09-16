import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  useAppState,
  PatientProfile,
  ConsultRequest,
} from "@/context/app-state";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function uid(prefix = "req") {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

export default function AddPatient() {
  const navigate = useNavigate();
  const { currentUser, setRequests } = useAppState() as any;

  const getDoctorProfileId = () => {
    const key = `app:doctor-map:${currentUser?.id || "anon"}`;
    let mapped = localStorage.getItem(key);
    if (!mapped) {
      mapped = currentUser?.id || "d1";
      localStorage.setItem(key, mapped);
    }
    return mapped;
  };
  const doctorProfileId = useMemo(getDoctorProfileId, [currentUser?.id]);

  const [form, setForm] = useState({
    name: "",
    dosha: "",
    age: "",
    gender: "",
    phone: "",
    address: "",
    height: "",
    weight: "",
    lifestyle: "",
    medicalHistory: "",
    allergies: "",
    conditions: "",
    medications: "",
    sleepPattern: "",
    digestion: "",
    emergencyContact: "",
    notes: "",
  });
  const [files, setFiles] = useState<File[]>([]);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files ? Array.from(e.target.files) : [];
    setFiles(list);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const profile: PatientProfile = {
      id: uid("P"),
      name: form.name,
      dosha: (form.dosha || null) as any,
      age: form.age ? Number(form.age) : null,
      gender: (form.gender || null) as any,
      phone: form.phone,
      address: form.address,
      height: form.height ? Number(form.height) : null,
      weight: form.weight ? Number(form.weight) : null,
      lifestyle: form.lifestyle,
      medicalHistory: form.medicalHistory,
      allergies: form.allergies,
      conditions: form.conditions,
      medications: form.medications,
      habits: "",
      sleepPattern: form.sleepPattern,
      digestion: (form.digestion || null) as any,
      emergencyContact: form.emergencyContact,
      notes: form.notes,
      documents: files.map((f) => ({
        name: f.name,
        url: URL.createObjectURL(f),
      })),
    };

    const newReq: ConsultRequest = {
      id: uid("req"),
      userId: uid("u"),
      doctorId: doctorProfileId,
      status: "accepted",
      createdAt: new Date().toISOString(),
      patientName: form.name,
      patientDosha: (form.dosha || null) as any,
      patientProfile: profile,
      plan: [],
    } as any;

    setRequests((prev: ConsultRequest[]) => [...prev, newReq]);
    navigate("/doctor/patients");
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Add Patient</h1>
        <Button variant="outline" onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>

      <Card className="border-t-4 border-t-primary">
        <CardHeader>
          <CardTitle>Patient Details</CardTitle>
          <CardDescription>
            Fill in the patient's information and upload documents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  required
                />
              </div>
              <div>
                <Label>Dosha</Label>
                <Select
                  value={form.dosha}
                  onValueChange={(v) => setForm((f) => ({ ...f, dosha: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select dosha" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Vata">Vata</SelectItem>
                    <SelectItem value="Pitta">Pitta</SelectItem>
                    <SelectItem value="Kapha">Kapha</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  min="0"
                  value={form.age}
                  onChange={onChange}
                />
              </div>
              <div>
                <Label>Gender</Label>
                <Select
                  value={form.gender}
                  onValueChange={(v) => setForm((f) => ({ ...f, gender: v }))}
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
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={form.phone}
                  onChange={onChange}
                />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={form.address}
                  onChange={onChange}
                />
              </div>
              <div>
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  name="height"
                  type="number"
                  min="0"
                  value={form.height}
                  onChange={onChange}
                />
              </div>
              <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  name="weight"
                  type="number"
                  min="0"
                  value={form.weight}
                  onChange={onChange}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <Label htmlFor="lifestyle">Lifestyle</Label>
                <Textarea
                  id="lifestyle"
                  name="lifestyle"
                  value={form.lifestyle}
                  onChange={onChange}
                />
              </div>
              <div>
                <Label htmlFor="medicalHistory">Medical History</Label>
                <Textarea
                  id="medicalHistory"
                  name="medicalHistory"
                  value={form.medicalHistory}
                  onChange={onChange}
                />
              </div>
              <div>
                <Label htmlFor="allergies">Allergies</Label>
                <Textarea
                  id="allergies"
                  name="allergies"
                  value={form.allergies}
                  onChange={onChange}
                />
              </div>
              <div>
                <Label htmlFor="conditions">Conditions</Label>
                <Textarea
                  id="conditions"
                  name="conditions"
                  value={form.conditions}
                  onChange={onChange}
                />
              </div>
              <div>
                <Label htmlFor="medications">Medications</Label>
                <Textarea
                  id="medications"
                  name="medications"
                  value={form.medications}
                  onChange={onChange}
                />
              </div>
              <div>
                <Label htmlFor="sleepPattern">Sleep Pattern</Label>
                <Input
                  id="sleepPattern"
                  name="sleepPattern"
                  value={form.sleepPattern}
                  onChange={onChange}
                />
              </div>
              <div>
                <Label htmlFor="digestion">Digestion</Label>
                <Input
                  id="digestion"
                  name="digestion"
                  value={form.digestion}
                  onChange={onChange}
                />
              </div>
              <div>
                <Label htmlFor="emergencyContact">Emergency Contact</Label>
                <Input
                  id="emergencyContact"
                  name="emergencyContact"
                  value={form.emergencyContact}
                  onChange={onChange}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={form.notes}
                  onChange={onChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="documents">Medical Documents</Label>
              <Input id="documents" type="file" multiple onChange={onFiles} />
              {files.length > 0 && (
                <ul className="text-sm text-muted-foreground list-disc pl-4">
                  {files.map((f) => (
                    <li key={f.name}>{f.name}</li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/doctor/patients")}
              >
                Cancel
              </Button>
              <Button type="submit">Save Patient</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
