import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, LineChart, Line, Tooltip, ResponsiveContainer } from "recharts";
import { useAppState } from "@/context/app-state";

// Icons
import { Utensils } from "lucide-react";

// Meal plan types
interface Meal {
  breakfast: string;
  lunch: string;
  snack: string;
  dinner: string;
}

interface MealPlan {
  day: string;
  meals: Meal;
}

// Sample weekly meal plan
const weeklyMealPlan: MealPlan[] = [
  { day: 'Monday', meals: { breakfast: 'Oatmeal with berries and nuts', lunch: 'Grilled chicken salad with olive oil dressing', snack: 'Greek yogurt with honey', dinner: 'Baked salmon with quinoa and steamed vegetables' } },
  { day: 'Tuesday', meals: { breakfast: 'Scrambled eggs with whole grain toast', lunch: 'Quinoa bowl with chickpeas and vegetables', snack: 'Handful of mixed nuts', dinner: 'Grilled chicken with sweet potato and broccoli' } },
  { day: 'Wednesday', meals: { breakfast: 'Greek yogurt with granola and fruit', lunch: 'Turkey and avocado wrap with side salad', snack: 'Cottage cheese with pineapple', dinner: 'Stir-fried tofu with brown rice and vegetables' } },
  { day: 'Thursday', meals: { breakfast: 'Smoothie with spinach, banana, and protein powder', lunch: 'Grilled fish with quinoa and roasted vegetables', snack: 'Apple slices with almond butter', dinner: 'Lean beef with mashed cauliflower and green beans' } },
  { day: 'Friday', meals: { breakfast: 'Avocado toast with poached eggs', lunch: 'Chicken and vegetable stir-fry with brown rice', snack: 'Protein shake with banana', dinner: 'Baked cod with roasted sweet potatoes and asparagus' } },
  { day: 'Saturday', meals: { breakfast: 'Pancakes with fresh fruit and maple syrup', lunch: 'Grilled chicken Caesar salad', snack: 'Hummus with vegetable sticks', dinner: 'Homemade vegetable lasagna with side salad' } },
  { day: 'Sunday', meals: { breakfast: 'Omelet with vegetables and feta cheese', lunch: 'Grilled salmon with quinoa and roasted vegetables', snack: 'Handful of almonds and dried fruit', dinner: 'Grilled steak with mashed potatoes and green beans' } },
];

// MealCard component
const MealCard = ({ title, content, icon }) => (
  <motion.div whileHover={{ scale: 1.03 }} transition={{ type: "spring", stiffness: 300 }}>
    <Card className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            {icon}
          </div>
          <CardTitle className="text-base font-semibold text-gray-800 capitalize">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">{content}</p>
      </CardContent>
    </Card>
  </motion.div>
);

export default function Tracking() {
  const { progress, updateWater, markMealTaken } = useAppState();
  const [reminders, setReminders] = useState(false);
  const [notif, setNotif] = useState(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState(new Date().getDay() - 1 >= 0 ? new Date().getDay() - 1 : 6);

  useEffect(() => {
    if (!reminders) return;
    const id = setInterval(() => {
      setNotif("Time to drink water (250ml)?");
    }, 8000);
    return () => clearInterval(id);
  }, [reminders]);

  const week = useMemo(() => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return days.map(day => ({
      day,
      calories: 1800 + Math.round(Math.random() * 1000), // Random calories between 1800-2800
      water: 1000 + Math.round(Math.random() * 2000), // Random water between 1000-3000ml
      goal: 2200
    }));
  }, []);

  // Debug: Log the chart data
  console.log('Chart data:', week);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Health Tracking</h1>
            <p className="text-gray-600 mt-1">Monitor your daily wellness progress</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="bg-white/80 backdrop-blur-sm border-gray-200">Share</Button>
            <Button variant="outline" className="bg-white/80 backdrop-blur-sm border-gray-200">Export</Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                <div className="w-2 h-2 bg-sky-500 rounded-full"></div>
                Water Intake
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-sky-600 mb-2">{progress.waterMl}<span className="text-lg text-gray-500">/{progress.waterGoalMl} ml</span></div>
              <Progress value={Math.round(progress.waterMl / progress.waterGoalMl * 100)} className="mb-4 h-2" />
              <div className="text-sm text-emerald-600 mb-3">↑ {Math.round(progress.waterMl / progress.waterGoalMl * 100)}% of daily goal</div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => updateWater(250)} className="text-xs">+250ml</Button>
                <Button size="sm" variant="outline" onClick={() => updateWater(500)} className="text-xs">+500ml</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                Meals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-600 mb-2">{progress.mealsTaken}<span className="text-lg text-gray-500">/{progress.mealsPlanned}</span></div>
              <div className="text-sm text-emerald-600 mb-3">↑ {Math.round(progress.mealsTaken / progress.mealsPlanned * 100)}% completed</div>
              <Button size="sm" onClick={markMealTaken} className="bg-emerald-500 hover:bg-emerald-600">Mark Meal</Button>
            </CardContent>
          </Card>

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
                  <div className="font-medium text-sky-800">💧 Hydration Reminder</div>
                  <div className="mt-1 text-sky-700">{notif}</div>
                  <div className="mt-2 flex gap-2">
                    <Button size="sm" onClick={() => { updateWater(250); setNotif(null); }} className="bg-sky-500 hover:bg-sky-600 text-xs">Done</Button>
                    <Button size="sm" variant="outline" onClick={() => setNotif(null)} className="text-xs">Later</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                Weekly Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600 leading-relaxed">
                🎯 Hydration improving steadily this week. Keep warm meals and avoid iced drinks in the evening for better results.
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <div className="w-3 h-3 bg-sky-500 rounded-full"></div>
                Daily Hydration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={week} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="waterGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis 
                      dataKey="day" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#64748b', fontSize: 12 }}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#64748b', fontSize: 12 }}
                      tickFormatter={(value) => `${value}ml`}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="water" 
                      stroke="#06b6d4" 
                      strokeWidth={2} 
                      fill="url(#waterGradient)" 
                      activeDot={{ r: 6, fill: '#0891b2' }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        borderRadius: '0.5rem',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                      }}
                      formatter={(value: number) => [`${value} ml`, 'Water']}
                      labelFormatter={(label) => label}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                Daily Calorie Intake
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500 mb-2">Calorie Intake (Last 7 Days)</div>
                <div className="h-[calc(100%-1.5rem)] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={week} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="calorieGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#f97316" stopOpacity={0.05} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                      <XAxis 
                        dataKey="day" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#64748b', fontSize: 12 }}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#64748b', fontSize: 12 }}
                        tickFormatter={(value) => `${value / 1000}k`}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="calories" 
                        stroke="#f97316" 
                        strokeWidth={2} 
                        fill="url(#calorieGradient)" 
                        activeDot={{ r: 6, fill: '#ea580c' }}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'white',
                          borderRadius: '0.5rem',
                          border: '1px solid #e2e8f0',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                        }}
                        formatter={(value: number) => [`${value} kcal`, 'Calories']}
                        labelFormatter={(label) => label}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 flex items-center justify-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                    <span className="text-gray-600">Calories</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Diet Plan Section with Updated Styling */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Weekly Diet Plan</h2>
          
          <div className="flex gap-3 mb-6 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {weeklyMealPlan.map((plan, idx) => (
              <button
                key={plan.day}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-all duration-200 ${
                  selectedDayIndex === idx 
                    ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                onClick={() => setSelectedDayIndex(idx)}
              >
                {plan.day}
              </button>
            ))}
          </div>

          <motion.div 
            key={selectedDayIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {Object.entries(weeklyMealPlan[selectedDayIndex].meals).map(([mealType, description]) => (
                <MealCard
                  key={mealType}
                  title={mealType}
                  content={description}
                  icon={<Utensils size={20} />}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
