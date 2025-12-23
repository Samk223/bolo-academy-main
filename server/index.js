import express from "express";
import pool from "./db.js";
import cors from "cors";
import bookingsRoute from "./routes/bookings.js";
import evaluateTestRoute from "./routes/evaluate-test.js";
import generateListeningAudio from "./routes/generate-listening-audio.js";
import lailaChatRoute from "./routes/laila-chat.js";
import slotsRoute from "./routes/slots.js";
import dotenv from "dotenv"; 

dotenv.config();


const app = express();
const PORT = process.env.PORT || 3000;


console.log(" SERVER INDEX.JS FROM /server IS RUNNING");

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:8080",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use("/bookings", bookingsRoute);
app.use("/evaluate-test", evaluateTestRoute);
app.use("/generate-listening-audio", generateListeningAudio);
app.use("/laila-chat", lailaChatRoute);
app.use("/slots", slotsRoute);

app.get("/", (req, res) => {
  res.send("Backend server is running");
});

app.get("/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      message: "Database connected successfully",
      time: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ error: "Database connection failed" });
  }
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
