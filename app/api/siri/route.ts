import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { Client } from "@gradio/client";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// --- 4. EXPANDED SCHEMA ---
// We add all available items to the schema's target enum.
const openAppSchema = {
    type: SchemaType.OBJECT,
    properties: {
        action: { type: SchemaType.STRING, enum: ["open", "chat"] },
        target: { type: SchemaType.STRING, enum: [
            "Spotify", "Finder", "Projects", "Resume", "About Me", "Terminal",
            "Google Chrome", "Photos", "System Settings", "Doom", "MacPaint", "Trash", "VS Code"
        ]},
    },
    required: ["action", "target"],
};

export async function POST(req: Request) {
 try {
  const { prompt } = await req.json();
  if (!prompt) {
   return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
  }

  let action = null;
  let spokenText = "";

  // --- 4. IMPROVED SYSTEM INSTRUCTIONS ---
  const actionModel = genAI.getGenerativeModel({
   model: "gemini-2.5-flash-preview-05-20",
   systemInstruction: `You are an expert macOS voice assistant named Siri. Your primary function is to determine if a user's request is a command to open an application or file, or if it's a general conversational query.

   Available items to open are:
   - Applications: Spotify, Finder, Google Chrome, Photos, System Settings, Doom, MacPaint, Photo Booth, Notes, VS Code, Terminal, Trash
   - Files/Folders: Projects, Resume, About Me

   Analyze the user's prompt.
   - If the prompt is a clear and direct command to "open", "launch", or "run" one of the available items, you MUST respond ONLY with the JSON command: {"action": "open", "target": "ItemName"}.
   - For ANY other type of prompt (e.g., asking a question, making a statement, telling a joke, general conversation), you MUST respond ONLY with: {"action": "chat"}. Do not try to guess or infer an "open" command. Be strict.
   - NEVER USE MARKDOWN FORMAT IN THE RESPONSE, ONLY SIMPLE PLAINTEXT. Example: Shahrukh Khan instead of **Shahrukh Khan** `,
   generationConfig: {
    responseMimeType: "application/json",
    responseSchema: openAppSchema,
   },
  });

  const actionResult = await actionModel.generateContent(prompt);
  const actionResponse = JSON.parse(actionResult.response.text());

  if (actionResponse.action === 'open') {
   action = actionResponse;
   spokenText = `Opening ${actionResponse.target}.`;
  } else {
   const chatModel = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-preview-05-20",
    systemInstruction: "You are a helpful and friendly macOS voice assistant named Siri. Keep your responses concise and conversational.",
   });
   const chatResult = await chatModel.generateContent(prompt);
   spokenText = chatResult.response.text();
  }

  // --- (Hugging Face TTS logic remains the same) ---
  const client = await Client.connect("NihalGazi/Text-To-Speech-Unlimited");
    const result = await client.predict("/text_to_speech_app", { 		
      prompt: spokenText, 		
      voice: "shimmer",
      emotion: "neutral",
      use_random_seed: true, 		
      specific_seed: 0,
    });
  
  const audioUrl = (result as any)?.data?.[0]?.url;
  if (!audioUrl) {
    throw new Error("Failed to generate audio from Hugging Face API.");
  }

  return NextResponse.json({
   action,
   spokenText,
   audioUrl: audioUrl,
  });
 } catch (error: any) {
  console.error('Error with Gemini API:', error);
  const errorMessage = error.message?.includes("quota")
   ? "You've reached the API limit for today. Please try again tomorrow."
   : "I'm having trouble connecting right now.";
  return NextResponse.json({ error: errorMessage }, { status: 500 });
 }
}