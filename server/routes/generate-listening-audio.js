import express from "express";
import fetch from "node-fetch";
import fs from "fs";
import path from "path";

const router = express.Router();

console.log("generate-listening-audio route loaded (MOCK + FALLBACK)");

router.post("/", async (req, res) => {
  try {
    const { text, questionId } = req.body;

    const finalText =
      text ||
      (typeof questionId === "number"
        ? `You will now hear listening question number ${questionId}. Please listen carefully and answer.`
        : null);

    if (!finalText || typeof questionId !== "number") {
      return res.status(400).json({
        error: "questionId (number) is required",
      });
    }

    /* -------------------------------------------------
       1️ MOCK AUDIO (PRIMARY – FAST & SAFE)
    -------------------------------------------------- */
    const mockAudioPath = path.join(
      process.cwd(),
      "mock-audio",
      `q${questionId}.mp3`
    );

    if (fs.existsSync(mockAudioPath)) {
      const buffer = fs.readFileSync(mockAudioPath);
      const base64Audio = buffer.toString("base64");

      return res.json({
        audioContent: base64Audio,
        transcript: finalText,
      });
    }

    /* -------------------------------------------------
       2️ ELEVENLABS FALLBACK (OPTIONAL)
       Enable only if explicitly allowed
    -------------------------------------------------- */
    if (process.env.ENABLE_ELEVENLABS !== "true") {
      return res.status(503).json({
        error: "Audio service unavailable",
      });
    }

    const elevenRes = await fetch(
      "https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL",
      {
        method: "POST",
        headers: {
          "xi-api-key": process.env.ELEVENLABS_API_KEY,
          "Content-Type": "application/json",
          Accept: "audio/mpeg",
        },
        body: JSON.stringify({
          text: finalText,
          model_id: "eleven_turbo_v2",
          voice_settings: {
            stability: 0.4,
            similarity_boost: 0.75,
          },
        }),
      }
    );

    if (!elevenRes.ok) {
      const errText = await elevenRes.text();
      console.error("ElevenLabs API error:", errText);
      return res.status(500).json({
        error: "Failed to generate listening audio",
      });
    }

    const buffer = Buffer.from(await elevenRes.arrayBuffer());
    const base64Audio = buffer.toString("base64");

    res.json({
      audioContent: base64Audio,
      transcript: finalText,
    });

  } catch (error) {
    console.error("Listening audio generation error:", error);
    res.status(500).json({
      error: "Listening audio generation failed",
    });
  }
});

export default router;
