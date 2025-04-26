"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chat = chat;
const genai_1 = require("@google/genai");
const aiChat_prompt_1 = require("../prompts/aiChat.prompt");
async function chat(userMessage) {
    const ai = new genai_1.GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const prompt = await (0, aiChat_prompt_1.chatPrompt)(userMessage);
    console.log('Sending prompt to Gemini...');
    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
    });
    const text = response.text;
    // console.log('chat response from gemini:', text);
    if (!text)
        throw new Error('No response from Gemini');
    // Clean the response text to ensure valid JSON
    const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
    // console.log('Cleaned response text:', cleanedText);
    try {
        // Parse the JSON response
        const parsedResponse = JSON.parse(cleanedText);
        // console.log('Parsed message response:', JSON.stringify(parsedResponse, null, 2));
        return parsedResponse;
    }
    catch (error) {
        console.error('Error parsing JSON response:', error);
        throw error;
    }
}
