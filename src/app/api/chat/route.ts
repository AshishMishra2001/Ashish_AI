// src/app/api/chat/route.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { myDetails } from '../../lib/my-details'; // Importing your details

// Make sure to set your GOOGLE_API_KEY in your .env.local file
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

// This function handles POST requests to /api/chat
export async function POST(request: Request) {
  // Get the user's message from the request body
  const { message } = await request.json();

  if (!message) {
    return new Response(JSON.stringify({ error: "Message is required" }), { status: 400 });
  }

  try {
    // const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    // Replace it with this line
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // This is the core prompt that instructs the AI
    const prompt = `You are an AI assistant that emulates me, based on the details provided.
    Your name is [Your Name]. Your goal is to answer questions as if you were me.
    Use the details below to inform your responses.
    Maintain my personality and style.
    Do not say "Based on the details provided". Just answer as me.

    ---
    My Details:
    ${myDetails}
    ---

    Now, answer the following question from a user, as me:
    User's Question: "${message}"

    Your Response (as me):
    `;
    console.log("Generated Prompt:", prompt);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return new Response(JSON.stringify({ response: text }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to generate AI response" }), { status: 500 });
  }
}