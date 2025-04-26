import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { 
  Dumbbell, 
  Timer, 
  Calendar, 
  Target, 
  Trophy, 
  RefreshCw, 
  Download, 
  Flame,
  Heart,
  ArrowRight,
  CheckCircle,
  Loader2,
  SaveIcon,
} from 'lucide-react';
import axios from 'axios';
import { Input } from "@/components/ui/Input";
import { WorkoutPlanDisplay } from "@/components/WorkoutPlanDisplay";
import { useToast } from "@/components/ui/use-toast";
import SubscriptionBanner from "@/components/SubscriptionBanner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const fitnessLevels = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

const fitnessGoals = [
  { value: 'strength', label: 'Build Strength' },
  { value: 'muscle', label: 'Muscle Gain' },
  { value: 'endurance', label: 'Endurance' },
  { value: 'weight-loss', label: 'Weight Loss' },
  { value: 'toning', label: 'Toning & Definition' },
  { value: 'flexibility', label: 'Flexibility' },
];

const equipmentOptions = [
  { id: 'bodyweight', label: 'Bodyweight Only' },
  { id: 'dumbbells', label: 'Dumbbells' },
  { id: 'bench', label: 'Bench' },
  { id: 'barbell', label: 'Barbell' },
  { id: 'kettlebell', label: 'Kettlebell' },
  { id: 'resistance-bands', label: 'Resistance Bands' },
  { id: 'cables', label: 'Cable Machine' },
  { id: 'pullup-bar', label: 'Pull-up Bar' },
];

interface WorkoutPlan {
    description: string;
    schedule: {
        [key: string]: string;
    };
    daily_workouts: {
        [key: string]: {
            exercises: Array<{
                name: string;
                sets: number;
                reps: string;
                description: string;
                gif_url: string;
            }>;
        };
    };
    warm_up: {
        description: string;
        exercises: Array<{
            name: string;
            duration: string;
            description: string;
            gif_url: string;
        }>;
    };
    cool_down: {
        description: string;
        exercises: Array<{
            name: string;
            duration: string;
            description: string;
            gif_url: string;
        }>;
    };
}

const WorkoutGenerator = () => {
  const { toast } = useToast();
  const [fitnessLevel, setFitnessLevel] = useState('intermediate');
  const [fitnessGoal, setFitnessGoal] = useState('strength');
  const [workoutDuration, setWorkoutDuration] = useState(45);
  const [workoutsPerWeek, setWorkoutsPerWeek] = useState(4);
  const [includeWarmup, setIncludeWarmup] = useState(true);
  const [includeCooldown, setIncludeCooldown] = useState(true);
  const [equipment, setEquipment] = useState<string[]>(['bodyweight', 'dumbbells']);
  const [generating, setGenerating] = useState(false);
  const [workouts, setWorkouts] = useState<any>(null);
  const [activeWorkoutType, setActiveWorkoutType] = useState('upper');
  const [loading, setLoading] = useState(false);
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [formData, setFormData] = useState({
    fitnessLevel: "",
    fitnessGoal: "",
    duration: "",
    daysPerweek: ""
  });
  const [subscriptionRequired, setSubscriptionRequired] = useState(false);
  const [savingPlan, setSavingPlan] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [planName, setPlanName] = useState('');
  
  const handleEquipmentChange = (checked: boolean, id: string) => {
    if (checked) {
      setEquipment([...equipment, id]);
    } else {
      setEquipment(equipment.filter(item => item !== id));
    }
  };
  
  const handleGenerate = async() => {
    setGenerating(true);
    setSubscriptionRequired(false);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/user/generate-workout-plan`, {
        fitnessLevel,
        fitnessGoal,
        duration: workoutDuration,
        daysPerweek: workoutsPerWeek
      }, { withCredentials: true });
      
      console.log('Response from server:', response.data);
      
      if (response.data?.success && response.data?.data?.workout_plan) {
        setWorkoutPlan(response.data.data.workout_plan);
        toast({
          title: "Success!",
          description: response.data.message || "Your workout plan has been generated.",
        });
      } else {
        console.error('Invalid response structure:', response.data);
        throw new Error(response.data?.message || "Invalid response format");
      }
    } catch (error: any) {
      console.error("Error occurred while generating a workout:", error);
      
      // Check if it's a subscription limit error
      if (error.response?.status === 403 && error.response?.data?.subscriptionRequired) {
        setSubscriptionRequired(true);
      } else {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to generate workout plan. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setGenerating(false);
    }
  };
  
  const handleReset = () => {
    setWorkouts(null);
  };

 
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSavePlan = async () => {
    if (!workoutPlan) return;

    try {
      setSavingPlan(true);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/save-workout-plan`,
        {
          name: planName || 'My Workout Plan',
          description: workoutPlan.description,
          schedule: workoutPlan.schedule,
          dailyWorkouts: workoutPlan.daily_workouts,
          warmUp: workoutPlan.warm_up,
          coolDown: workoutPlan.cool_down
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success('Workout plan saved successfully!');
        setShowSaveDialog(false);
      }
    } catch (error) {
      console.error('Error saving workout plan:', error);
      toast.error('Failed to save workout plan. Please try again.');
    } finally {
      setSavingPlan(false);
    }
  };

  return (
    <div className="container max-w-6xl py-8 mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-2">AI Workout Generator</h1>
        <p className="text-lg text-muted-foreground">Create personalized workout routines based on your goals and available equipment</p>
      </motion.div>

      {subscriptionRequired && <SubscriptionBanner type="workout" />}

      <div className="grid gap-8 md:grid-cols-3">
        {/* Workout Generator Form */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Dumbbell className="w-5 h-5 mr-2 text-primary" />
                Workout Preferences
              </CardTitle>
              <CardDescription>Customize your workout plan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Fitness Level</label>
                <Select value={fitnessLevel} onValueChange={setFitnessLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your fitness level" />
                  </SelectTrigger>
                  <SelectContent>
                    {fitnessLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Fitness Goal</label>
                <Select value={fitnessGoal} onValueChange={setFitnessGoal}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your primary goal" />
                  </SelectTrigger>
                  <SelectContent>
                    {fitnessGoals.map((goal) => (
                      <SelectItem key={goal.value} value={goal.value}>{goal.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Workout Duration</label>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{workoutDuration} minutes</span>
                </div>
                <Slider
                  defaultValue={[45]}
                  min={15}
                  max={90}
                  step={5}
                  onValueChange={(value) => setWorkoutDuration(value[0])}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Workouts Per Week</label>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{workoutsPerWeek} workouts</span>
                </div>
                <Slider
                  defaultValue={[4]}
                  min={1}
                  max={7}
                  step={1}
                  onValueChange={(value) => setWorkoutsPerWeek(value[0])}
                />
              </div>

              <div className="space-y-4">
                <label className="text-sm font-medium">Available Equipment</label>
                <div className="grid grid-cols-2 gap-2">
                  {equipmentOptions.map((item) => (
                    <div key={item.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={item.id}
                        checked={equipment.includes(item.id)}
                        onCheckedChange={(checked) => handleEquipmentChange(checked as boolean, item.id)}
                      />
                      <Label htmlFor={item.id} className="text-sm">{item.label}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-medium">Additional Options</label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="warmup" className="text-sm">Include Warm-up Routine</Label>
                    <Switch 
                      id="warmup" 
                      checked={includeWarmup}
                      onCheckedChange={setIncludeWarmup}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="cooldown" className="text-sm">Include Cool-down Routine</Label>
                    <Switch 
                      id="cooldown" 
                      checked={includeCooldown}
                      onCheckedChange={setIncludeCooldown}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              {!workouts ? (
                <Button onClick={handleGenerate} className="w-full" disabled={generating || subscriptionRequired}>
                  {generating ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Generating Workouts
                    </>
                  ) : (
                    <>
                      <Dumbbell className="w-4 h-4 mr-2" /> Generate Workout Plan
                    </>
                  )}
                </Button>
              ) : (
                <Button onClick={handleReset} variant="outline" className="w-full">
                  <Target className="w-4 h-4 mr-2" /> Reset Preferences
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>

        {/* Generated Workout Plans */}
        <div className="md:col-span-2">
          {!workoutPlan ? (
            <div className="flex items-center justify-center h-full min-h-[400px] rounded-lg border border-dashed">
              <div className="flex flex-col items-center text-center p-8">
                <Dumbbell className="w-16 h-16 mb-4 text-muted-foreground/60" />
                <h3 className="text-lg font-medium mb-2">No Workout Plan Generated Yet</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  Adjust your preferences and generate a personalized workout plan to see results here.
                </p>
              </div>
            </div>
          ) : (
            <WorkoutPlanDisplay plan={workoutPlan} isLoading={loading} />
          )}
        </div>
      </div>

      {workoutPlan && (
        <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <SaveIcon className="w-4 h-4" /> Save Plan
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Save Workout Plan</DialogTitle>
              <DialogDescription>
                Give your workout plan a name to save it to your profile.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="plan-name">Plan Name</Label>
                <Input
                  id="plan-name"
                  placeholder="e.g., My Weekly Workout"
                  value={planName}
                  onChange={(e) => setPlanName(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowSaveDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSavePlan}
                disabled={savingPlan}
              >
                {savingPlan ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <SaveIcon className="w-4 h-4 mr-2" />
                    Save Plan
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default WorkoutGenerator;