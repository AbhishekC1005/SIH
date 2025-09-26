// New file for frontend, e.g., Register.js

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useAppState } from "@/context/app-state";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon } from "lucide-react";
import { QUIZ } from "@/data/Quiz";

// —— Constants ——
const bgUrl =
  "https://images.pexels.com/photos/3621234/pexels-photo-3621234.jpeg";

// —— Schemas Aligned with 'Patient' Type ——
const formSchema = z.object({
  // BaseUser Fields
  name: z.string().min(2, "Name is required"),
  gender: z.enum(["male", "female", "prefer not to say"], {
    required_error: "Gender is required",
  }),
  dob: z.string().min(1, "Date of birth is required"),
  contact: z
    .string()
    .regex(/^\d{10}$/, "Contact number must be exactly 10 digits"),
  // ✅ CHANGE: Updated address schema to match backend's expectation of a single object,
  // which will then be converted to a single-element array on the frontend
  address: z.object({
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State is required"),
    country: z.string().min(2, "Country is required"),
  }),
  email: z.string().email("Valid email required"),
  password: z.string().min(6, "Password must be at least 6 characters"),

  // Quiz Fields
  answers: z.record(z.string(), z.number().min(1).max(3)),

  // Medical Fields (transformed for backend)
  allergies: z
    .string()
    .optional()
    .transform((val) => (val ? val.split(",").map((s) => s.trim()) : [])),
  // ✅ NEW: Added diseases field to match backend
  diseases: z
    .string()
    .optional()
    .transform((val) => (val ? val.split(",").map((s) => s.trim()) : [])),
  // ✅ CHANGE: The old backend expects one field for both file and text.
  // We'll rename the field to match the backend's expected file field name.
  medical_history: z
    .custom<File | undefined>()
    .refine((file) => !file || file.type === "application/pdf", {
      message: "Only PDF files are allowed",
    })
    .optional(),
  // ✅ DELETED: The `medical_description` field is removed as the old backend does not use it.
});

type FormValues = z.infer<typeof formSchema>;

// —— Animation Variants ——
const stepVariants = {
  initial: { opacity: 0, y: 16 },
  enter: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
};

// —— Reusable Form Field Components ——
function TextField({
  name,
  label,
  ...props
}: { name: keyof FormValues } & React.InputHTMLAttributes<HTMLInputElement> & {
    label: string;
  }) {
  const {
    register,
    formState: { errors },
  } = useFormContext<FormValues>();
  const error = (errors as any)[name];
  return (
    <div className="grid gap-2">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} {...props} {...register(name)} />
      {error && <p className="text-xs text-destructive">{error.message}</p>}
    </div>
  );
}

function SelectField({
  name,
  label,
  options,
}: {
  name: keyof FormValues;
  label: string;
  options: { label: string; value: string }[];
}) {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<FormValues>();
  const value = watch(name);
  const error = (errors as any)[name];
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      <Select
        value={value as string}
        onValueChange={(v) =>
          setValue(name, v as any, { shouldValidate: true })
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-xs text-destructive">{error.message}</p>}
    </div>
  );
}

// —— Step Components ——
function StepPersonal() {
  const {
    register,
    formState: { errors },
  } = useFormContext<FormValues>();
  return (
    <div className="space-y-4">
      <TextField name="name" label="Name" placeholder="Your full name" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SelectField
          name="gender"
          label="Gender"
          options={[
            { label: "Male", value: "male" },
            { label: "Female", value: "female" },
            { label: "Prefer not to say", value: "prefer not to say" },
          ]}
        />
        <div className="grid gap-2">
          <Label>Date of Birth</Label>
          <div className="relative">
            <CalendarIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input type="date" className="pl-9" {...register("dob")} />
          </div>
          {errors.dob && (
            <p className="text-xs text-destructive">{errors.dob.message}</p>
          )}
        </div>
      </div>
      <TextField
        name="contact"
        label="Contact Number"
        placeholder="10-digit number"
        inputMode="numeric"
      />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="grid gap-2">
          <Label>City</Label>
          <Input placeholder="City" {...register("address.city")} />
          {errors.address?.city && (
            <p className="text-xs text-destructive">
              {errors.address.city.message}
            </p>
          )}
        </div>
        <div className="grid gap-2">
          <Label>State</Label>
          <Input placeholder="State" {...register("address.state")} />
          {errors.address?.state && (
            <p className="text-xs text-destructive">
              {errors.address.state.message}
            </p>
          )}
        </div>
        <div className="grid gap-2">
          <Label>Country</Label>
          <Input placeholder="Country" {...register("address.country")} />
          {errors.address?.country && (
            <p className="text-xs text-destructive">
              {errors.address.country.message}
            </p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TextField
          name="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
        />
        <TextField
          name="password"
          label="Password"
          type="password"
          placeholder="••••••••"
        />
      </div>
    </div>
  );
}

function StepQuiz({
  index,
  setIndex,
  onFinish,
}: {
  index: number;
  setIndex: (n: number) => void;
  onFinish: () => void;
}) {
  const { setValue, watch } = useFormContext<FormValues>();
  const start = index * 2;
  const slice = QUIZ.slice(start, start + 2);
  const answers = watch("answers") || {};
  const setAnswer = (qid: number, val: 1 | 2 | 3) =>
    setValue(`answers.${String(qid)}`, val);
  const canProceed = slice.every((q) => !!answers[String(q.id)]);
  const handleNext = () => {
    if (!canProceed) return;
    if (index < 4) setIndex(index + 1);
    else onFinish();
  };
  return (
    <div className="space-y-6">
      {slice.map((q) => (
        <div key={q.id} className="rounded-lg border p-4">
          <p className="font-medium mb-3">{q.q}</p>
          <div className="grid gap-2">
            {[q.a1, q.a2, q.a3].map((label, i) => {
              const opt = (i + 1) as 1 | 2 | 3;
              const active = answers[String(q.id)] === opt;
              return (
                <Button
                  key={opt}
                  type="button"
                  variant={active ? "secondary" : "outline"}
                  className={`justify-start h-10 ${active ? "ring-2 ring-primary" : ""}`}
                  onClick={() => setAnswer(q.id, opt)}
                >
                  {label}
                </Button>
              );
            })}
          </div>
        </div>
      ))}
      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="ghost"
          onClick={() => setIndex(Math.max(0, index - 1))}
          disabled={index === 0}
        >
          Previous
        </Button>
        <Button type="button" onClick={handleNext} disabled={!canProceed}>
          {index < 4 ? "Next" : "Finish Quiz"}
        </Button>
      </div>
    </div>
  );
}

function StepMedical({
  onPdfChange,
}: {
  onPdfChange: React.ChangeEventHandler<HTMLInputElement>;
}) {
  const {
    register,
    formState: { errors },
  } = useFormContext<FormValues>();
  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label>Allergies (comma-separated, if any)</Label>
        <Input placeholder="e.g., peanuts, pollen" {...register("allergies")} />
      </div>
      <div className="grid gap-2">
        <Label>Diseases (comma-separated, if any)</Label>
        <Input placeholder="e.g., diabetes, hypertension" {...register("diseases")} />
      </div>
      <div className="grid gap-2">
        <Label>Medical Document (PDF only, optional)</Label>
        {/* ✅ CHANGE: The name now matches the backend's expected file field name */}
        <Input type="file" accept="application/pdf" onChange={onPdfChange} />
        {errors.medical_history && (
          <p className="text-xs text-destructive">
            {errors.medical_history.message}
          </p>
        )}
      </div>
      {/* The medical description text area is REMOVED to be compatible with the old backend */}
    </div>
  );
}

// —— Main Component ——
export default function Register() {
  const { setCurrentUser } = useAppState();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeStep, setActiveStep] = useState<0 | 1 | 2>(0);
  const [quizScreen, setQuizScreen] = useState(0);

  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      gender: undefined,
      dob: "",
      contact: "",
      address: { city: "", state: "", country: "" },
      email: "",
      password: "",
      answers: {},
      allergies: [],
      diseases: [],
      medical_history: undefined,
    },
    mode: "onChange",
  });

  const { handleSubmit, trigger, setError: setFormError, setValue } = methods;

  const nextFromPersonal = async () => {
    const ok = await trigger([
      "name",
      "gender",
      "dob",
      "contact",
      "address",
      "email",
      "password",
    ]);
    if (ok) setActiveStep(1);
  };

  const determineDosha = (
    answers: Record<string, number>,
  ): "vata" | "pitta" | "kapha" => {
    const counts = { vata: 0, pitta: 0, kapha: 0 };
    Object.values(answers).forEach((v) => {
      if (v === 1) counts.vata++;
      else if (v === 2) counts.pitta++;
      else counts.kapha++;
    });
    const maxCount = Math.max(counts.vata, counts.pitta, counts.kapha);
    if (counts.vata === maxCount) return "vata";
    if (counts.pitta === maxCount) return "pitta";
    return "kapha";
  };

  const handlePdfChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.currentTarget.files?.[0];
    // ✅ CHANGE: The value is now set to medical_history, matching the backend's expected field
    setValue("medical_history", file, { shouldValidate: true });
  };

  const finalizeRegistration = async (values: FormValues) => {
    setIsLoading(true);
    setError(null);

    if (Object.keys(values.answers).length !== QUIZ.length) {
      setFormError("answers", {
        message: `Please answer all ${QUIZ.length} quiz questions.`,
      } as any);
      setActiveStep(1);
      setIsLoading(false);
      return;
    }

    // ✅ CHANGES: Construct FormData to match the old backend's expectations
    const formData = new FormData();

    // Append non-file, non-array fields
    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("password", values.password);
    formData.append("dob", values.dob);
    formData.append("gender", values.gender);
    formData.append("contact", values.contact);
    formData.append("ayurvedic_category", determineDosha(values.answers));
    formData.append("mode", "online");
    // ✅ CHANGE: The backend expects an array, so we wrap the object in an array before stringifying
    formData.append("address", JSON.stringify([values.address]));

    // Append array fields as comma-separated strings
    if (values.allergies && values.allergies.length > 0) {
      formData.append("allergies", values.allergies.join(","));
    }
    if (values.diseases && values.diseases.length > 0) {
      formData.append("diseases", values.diseases.join(","));
    }

    // ✅ CHANGE: The old backend expects a single file with the field name 'medical_history'
    if (values.medical_history) {
      formData.append("medical_history", values.medical_history);
    }

    try {
      const response = await axios.post(
        "/api/patient/register-patient",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      console.log("Registration successful:", response.data);
      
      // Set user in app state before redirect
      const userData = response.data.data?.user || response.data.user;
      if (userData) {
        const user = {
          id: userData._id || userData.id,
          name: userData.name,
          email: userData.email,
          role: userData.role || "patient", // Default to patient role
          dosha: userData.ayurvedic_category || userData.dosha || null,
        };
        
        // Save user to localStorage immediately before redirect
        localStorage.setItem("app:currentUser", JSON.stringify(user));
        setCurrentUser(user);
      }
      
      // Small delay to ensure localStorage is written before redirect
      setTimeout(() => {
        if (user.role === "doctor") {
          window.location.assign("/doctor");
        } else {
          window.location.assign("/dashboard");
        }
      }, 100);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "An unexpected error occurred.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full bg-fixed bg-cover bg-center"
      style={{ backgroundImage: `url(${bgUrl})` }}
    >
      <div className="pointer-events-none fixed inset-0 z-0 bg-gradient-to-r from-[rgba(0,0,0,0.65)] via-[rgba(0,0,0,0.2)] to-transparent" />
      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-2xl"
        >
          <Card className="rounded-2xl border bg-white shadow-sm">
            <CardContent className="p-6 sm:p-8">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight">
                    Create your account
                  </h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Sign up as a patient
                  </p>
                </div>
                <a
                  href="/login"
                  className="text-sm underline-offset-4 hover:underline"
                >
                  Already registered? Sign in
                </a>
              </div>

              {error && (
                <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                  {error}
                </div>
              )}

              {/* Stepper header */}
              <div className="mb-6 grid grid-cols-3 gap-2">
                {["Personal", "Quiz", "Medical"].map((label, i) => (
                  <div
                    key={label}
                    className={`rounded-full border px-3 py-2 text-center text-xs sm:text-sm transition-colors ${i < activeStep ? "bg-muted" : i === activeStep ? "bg-accent" : "bg-card"}`}
                  >
                    {label}
                  </div>
                ))}
              </div>

              <FormProvider {...methods}>
                <form
                  onSubmit={handleSubmit(finalizeRegistration)}
                  className="space-y-6"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {activeStep === 0 && (
                      <motion.div
                        key="step-1"
                        variants={stepVariants}
                        initial="initial"
                        animate="enter"
                        exit="exit"
                        transition={{ duration: 0.25 }}
                      >
                        <StepPersonal />
                        <div className="mt-6 flex justify-end">
                          <Button
                            type="button"
                            className="rounded-full"
                            onClick={nextFromPersonal}
                          >
                            Continue to Quiz
                          </Button>
                        </div>
                      </motion.div>
                    )}
                    {activeStep === 1 && (
                      <motion.div
                        key="step-2"
                        variants={stepVariants}
                        initial="initial"
                        animate="enter"
                        exit="exit"
                        transition={{ duration: 0.25 }}
                      >
                        <StepQuiz
                          index={quizScreen}
                          setIndex={setQuizScreen}
                          onFinish={() => setActiveStep(2)}
                        />
                      </motion.div>
                    )}
                    {activeStep === 2 && (
                      <motion.div
                        key="step-3"
                        variants={stepVariants}
                        initial="initial"
                        animate="enter"
                        exit="exit"
                        transition={{ duration: 0.25 }}
                      >
                        <StepMedical onPdfChange={handlePdfChange} />
                        <div className="mt-6 flex items-center justify-between">
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setActiveStep(1)}
                          >
                            Back to Quiz
                          </Button>
                          <Button
                            type="submit"
                            className="rounded-full"
                            disabled={isLoading}
                          >
                            {isLoading
                              ? "Creating Account..."
                              : "Create Account"}
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>
              </FormProvider>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}