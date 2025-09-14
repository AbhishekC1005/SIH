import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

// Icons
import { 
  Droplet, 
  Flame, 
  Activity, 
  Moon,
  Utensils,
  CheckCircle2,
  Clock as ClockIcon,
  TrendingUp,
  CheckCircle,
  Sun,
  MoonStar,
  Coffee,
  Info
} from "lucide-react";

// Recharts components
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Legend,
  CartesianGrid
} from "recharts";

// Types
type GoalStatus = 'active' | 'in-progress' | 'consistent' | 'on-track';

interface Goal {
  id: string;
  title: string;
  progress: number;
  status: GoalStatus;
  icon: React.ReactNode;
}

// Constants
const WATER_GOAL = 2500; // ml
const CALORIE_GOAL = 2000; // kCal
const STEPS_GOAL = 10000;
const SLEEP_GOAL = 8; // hours

// Define types for meal plan
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

const weeklyMealPlan: MealPlan[] = [
  { 
    day: 'Monday', 
    meals: {
      breakfast: 'Oatmeal with berries and nuts',
      lunch: 'Grilled chicken salad with olive oil dressing',
      snack: 'Greek yogurt with honey',
      dinner: 'Baked salmon with quinoa and steamed vegetables'
    }
  },
  { 
    day: 'Tuesday', 
    meals: {
      breakfast: 'Scrambled eggs with whole grain toast',
      lunch: 'Quinoa bowl with chickpeas and vegetables',
      snack: 'Handful of mixed nuts',
      dinner: 'Grilled chicken with sweet potato and broccoli'
    }
  },
  { 
    day: 'Wednesday', 
    meals: {
      breakfast: 'Greek yogurt with granola and fruit',
      lunch: 'Turkey and avocado wrap with side salad',
      snack: 'Cottage cheese with pineapple',
      dinner: 'Stir-fried tofu with brown rice and vegetables'
    }
  },
  { 
    day: 'Thursday', 
    meals: {
      breakfast: 'Smoothie with spinach, banana, and protein powder',
      lunch: 'Grilled fish with quinoa and roasted vegetables',
      snack: 'Apple slices with almond butter',
      dinner: 'Lean beef with mashed cauliflower and green beans'
    }
  },
  { 
    day: 'Friday', 
    meals: {
      breakfast: 'Avocado toast with poached eggs',
      lunch: 'Chicken and vegetable stir-fry with brown rice',
      snack: 'Protein shake with banana',
      dinner: 'Baked cod with roasted sweet potatoes and asparagus'
    }
  },
  { 
    day: 'Saturday', 
    meals: {
      breakfast: 'Pancakes with fresh fruit and maple syrup',
      lunch: 'Grilled chicken Caesar salad',
      snack: 'Hummus with vegetable sticks',
      dinner: 'Homemade vegetable lasagna with side salad'
    }
  },
  { 
    day: 'Sunday', 
    meals: {
      breakfast: 'Omelet with vegetables and feta cheese',
      lunch: 'Grilled salmon with quinoa and roasted vegetables',
      snack: 'Handful of almonds and dried fruit',
      dinner: 'Grilled steak with mashed potatoes and green beans'
    }
  }
];

// Types for MealCard component
interface MealCardProps {
  title: string;
  content: string;
  icon: React.ReactNode;
  borderColor: string;
  bgColor: string;
}

// Meal Card Component
const MealCard: React.FC<MealCardProps> = ({ title, content, icon, borderColor, bgColor }) => (
  <motion.div 
    whileHover={{ y: -2 }}
    transition={{ type: "spring", stiffness: 300 }}
    className="h-full"
  >
    <Card className={`h-full border-l-4 ${borderColor} bg-gradient-to-br from-card to-card/80 hover:shadow-md transition-shadow duration-300`}>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${bgColor}`}>
            {icon}
          </div>
          <CardTitle className="text-base font-semibold text-foreground/90">
            {title}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{content}</p>
      </CardContent>
    </Card>
  </motion.div>
);

const Tracking: React.FC = () => {
  // State
  const [water, setWater] = useState(1200);
  const [calories, setCalories] = useState(1450);
  const [steps, setSteps] = useState(7243);
  const [sleep, setSleep] = useState(6.5);
  const [mealsTaken, setMealsTaken] = useState(0);
  const mealsPlanned = 3;
  const [selectedDayIndex, setSelectedDayIndex] = useState(new Date().getDay() - 1 >= 0 ? new Date().getDay() - 1 : 6); // 0-6 for Monday-Sunday
  
  // Calculate progress percentages
  const waterProgress = Math.min(Math.round((water / WATER_GOAL) * 100), 100);
  const caloriesProgress = Math.min(Math.round((calories / CALORIE_GOAL) * 100), 100);
  const stepsProgress = Math.min(Math.round((steps / STEPS_GOAL) * 100), 100);
  const sleepProgress = Math.min(Math.round((sleep / SLEEP_GOAL) * 100), 100);
  
  // Define types for weekly data
  interface WeeklyData {
    day: string;
    water: number;
    calories: number;
    steps: number;
    sleep: number;
  }

  // Generate weekly data
  const week: WeeklyData[] = useMemo(() => 
    Array.from({ length: 7 }).map((_, i) => ({
      day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i],
      water: 1200 + Math.round(Math.random() * 1300),
      calories: 1200 + Math.round(Math.random() * 1600),
      steps: 3000 + Math.round(Math.random() * 9000),
      sleep: 4 + Math.random() * 5
    })),
    []
  );
  
  // Event handlers
  
  const markMealAsTaken = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setMealsTaken(prev => Math.min(mealsPlanned, prev + 1));
  };

  const updateWater = (amount: number) => {
    setWater(prev => Math.max(0, prev + amount));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Health Tracker</h1>
      

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {/* Water Intake */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Water Intake</CardTitle>
            <Droplet className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{water}ml</div>
            <p className="text-xs text-muted-foreground">
              {waterProgress}% of daily goal
            </p>
            <Progress value={waterProgress} className="h-2 mt-2" />
            <div className="flex gap-2 mt-2">
              <Button size="sm" variant="outline" onClick={() => updateWater(-250)}>-250ml</Button>
              <Button size="sm" variant="outline" onClick={() => updateWater(250)}>+250ml</Button>
            </div>
          </CardContent>
        </Card>

        {/* Calories */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Calories</CardTitle>
            <Flame className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{calories}</div>
            <p className="text-xs text-muted-foreground">
              {caloriesProgress}% of daily goal
            </p>
            <Progress value={caloriesProgress} className="h-2 mt-2" />
          </CardContent>
        </Card>

        {/* Steps */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Steps</CardTitle>
            <Activity className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{steps.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {stepsProgress}% of daily goal
            </p>
            <Progress value={stepsProgress} className="h-2 mt-2" />
          </CardContent>
        </Card>

        {/* Sleep */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sleep</CardTitle>
            <Moon className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sleep.toFixed(1)}h</div>
            <p className="text-xs text-muted-foreground">
              {sleepProgress}% of daily goal
            </p>
            <Progress value={sleepProgress} className="h-2 mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Weekly Progress */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Weekly Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={week}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Bar dataKey="steps" fill="#10b981" name="Steps" />
                  <Bar dataKey="calories" fill="#f59e0b" name="Calories" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Meals */}
        <Card>
          <CardHeader>
            <CardTitle>Meals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Breakfast</p>
                  <p className="text-sm text-muted-foreground">08:30 AM</p>
                </div>
                <Button size="sm" variant="outline" onClick={markMealAsTaken}>
                  Log Meal
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Lunch</p>
                  <p className="text-sm text-muted-foreground">12:30 PM</p>
                </div>
                <Button size="sm" variant="outline" onClick={markMealAsTaken}>
                  Log Meal
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Dinner</p>
                  <p className="text-sm text-muted-foreground">07:30 PM</p>
                </div>
                <Button size="sm" variant="outline" onClick={markMealAsTaken}>
                  Log Meal
                </Button>
              </div>
            </div>
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium">Meals Logged</p>
                <p className="text-sm">
                  {mealsTaken}/{mealsPlanned}
                </p>
              </div>
              <Progress value={(mealsTaken / mealsPlanned) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Diet Plan Section */}
      <div className="mt-16 relative">
        <div className="absolute -top-10 left-0 right-0 h-24 bg-gradient-to-b from-background/0 to-background/80 -z-10" />
        <div className="relative">
          <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-16 h-16 bg-primary/10 rounded-full blur-3xl" />
          <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Weekly Diet Plan
          </h2>
          <p className="text-muted-foreground mb-6">Your personalized nutrition guide for the week</p>
        </div>
        
        {/* Day Selector Buttons */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-background -z-10" />
          <div className="flex space-x-1 p-1 bg-muted/30 rounded-2xl backdrop-blur-sm border border-border/50">
            {weeklyMealPlan.map((plan, idx) => (
              <Button
                key={plan.day}
                variant="ghost"
                className={`relative flex-1 whitespace-nowrap rounded-xl px-3 py-2 text-sm font-medium transition-all duration-300 ${
                  selectedDayIndex === idx 
                    ? 'bg-background shadow-lg text-foreground' 
                    : 'text-muted-foreground hover:bg-background/50 hover:text-foreground/80'
                }`}
                onClick={() => setSelectedDayIndex(idx)}
              >
                {selectedDayIndex === idx && (
                  <motion.span 
                    layoutId="activeDay"
                    className="absolute inset-0 bg-background rounded-lg shadow-sm border border-border/50"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30
                    }}
                  />
                )}
                <span className="relative z-10">
                  {plan.day.slice(0, 3)}
                </span>
              </Button>
            ))}
          </div>
        </div>

        {/* Diet Plan Content */}
        <motion.div 
          key={selectedDayIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-2xl blur opacity-30" />
          <Card className="relative bg-card/80 backdrop-blur-sm border border-border/50 shadow-lg overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16" />
            <CardContent className="p-6 relative">
              {(() => {
                const dayPlan = weeklyMealPlan[selectedDayIndex];
                if (!dayPlan) return null;
                
                return (
                  <div key={dayPlan.day} className="space-y-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <Utensils className="h-5 w-5 text-primary" />
                        <h3 className="text-xl font-semibold">{dayPlan.day}'s Meal Plan</h3>
                      </div>
                      <Badge variant="outline" className="text-sm">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                      </Badge>
                    </div>
                    
                    <div className="grid gap-6 md:grid-cols-2">
                      {/* Breakfast */}
                      <MealCard 
                        title="Breakfast"
                        content={dayPlan.meals.breakfast}
                        icon={<Sun className="h-4 w-4 text-blue-500" />}
                        borderColor="border-blue-500"
                        bgColor="bg-blue-500/10"
                      />

                      {/* Lunch */}
                      <MealCard 
                        title="Lunch"
                        content={dayPlan.meals.lunch}
                        icon={<Utensils className="h-4 w-4 text-green-500" />}
                        borderColor="border-green-500"
                        bgColor="bg-green-500/10"
                      />

                      {/* Snack */}
                      <MealCard 
                        title="Snack"
                        content={dayPlan.meals.snack}
                        icon={<Coffee className="h-4 w-4 text-amber-500" />}
                        borderColor="border-amber-500"
                        bgColor="bg-amber-500/10"
                      />

                      {/* Dinner */}
                      <MealCard 
                        title="Dinner"
                        content={dayPlan.meals.dinner}
                        icon={<MoonStar className="h-4 w-4 text-indigo-500" />}
                        borderColor="border-indigo-500"
                        bgColor="bg-indigo-500/10"
                      />
                    </div>

                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="mt-8 p-6 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl border border-border/50"
                    >
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Info className="h-4 w-4" />
                        Daily Nutrition Tips
                      </h4>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• Drink at least 8 glasses of water throughout the day</li>
                        <li>• Include a source of protein in every meal</li>
                        <li>• Choose whole grains over refined carbohydrates</li>
                        <li>• Include colorful vegetables for essential vitamins</li>
                      </ul>
                    </motion.div>
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Tracking;
