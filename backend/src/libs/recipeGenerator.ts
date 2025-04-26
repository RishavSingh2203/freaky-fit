import { GoogleGenAI } from "@google/genai";
import { recipePrompt } from "../prompts/reciepe.prompt";
export async function generateRecipe(
  ingredients: string[],
  fitnessGoal: string
) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

  const prompt = recipePrompt(ingredients, fitnessGoal);
  // console.log("Sending prompt to Gemini...");

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt || "",
  });
  const text = response.text;
  // console.log("chat response from gemini:", text);
  if (!text) throw new Error("No response from Gemini");
  
  const cleanedText = text
    .replace(/```json\n?|\n?```/g, '')   // Remove JSON code block markers
    .replace(/\\|\*/g, '')               // Remove unnecessary escape sequences or asterisks
    .replace(/"\[/g, '[')                // Clean misplaced quote before opening square bracket
    .replace(/\]"/g, ']')                // Clean misplaced quote after closing square bracket
    .trim();                             // Remove leading/trailing whitespace


  console.log('Cleaned response text:', cleanedText);
  try {
    const parsedResponse = JSON.parse(cleanedText);
    // console.log('Parsed message response:', JSON.stringify(parsedResponse, null, 2));
    return parsedResponse;
    
  } catch (error) {
    console.error('Error parsing JSON response:', error);
    throw error;
  }

}
