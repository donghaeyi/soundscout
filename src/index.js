require('dotenv').config();
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const PORT = 3000;
 
// Middleware
app.use(express.static(path.join(__dirname, "resources")));

// Handlebars setup
const hbs = exphbs.create({
  extname: ".hbs",
  layoutsDir: path.join(__dirname, "views", "layouts"),
  partialsDir: path.join(__dirname, "views", "partials"),
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

// Routes
app.get("/", (req, res) => {
  res.redirect("/home");
});

app.get("/home", (req, res) => {
  res.render("pages/home");
});

app.get("/recognition", (req, res) => {
  res.render("pages/recognition");
});

app.get("/learnmore", (req, res) => {
  const instrument = req.query.instrument || "instrument";
  res.render("pages/learnmore", { instrument }); // optional: pass instrument to view
});

// ==============================
// Gemini API: Instrument Overview
// ==============================
// Note: This relies on the new API key in .env being valid.
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

app.get("/api/overview", async (req, res) => {
  const instrument = req.query.instrument;
  if (!instrument) {
    return res.status(400).json({ error: "Missing 'instrument' query parameter." });
  }

  try {
    // FIX 1: Switched to the current stable alias for better compatibility.
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `Give a short, 6-7 sentence beginner-friendly description of the musical instrument "${instrument}". Avoid technical jargon and keep it simple. Only provide the descriptive text, no introductory phrases.`;

    // *** CRITICAL FIX: Corrected the generateContent call structure. ***
    // We now pass the 'prompt' string as the first argument, and the configuration
    // object as the second argument. This resolves the 400 Bad Request error.
    const result = await model.generateContent(
        prompt,
        {
            maxOutputTokens: 300 // Limits output size for reliable short responses.
        }
    );
    
    // The previous fix (calling .text() as a function) is still necessary and correct.
    let overview = result.response.text(); 
    
    if (!overview || overview.trim().length === 0) {
        overview = "";
        console.warn(`\n--- Gemini returned NO TEXT for instrument: ${instrument} ---`);
        
        // Log feedback to understand why the content was empty (e.g., safety blocking)
        if (result.response.promptFeedback) {
            console.warn("Prompt Feedback (Reason for Block):", JSON.stringify(result.response.promptFeedback, null, 2));
        }
        if (result.response.candidates && result.response.candidates.length > 0) {
            console.warn("Candidate Finish Reason:", result.response.candidates[0].finishReason);
        }
        console.warn("-----------------------------------------------------------------\n");
    }

    res.json({ overview });
  } catch (error) {
    console.error("Gemini API error:", error);
    res.status(500).json({ error: "Failed to generate overview." });
  }
});

// Server start
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
