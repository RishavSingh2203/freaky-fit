import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/Button"

const workoutPlans = [
  {
    title: "Beginner Full Body",
    description: "Perfect for those just starting their fitness journey",
    duration: "45 mins",
    level: "Beginner",
    workouts: 3
  },
  {
    title: "Intermediate Split",
    description: "Upper/Lower body split for intermediate athletes",
    duration: "60 mins",
    level: "Intermediate",
    workouts: 4
  },
  {
    title: "Advanced PPL",
    description: "Push/Pull/Legs split for advanced training",
    duration: "90 mins",
    level: "Advanced",
    workouts: 6
  }
]

export default function Training() {
  return (
    <div className="container py-10">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Training Programs</h1>
          <p className="text-muted-foreground">Choose a workout plan that matches your goals</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {workoutPlans.map((plan) => (
            <Card key={plan.title}>
              <CardHeader>
                <CardTitle>{plan.title}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-medium">Duration</div>
                      <div className="text-muted-foreground">{plan.duration}</div>
                    </div>
                    <div>
                      <div className="font-medium">Level</div>
                      <div className="text-muted-foreground">{plan.level}</div>
                    </div>
                    <div>
                      <div className="font-medium">Workouts/Week</div>
                      <div className="text-muted-foreground">{plan.workouts}</div>
                    </div>
                  </div>
                  <Button className="w-full">Start Plan</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Custom Workout Builder</CardTitle>
            <CardDescription>
              Create your own workout plan tailored to your specific needs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline">Create Custom Plan</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 