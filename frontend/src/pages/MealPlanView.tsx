import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Salad } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import axios from 'axios';
import { toast } from 'react-hot-toast';

interface Meal {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  prepTime: number;
  image: string;
  ingredients: string[];
  instructions: string;
}

interface DailyMeals {
  breakfast: Meal[];
  lunch: Meal[];
  dinner: Meal[];
  snacks: Meal[];
}

interface MealPlan {
  _id: string;
  name: string;
  description: string;
  dailyCalories: number;
  weeklyPlan: {
    [key: string]: DailyMeals;
  };
  createdAt: string;
}

export function MealPlanView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState('monday');

  useEffect(() => {
    const fetchMealPlan = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/user/saved-meal-plans/${id}`,
          { withCredentials: true }
        );

        if (response.data.success) {
          setMealPlan(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching meal plan:', error);
        toast.error('Failed to fetch meal plan');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMealPlan();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!mealPlan) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <Salad className="w-12 h-12 mx-auto text-muted-foreground" />
              <h2 className="mt-4 text-lg font-medium">Meal Plan Not Found</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                The meal plan you're looking for doesn't exist or has been deleted.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => navigate('/profile')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const days = Object.keys(mealPlan.weeklyPlan || {});

  const renderMealType = (meals: Meal[], title: string) => (
    <div className="space-y-4">
      <h3 className="font-medium text-lg capitalize">{title}</h3>
      {meals.map((meal, index) => (
        <Card key={index}>
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <img
                src={meal.image}
                alt={meal.name}
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h4 className="font-medium">{meal.name}</h4>
                <div className="mt-2 grid grid-cols-4 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Calories</p>
                    <p className="font-medium">{meal.calories}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Protein</p>
                    <p className="font-medium">{meal.protein}g</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Carbs</p>
                    <p className="font-medium">{meal.carbs}g</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Fat</p>
                    <p className="font-medium">{meal.fat}g</p>
                  </div>
                </div>
                <div className="mt-4">
                  <h5 className="font-medium mb-2">Ingredients</h5>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    {meal.ingredients.map((ingredient, i) => (
                      <li key={i}>{ingredient}</li>
                    ))}
                  </ul>
                </div>
                <div className="mt-4">
                  <h5 className="font-medium mb-2">Instructions</h5>
                  <p className="text-sm text-muted-foreground">
                    {meal.instructions}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate('/profile')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Profile
        </Button>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{mealPlan.name}</CardTitle>
            <CardDescription>
              {mealPlan.description}
              <br />
              Daily Calories: {mealPlan.dailyCalories} kcal
            </CardDescription>
          </CardHeader>
        </Card>

        <Tabs value={activeDay} onValueChange={setActiveDay}>
          <TabsList className="grid grid-cols-7 mb-4">
            {days.map((day) => (
              <TabsTrigger
                key={day}
                value={day}
                className="capitalize"
              >
                {day.slice(0, 3)}
              </TabsTrigger>
            ))}
          </TabsList>

          {days.map((day) => (
            <TabsContent key={day} value={day}>
              <div className="space-y-6">
                {renderMealType(mealPlan.weeklyPlan[day].breakfast, 'Breakfast')}
                {renderMealType(mealPlan.weeklyPlan[day].lunch, 'Lunch')}
                {renderMealType(mealPlan.weeklyPlan[day].dinner, 'Dinner')}
                {renderMealType(mealPlan.weeklyPlan[day].snacks, 'Snacks')}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}