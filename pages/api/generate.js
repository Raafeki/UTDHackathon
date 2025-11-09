import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: "No text provided." });
  }

  try {
    // 1. Ensure you have GEMINI_API_KEY in your .env.local
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // 💡 FIX: Updated the model name to the current recommended stable alias.
    // 'gemini-2.5-flash' is the stable alias for the high-performance model.
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
    You are an **action-oriented, results-focused** Product Manager AI. Your goal is to generate a simple, direct summary for a sprint planning meeting. **Do not use corporate jargon or marketing language.**
    
    Analyze the sprint backlog text below and produce the following, **using simple language and bullet points wherever possible**:
    
    **SPRINT GOAL (1 Sentence, focused on the outcome):**
    
    **KEY DELIVERABLES (Short list of 3-4 simple bullet points):**
    - Deliverable 1
    - Deliverable 2
    
    **RISKS & BLOCKERS (Short list of simple bullet points):**
    - Risk/Blocker 1
    - Risk/Blocker 2
    
    **STAKEHOLDER CHECK-IN (A short, confident paragraph, max 3 sentences):**
    
    Backlog:
    ${text}
    `;

    // ✅ Correct call format for v1 API
    const result = await model.generateContent(prompt);

    const output = result.response.text();
    return res.status(200).json({ output });

  } catch (error) {
    // 💡 IMPROVEMENT: Use the name property if available for better error logging
    const errorMessage = error.message || "An unknown AI error occurred.";
    console.error("AI ERROR →", error);
    return res.status(500).json({ error: errorMessage });
  }
}