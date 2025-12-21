import express from "express";
import fetch from "node-fetch";

const router = express.Router();

console.log(" laila-chat route loaded");

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    // Validation (same intent as TS)
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required" });
    }

    // Prompt mirrors laila-chat.ts behavior
    const prompt = `
You are Laila, a friendly English-speaking coach.

Your role:
- Help students improve spoken English
- Correct grammar gently
- Suggest better sentence structures
- Encourage confidence
- Keep replies short, clear, and conversational

Student message:
"${message}"

Reply in plain text only.
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (!data.candidates) {
      console.error("Gemini raw error:", data);
      return res.status(500).json({ error: "AI response failed" });
    }

    const reply = data.candidates[0].content.parts[0].text;

    res.json({
      reply
    });

  } catch (error) {
    console.error("Laila chat failed:", error.message);
    res.status(500).json({ error: "Chat failed" });
  }
});

export default router;