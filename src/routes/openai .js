const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv").config();
const cors = require("cors");

const airouter = express.Router();
const corsOptions = {
  origin: "http://localhost:5173", // Allow only your frontend origin
  credentials: true, // Allow cookies and authorization headers
};

airouter.use(cors(corsOptions));
airouter.use(express.json());

// Ensure API key is present
if (!process.env.OPENROUTER_API_KEY) {
  throw new Error("OPENROUTER_API_KEY is missing in the environment variables.");
}

// Retry function with exponential backoff
const retryWithBackoff = async (fn, retries = 3, delay = 1000) => {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0 || error.response?.status !== 429) {
      throw error;
    }
    await new Promise((resolve) => setTimeout(resolve, delay));
    return retryWithBackoff(fn, retries - 1, delay * 2);
  }
};

// AI Chatbot endpoint using OpenRouter
airouter.post("/ai-chat", async (req, res) => {
  const { message } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const response = await retryWithBackoff(async () => {
      return await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "openai/gpt-3.5-turbo", // Change model if needed (e.g., mistral or mixtral)
          messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: message },
          ],
          max_tokens: 150,
        },
        {
          headers: {
            "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
    });

    // Extract response
    const aiResponse = response.data.choices[0].message.content;

    // Send response back to the client
    res.json({ response: aiResponse });
  } catch (error) {
    console.error("Error communicating with OpenRouter:", error.response?.data || error.message);

    if (error.response?.status === 429) {
      res.status(429).json({ error: "Rate limit exceeded. Please try again later." });
    } else if (error.response?.status === 401) {
      res.status(401).json({ error: "Invalid API key. Please check your OpenRouter API key." });
    } else {
      res.status(500).json({ error: "Failed to process your request. Please try again." });
    }
  }
});

module.exports = airouter;
