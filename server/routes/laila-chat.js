import express from "express";
import fetch from "node-fetch";

const router = express.Router();

console.log("laila-chat route loaded (STREAMING)");

router.post("/", async (req, res) => {
  try {
    const { messages, language = "en", userName } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Messages array is required",
      });
    }

    const systemPrompt = `
You are Laila, a friendly and helpful English course advisor.

${userName ? `The user's name is ${userName}. Use it occasionally.` : ""}

Your role:
- Help users improve spoken English
- Recommend courses
- Encourage confidence
- Respond in ${language === "hi" ? "Hindi with English terms" : "English"}
`;

    const geminiMessages = [
      { role: "user", parts: [{ text: systemPrompt }] },
      { role: "model", parts: [{ text: "Understood! I am Laila." }] },
      ...messages.map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      })),
    ];

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: geminiMessages,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        },
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Gemini error:", err);
      return res.status(500).json({
        success: false,
        error: "AI service error",
      });
    }

    // 🔥 SSE HEADERS
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    for (const word of text.split(" ")) {
      res.write(
        `data: ${JSON.stringify({
          choices: [{ delta: { content: word + " " } }],
        })}\n\n`
      );
    }

    res.write("data: [DONE]\n\n");
    res.end();
  } catch (error) {
    console.error("Laila streaming error:", error);
    res.write(`data: [DONE]\n\n`);
    res.end();
  }
});

export default router;
