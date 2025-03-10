const express = require("express");
const { OpenAI } = require("openai");
const dotenv = require("dotenv").config();

const airouter = express.Router();

// Initialize OpenAI
if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is missing in the environment variables.");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// AI Chatbot endpoint
airouter.post("/ai-chat", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    // Send the user's message to OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Use GPT-3.5 or GPT-4
      messages: [
        { role: "system", content: "You are a helpful assistant." }, // System message
        { role: "user", content: message }, // User's message
      ],
      max_tokens: 150, // Limit response length
    });

    // Extract the AI's response
    const aiResponse = response.choices[0].message.content;

    // Send the response back to the client
    res.json({ response: aiResponse });
  } catch (error) {
    console.error("Error communicating with OpenAI:", error);
    res.status(500).json({ error: "Failed to process your request" });
  }
});

module.exports = airouter