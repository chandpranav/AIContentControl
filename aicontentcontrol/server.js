require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("public"));


const API_URL = "https://api.openai.com/v1/chat/completions";
const API_KEY = process.env.OPENAI_API_KEY; // Store key in .env

app.post('/get-strategy', async (req, res) => {
    const { platform, userInterest, targetInterest } = req.body;

    // Use all three to shape the user prompt
    const data = {
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "system",
                content: "You are a social media expert helping users manipulate recommendation systems."
            },
            {
                role: "user",
                content: `I currently see content about ${userInterest} on ${platform}. I want to change my recommendations to ${targetInterest}.
                Provide engagement strategies including:
                - 5 accounts to follow
                - 5 relevant hashtags
                - 3 search queries to perform daily
                - Types of posts to interact with (like/comment/save)
                - Actions to avoid to prevent seeing old content`
            }
        ],
        temperature: 0.7
    };

    try {
        const response = await axios.post(API_URL, data, {
            headers: { Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json" }
        });

        res.json({ strategy: response.data.choices[0].message.content });
    } catch (error) {
        res.status(500).json({ error: "API Request Failed" });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



