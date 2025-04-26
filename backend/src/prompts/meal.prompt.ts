interface MealPlanRequest {
    dailyCalories: number;
    dietType: string;
    excludeIngredients: string[];
    preparationTime: number;
    isVegetarian: boolean;
    isVegan: boolean;
    isGlutenFree: boolean;
    isDairyFree: boolean;
    isKeto: boolean;
    isLowCarb: boolean;
    isHighProtein: boolean;
    isLowFat: boolean;
}

export const mealPrompt = (request: MealPlanRequest): string => {
    const dietaryRestrictions = [];
    if (request.isVegetarian) dietaryRestrictions.push('vegetarian');
    if (request.isVegan) dietaryRestrictions.push('vegan');
    if (request.isGlutenFree) dietaryRestrictions.push('gluten-free');
    if (request.isDairyFree) dietaryRestrictions.push('dairy-free');
    if (request.isKeto) dietaryRestrictions.push('keto');
    if (request.isLowCarb) dietaryRestrictions.push('low-carb');
    if (request.isHighProtein) dietaryRestrictions.push('high-protein');
    if (request.isLowFat) dietaryRestrictions.push('low-fat');

    const restrictionsText = dietaryRestrictions.length > 0 
        ? `The meals must be ${dietaryRestrictions.join(', ')}.` 
        : '';

    const excludeText = request.excludeIngredients.length > 0
        ? `Do not include any meals containing: ${request.excludeIngredients.join(', ')}.`
        : '';

    return `Generate a weekly meal plan. Your response must be a valid JSON object with this structure:

{
  "meal_plan": {
    "description": "string (optional)",
    "daily_calories": ${request.dailyCalories},
    "weekly_plan": {
      "monday": {
        "breakfast": [meal],
        "lunch": [meal],
        "dinner": [meal],
        "snacks": [meal]
      },
      "tuesday": { same as monday },
      "wednesday": { same as monday },
      "thursday": { same as monday },
      "friday": { same as monday },
      "saturday": { same as monday },
      "sunday": { same as monday }
    }
  }
}

Each meal can have these fields (all optional):
{
  "name": "string",
  "calories": number,
  "protein": number,
  "carbs": number,
  "fat": number,
  "prepTime": number,
  "image": "https://images.pexels.com/photos/[photo-id]/pexels-photo-[photo-id].jpeg",
  "ingredients": ["string"],
  "instructions": "string"
}

Rules:
1. All numbers must be integers
2. All strings must be in double quotes
3. No trailing commas
4. No comments in JSON
5. No markdown formatting
6. No text before or after JSON

Calorie ranges (if specified):
- Breakfast: 300-500
- Lunch: 400-600
- Dinner: 400-600
- Snacks: 100-600

Prep time (if specified): 0-${request.preparationTime} minutes

${restrictionsText}
${excludeText}

Example meal:
{
  "name": "Overnight Oats",
  "calories": 350,
  "protein": 15,
  "carbs": 45,
  "fat": 12,
  "prepTime": 5,
  "image": "https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg",
  "ingredients": ["1 cup rolled oats", "1 cup almond milk", "1 tbsp chia seeds", "1 tbsp honey"],
  "instructions": "Mix all ingredients in a jar. Refrigerate overnight. Serve cold."
}`;
};

export default mealPrompt; 