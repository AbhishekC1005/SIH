import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
  Cell,
  Area,
  AreaChart,
} from "recharts";
import { useAppState } from "@/context/app-state";

export default function Tracking() {
  const { progress, updateWater, markMealTaken } = useAppState();
  const [reminders, setReminders] = useState(false);
  const [notif, setNotif] = useState(null);

  useEffect(() => {
    if (!reminders) return;
    const id = setInterval(() => {
      setNotif("Time to drink water (250ml)?");
    }, 8000);
    return () => clearInterval(id);
  }, [reminders]);

  const week = useMemo(
    () =>
      Array.from({ length: 7 }).map((_, i) => ({
        day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
        water: 1200 + Math.round(Math.random() * 1200),
        meals: 2 + Math.round(Math.random() * 1),
        calories: 1800 + Math.round(Math.random() * 700),
      })),
    [],
  );

  const COLORS = ["#06b6d4", "#f59e0b", "#64748b"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Health Tracking
            </h1>
            <p className="text-gray-600 mt-1">
              Monitor your daily wellness progress
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="bg-white/80 backdrop-blur-sm border-gray-200"
            >
              Share
            </Button>
            <Button
              variant="outline"
              className="bg-white/80 backdrop-blur-sm border-gray-200"
            >
              Export
            </Button>
          </div>
        </div>

        {/* Main Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Water Card */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                <div className="w-2 h-2 bg-sky-500 rounded-full"></div>
                Water Intake
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-sky-600 mb-2">
                {progress.waterMl}
                <span className="text-lg text-gray-500">
                  /{progress.waterGoalMl} ml
                </span>
              </div>
              <Progress
                value={Math.round(
                  (progress.waterMl / progress.waterGoalMl) * 100,
                )}
                className="mb-4 h-2"
              />
              <div className="text-sm text-emerald-600 mb-3">
                ↑ {Math.round((progress.waterMl / progress.waterGoalMl) * 100)}%
                of daily goal
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateWater(250)}
                  className="text-xs"
                >
                  +250ml
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateWater(500)}
                  className="text-xs"
                >
                  +500ml
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Meals Card */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                Meals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-600 mb-2">
                {progress.mealsTaken}
                <span className="text-lg text-gray-500">
                  /{progress.mealsPlanned}
                </span>
              </div>
              <div className="text-sm text-emerald-600 mb-3">
                ↑{" "}
                {Math.round(
                  (progress.mealsTaken / progress.mealsPlanned) * 100,
                )}
                % completed
              </div>
              <Button
                size="sm"
                onClick={markMealTaken}
                className="bg-emerald-500 hover:bg-emerald-600"
              >
                Mark Meal
              </Button>
            </CardContent>
          </Card>

          {/* Reminders Card */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                Smart Reminders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-3">
                <Switch checked={reminders} onCheckedChange={setReminders} />
                <div className="text-sm text-gray-600">Auto notifications</div>
              </div>
              {notif && (
                <div className="mt-3 rounded-lg border border-sky-200 bg-sky-50 p-3 text-sm">
                  <div className="font-medium text-sky-800">
                    💧 Hydration Reminder
                  </div>
                  <div className="mt-1 text-sky-700">{notif}</div>
                  <div className="mt-2 flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => {
                        updateWater(250);
                        setNotif(null);
                      }}
                      className="bg-sky-500 hover:bg-sky-600 text-xs"
                    >
                      Done
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setNotif(null)}
                      className="text-xs"
                    >
                      Later
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Summary Card */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                Weekly Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600 leading-relaxed">
                🎯 Hydration improving steadily this week. Keep warm meals and
                avoid iced drinks in the evening for better results.
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Hydration Trend */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <div className="w-3 h-3 bg-sky-500 rounded-full"></div>
                Daily Hydration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{ water: { label: "Water (ml)", color: "#06b6d4" } }}
                className="h-64 w-full"
              >
                <AreaChart data={week}>
                  <defs>
                    <linearGradient
                      id="waterGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                      <stop
                        offset="95%"
                        stopColor="#06b6d4"
                        stopOpacity={0.05}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    className="text-sm"
                  />
                  <YAxis hide />
                  <Area
                    type="monotone"
                    dataKey="water"
                    stroke="#06b6d4"
                    strokeWidth={3}
                    fill="url(#waterGradient)"
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Sleep Pattern */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                Daily Calories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{ calories: { label: "Calories", color: "#f59e0b" } }}
                className="h-64 w-full"
              >
                <LineChart data={week}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    className="text-sm"
                  />
                  <YAxis hide />
                  <Line
                    type="monotone"
                    dataKey="calories"
                    stroke="#f59e0b"
                    strokeWidth={3}
                    dot={{ fill: "#f59e0b", strokeWidth: 2, r: 6 }}
                    activeDot={{
                      r: 8,
                      stroke: "#f59e0b",
                      strokeWidth: 2,
                      fill: "#fff",
                    }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Macro Distribution */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                Nutrition Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  carb: { label: "Carbs" },
                  protein: { label: "Protein" },
                  fat: { label: "Fats" },
                }}
                className="h-64 w-full"
              >
                <PieChart>
                  <Pie
                    data={[
                      { name: "carb", value: 55, label: "Carbohydrates" },
                      { name: "protein", value: 20, label: "Protein" },
                      { name: "fat", value: 25, label: "Healthy Fats" },
                    ]}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={80}
                    stroke="#fff"
                    strokeWidth={2}
                  >
                    {COLORS.map((c, i) => (
                      <Cell key={i} fill={c} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Adherence Status */}
          <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
                <div className="w-3 h-3 bg-muted-foreground rounded-full"></div>
                Health Goals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Warm Food Preference
                  </span>
                  <Badge className="bg-accent/10 text-accent hover:bg-accent/20">
                    Active
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Light Exercise Routine
                  </span>
                  <Badge
                    variant="secondary"
                    className="bg-primary/10 text-primary"
                  >
                    In Progress
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Regular Meal Schedule
                  </span>
                  <Badge className="bg-accent/10 text-accent hover:bg-accent/20">
                    Consistent
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Hydration Target
                  </span>
                  <Badge className="bg-accent/10 text-accent hover:bg-accent/20">
                    On Track
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
