import React, { useState } from 'react';
import { ArrowDown, ChefHat, Loader2, Plus, X, Utensils, Scale, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { Input } from '@/components/ui/Input';
import { Label } from '@radix-ui/react-label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

interface RecipeResponse {
  success: boolean;
  message: string;
  data: {
    recipe: string[];
    nutrition: string[];
  };
}

function AiRecipe() {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [currentIngredient, setCurrentIngredient] = useState('');
  const [fitnessGoal, setFitnessGoal] = useState<string>('');
  const [generatedRecipe, setGeneratedRecipe] = useState<RecipeResponse['data'] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddIngredient = () => {
    if (currentIngredient.trim() && !ingredients.includes(currentIngredient.trim())) {
      setIngredients(prev => [...prev, currentIngredient.trim()]);
      setCurrentIngredient('');
    }
  };

  const handleRemoveIngredient = (ingredient: string) => {
    setIngredients(prev => prev.filter(i => i !== ingredient));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddIngredient();
    }
  };

  const handleGenerateRecipe = async () => {
    if (ingredients.length === 0 || !fitnessGoal) {
      setError("Please add ingredients and select a fitness goal");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/user/generate-recipe`, {
        ingredients,
        fitnessGoal
      });

      if (response.data.success && response.data.data) {
        setGeneratedRecipe(response.data.data);
      } else {
        setError(response.data.message || "Failed to generate recipe");
      }
    } catch (err) {
      setError("Failed to generate recipe. Please try again.");
      console.error('Error generating recipe:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-5xl py-12 mx-auto px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center mb-12"
      >
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-primary/50 rounded-lg blur opacity-25"></div>
          <h1 className="relative text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50 mb-3">
            AI Recipe Generator
          </h1>
        </div>
        <p className="text-muted-foreground text-center max-w-2xl">
          Create personalized recipes based on your ingredients and fitness goals. Let AI craft the perfect meal for your needs.
        </p>
      </motion.div>

      <div className="space-y-8">
        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-xl mx-auto w-full"
        >
          <Card className="border-2 hover:border-primary/50 transition-colors duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Utensils className="w-6 h-6 text-primary" />
                Recipe Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="ingredients" className="text-base">Ingredients</Label>
                <div className="flex gap-2">
                  <Input
                    id="ingredients"
                    type="text"
                    placeholder="Add ingredient (e.g., chicken, rice)"
                    value={currentIngredient}
                    onChange={(e) => setCurrentIngredient(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 h-11"
                  />
                  <Button 
                    onClick={handleAddIngredient} 
                    variant="outline" 
                    size="icon"
                    className="h-11 w-11"
                    aria-label="Add ingredient"
                  >
                    <Plus className="h-5 w-5" />
                  </Button>
                </div>
                <AnimatePresence>
                  {ingredients.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex flex-wrap gap-2 mt-2"
                    >
                      {ingredients.map((ingredient) => (
                        <motion.div
                          key={ingredient}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                        >
                          <Badge 
                            variant="secondary" 
                            className="flex items-center gap-1 px-3 py-1 text-sm hover:bg-secondary/80 transition-colors"
                          >
                            {ingredient}
                            <button
                              onClick={() => handleRemoveIngredient(ingredient)}
                              className="ml-1 hover:text-destructive transition-colors"
                              aria-label={`Remove ${ingredient}`}
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </Badge>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="space-y-3">
                <Label htmlFor="fitnessGoal" className="text-base">Fitness Goal</Label>
                <Select value={fitnessGoal} onValueChange={setFitnessGoal}>
                  <SelectTrigger className="h-11">
                    <span className="flex items-center gap-2">
                      <Scale className="h-4 w-4 text-primary" />
                      {fitnessGoal || "Select Goal"}
                    </span>
                    <ArrowDown className="ml-2 h-4 w-4" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weight loss">Weight Loss</SelectItem>
                    <SelectItem value="weight gain">Weight Gain</SelectItem>
                    <SelectItem value="muscle gain">Muscle Gain</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={handleGenerateRecipe} 
                className="w-full h-11 text-base font-medium"
                disabled={isLoading || ingredients.length === 0 || !fitnessGoal}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating Recipe...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate Recipe
                  </>
                )}
              </Button>

              {error && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-destructive text-center"
                >
                  {error}
                </motion.p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recipe Display Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="border-2 hover:border-primary/50 transition-colors duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <ChefHat className="w-6 h-6 text-primary" />
                Generated Recipe
              </CardTitle>
            </CardHeader>
            <CardContent>
              {generatedRecipe ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-8"
                >
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                        <Utensils className="w-5 h-5 text-primary" />
                        Instructions
                      </h3>
                      <ol className="space-y-3">
                        {generatedRecipe.recipe.map((step, index) => (
                          <motion.li 
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="flex gap-3 text-muted-foreground"
                          >
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium">
                              {index + 1}
                            </span>
                            <span>{step.replace(/^\d+\.\s*/, '')}</span>
                          </motion.li>
                        ))}
                      </ol>
                    </div>

                    <div>
                      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                        <Scale className="w-5 h-5 text-primary" />
                        Nutrition Information
                      </h3>
                      <ul className="space-y-2">
                        {generatedRecipe.nutrition.map((info, index) => (
                          <motion.li 
                            key={index}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="text-muted-foreground flex items-center gap-2"
                          >
                            <span className="w-2 h-2 rounded-full bg-primary/50"></span>
                            {info}
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center h-full min-h-[300px] text-muted-foreground"
                >
                  <ChefHat className="w-16 h-16 mb-6 opacity-50" />
                  <p className="text-lg">Your recipe will appear here</p>
                  <p className="text-sm mt-2">Add ingredients and select a fitness goal to generate a recipe</p>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default AiRecipe;
