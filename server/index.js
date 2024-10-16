// main.js
import express from "express";
import { Model } from "./Model.js";  

const app = express();
app.use(express.json());  // Middleware to parse JSON bodies

// Define a POST endpoint to generate AI replies
app.post("/generate-reply", async (req, res) => {
  const { content } = req.body;  // Extract 'content' from the request body

  if (!content) {
    return res.status(400).json({ error: "Message content is required" });
  }

  try {
    // Call the AI model to generate a reply
    const reply = await Model({ content });
    return res.json({ reply });
  } catch (error) {
    console.error("Error generating reply:", error);
    return res.status(500).json({ error: "Failed to generate reply" });
  }
});

// Start the server on port 3000 or a provided port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
