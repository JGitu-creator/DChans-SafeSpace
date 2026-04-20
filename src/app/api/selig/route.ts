import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { struggle, message, history, settings } = await req.json();
    const bibleVersion = settings?.bibleVersion || 'ESV';

    // Read System Prompt from docs
    const systemPromptPath = path.join(process.cwd(), 'docs', 'system-instructions.md');
    let systemPrompt = fs.readFileSync(systemPromptPath, 'utf8');

    // Inject Bible Version instruction
    systemPrompt += `\n\nCRITICAL: Use the ${bibleVersion} Bible version for all verses and exegesis style.`;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash", 
      systemInstruction: systemPrompt,
    });

    const chatSession = model.startChat({
      history: history || [],
    });

    let prompt = "";
    if (struggle) {
      prompt = `Hadassah is sharing a struggle: "${struggle}". Respond as Selig using the JSON structure.`;
    } else if (message) {
      prompt = message; // Direct chat message
    } else {
      prompt = "Give Hadassah a warm morning greeting in your Selig persona using the JSON structure.";
    }

    const result = await chatSession.sendMessage(prompt);
    const text = result.response.text();
    
    // Clean JSON from response (remove markdown blocks if any)
    const jsonString = text.replace(/```json|```/g, "").trim();
    const affirmation = JSON.parse(jsonString);

    return NextResponse.json(affirmation);
  } catch (error) {
    console.error("Selig API Error:", error);
    return NextResponse.json({ error: "Selig is taking a moment to pray. Please try again later." }, { status: 500 });
  }
}
