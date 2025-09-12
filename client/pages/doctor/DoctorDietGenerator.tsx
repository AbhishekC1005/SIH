// DoctorDietGenerator.tsx
import { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppState } from "@/context/app-state";
import PatientVerification from "@/components/doctor/dietPlan/PatientVerification";
import DietQuiz from "@/components/doctor/dietPlan/DietQuiz";
import DietPlan from "@/components/doctor/dietPlan/DietPlan";
import { Progress } from "@/components/ui/progress";

export default function DoctorDietGenerator() {
  const { requests } = useAppState();
  const navigate = useNavigate();
  const location = useLocation();

  // Optional pid passed from patient view
  const passedPid = location.state?.pid as string | undefined;

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1 - patient
  const [patientId, setPatientId] = useState(passedPid ?? "");
  const [patientName, setPatientName] = useState("");

  // Step 2 - quiz
  const [cuisine, setCuisine] = useState("Indian");
  const [veg, setVeg] = useState(true);
  const [activity, setActivity] = useState<"Low" | "Moderate" | "High">("Moderate");
  const [restrictions, setRestrictions] = useState<string[]>([]);

  // Step 3 - plan
  const [plan, setPlan] = useState<any[] | null>(null);

  const progress = step === 1 ? 33 : step === 2 ? 66 : 100;

  const recommend = useMemo(() => {
    const water = activity === "High" ? 3 : activity === "Moderate" ? 2.5 : 2;
    const calories = activity === "High" ? 2600 : activity === "Moderate" ? 2200 : 1800;
    return { water, calories };
  }, [activity]);

  const generatePlan = () => {
    // your plan generation logic here
    return [];
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border bg-card p-6 shadow-sm flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Diet Plan Generator</h1>
        </div>
        <div className="w-48">
          <Progress value={progress} />
        </div>
      </div>

      {/* Step 1: Patient Verification */}
      {step === 1 && (
        <PatientVerification
          requests={requests}
          patientId={patientId}
          setPatientId={setPatientId}
          onVerified={(name) => {
            setPatientName(name);
            setStep(2); // Move to Step 2
          }}
        />
      )}

      {/* Step 2: Quiz Inputs */}
      {step === 2 && (
        <div className="space-y-4">
          <DietQuiz
            cuisine={cuisine}
            setCuisine={setCuisine}
            veg={veg}
            setVeg={setVeg}
            activity={activity}
            setActivity={setActivity}
            restrictions={restrictions}
            setRestrictions={setRestrictions}
          />

          <div className="flex justify-end">
            <button
              className="px-4 py-2 rounded bg-primary text-white"
              onClick={() => {
                setPlan(generatePlan());
                setStep(3);
              }}
            >
              Generate Diet Plan
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Diet Plan Display */}
      {step === 3 && (
        <DietPlan
          patientName={patientName}
          plan={plan}
          recommend={recommend} generatePlan={function (): { day: string; meals: { type: string; name: string; calories: number; protein: number; carbs: number; fat: number; vitamins: string[]; ayur: any; }[]; }[] {
            throw new Error("Function not implemented.");
          } }        />
      )}

      <div className="mt-4">
        <button onClick={() => navigate(-1)} className="px-4 py-2 border rounded">
          Back
        </button>
      </div>
    </div>
  );
}
