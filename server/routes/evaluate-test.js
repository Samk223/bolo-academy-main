import express from "express";
import fetch from "node-fetch";

const router = express.Router();

console.log(" evaluate-test route loaded");

router.post("/", async (req, res) => {
  const { testType, answers } = req.body;
  try {

    // ---------------- VALIDATION ----------------
    if (!testType || !["written", "listening"].includes(testType)) {
      return res.status(400).json({ error: "Invalid or missing testType" });
    }

    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ error: "Answers array is required" });
    }

    // ---------------- PROMPT BUILDING ----------------
    const formattedAnswers = answers
      .map(
        (a) => `
Question ID: ${a.questionId}
Question (${a.type}): ${a.question}
Student Answer: ${a.answer || "No answer"}
`
      )
      .join("\n");

    const prompt = `
You are an English proficiency evaluator.

Evaluate each answer separately on:
- Grammar (0–100)
- Vocabulary (0–100)
- Coherence (0–100)
- Fluency (0–100)

Then provide:
- Overall feedback
- Strengths (array)
- Areas to improve (array)
- CEFR level (A1–C1)
- Recommended course name
- Final percentage score (0–100)

Return STRICT JSON ONLY in this format:

{
  "scorePercentage": number,
  "cefrLevel": "A1|A2|B1|B2|C1",
  "recommendedCourse": string,
  "evaluation": {
    "evaluations": [
      {
        "questionId": number,
        "grammar": number,
        "vocabulary": number,
        "coherence": number,
        "fluency": number,
        "feedback": string
      }
    ],
    "overallFeedback": string,
    "strengths": string[],
    "areasToImprove": string[]
  }
}

Test Type: ${testType.toUpperCase()}

Student Answers:
${formattedAnswers}
`;


    const hasMeaningfulAnswer = answers.some(
      a => a.answer && a.answer.trim().length > 10
    );

    if (!hasMeaningfulAnswer) {
      return res.status(200).json({
        scorePercentage: 10,
        cefrLevel: "A1",
        recommendedCourse: "Basic English Foundation",
        evaluation: {
          evaluations: answers.map(a => ({
            questionId: a.questionId,
            grammar: 10,
            vocabulary: 10,
            coherence: 10,
            fluency: 10,
            feedback: "Answer too short to evaluate meaningfully."
          })),
          overallFeedback: "Please provide longer answers for accurate evaluation.",
          strengths: [],
          areasToImprove: ["Expand your answers"]
        },
        answers
      });
    }



    // ---------------- GEMINI CALL ----------------
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }]
            }
          ]
        }),
      }
    );


    const data = await response.json();

    if (
      !data ||
      !Array.isArray(data.candidates) ||
      !data.candidates[0]?.content?.parts?.[0]?.text
    ) {
      console.error(" Gemini raw response:", data);
      throw new Error("Invalid Gemini response");
    }


    let text = data.candidates[0].content.parts[0].text;

    // ---------------- CLEAN & PARSE ----------------
    text = text.replace(/```json|```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (err) {
      console.error("❌ JSON parse failed:", text);
      return res.status(500).json({ error: "Invalid AI response format" });
    }

    // ---------------- FINAL RESPONSE (FRONTEND SAFE) ----------------
    res.json({
      ...parsed,
      answers, // echo back answers (frontend expects this)
    });

  } catch (error) {
    console.error("Gemini evaluation failed:", error);

    return res.status(200).json({
      scorePercentage: 0,
      cefrLevel: "N/A",
      recommendedCourse: "Please try again",
      evaluation: {
        evaluations: answers.map((a) => ({
          questionId: a.questionId,
          grammar: 0,
          vocabulary: 0,
          coherence: 0,
          fluency: 0,
          feedback: "Evaluation could not be completed."
        })),
        overallFeedback: "AI evaluation failed. Please try again later.",
        strengths: [],
        areasToImprove: []
      },
      answers
    });
  }

});

export default router;
