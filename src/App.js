import React, { useState, useEffect } from 'react';
import './App.css';

const LoginPage = ({ onLoginSuccess, onSwitchToRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        onLoginSuccess();
      } else {
        const data = await response.json();
        console.error('Login failed:', data.error);
        setError(data.error || 'An unexpected error occurred. Please try again.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleLogin}>
        <h1>Login</h1>
        {error && <p className="error">{error}</p>}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
        <p>
          Don't have an account?{' '}
          <span className="link" onClick={onSwitchToRegister}>
            Create one
          </span>
        </p>
      </form>
    </div>
  );
};

const RegisterPage = ({ onSwitchToLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        setSuccess('Account created successfully! Please login.');
        setError('');
        setUsername('');
        setPassword('');
      } else {
        const data = await response.json();
        setError(data.error || 'An unexpected error occurred. Please try again.');
        setSuccess('');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      setError('An unexpected error occurred. Please try again.');
      setSuccess('');
    }
  };

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleRegister}>
        <h1>Create Account</h1>
        {success && <p className="success">{success}</p>}
        {error && <p className="error">{error}</p>}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Register</button>
        <p>
          Already have an account?{' '}
          <span className="link" onClick={onSwitchToLogin}>
            Login here
          </span>
        </p>
      </form>
    </div>
  );
};

const NewsPage = () => {
  const [news, setNews] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredNews, setFilteredNews] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/news')
      .then((response) => response.json())
      .then((data) => {
        const validNews = data.filter((article) => article.urlToImage);
        setNews(validNews);
        setFilteredNews(validNews);
      })
      .catch((error) => console.error('Error fetching news:', error));
  }, []);

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    if (query.length > 0) {
      const filtered = news.filter(
        (article) =>
          article.title.toLowerCase().includes(query) ||
          (article.description && article.description.toLowerCase().includes(query))
      );
      setFilteredNews(filtered);
      const filteredSuggestions = news
        .filter((article) =>
          article.title.toLowerCase().includes(query)
        )
        .map((article) => article.title);
      setSuggestions(filteredSuggestions);
    } else {
      setFilteredNews(news);
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    const filtered = news.filter((article) =>
      article.title.toLowerCase().includes(suggestion.toLowerCase())
    );
    setFilteredNews(filtered);
    setSuggestions([]);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Global Nexus</h1>
        <p className="tagline">Connecting You to the World's Pulse</p>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search news..."
            value={searchQuery}
            onChange={handleSearch}
            className="search-input"
          />
          <ul className="suggestions">
            {suggestions.map((suggestion, index) => (
              <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      </header>
      <main>
        {filteredNews.length > 0 ? (
          filteredNews.map((article, index) => (
            <div key={index} className="news-item">
              <h2>
                <a href={article.url} target="_blank" rel="noopener noreferrer">
                  {article.title}
                </a>
              </h2>
              <img src={article.urlToImage} alt={article.title} />
              <p>{article.description}</p>
              <a href={article.url} target="_blank" rel="noopener noreferrer">
                Read More
              </a>
            </div>
          ))
        ) : (
          <p>Loading news...</p>
        )}
      </main>
    </div>
  );
};

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [isRegisterPage, setIsRegisterPage] = useState(false);

  const handleLoginSuccess = () => {
    setLoggedIn(true);
  };

  const handleSwitchToRegister = () => {
    setIsRegisterPage(true);
  };

  const handleSwitchToLogin = () => {
    setIsRegisterPage(false);
  };

  return (
    <div className="App">
      {loggedIn ? (
        <NewsPage />
      ) : isRegisterPage ? (
        <RegisterPage onSwitchToLogin={handleSwitchToLogin} />
      ) : (
        <LoginPage onLoginSuccess={handleLoginSuccess} onSwitchToRegister={handleSwitchToRegister} />
      )}
    </div>
  );
};

export default App;
