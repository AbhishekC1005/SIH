
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useAppState } from "@/context/app-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useSearchParams } from "react-router-dom";

// New imports for the polished form
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "lucide-react";

type MealInfo = { name: string; kcal: number; tags: string[]; icon: string };
type WeeklyPlan = {
  day: string;
  breakfast: MealInfo;
  lunch: MealInfo;
  dinner: MealInfo;
  snacks: MealInfo;
}[];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

export default function DoctorDashboard() {
  const {
    currentUser,
    doctors,
    requests,
    setRequests,
    conversations,
    addMessage,
  } = useAppState();

  // Toggle full-page Add Patient form view
  const [showAddPatient, setShowAddPatient] = useState(false);

  const [videoOpen, setVideoOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [draft, setDraft] = useState("");

  const defaultPlan = [
    { time: "08:00", name: "Warm Spiced Oats", calories: 320, waterMl: 250 },
    { time: "12:30", name: "Moong Dal Khichdi", calories: 450, waterMl: 300 },
    { time: "19:30", name: "Steamed Veg + Ghee", calories: 420, waterMl: 250 },
  ];
  const [plan, setPlan] = useState(defaultPlan);
  const [selected, setSelected] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan | null>(null);

  const getDoctorProfileId = () => {
    const key = `app:doctor-map:${currentUser?.id || "anon"}`;
    let mapped = localStorage.getItem(key);
    if (!mapped) {
      mapped = doctors[0]?.id || "d1";
      localStorage.setItem(key, mapped);
    }
    return mapped;
  };
  const doctorProfileId = getDoctorProfileId();

  const accept = (id: string) =>
    setRequests(
      requests.map((r) => (r.id === id ? { ...r, status: "accepted" } : r)),
    );
  const reject = (id: string) =>
    setRequests(
      requests.map((r) => (r.id === id ? { ...r, status: "rejected" } : r)),
    );

  const selectedReq = useMemo(
    () => requests.find((r) => r.id === selected) || null,
    [requests, selected],
  );

  useEffect(() => {
    const open = searchParams.get("open");
    if (open && !selected) {
      const exists = requests.some((r) => r.id === open);
      if (exists) setSelected(open);
    }
  }, [searchParams, requests]);

  useEffect(() => {
    if (selectedReq) {
      setPlan(
        selectedReq.plan && selectedReq.plan.length
          ? selectedReq.plan
          : defaultPlan.map((item) => ({
              ...item,
              waterMl: item.waterMl === undefined ? 0 : item.waterMl,
            })),
      );
    }
  }, [selectedReq?.id]);

  useEffect(() => {
    if (selectedReq?.id) markViewed(selectedReq.id);
  }, [selectedReq?.id]);

  const pendingForMe = useMemo(
    () =>
      requests.filter(
        (r) => r.doctorId === doctorProfileId && r.status === "pending",
      ),
    [requests, doctorProfileId],
  );
  const myPatients = useMemo(
    () =>
      requests.filter(
        (r) => r.doctorId === doctorProfileId && r.status === "accepted",
      ),
    [requests, doctorProfileId],
  );

  const lvKey = `app:patients:lastViewed:${doctorProfileId}`;
  const markViewed = (id: string) => {
    try {
      const m = JSON.parse(localStorage.getItem(lvKey) || "{}");
      m[id] = Date.now();
      localStorage.setItem(lvKey, JSON.stringify(m));
    } catch {}
  };

  const generateWeekly = () => {
    const dosha = selectedReq?.patientDosha || "Kapha";
    const base = {
      bf: [
        {
          name: "Warm Spiced Oats",
          kcal: 320,
          tags: ["Warm", "Rasa: Madhura", "Light"],
          icon: "🥣",
        },
        {
          name: "Ragi Porridge",
          kcal: 300,
          tags: ["Grounding", "Sattvic"],
          icon: "🥛",
        },
      ],
      ln: [
        {
          name: "Moong Dal Khichdi",
          kcal: 450,
          tags: ["Light", "Tridoshic"],
          icon: "🍲",
        },
        {
          name: "Veg Millet Bowl",
          kcal: 480,
          tags: ["Warm", "Madhura"],
          icon: "🥗",
        },
      ],
      dn: [
        {
          name: "Steamed Veg + Ghee",
          kcal: 420,
          tags: ["Light", "Warm"],
          icon: "🍲",
        },
        {
          name: "Paneer & Spinach",
          kcal: 430,
          tags: ["Heavy", "Madhura"],
          icon: "🥗",
        },
      ],
      sn: [
        {
          name: "Herbal Tea + Nuts",
          kcal: 180,
          tags: ["Warm", "Kashaya"],
          icon: "🍵",
        },
        {
          name: "Fruit & Seeds",
          kcal: 160,
          tags: ["Cold", "Amla"],
          icon: "🍎",
        },
      ],
    } as const;
    const pick = <T,>(arr: readonly T[]) =>
      arr[Math.floor(Math.random() * arr.length)];
    const adjust = (m: MealInfo): MealInfo => {
      if (dosha === "Pitta")
        return { ...m, tags: Array.from(new Set([...m.tags, "Cooling"])) };
      if (dosha === "Vata")
        return { ...m, tags: Array.from(new Set([...m.tags, "Warm"])) };
      return { ...m, tags: Array.from(new Set([...m.tags, "Light"])) };
    };
    const meal = (t: "bf" | "ln" | "dn" | "sn"): MealInfo =>
      adjust(pick((base as any)[t]));
    const week: WeeklyPlan = DAYS.map((d) => ({
      day: d,
      breakfast: meal("bf"),
      lunch: meal("ln"),
      dinner: meal("dn"),
      snacks: meal("sn"),
    }));
    setWeeklyPlan(week);
  };

  const exportWeeklyCsv = () => {
    if (!weeklyPlan) return;
    const header = ["Day", "Breakfast", "Lunch", "Dinner", "Snacks"];
    const rows = weeklyPlan.map((r) => [
      r.day,
      `${r.breakfast.name} (${r.breakfast.kcal})`,
      `${r.lunch.name} (${r.lunch.kcal})`,
      `${r.dinner.name} (${r.dinner.kcal})`,
      `${r.snacks.name} (${r.snacks.kcal})`,
    ]);
    const csv = [header, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "diet-plan-weekly.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // ——— Standalone Add Patient View (no background image) ———
  if (showAddPatient) {
    return (
      <div className="mx-auto max-w-3xl p-4 sm:p-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Add New Patient</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <AddPatientForm
              onCancel={() => setShowAddPatient(false)}
              onCreate={(payload) => {
                const newId = `req_${Date.now()}`;
                const newUserId = `u_${Date.now()}`;
                const newReq = {
                  id: newId,
                  userId: newUserId,
                  doctorId: doctorProfileId,
                  status: "accepted" as const,
                  createdAt: new Date().toISOString(),
                  patientName: payload.name,
                  patientDosha: (payload as any).dosha || null,
                  plan: defaultPlan,
                  patientProfile: {
                    whatsapp: payload.whatsapp,
                    dob: payload.dob,
                    address: payload.address,
                    gender: payload.gender,
                    heightCm: payload.heightCm,
                    weightKg: payload.weightKg,
                    allergies: payload.allergies,
                    conditions: payload.conditions,
                    medications: payload.medications,
                    habits: payload.habits,
                    sleepPattern: payload.sleepPattern,
                    digestion: payload.digestion,
                    notes: payload.notes,
                    hasPdf: !!payload.medicalDoc,
                  },
                };
                setRequests([newReq, ...requests]);
                setSelected(newId);
                setShowAddPatient(false);
              }}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  // ——— Summary dashboard when no patient is open ———
  if (!selectedReq) {
    return (
      <div className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <Card className="bg-[#0FA36B]/10 border-[#0FA36B]/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Pending</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 text-2xl font-bold">
              {pendingForMe.length}
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Active Patients</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 text-2xl font-bold">
              {myPatients.length}
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Total Requests</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 text-2xl font-bold">
              {pendingForMe.length + myPatients.length}
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Consultations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
              Manage incoming requests and active patients
            </div>
            <div className="rounded-lg border">
              <div className="flex items-center justify-between flex-wrap gap-2 border-b p-2 text-sm">
                <div className="font-medium">Requests</div>
                <Button size="sm" onClick={() => setShowAddPatient(true)}>
                  Add Patient
                </Button>
              </div>
              <div className="p-3">
                <div>
                  <div className="mb-2 text-sm font-semibold">
                    Patient Requests
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Req ID</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingForMe.length === 0 && (
                        <TableRow>
                          <TableCell
                            colSpan={3}
                            className="text-center text-muted-foreground"
                          >
                            No pending requests
                          </TableCell>
                        </TableRow>
                      )}
                      {pendingForMe.map((r) => (
                        <TableRow key={r.id} className="hover:bg-muted/40">
                          <TableCell className="font-mono text-xs">
                            {r.id}
                          </TableCell>
                          <TableCell>
                            <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-900">
                              Pending
                            </span>
                          </TableCell>
                          <TableCell className="text-right space-x-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => accept(r.id)}
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => reject(r.id)}
                            >
                              Reject
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setSelected(r.id);
                                markViewed(r.id);
                                setSearchParams((prev) => {
                                  const p = new URLSearchParams(prev);
                                  p.set("open", r.id);
                                  return p;
                                });
                              }}
                            >
                              Open
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ——— Patient open view ———
  const patient = {
    id: selectedReq.userId,
    name: selectedReq.patientName || `Patient ${selectedReq.userId}`,
    dosha: selectedReq.patientDosha || null,
  };

  const isApproved = selectedReq.status === "accepted";

  const send = () => {
    if (!draft.trim() || !selectedReq) return;
    addMessage(selectedReq.id, { from: "doctor", text: draft.trim() });
    setDraft("");
    setTimeout(
      () =>
        addMessage(selectedReq.id, {
          from: "patient",
          text: "Thanks, noted!",
        }),
      300,
    );
  };

  return (
    <div className="space-y-6">
  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
    {/* Patient Card */}
    <Card className="flex-1 bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          🧑 Patient Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* ID */}
          <div>
            <div className="text-xs text-gray-500">ID</div>
            <div className="font-mono">{patient?.id || "P-2025001"}</div>
          </div>

          {/* Name */}
          <div>
            <div className="text-xs text-gray-500">Name</div>
            <div className="font-medium">{patient?.name || "John Doe"}</div>
          </div>

          {/* Dosha */}
          <div>
            <div className="text-xs text-gray-500">Dosha</div>
            <div className="font-medium">{patient?.dosha || "Pitta"}</div>
          </div>

          {/* Age */}
          <div>
            <div className="text-xs text-gray-500">Age</div>
            <div className="font-medium">{patient?.age || "32"}</div>
          </div>

          {/* Gender */}
          <div>
            <div className="text-xs text-gray-500">Gender</div>
            <div className="font-medium">{patient?.gender || "Male"}</div>
          </div>

          {/* Contact */}
          <div>
            <div className="text-xs text-gray-500">Contact</div>
            <div className="font-medium">
              {patient?.phone || "+91 98765 43210"}
            </div>
          </div>

          {/* Address */}
          <div className="sm:col-span-2">
            <div className="text-xs text-gray-500">Address</div>
            <div className="font-medium">
              {patient?.address || "123, MG Road, Bengaluru, India"}
            </div>
          </div>

          {/* Medical History */}
          <div className="sm:col-span-2">
            <div className="text-xs text-gray-500">Medical History</div>
            <div className="font-medium">
              {patient?.medicalHistory ||
                "Hypertension, seasonal allergies, mild acidity"}
            </div>
          </div>

          {/* Allergies */}
          <div>
            <div className="text-xs text-gray-500">Allergies</div>
            <div className="font-medium">
              {patient?.allergies || "Penicillin"}
            </div>
          </div>

          {/* Weight */}
          <div>
            <div className="text-xs text-gray-500">Weight</div>
            <div className="font-medium">
              {patient?.weight ? `${patient.weight} kg` : "72 kg"}
            </div>
          </div>

          {/* Height */}
          <div>
            <div className="text-xs text-gray-500">Height</div>
            <div className="font-medium">
              {patient?.height ? `${patient.height} cm` : "178 cm"}
            </div>
          </div>

          {/* Lifestyle */}
          <div className="sm:col-span-2">
            <div className="text-xs text-gray-500">Lifestyle</div>
            <div className="font-medium">
              {patient?.lifestyle ||
                "Non-smoker, occasional alcohol, daily yoga, vegetarian diet"}
            </div>
          </div>

          {/* Emergency Contact */}
          <div>
            <div className="text-xs text-gray-500">Emergency Contact</div>
            <div className="font-medium">
              {patient?.emergencyContact || "Jane Doe (+91 91234 56789)"}
            </div>
          </div>
        </div>

        {/* Medical Documents */}
        <div className="mt-6">
          <div className="text-xs text-gray-500 mb-2">Medical Documents</div>
          <div className="space-y-2">
            {(patient?.documents || [
              { name: "Blood Test Report.pdf", url: "/mock/blood-test.pdf" },
              { name: "X-Ray Scan.pdf", url: "/mock/xray.pdf" },
              { name: "Prescription.pdf", url: "/mock/prescription.pdf" },
            ]).map((doc, idx) => (
              <Button
                key={idx}
                variant="outline"
                size="sm"
                className="w-full justify-start bg-white hover:bg-sky-50 text-gray-700"
                onClick={() => window.open(doc.url, "_blank")}
              >
                📄 {doc.name}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>

    {/* Right Side Buttons */}
    <div className="flex gap-2 lg:ml-3">
      {!isApproved && (
        <Button className="bg-emerald-500 hover:bg-emerald-600 text-white" onClick={() => accept(selectedReq.id)}>
          Approve
        </Button>
      )}
      <Button
        variant="outline"
        onClick={() => {
          setSelected(null);
          setSearchParams((prev) => {
            const p = new URLSearchParams(prev);
            p.delete("open");
            return p;
          });
        }}
      >
        Back
      </Button>
    </div>
  </div>
</div>

  );
}

const WeeklyMealCell: React.FC<{
  m: { name: string; kcal: number; tags: string[]; icon: string };
}> = ({ m }) => {
  return (
    <TableCell>
      <div className="font-medium">
        {m.icon} {m.name}{" "}
        <span className="text-xs text-muted-foreground">{m.kcal} kcal</span>
      </div>
      <div className="mt-1 flex flex-wrap gap-1">
        {m.tags.map((t, i) => (
          <Badge key={i} variant="secondary">
            {t}
          </Badge>
        ))}
      </div>
    </TableCell>
  );
};

/* -------------------------
   Polished AddPatientForm (inlined)
   Uses react-hook-form + zod for validation
   ------------------------- */

const patientSchema = z.object({
  name: z.string().min(2, "Full name is required"),
  gender: z.enum(["male", "female", "other"], { required_error: "Gender is required" }),
  dob: z.string().min(1, "Date of birth is required"),
  whatsapp: z.string().regex(/^\d{10}$/, "Must be 10 digits").optional(),
  address: z.string().min(3, "Address is required").optional(),
  heightCm: z.string().optional(),
  weightKg: z.string().optional(),
  allergies: z.string().optional(),
  conditions: z.string().optional(),
  medications: z.string().optional(),
  habits: z.string().optional(),
  sleepPattern: z.string().optional(),
  digestion: z.string().optional(),
  notes: z.string().optional(),
  medicalDoc: z.any().optional(),
});

type PatientFormValues = z.infer<typeof patientSchema>;

function AddPatientForm({
  onCancel,
  onCreate,
}: {
  onCancel: () => void;
  onCreate: (payload: PatientFormValues) => void;
}) {
  const methods = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      name: "",
      gender: "male",
      dob: "",
      whatsapp: "",
      address: "",
      heightCm: "",
      weightKg: "",
      allergies: "",
      conditions: "",
      medications: "",
      habits: "",
      sleepPattern: "",
      digestion: "",
      notes: "",
      medicalDoc: undefined,
    },
    mode: "onTouched",
  });

  const { register, handleSubmit, setValue, formState } = methods;
  const { errors } = formState;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    setValue("medicalDoc", file);
  };

  const submit = (data: PatientFormValues) => {
    // Normalize address into the shape your dashboard expects (optional:
    // you can capture structured address fields if you prefer)
    onCreate(data);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(submit)} className="w-full">
        <div className="p-6">
          <Card className="rounded-2xl shadow-md border">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Add New Patient</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Personal Information</h3>
                  <div className="text-sm text-muted-foreground">Required</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Full Name</Label>
                    <Input {...register("name")} placeholder="John Doe" />
                    {errors.name && <p className="text-xs text-destructive mt-1">{String(errors.name.message)}</p>}
                  </div>

                  <div>
                    <Label>Gender</Label>
                    <select {...register("gender")} className="w-full rounded-md border px-3 py-2">
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.gender && <p className="text-xs text-destructive mt-1">{String(errors.gender.message)}</p>}
                  </div>

                  <div>
                    <Label>Date of birth</Label>
                    <div className="relative">
                      <CalendarIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <Input type="date" className="pl-9" {...register("dob")} />
                    </div>
                    {errors.dob && <p className="text-xs text-destructive mt-1">{String(errors.dob.message)}</p>}
                  </div>

                  <div>
                    <Label>WhatsApp (optional)</Label>
                    <Input placeholder="9876543210" {...register("whatsapp")} />
                    {errors.whatsapp && <p className="text-xs text-destructive mt-1">{String(errors.whatsapp.message)}</p>}
                  </div>

                  <div className="md:col-span-2">
                    <Label>Address</Label>
                    <Textarea placeholder="Street, City, State, Country" {...register("address")} />
                    {errors.address && <p className="text-xs text-destructive mt-1">{String(errors.address.message)}</p>}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Medical Details */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Medical Details</h3>
                  <div className="text-sm text-muted-foreground">Optional</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Height (cm)</Label>
                    <Input type="number" placeholder="e.g. 170" {...register("heightCm")} />
                  </div>
                  <div>
                    <Label>Weight (kg)</Label>
                    <Input type="number" placeholder="e.g. 65" {...register("weightKg")} />
                  </div>

                  <div className="md:col-span-2">
                    <Label>Allergies</Label>
                    <Input placeholder="e.g. peanuts, pollen" {...register("allergies")} />
                  </div>

                  <div className="md:col-span-2">
                    <Label>Medical Conditions</Label>
                    <Textarea placeholder="e.g. diabetes, hypertension" {...register("conditions")} />
                  </div>

                  <div className="md:col-span-2">
                    <Label>Medications</Label>
                    <Textarea placeholder="Current medications" {...register("medications")} />
                  </div>

                  <div>
                    <Label>Upload Medical Document (PDF)</Label>
                    <Input type="file" accept="application/pdf" onChange={handleFileChange} />
                    {errors.medicalDoc && <p className="text-xs text-destructive mt-1">{String(errors.medicalDoc.message)}</p>}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Lifestyle */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Lifestyle & Notes</h3>
                  <div className="text-sm text-muted-foreground">Optional</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Habits</Label>
                    <Input placeholder="e.g. smoking, alcohol" {...register("habits")} />
                  </div>
                  <div>
                    <Label>Sleep Pattern</Label>
                    <Input placeholder="e.g. 7-8 hrs" {...register("sleepPattern")} />
                  </div>
                  <div>
                    <Label>Digestion</Label>
                    <Input placeholder="e.g. normal, weak" {...register("digestion")} />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Additional Notes</Label>
                    <Textarea placeholder="Any extra notes..." {...register("notes")} />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-6">
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
                <Button type="submit" className="px-6">
                  Create Patient
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </FormProvider>
  );
}
