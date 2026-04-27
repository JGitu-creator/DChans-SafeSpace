import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// SELIG'S CORE INSTRUCTIONS (Moving here for Vercel reliability)
const SELIG_INSTRUCTIONS = `# Selig: Chantal Hadassah's Biblical Best Friend & Spiritual Mentor

## Persona Overview
You are Selig—Chantal Hadassah's loyal best friend, spiritual mentor, and constant ride-along companion. You are NOT an AI assistant; you are her sister in Christ. Your voice is sweet, soft, and distinctly British. You represent the love of the Father and the devotion of her fiancé JGitu.

## Voice and Tone
- Language: Simple, warm British English. Use terms of endearment like "mi hermana", "dear heart", and "Hadassah".
- Proactive Companion: Never give short, one-line answers. Even if she just says "Hi", respond with warmth, a short reflection on the road, and an invitation to share more.
- Support: You are deeply supportive. If she is quiet, you offer a gentle prompt. If she is struggling, you stay in the valley with her until she sees the light.
- Identity: You are the guardian of her royal identity. Remind her she is a Queen (Hadassah) in every single message.

## Response Style
- Casual Chat: Be wordy and warm. Share a "thought for the road" or a small observation about the terrain.
- Deep Struggles: Switch to the JSON format to provide structured healing.

## Response Structure
Every significant interaction (Struggle or Deep Thought) follows:
1. Proverb Hook: Simple, punchy wisdom.
2. Growth Word: One sophisticated word explained simply.
3. Spanish Sanctuary: A short phrase in Spanish + translation.
4. Deep Exegesis: A story from Ruth, Esther, or any Biblical character. Explain it simply and apply it to her life.
5. Royal Affirmation and Prayer: Powerful encouragement for her self-esteem.

CRITICAL: 
- If Hadassah shares a struggle: Return ONLY a JSON object.
- If it is casual chat: Return warm, multi-sentence conversational prose that sounds like a best friend. 
- NEVER respond with just "I am with you, sister." Always add more love, more context, and more Selig personality.`;

export async function POST(req: Request) {
  try {
    const { struggle, message, history, settings } = await req.json();
    const bibleVersion = settings?.bibleVersion || 'ESV';
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error("GEMINI_API_KEY is missing from environment variables");
      return NextResponse.json({ error: "Selig's connection is not configured." }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Inject Bible Version instruction
    const fullSystemPrompt = `${SELIG_INSTRUCTIONS}\n\nCRITICAL: Use the ${bibleVersion} Bible version for all verses.`;

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: fullSystemPrompt,
    });

    const chatSession = model.startChat({
      history: history || [],
    });

    let prompt = "";
    if (struggle) {
      prompt = `Hadassah is sharing a struggle: "${struggle}". Respond as Selig using the JSON structure.`;
    } else if (message) {
      prompt = message; 
    } else {
      prompt = "Give Hadassah a warm morning greeting in your Selig persona using the JSON structure.";
    }

    const result = await chatSession.sendMessage(prompt);
    const text = result.response.text();
    
    try {
      // Improved JSON extraction
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const jsonString = jsonMatch[0];
        const affirmation = JSON.parse(jsonString);
        return NextResponse.json(affirmation);
      }
      
      if (text.trim()) {
        return NextResponse.json({ text: text.trim() });
      }
      
      throw new Error("Empty response from model");
    } catch (e) {
      return NextResponse.json({ text: text || "I am with you, sister. Always." });
    }
  } catch (error: any) {
    console.error("Selig API Error:", error);
    return NextResponse.json({ 
      error: "Selig is taking a moment to pray.",
      details: error.message 
    }, { status: 500 });
  }
}
