import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function Recipes() {
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
    if (!mealName.trim()) return;
    setRecipe(generateSingle(mealName.trim()));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>User Recipe Generator</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row">
          <Input
            placeholder="Enter Meal Name (e.g., Moong Dal Khichdi)"
            value={mealName}
            onChange={(e) => setMealName(e.target.value)}
          />
          <Button onClick={onGenerate}>Generate Recipe</Button>
        </CardContent>
      </Card>

      {recipe && (
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="text-base">{recipe.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border mb-3">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Calories</TableHead>
                    <TableHead>Protein</TableHead>
                    <TableHead>Carbs</TableHead>
                    <TableHead>Fat</TableHead>
                    <TableHead>Vitamins</TableHead>
                    <TableHead>Ayurveda</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>{recipe.calories} kcal</TableCell>
                    <TableCell>{recipe.protein} g</TableCell>
                    <TableCell>{recipe.carbs} g</TableCell>
                    <TableCell>{recipe.fat} g</TableCell>
                    <TableCell>{recipe.vitamins.join(", ")}</TableCell>
                    <TableCell>
                      Rasa {recipe.ayur.rasa}, Virya {recipe.ayur.virya}, Vipaka {recipe.ayur.vipaka}, Guna {recipe.ayur.guna.join(", ")}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            <div className="mb-2 font-medium">Ingredients</div>
            <ul className="mb-3 list-disc pl-6 text-sm">
              {recipe.ingredients.map((ing, idx) => (
                <li key={idx}>{ing}</li>
              ))}
            </ul>
            <div className="mb-2 font-medium">Steps</div>
            <ol className="list-decimal pl-6 text-sm space-y-1">
              {recipe.steps.map((s, idx) => (
                <li key={idx}>{s}</li>
              ))}
            </ol>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
