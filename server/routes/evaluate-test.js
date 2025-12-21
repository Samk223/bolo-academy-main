import express from "express";
import fetch from "node-fetch";

const router = express.Router();

console.log("evaluate-test route loaded");

router.post("/", async (req, res) => {
  try {
    const { answers } = req.body;

    if (!answers || typeof answers !== "string") {
      return res.status(400).json({ error: "Answers text is required" });
    }

    const prompt = `
You are an English proficiency evaluator.

Analyze the following student's answers and return STRICT JSON with:
{
  "grammar_score": number,
  "vocabulary_score": number,
  "fluency_score": number,
  "cefr_level": "A1|A2|B1|B2|C1",
  "feedback": string
}

Student Answers:
"${answers}"
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
      return res.status(500).json({ error: "Gemini API error" });
    }

    const text = data.candidates[0].content.parts[0].text;


    const cleanedText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    res.json({
      evaluation: JSON.parse(cleanedText)
    });


  } catch (error) {
    console.error("Test evaluation failed:", error);
    res.status(500).json({ error: "Evaluation failed" });
  }
});

export default router;
