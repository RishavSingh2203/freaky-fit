import React from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Activity, 
  Calendar, 
  LineChart, 
  Dumbbell, 
  Apple, 
  MessagesSquare, 
  User, 
  Flame,
  TrendingUp,
  ArrowRight,
  Utensils,
  Target,
  Timer,
  Heart
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Link } from 'react-router-dom';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Dashboard Hero Section - Simplified */}
      <section className="relative py-10 overflow-hidden bg-gradient-to-r from-primary/10 to-background border-b">
        <div className="container px-4 mx-auto sm:px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-2xl mx-auto"
          >
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Welcome back, {user?.name?.split(' ')[0] || 'there'}!
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">
              Your fitness journey continues. What would you like to do today?
            </p>
          </motion.div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-12">
        <div className="container px-4 mx-auto sm:px-6 max-w-5xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            <Link to="/workout-generator" className="group">
              <Card className="h-full transition-colors hover:border-primary hover:shadow-md group-hover:shadow-primary/10">
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2 group-hover:bg-primary/20 transition-colors">
                    <Dumbbell className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Workout Builder</CardTitle>
                  <CardDescription>Generate personalized workout plans</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground mb-4">+
                    Build custom workouts based on your goals, equipment, and fitness level.
                  </div>
                  <Button variant="ghost" size="sm" className="group-hover:translate-x-1 transition-transform gap-1">
                    Create Workout <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </Link>

            <Link to="/meal-generator" className="group">
              <Card className="h-full transition-colors hover:border-primary hover:shadow-md group-hover:shadow-primary/10">
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2 group-hover:bg-primary/20 transition-colors">
                    <Utensils className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Meal Planner</CardTitle>
                  <CardDescription>Create custom meal plans</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground mb-4">
                    Generate personalized meal plans to match your nutritional needs and preferences.
                  </div>
                  <Button variant="ghost" size="sm" className="group-hover:translate-x-1 transition-transform gap-1">
                    Plan Meals <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </Link>

            <Link to="/training" className="group">
              <Card className="h-full transition-colors hover:border-primary hover:shadow-md group-hover:shadow-primary/10">
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2 group-hover:bg-primary/20 transition-colors">
                    <Activity className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Start Training</CardTitle>
                  <CardDescription>Begin your workout session</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground mb-4">
                    Start a guided workout session with real-time tracking and feedback.
                  </div>
                  <Button variant="ghost" size="sm" className="group-hover:translate-x-1 transition-transform gap-1">
                    Start Session <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </Link>

            <Link to="/profile" className="group">
              <Card className="h-full transition-colors hover:border-primary hover:shadow-md group-hover:shadow-primary/10">
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2 group-hover:bg-primary/20 transition-colors">
                    <LineChart className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Progress</CardTitle>
                  <CardDescription>Track your fitness journey</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground mb-4">
                    View your progress, achievements, and set new fitness goals.
                  </div>
                  <Button variant="ghost" size="sm" className="group-hover:translate-x-1 transition-transform gap-1">
                    View Stats <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Weekly Summary */}
      <section className="pb-12">
        <div className="container px-4 mx-auto sm:px-6 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Weekly Summary</CardTitle>
                <CardDescription>Your activity for the past 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    { 
                      icon: <Timer className="w-5 h-5 text-primary" />, 
                      title: "Active Time", 
                      value: "5.2 hours",
                      change: "+0.5 hrs from last week"
                    },
                    { 
                      icon: <Flame className="w-5 h-5 text-primary" />, 
                      title: "Calories Burned", 
                      value: "3,240",
                      change: "+6% from last week"
                    },
                    { 
                      icon: <Dumbbell className="w-5 h-5 text-primary" />, 
                      title: "Workouts", 
                      value: "4 completed",
                      change: "80% of your goal"
                    },
                    { 
                      icon: <Heart className="w-5 h-5 text-primary" />, 
                      title: "Average HR", 
                      value: "132 BPM",
                      change: "Good intensity zone"
                    }
                  ].map((stat, index) => (
                    <div key={index} className="flex flex-col">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 rounded-md bg-primary/10">
                          {stat.icon}
                        </div>
                        <span className="font-medium text-sm">{stat.title}</span>
                      </div>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <div className="text-xs text-muted-foreground mt-1">{stat.change}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 