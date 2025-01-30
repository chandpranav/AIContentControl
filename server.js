require('dotenv').config();
const axios = require('axios');

const API_URL = "https://api-inference.huggingface.co/models/microsoft/DialoGPT-large"; // AI model for text-based responses
const API_KEY = process.env.HUGGINGFACE_API_KEY;

// Function to generate Instagram manipulation instructions
async function manipulateInstagram(userInput, targetInterest) {
    const prompt = `I am getting content related to ${userInput} on Instagram. I want to see content about ${targetInterest}. 
    Suggest engagement behaviors to manipulate Instagram’s recommendation system, including:
    - Hashtags to follow
    - Accounts to engage with
    - Search queries to use
    - How to interact with posts (likes, comments, saves)`;

    const data = { "inputs": prompt };

    try {
        const response = await axios.post(API_URL, data, {
            headers: { Authorization: `Bearer ${API_KEY}` }
        });

        console.log("AI Suggestions:", response.data);
    } catch (error) {
        console.error("Error:", error.response ? error.response.data : error.message);
    }
}

// Example usage
manipulateInstagram("tech products", "traveling the mountains");
