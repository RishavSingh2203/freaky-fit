import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useState, ChangeEvent, useEffect } from 'react';
import { UserCircle, Mail, Key, DumbbellIcon, Calendar, Trophy, Activity, Dumbbell, Salad, ChevronRight } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

interface SavedMealPlan {
  _id: string;
  name: string;
  description: string;
  dailyCalories: number;
  createdAt: string;
}

interface SavedWorkoutPlan {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
}

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [savedMealPlans, setSavedMealPlans] = useState<SavedMealPlan[]>([]);
  const [savedWorkoutPlans, setSavedWorkoutPlan] = useState<SavedWorkoutPlan[]>([]);
  const [selectedMealPlan, setSelectedMealPlan] = useState<SavedMealPlan | null>(null);
  const [selectedWorkoutPlan, setSelectedWorkoutPlan] = useState<SavedWorkoutPlan | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  const workoutStats = {
    totalWorkouts: 48,
    thisMonth: 12,
    streak: 5,
    achievements: 8,
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement profile update logic
    setIsEditing(false);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const fetchSavedPlans = async () => {
      try {
        const [mealPlansRes, workoutPlansRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/user/saved-meal-plans`, { withCredentials: true }),
          axios.get(`${import.meta.env.VITE_API_URL}/api/user/saved-workout-plans`, { withCredentials: true })
        ]);

        if (mealPlansRes.data.success) {
          setSavedMealPlans(mealPlansRes.data.data);
        }
        if (workoutPlansRes.data.success) {
          setSavedWorkoutPlan(workoutPlansRes.data.data);
        }
      } catch (error) {
        console.error('Error fetching saved plans:', error);
        toast.error('Failed to fetch saved plans');
      } finally {
        setLoading(false);
      }
    };

    fetchSavedPlans();
  }, []);

  const handleViewMealPlan = async (id: string) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/user/saved-meal-plans/${id}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        navigate(`/meal-plan/${id}`);
      }
    } catch (error) {
      console.error('Error fetching meal plan:', error);
      toast.error('Failed to fetch meal plan');
    }
  };

  const handleViewWorkoutPlan = async (id: string) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/user/saved-workout-plans/${id}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        navigate(`/workout-plan/${id}`);
      }
    } catch (error) {
      console.error('Error fetching workout plan:', error);
      toast.error('Failed to fetch workout plan');
    }
  };

  return (
    <div className="container py-10">
      <div className="grid gap-8 md:grid-cols-[280px_1fr]">
        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="text-center">
              <Avatar className="w-24 h-24 mx-auto">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback className="text-2xl">
                  {user?.name?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="mt-4">{user?.name}</CardTitle>
              <CardDescription>{user?.email}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Workout Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <DumbbellIcon className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Total Workouts</p>
                  <p className="text-2xl font-bold">{workoutStats.totalWorkouts}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">This Month</p>
                  <p className="text-2xl font-bold">{workoutStats.thisMonth}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Activity className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Current Streak</p>
                  <p className="text-2xl font-bold">{workoutStats.streak} days</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Trophy className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Achievements</p>
                  <p className="text-2xl font-bold">{workoutStats.achievements}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your profile information and email address.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <div className="flex gap-4">
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                        {isEditing && (
                          <Button type="submit" className="shrink-0">
                            Save
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your latest workouts and achievements.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { title: 'Completed Upper Body Workout', time: '2 hours ago' },
                      { title: 'Achieved New Personal Best', time: 'Yesterday' },
                      { title: 'Completed 5k Run', time: '2 days ago' },
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                        <div className="flex-1">
                          <p className="font-medium">{activity.title}</p>
                          <p className="text-sm text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Password</CardTitle>
                  <CardDescription>
                    Change your password or enable two-factor authentication.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current">Current Password</Label>
                    <Input id="current" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new">New Password</Label>
                    <Input id="new" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm">Confirm Password</Label>
                    <Input id="confirm" type="password" />
                  </div>
                  <Button>Update Password</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preferences">
              <Card>
                <CardHeader>
                  <CardTitle>Preferences</CardTitle>
                  <CardDescription>
                    Manage your notification and display preferences.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Add preference settings here */}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Tabs defaultValue="meal-plans">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="meal-plans" className="flex items-center gap-2">
                <Salad className="w-4 h-4" />
                Meal Plans
              </TabsTrigger>
              <TabsTrigger value="workout-plans" className="flex items-center gap-2">
                <Dumbbell className="w-4 h-4" />
                Workout Plans
              </TabsTrigger>
            </TabsList>

            <TabsContent value="meal-plans">
              <Card>
                <CardHeader>
                  <CardTitle>Saved Meal Plans</CardTitle>
                  <CardDescription>Your personalized meal plans</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-4">
                      {savedMealPlans.map((plan) => (
                        <Card key={plan._id} className="cursor-pointer hover:bg-accent/50" onClick={() => handleViewMealPlan(plan._id)}>
                          <CardContent className="p-4 flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">{plan.name}</h4>
                              <p className="text-sm text-muted-foreground">{plan.description}</p>
                              <p className="text-sm text-muted-foreground mt-1">
                                {new Date(plan.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-muted-foreground" />
                          </CardContent>
                        </Card>
                      ))}
                      {savedMealPlans.length === 0 && !loading && (
                        <div className="text-center py-8 text-muted-foreground">
                          <p>No saved meal plans yet</p>
                          <Button 
                            variant="outline" 
                            className="mt-4"
                            onClick={() => navigate('/meal-generator')}
                          >
                            Create a Meal Plan
                          </Button>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="workout-plans">
              <Card>
                <CardHeader>
                  <CardTitle>Saved Workout Plans</CardTitle>
                  <CardDescription>Your personalized workout plans</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-4">
                      {savedWorkoutPlans.map((plan) => (
                        <Card key={plan._id} className="cursor-pointer hover:bg-accent/50" onClick={() => handleViewWorkoutPlan(plan._id)}>
                          <CardContent className="p-4 flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">{plan.name}</h4>
                              <p className="text-sm text-muted-foreground">{plan.description}</p>
                              <p className="text-sm text-muted-foreground mt-1">
                                {new Date(plan.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-muted-foreground" />
                          </CardContent>
                        </Card>
                      ))}
                      {savedWorkoutPlans.length === 0 && !loading && (
                        <div className="text-center py-8 text-muted-foreground">
                          <p>No saved workout plans yet</p>
                          <Button 
                            variant="outline" 
                            className="mt-4"
                            onClick={() => navigate('/workout-generator')}
                          >
                            Create a Workout Plan
                          </Button>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
} 