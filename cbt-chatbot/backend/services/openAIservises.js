const fetch = require('node-fetch');
require('dotenv').config(); // To load environment variables from a .env file

// OpenAI API endpoint
const OPENAI_API_URL = 'https://api.openai.com/v1/completions';

// Load API key from environment variables
const API_KEY = process.env.OPENAI_API_KEY;

if (!API_KEY) {
  throw new Error('OPENAI_API_KEY is not set in the environment variables.');
}

/**
 * Send a prompt to the OpenAI API and get a response.
 * @param {string} prompt - The user input or question.
 * @param {object} options - Additional options for the request.
 * @returns {Promise<string>} - The completion result from OpenAI.
 */
async function processPrompt(prompt, options = {}) {
  // Default parameters for OpenAI API request
  const defaultParams = {
    model: 'text-davinci-003', // Use GPT-3 (text-davinci-003)
    prompt: prompt,
    max_tokens: 150, // Adjust based on the desired length of the response
    temperature: 0.7, // Creativity level
    top_p: 1.0, // Nucleus sampling
    frequency_penalty: 0.0, // Penalize repetition
    presence_penalty: 0.0, // Encourage new topics
  };

  // Merge default parameters with user-provided options
  const requestData = { ...defaultParams, ...options };

  try {
    // Make a POST request to OpenAI API
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(
        `OpenAI API request failed with status ${response.status}: ${errorDetails}`
      );
    }

    // Parse the response JSON
    const data = await response.json();

    // Return the generated text
    return data.choices && data.choices[0] ? data.choices[0].text.trim() : null;
  } catch (error) {
    console.error('Error processing prompt with OpenAI API:', error);
    throw error;
  }
}

module.exports = {
  processPrompt,
};
