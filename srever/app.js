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

// Mock user data for login and registration
const USERS = [];

// Endpoint for login
app.post('/api/login', (req, res) => {
  let { username, password } = req.body;

  username = username.trim(); // Remove any leading/trailing spaces
  password = password.trim(); // Remove any leading/trailing spaces

  if (!username || !password) {
    console.error('Invalid input: Missing username or password');
    return res.status(400).json({ error: 'Invalid input' });
  }

  const user = USERS.find(
    (u) =>
      u.username.toLowerCase() === username.toLowerCase() &&
      u.password === password
  );

  if (user) {
    console.log('Login successful for:', username);
    res.status(200).json({ message: 'Login successful!' });
  } else {
    console.error('Login failed for username:', username);
    res.status(401).json({ error: 'Invalid username or password' });
  }
});

// Endpoint for account creation
app.post('/api/register', (req, res) => {
  let { username, password } = req.body;

  username = username.trim(); // Remove any leading/trailing spaces
  password = password.trim(); // Remove any leading/trailing spaces

  if (!username || !password) {
    console.error('Invalid input: Missing username or password');
    return res.status(400).json({ error: 'Invalid input' });
  }

  // Check if username already exists
  const existingUser = USERS.find(
    (u) => u.username.toLowerCase() === username.toLowerCase()
  );
  if (existingUser) {
    console.error('Username already exists:', username);
    return res.status(409).json({ error: 'Username already exists' });
  }

  // Create a new user
  USERS.push({ username, password });
  console.log('User registered:', USERS);
  res.status(201).json({ message: 'Account created successfully!' });
});

// Endpoint to fetch real-time news
app.get('/api/news', async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/top-headlines`, {
      params: {
        country: 'us', // Change the country as needed
        apiKey: NEWS_API_KEY,
        pageSize: 100,
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
