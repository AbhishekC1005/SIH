import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppState } from "@/context/app-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChefHat, Salad, Stethoscope, ScanLine, Bot, Droplet } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

export default function Dashboard() {
  const navigate = useNavigate();
  const {
    currentUser,
    progress,
    dietPlan,
    doctors,
    requests,
    setRequests,
    notifications,
    addNotification,
    markAllRead,
    markNotificationRead,
  } = useAppState();

  const [connectOpen, setConnectOpen] = useState(false);

  const chartData = useMemo(() => (
    Array.from({ length: 7 }).map((_, i) => ({
      day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
      water: 1500 + Math.round(Math.random() * 800),
      meals: 2 + Math.round(Math.random())
    }))
  ), []);

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    hover: { scale: 1.02, transition: { duration: 0.2 } },
  };

  const consultedDoctorIds = requests.map(r => r.doctorId);
  const consultedDoctors = doctors.filter(d => consultedDoctorIds.includes(d.id));

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[{ title: "Dosha", icon: Bot, value: currentUser?.dosha || "Unclassified", subtitle: "Complete quiz to personalize" },
            { title: "Water Intake", icon: Droplet, value: `${progress.waterMl} / ${progress.waterGoalMl} ml`, subtitle: "Track hydration" },
            { title: "Meals", icon: Salad, value: `${progress.mealsTaken}/${progress.mealsPlanned}`, subtitle: "Monitor meals" },
            { title: "Last Plan", icon: ChefHat, value: dietPlan ? dietPlan.date : "None", subtitle: "Generate a plan to get started" }
          ].map((item, index) => (
            <motion.div key={index} variants={cardVariants} initial="hidden" animate="visible" whileHover="hover">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                  <item.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{item.value}</div>
                  <p className="text-xs text-muted-foreground">{item.subtitle}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Section: Left Hydration / Right Doctors + Actions */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Left: Weekly Hydration */}
          <motion.div variants={cardVariants} initial="hidden" animate="visible" whileHover="hover">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle>Weekly Hydration</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{ water: { label: "Water", color: "hsl(var(--primary))" } }}>
                  <AreaChart data={chartData}>
                    <CartesianGrid vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="day" tickLine={false} axisLine={false} />
                    <YAxis hide />
                    <Area type="monotone" dataKey="water" stroke="hsl(var(--primary))" fill="hsl(var(--primary)/.2)" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right: Consulted Doctors on top / Quick Actions below */}
          <div className="space-y-4">
            {/* Consulted Doctors */}
            <motion.div variants={cardVariants} initial="hidden" animate="visible" whileHover="hover">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <CardTitle>Consulted Doctors</CardTitle>
                </CardHeader>
                <CardContent>
                  {consultedDoctors.length === 0 ? (
                    <div className="text-sm text-muted-foreground">You have not consulted any doctors yet.</div>
                  ) : (
                    <div className="space-y-3">
                      {consultedDoctors.map((d) => (
                        <Card key={d.id} className="p-3 bg-white/70 backdrop-blur-sm border shadow-sm hover:shadow-md transition-all duration-200">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">{d.name}</div>
                              <div className="text-xs text-muted-foreground">{d.specialty}</div>
                            </div>
                            <Badge variant="secondary">★ {d.rating}</Badge>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div variants={cardVariants} initial="hidden" animate="visible" whileHover="hover">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-2">
                  <Dialog open={connectOpen} onOpenChange={setConnectOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full flex gap-2"><Stethoscope className="h-4 w-4" /> Connect with Doctor</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Available Doctors</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {doctors.map((d) => (
                          <Card key={d.id} className="p-4 bg-white/70 backdrop-blur-sm border shadow-sm hover:shadow-md transition-all duration-200">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-semibold">{d.name}</div>
                                <div className="text-xs text-muted-foreground">{d.specialty}</div>
                              </div>
                              <Badge variant="secondary">★ {d.rating}</Badge>
                            </div>
                            <Button className="mt-3 w-full" onClick={() => {
                              setRequests([...requests, {
                                id: `req_${Date.now()}`,
                                userId: currentUser?.id || "me",
                                doctorId: d.id,
                                status: "pending",
                                createdAt: new Date().toISOString(),
                                patientName: currentUser?.name,
                                patientDosha: currentUser?.dosha
                              }]);
                              setConnectOpen(false);
                              addNotification({
                                type: "doctor",
                                title: "Consultation requested",
                                message: `We’ll connect you with ${d.name} shortly.`
                              });
                              toast({
                                title: "Consultation requested",
                                description: `We’ll connect you with ${d.name} shortly. You’ll see updates in Notifications.`
                              });
                            }}>Request Consult</Button>
                          </Card>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button variant="outline" className="w-full flex gap-2" onClick={() => navigate('/scan')}>
                    <ScanLine className="h-4 w-4" /> Scan Barcode
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => navigate('/recipes')}>
                    Recipe Generator
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Notifications */}
        <motion.div variants={cardVariants} initial="hidden" animate="visible" whileHover="hover">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Notifications</CardTitle>
              <Button variant="outline" size="sm" onClick={markAllRead}>Mark all read</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {notifications.length === 0 && (
                  <div className="text-sm text-muted-foreground">No notifications yet.</div>
                )}
                {notifications.slice(0, 10).map((n) => (
                  <div key={n.id} className="flex items-start gap-3 rounded-md border p-2 hover:bg-muted transition-colors">
                    <span className={`mt-1 inline-block h-2 w-2 rounded-full ${n.read ? 'bg-muted' : 'bg-primary'}`} />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{n.title}</div>
                      <div className="text-xs text-muted-foreground">{n.message}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-[10px] text-muted-foreground">{new Date(n.time).toLocaleTimeString()}</div>
                      <Button variant="ghost" size="sm" onClick={() => markNotificationRead(n.id)}>Mark read</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Diet Plan */}
        <AnimatePresence>
          {dietPlan && (
            <motion.div key="diet" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <CardTitle>Diet Plan for {dietPlan.date}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm text-left text-gray-700">
                      <thead className="text-xs text-gray-500 uppercase bg-gray-100">
                        <tr>
                          <th className="px-3 py-2">Time</th>
                          <th className="px-3 py-2">Meal</th>
                          <th className="px-3 py-2">Properties</th>
                          <th className="px-3 py-2">Calories</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {dietPlan.meals.map((m, idx) => (
                          <tr key={idx}>
                            <td className="px-3 py-2">{m.time}</td>
                            <td className="px-3 py-2">{m.name}</td>
                            <td className="px-3 py-2 flex flex-wrap gap-1">
                              {m.properties.map((p, i) => (
                                <Badge key={i} variant="secondary">{p}</Badge>
                              ))}
                            </td>
                            <td className="px-3 py-2">{m.calories}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
