import { workAttt } from "../libs/workoutPlanGenerator";

export const workoutPrompt = ({fitnessLevel, fitnessGoal, duration, daysPerweek}: workAttt) => {
    return `Generate a detailed workout plan for a ${fitnessLevel} person who wants to ${fitnessGoal} for ${duration} per day and ${daysPerweek} days per week. 
    
    IMPORTANT: Your response must be a valid JSON object that exactly matches the structure below. Do not include any markdown formatting or code blocks.
    
    Required structure:
    {
        "workout_plan": {
            "description": "Overall plan description",
            "schedule": {
                "monday": "Workout type",
                "tuesday": "Workout type",
                "wednesday": "Workout type",
                "thursday": "Workout type",
                "friday": "Workout type",
                "saturday": "Workout type",
                "sunday": "Workout type"
            },
            "daily_workouts": {
                "monday": {
                    "exercises": [
                        {
                            "name": "Exercise name",
                            "sets": 3,
                            "reps": "12",
                            "description": "Detailed exercise description",
                            "gif_url": "https://example.com/exercise.gif"
                        }
                    ]
                },
                "tuesday": {
                    "exercises": [
                        {
                            "name": "Exercise name",
                            "sets": 3,
                            "reps": "12",
                            "description": "Detailed exercise description",
                            "gif_url": "https://example.com/exercise.gif"
                        }
                    ]
                },
                "wednesday": {
                    "exercises": [
                        {
                            "name": "Exercise name",
                            "sets": 3,
                            "reps": "12",
                            "description": "Detailed exercise description",
                            "gif_url": "https://example.com/exercise.gif"
                        }
                    ]
                },
                "thursday": {
                    "exercises": [
                        {
                            "name": "Exercise name",
                            "sets": 3,
                            "reps": "12",
                            "description": "Detailed exercise description",
                            "gif_url": "https://example.com/exercise.gif"
                        }
                    ]
                },
                "friday": {
                    "exercises": [
                        {
                            "name": "Exercise name",
                            "sets": 3,
                            "reps": "12",
                            "description": "Detailed exercise description",
                            "gif_url": "https://example.com/exercise.gif"
                        }
                    ]
                },
                "saturday": {
                    "exercises": [
                        {
                            "name": "Exercise name",
                            "sets": 3,
                            "reps": "12",
                            "description": "Detailed exercise description",
                            "gif_url": "https://example.com/exercise.gif"
                        }
                    ]
                },
                "sunday": {
                    "exercises": [
                        {
                            "name": "Exercise name",
                            "sets": 3,
                            "reps": "12",
                            "description": "Detailed exercise description",
                            "gif_url": "https://example.com/exercise.gif"
                        }
                    ]
                }
            },
            "warm_up": {
                "description": "Warm-up instructions",
                "exercises": [
                    {
                        "name": "Warm-up exercise name",
                        "duration": "5 minutes",
                        "description": "Warm-up exercise description",
                        "gif_url": "https://example.com/warmup.gif"
                    }
                ]
            },
            "cool_down": {
                "description": "Cool-down instructions",
                "exercises": [
                    {
                        "name": "Cool-down exercise name",
                        "duration": "5 minutes",
                        "description": "Cool-down exercise description",
                        "gif_url": "https://example.com/cooldown.gif"
                    }
                ]
            }
        }
    }

    Requirements:
    1. The response must be valid JSON without any markdown formatting
    2. All days (monday through sunday) must be present in both schedule and daily_workouts
    3. Each day must have an "exercises" array with 4-6 exercises
    4. Each exercise must have all required fields (name, sets, reps, description, gif_url)
    5. Warm-up must have 3-4 exercises
    6. Cool-down must have 2-3 exercises
    7. All fields must be strings except for "sets" which must be a number
    8. Do not include any comments or additional text outside the JSON structure
    9. Each exercise object must be a complete object with all required fields
    10. The exercises array must be a proper array of objects, not a string or other type`;
}

export default workoutPrompt;