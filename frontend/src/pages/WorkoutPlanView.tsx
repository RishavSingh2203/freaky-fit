import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Dumbbell } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import axios from 'axios';
import { toast } from 'react-hot-toast';

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  description: string;
  gifUrl: string;
}

interface WarmUpExercise {
  name: string;
  duration: string;
  description: string;
  gifUrl: string;
}

interface DailyWorkout {
  exercises: Exercise[];
}

interface WorkoutPlan {
  _id: string;
  name: string;
  description: string;
  schedule: {
    [key: string]: string;
  };
  dailyWorkouts: {
    [key: string]: DailyWorkout;
  };
  warmUp: {
    description: string;
    exercises: WarmUpExercise[];
  };
  coolDown: {
    description: string;
    exercises: WarmUpExercise[];
  };
  createdAt: string;
}

export function WorkoutPlanView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState('monday');

  useEffect(() => {
    const fetchWorkoutPlan = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/user/saved-workout-plans/${id}`,
          { withCredentials: true }
        );

        if (response.data.success) {
          setWorkoutPlan(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching workout plan:', error);
        toast.error('Failed to fetch workout plan');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchWorkoutPlan();
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

  if (!workoutPlan) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <Dumbbell className="w-12 h-12 mx-auto text-muted-foreground" />
              <h2 className="mt-4 text-lg font-medium">Workout Plan Not Found</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                The workout plan you're looking for doesn't exist or has been deleted.
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

  const renderExerciseList = (exercises: Exercise[] | WarmUpExercise[], title: string) => (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {exercises?.map((exercise, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <h4 className="font-medium">{exercise.name}</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    {'sets' in exercise && (
                      <>
                        <div>
                          <p className="text-muted-foreground">Sets</p>
                          <p className="font-medium">{exercise.sets}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Reps</p>
                          <p className="font-medium">{exercise.reps}</p>
                        </div>
                      </>
                    )}
                    {'duration' in exercise && (
                      <div>
                        <p className="text-muted-foreground">Duration</p>
                        <p className="font-medium">{exercise.duration}</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Instructions</p>
                    <p className="text-sm">{exercise.description}</p>
                  </div>
                  {exercise.gifUrl && (
                    <div className="mt-2">
                      <img
                        src={exercise.gifUrl}
                        alt={exercise.name}
                        className="w-full max-w-md rounded-lg"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const days = Object.keys(workoutPlan.schedule || {});

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
            <CardTitle>{workoutPlan.name}</CardTitle>
            <CardDescription>{workoutPlan.description}</CardDescription>
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
                {workoutPlan.warmUp && renderExerciseList(workoutPlan.warmUp.exercises, 'Warm Up')}
                {workoutPlan.dailyWorkouts[day] && renderExerciseList(workoutPlan.dailyWorkouts[day].exercises, 'Main Workout')}
                {workoutPlan.coolDown && renderExerciseList(workoutPlan.coolDown.exercises, 'Cool Down')}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}