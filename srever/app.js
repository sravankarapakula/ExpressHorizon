const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// NewsAPI configuration
const NEWS_API_KEY = '3a40ebeb9dad4641975cf04ccbb8fc92'; // Replace with your NewsAPI key
const BASE_URL = 'https://newsapi.org/v2';

// Endpoint to fetch real-time news
app.get('/api/news', async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/top-headlines`, {
      params: {
        country: 'us', // Change the country as needed
        apiKey: NEWS_API_KEY,
        pageSize: 100, // Increase the number of articles per request
        page: 1,
      },
    });
    res.json(response.data.articles);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

