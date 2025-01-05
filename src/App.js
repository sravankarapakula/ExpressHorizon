// import React, { useState, useEffect } from 'react';
// import './App.css';

// const App = () => {
//   const [news, setNews] = useState([]);

//   useEffect(() => {
//     // Fetch news articles from the backend
//     fetch('http://localhost:5000/api/news')
//       .then((response) => response.json())
//       .then((data) => {
//         // Filter out articles that don't have an image
//         const filteredNews = data.filter(article => article.urlToImage);
//         setNews(filteredNews);
//       })
//       .catch((error) => console.error('Error fetching news:', error));
//   }, []);

//   return (
//     <div className="App">
//       <header className="App-header">
//         <h1>Global Nexus</h1>
//       </header>
//       <main>
//         {news.length > 0 ? (
//           news.map((article, index) => (
//             <div key={index} className="news-item">
//               <h2><a href={article.url} target="_blank" rel="noopener noreferrer" title={article.title}>
//               {article.title} </a></h2>
//               <img src={article.urlToImage} alt={article.title} style={{ maxWidth: '100%' }} />
//               <p>{article.description}</p>
//               <a href={article.url} target="_blank" rel="noopener noreferrer">
//                 Read More
//               </a>
//             </div>
//           ))
//         ) : (
//           <p>Loading news...</p>
//         )}
//       </main>
//       <footer className="App-footer">
//         <p>&copy; 2024 Global Nexus</p>
//       </footer>
//     </div>
//   );
// };

// export default App;
import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [news, setNews] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredNews, setFilteredNews] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    // Fetch news articles from the backend
    fetch('http://localhost:5000/api/news')
      .then((response) => response.json())
      .then((data) => {
        // Filter out articles that don't have an image
        const validNews = data.filter((article) => article.urlToImage);
        setNews(validNews);
        setFilteredNews(validNews); // Initialize filtered news
      })
      .catch((error) => console.error('Error fetching news:', error));
  }, []);

  // Handle search input
  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    if (query.length > 0) {
      // Filter news based on title or description
      const filtered = news.filter(
        (article) =>
          article.title.toLowerCase().includes(query) ||
          (article.description && article.description.toLowerCase().includes(query))
      );

      // Update filtered news
      setFilteredNews(filtered);

      // Update suggestions
      const filteredSuggestions = news
        .filter((article) =>
          article.title.toLowerCase().includes(query)
        )
        .map((article) => article.title);

      setSuggestions(filteredSuggestions);
    } else {
      setFilteredNews(news); // Reset to all news if query is empty
      setSuggestions([]); // Clear suggestions
    }
  };

  // Handle suggestion click
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
          <button className="search-icon">
            <i className="fas fa-search"></i>
          </button>
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
                <a href={article.url} target="_blank" rel="noopener noreferrer" title={article.title}>
                  {article.title}
                </a>
              </h2>
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
        <p>&copy; 2024 Global Nexus</p>
      </footer>
    </div>
  );
};

export default App;
