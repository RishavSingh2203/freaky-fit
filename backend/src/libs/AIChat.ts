import { GoogleGenAI } from "@google/genai";
import { chatPrompt } from "../prompts/aiChat.prompt";

export async function chat(userMessage:string){

        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY!});
        
        const prompt=await chatPrompt(userMessage);
        console.log('Sending prompt to Gemini...');
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt,
        });
          
        const text = response.text;
        // console.log('chat response from gemini:', text);
        
        if(!text) throw new Error('No response from Gemini');
        
        // Clean the response text to ensure valid JSON
        const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
        // console.log('Cleaned response text:', cleanedText);
        
        try {
            // Parse the JSON response
            const parsedResponse = JSON.parse(cleanedText);
            // console.log('Parsed message response:', JSON.stringify(parsedResponse, null, 2));
            
            return parsedResponse;
        } catch (error) {
            console.error('Error parsing JSON response:', error);
            throw error;

}
}