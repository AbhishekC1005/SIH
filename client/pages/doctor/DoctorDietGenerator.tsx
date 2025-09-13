import { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppState } from "@/context/app-state";
import PatientVerification from "@/components/doctor/dietPlan/PatientVerification";
import DietQuiz from "@/components/doctor/dietPlan/DietQuiz";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

export default function DoctorDietGenerator() {
  const { requests } = useAppState();
  const navigate = useNavigate();
  const location = useLocation();

  // Optional pid from patient view or query string
  const passedPid = location.state?.pid as string | undefined;
  const pidFromQuery = new URLSearchParams(location.search).get("pid") || undefined;

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [patientId, setPatientId] = useState(passedPid ?? pidFromQuery ?? "");
  const [patientName, setPatientName] = useState("");

  // Quiz inputs
  const [cuisine, setCuisine] = useState("Indian");
  const [veg, setVeg] = useState(true);
  const [activity, setActivity] = useState<"Low" | "Moderate" | "High">("Moderate");
  const [restrictions, setRestrictions] = useState<string[]>([]);

  // Plan data
  const [plan, setPlan] = useState<any[] | null>(null);
  const [detail, setDetail] = useState<{ di: number; mi: number } | null>(null);

  const progress = step === 1 ? 33 : step === 2 ? 66 : 100;

  // Keep input in sync if route changes
  useEffect(() => {
    const s = (location.state as any)?.pid as string | undefined;
    const q = new URLSearchParams(location.search).get("pid") || undefined;
    const next = s ?? q;
    if (next && next !== patientId) setPatientId(next);
  }, [location]);

  const recommend = useMemo(() => {
    const water = activity === "High" ? 3000 : activity === "Moderate" ? 2500 : 2000;
    const calories = activity === "High" ? 2600 : activity === "Moderate" ? 2200 : 1800;
    return { water, calories };
  }, [activity]);

  const generatePlan = () => {
    // Demo: generate simple 3-day plan
    return Array.from({ length: 3 }).map((_, i) => ({
      day: `Day ${i + 1}`,
      meals: [
        {
          type: "Breakfast",
          name: "Oats with fruits",
          calories: 350,
          protein: 12,
          carbs: 60,
          fat: 8,
          vitamins: ["B1", "C"],
          ayur: { dosha: "Pitta", rasa: "Madhura", properties: ["Light", "Cooling"] }
        },
        {
          type: "Lunch",
          name: veg ? "Veg Thali" : "Chicken Curry with Rice",
          calories: 600,
          protein: 20,
          carbs: 80,
          fat: 18,
          vitamins: ["A", "B12"],
          ayur: { dosha: "Kapha", rasa: "Madhura", properties: ["Sattvic"] }
        },
        {
          type: "Dinner",
          name: "Khichdi with Ghee",
          calories: 450,
          protein: 15,
          carbs: 70,
          fat: 12,
          vitamins: ["E"],
          ayur: { dosha: "Vata", rasa: "Madhura", properties: ["Easy-digest", "Grounding"] }
        }
      ]
    }));
  };

  const stats = useMemo(() => {
    if (!plan) return { perDay: [], avgCal: 0 };
    const perDay = plan.map(d => ({
      date: d.day,
      calories: d.meals.reduce((s: number, m: any) => s + (m.calories || 0), 0)
    }));
    const avgCal = perDay.length
      ? Math.round(perDay.reduce((s, x) => s + x.calories, 0) / perDay.length)
      : 0;
    return { perDay, avgCal };
  }, [plan]);

  return (
    <div className="space-y-4">
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Diet Plan Generator</h1>
          <div className="w-48">
            <Progress value={progress} />
          </div>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">Search by Patient ID or Name to verify the patient, then proceed.</p>
      </div>

      {/* Step 1 */}
      {step === 1 && (
        <PatientVerification
          requests={requests}
          patientId={patientId}
          setPatientId={setPatientId}
          onVerified={(name) => {
            setPatientName(name);
            setStep(2);
          }}
        />
      )}

      {/* Step 2 */}
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

      {/* Step 3 */}
      {step === 3 && plan && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>
                Diet Plan for {patientName || "Patient"} • Avg {stats.avgCal} kcal/day
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{ cal: { label: "Calories", color: "hsl(var(--primary))" } }}>
                <BarChart data={stats.perDay}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="calories" fill="var(--color-cal)" radius={4} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Generated Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Day</TableHead>
                      <TableHead>Meal</TableHead>
                      <TableHead>Type</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {plan.map((day, di) =>
                      day.meals.map((m: any, mi: number) => (
                        <TableRow key={`${day.day}-${mi}`}>
                          {mi === 0 && (
                            <TableCell rowSpan={day.meals.length} className="font-mono text-xs align-top">
                              {day.day}
                            </TableCell>
                          )}
                          <TableCell>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  className="underline-offset-2 hover:underline"
                                  onClick={() => setDetail({ di, mi })}
                                >
                                  {m.name}
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <div className="text-xs">
                                  <div className="font-medium">{m.name}</div>
                                  <div>{m.calories} kcal</div>
                                  <div>Dosha: {m.ayur.dosha}</div>
                                  <div>Rasa: {m.ayur.rasa}</div>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TableCell>
                          <TableCell>{m.type}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Meal details modal */}
          <Dialog open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
            <DialogContent className="sm:max-w-[560px]">
              {detail && (
                <>
                  <DialogHeader>
                    <DialogTitle>Meal Details</DialogTitle>
                    <DialogDescription>Nutrition and Ayurveda properties</DialogDescription>
                  </DialogHeader>
                  {(() => {
                    const m = plan[detail.di].meals[detail.mi];
                    return (
                      <div className="space-y-3 text-sm">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <div className="text-xs text-muted-foreground">Day</div>
                            <div>{plan[detail.di].day}</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">Type</div>
                            <div>{m.type}</div>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <div className="text-xs text-muted-foreground">Calories</div>
                            <div>{m.calories}</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">Protein (g)</div>
                            <div>{m.protein}</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">Carbs (g)</div>
                            <div>{m.carbs}</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">Fat (g)</div>
                            <div>{m.fat}</div>
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Vitamins</div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {m.vitamins.map((v: string) => (
                              <Badge key={v} variant="secondary">{v}</Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Dosha</div>
                          <div>{m.ayur.dosha}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Rasa</div>
                          <div>{m.ayur.rasa}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Properties</div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {m.ayur.properties.map((p: string) => (
                              <Badge key={p} variant="secondary">{p}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </>
              )}
            </DialogContent>
          </Dialog>
        </>
      )}

      <div className="mt-4">
        <button onClick={() => navigate(-1)} className="px-4 py-2 border rounded">
          Back
        </button>
      </div>
    </div>
  );
}
