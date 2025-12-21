import express from "express";
import fetch from "node-fetch";

const router = express.Router();

console.log("generate-listening-audio route loaded");

router.post("/", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "Text is required" });
    }

    const response = await fetch(
      "https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL",
      {
        method: "POST",
        headers: {
          "xi-api-key": process.env.ELEVENLABS_API_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.7
          }
        })
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error("ElevenLabs error:", err);
      throw new Error("Audio generation failed");
    }

    const audioBuffer = Buffer.from(await response.arrayBuffer());

    res.set({
      "Content-Type": "audio/mpeg",
      "Content-Disposition": "inline; filename=audio.mp3"
    });

    res.send(audioBuffer);

  } catch (error) {
    console.error("Listening audio generation failed:", error.message);
    res.status(500).json({ error: "Listening audio generation failed" });
  }
});

export default router;
