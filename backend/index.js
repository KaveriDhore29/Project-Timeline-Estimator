import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/estimate", async (req, res) => {
  const { description, techStack, teamType } = req.body;

  const prompt = `
You are a senior software architect.

Estimate the project based on:
Project Description: ${description}
Tech Stack: ${techStack}
Team Type: ${teamType}

Return ONLY valid JSON with:
- estimated_duration
- team_size
- roles
- feature_breakdown
- risks
- complexity
`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    res.json(JSON.parse(response.choices[0].message.content));
  } catch (err) {
    res.status(500).json({ error: "Estimation failed" });
  }
});

app.listen(3000, () => {
  console.log("AI Estimator API running on port 3000");
});
