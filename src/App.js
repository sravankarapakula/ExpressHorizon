import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    // Fetch news articles from the backend
    fetch('http://localhost:5000/api/news')
      .then((response) => response.json())
      .then((data) => setNews(data))
      .catch((error) => console.error('Error fetching news:', error));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Express Horizon</h1>
      </header>
      <main>
        {news.length > 0 ? (
          news.map((article, index) => (
            <div key={index} className="news-item">
              <h2>{article.title}</h2>
              <img src={article.urlToImage} alt={article.title} style={{ maxWidth: '100%' }} />
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
      <footer className="App-footer">
        <p>&copy; 2024 Express Horizon</p>
      </footer>
    </div>
  );
};

export default App;
