import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppState } from "@/context/app-state";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Search, User, Check, X, Utensils, Plus, ArrowLeft, ChefHat, Leaf, Flame, Zap, Droplet, Info } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function DoctorRecipeGenerator() {
  const navigate = useNavigate();
  const { requests } = useAppState();

  const search = new URLSearchParams(location.search);
  const pid = search.get("pid") || "";

  const [patientId, setPatientId] = useState<string>(pid);
  const [fetchedName, setFetchedName] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const [mealName, setMealName] = useState("");

  type Recipe = {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    vitamins: string[];
    ayur: { rasa: string; virya: string; vipaka: string; guna: string[] };
    ingredients: string[];
    steps: string[];
  };

  const [recipe, setRecipe] = useState<Recipe | null>(null);

  const fetchPatient = () => {
    const q = patientId.trim().toLowerCase();
    const match = requests.find(
      (r) =>
        r.userId.toLowerCase() === q ||
        (r.patientName || "").toLowerCase().includes(q),
    );
    if (match) {
      setFetchedName(match.patientName || `Patient ${match.userId}`);
      setFetchError(null);
      setConfirmed(false);
    } else {
      setFetchedName(null);
      setFetchError("No patient found. Try full ID or part of the name.");
      setConfirmed(false);
    }
  };

  const macros = (kcal: number) => ({
    protein: Math.round((kcal * 0.2) / 4),
    carbs: Math.round((kcal * 0.55) / 4),
    fat: Math.round((kcal * 0.25) / 9),
  });

  const generateSingle = (meal: string): Recipe => {
    const base = 400 + Math.floor(Math.random() * 300);
    return {
      name: meal,
      calories: base,
      ...macros(base),
      vitamins: ["A", "B", "C"],
      ayur: {
        rasa: "Madhura",
        virya: "Ushna",
        vipaka: "Madhura",
        guna: ["Sattvic", "Light"],
      },
      ingredients: [
        `${meal} base ingredient`,
        "Seasonal vegetables",
        "Spices (cumin, turmeric, coriander)",
        "Ghee or oil",
        "Herbs (coriander/parsley)",
      ],
      steps: [
        "Prepare and wash ingredients.",
        "Heat pan and temper spices.",
        `Add ingredients to create ${meal}.`,
        "Simmer until cooked and flavors blend.",
        "Garnish and serve warm.",
      ],
    };
  };

  const onGenerate = () => {
    if (!confirmed || !mealName.trim()) return;
    setRecipe(generateSingle(mealName.trim()));
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-6 py-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <motion.div 
          variants={containerVariants} 
          initial="hidden" 
          animate="show"
          className="space-y-6"
        >
          <motion.div variants={itemVariants}>
            <Card className="border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Patient Identification</CardTitle>
                <CardDescription>
                  Enter patient ID or name to generate a personalized recipe
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      className="pl-10"
                      placeholder="Patient ID or name"
                      value={patientId}
                      onChange={(e) => setPatientId(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") fetchPatient();
                      }}
                    />
                  </div>
                  <Button 
                    onClick={fetchPatient}
                    className="h-11 px-6 py-2 text-base font-medium"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>

                {fetchedName && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4"
                  >
                    <div className="flex items-center justify-between p-3 bg-primary/5 rounded-md border">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-primary" />
                        <span className="font-medium">{fetchedName}</span>
                      </div>
                      <Button 
                        size="sm" 
                        variant={confirmed ? "default" : "outline"}
                        onClick={() => setConfirmed(!confirmed)}
                        className="gap-2"
                      >
                        {confirmed ? (
                          <>
                            <Check className="h-4 w-4" />
                            Confirmed
                          </>
                        ) : (
                          'Confirm Patient'
                        )}
                      </Button>
                    </div>
                  </motion.div>
                )}

                {fetchError && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 text-sm text-destructive bg-destructive/5 p-3 rounded-md flex items-center gap-2 border border-destructive/20"
                  >
                    <X className="h-4 w-4" />
                    {fetchError}
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className={!confirmed ? "opacity-50 pointer-events-none" : ""}
          >
            <Card className="border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Recipe Request</CardTitle>
                <CardDescription>
                  Enter meal name to generate a personalized recipe
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Utensils className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      className="pl-10"
                      placeholder="Meal name"
                      value={mealName}
                      onChange={(e) => setMealName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") onGenerate();
                      }}
                    />
                  </div>
                  <Button 
                    onClick={onGenerate}
                    className="gap-2 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all"
                  >
                    <Zap className="h-4 w-4" />
                    Generate Recipe
                  </Button>
                </div>
                {!confirmed && (
                  <p className="text-sm text-muted-foreground mt-3 text-center">
                    Please identify the patient first
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <AnimatePresence>
            {recipe && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                variants={itemVariants}
                exit={{ opacity: 0, y: 20 }}
              >
                <Card className="border-primary/20 shadow-md overflow-hidden">
                  <div className="bg-gradient-to-r from-primary/5 to-accent/5 p-6 border-b">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h2 className="text-2xl font-bold text-foreground">{recipe.name}</h2>
                        <p className="text-muted-foreground mt-1">Personalized recipe for {fetchedName}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="gap-1">
                          <Flame className="h-3.5 w-3.5 text-primary" />
                          {recipe.calories} kcal
                        </Badge>
                        <Badge variant="secondary" className="gap-1">
                          <Leaf className="h-3.5 w-3.5 text-accent" />
                          {recipe.ayur.rasa}
                        </Badge>
                        <Badge variant="secondary" className="gap-1">
                          <Droplet className="h-3.5 w-3.5 text-primary/80" />
                          {recipe.ayur.virya}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                          <Utensils className="h-5 w-5 text-accent" />
                          Ingredients
                        </h3>
                        <ul className="space-y-2">
                          {recipe.ingredients.map((ing, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <div className="h-1.5 w-1.5 mt-2.5 rounded-full bg-accent flex-shrink-0" />
                              <span className="text-foreground">{ing}</span>
                            </li>
                          ))}
                        </ul>
                        
                        <h3 className="text-lg font-semibold mb-3 mt-6 flex items-center gap-2">
                          <Zap className="h-5 w-5 text-primary" />
                          Nutrition (per serving)
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="rounded-lg border p-3">
                            <div className="text-xs text-muted-foreground">Protein</div>
                            <div className="font-semibold">{recipe.protein}g</div>
                          </div>
                          <div className="rounded-lg border p-3">
                            <div className="text-xs text-muted-foreground">Carbs</div>
                            <div className="font-semibold">{recipe.carbs}g</div>
                          </div>
                          <div className="rounded-lg border p-3">
                            <div className="text-xs text-muted-foreground">Fat</div>
                            <div className="font-semibold">{recipe.fat}g</div>
                          </div>
                          <div className="rounded-lg border p-3">
                            <div className="text-xs text-muted-foreground">Vitamins</div>
                            <div className="font-semibold">{recipe.vitamins.join(", ")}</div>
                          </div>
                        </div>
                        
                        <h3 className="text-lg font-semibold mb-3 mt-6 flex items-center gap-2">
                          <Leaf className="h-5 w-5 text-accent" />
                          Ayurvedic Properties
                        </h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Rasa (Taste):</span>
                            <span className="font-medium">{recipe.ayur.rasa}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Virya (Potency):</span>
                            <span className="font-medium">{recipe.ayur.virya}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Vipaka (Post-digestive effect):</span>
                            <span className="font-medium">{recipe.ayur.vipaka}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Guna (Qualities):</span>
                            <span className="font-medium">{recipe.ayur.guna.join(", ")}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                          <ChefHat className="h-5 w-5 text-primary" />
                          Preparation Steps
                        </h3>
                        <ol className="space-y-3">
                          {recipe.steps.map((step, idx) => (
                            <li key={idx} className="flex gap-3">
                              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center text-accent font-medium text-sm">
                                {idx + 1}
                              </div>
                              <div className="pt-0.5">{step}</div>
                            </li>
                          ))}
                        </ol>
                        
                        <div className="mt-8 p-4 bg-primary/5 rounded-lg border border-border">
                          <h4 className="font-medium mb-2 flex items-center gap-2">
                            <Info className="h-4 w-4 text-primary" />
                            Serving Suggestion
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Serve this {recipe.name} warm, garnished with fresh herbs. 
                            Pairs well with whole grain bread or steamed rice for a complete meal.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div 
            variants={itemVariants}
            className="flex justify-start pt-2"
          >
            <Button 
              variant="outline" 
              onClick={() => navigate(-1)}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
