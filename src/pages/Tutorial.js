import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './Tutorial.css';

// ...your full tutorials array as in your first block (with tags, resources, etc.)...

const tutorials = [
  // ...existing tutorials array (with tags, resources, etc.)...
  // (Keep the full, detailed tutorials array here. Remove the second, short array.)
];

function Tutorial() {
  const { category } = useParams(); // Support category routes (e.g., /tutorials/html)
  const [selectedCategory, setSelectedCategory] = useState(category || 'All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedTutorials, setExpandedTutorials] = useState({});

  const categories = ['All', ...new Set(tutorials.map(t => t.category))];

  // Sync URL param with selected category
  useEffect(() => {
    if (category && categories.includes(category)) {
      setSelectedCategory(category);
    }
    // eslint-disable-next-line
  }, [category]);

  // Filter tutorials by category and search query
  const filteredTutorials = tutorials
    .filter(t => selectedCategory === 'All' || t.category === selectedCategory)
    .filter(t =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.tags && t.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
    );

  // Toggle tutorial expansion
  const toggleTutorial = (id) => {
    setExpandedTutorials(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="tutorial-container" id="tutorials-section">
      <h1 id="tutorials-heading">Web Development Tutorials</h1>

      {/* Search Bar */}
      <div className="search-bar" role="search">
        <label htmlFor="search-input" className="sr-only">Search Tutorials</label>
        <input
          id="search-input"
          type="text"
          placeholder="Search by title, description, or tag..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-describedby="search-help"
        />
        <span id="search-help" className="sr-only">
          Enter keywords to find tutorials
        </span>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar" id="filter-bar">
        <label htmlFor="category-select">Filter by Category: </label>
        <select
          id="category-select"
          onChange={(e) => setSelectedCategory(e.target.value)}
          value={selectedCategory}
          aria-label="Select tutorial category"
        >
          {categories.map((cat, i) => (
            <option key={`cat-${i}`} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Tutorial List */}
      <div className="tutorial-list" id="tutorial-list">
        {filteredTutorials.length === 0 ? (
          <p id="no-results">No tutorials found. Try adjusting your search or category.</p>
        ) : (
          filteredTutorials.map(tutorial => (
            <div
              key={tutorial.id}
              className={`tutorial-card ${expandedTutorials[tutorial.id] ? 'expanded' : ''}`}
              id={`tutorial-${tutorial.id}`}
            >
              <div
                className="tutorial-header"
                onClick={() => toggleTutorial(tutorial.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && toggleTutorial(tutorial.id)}
                aria-expanded={expandedTutorials[tutorial.id]}
                aria-controls={`tutorial-content-${tutorial.id}`}
              >
                <h2 id={`tutorial-title-${tutorial.id}`}>{tutorial.title}</h2>
                <span className="toggle-icon">
                  {expandedTutorials[tutorial.id] ? '−' : '+'}
                </span>
              </div>
              <div
                className="tutorial-content"
                id={`tutorial-content-${tutorial.id}`}
                aria-hidden={!expandedTutorials[tutorial.id]}
              >
                <p id={`tutorial-desc-${tutorial.id}`}>{tutorial.description}</p>
                <div className="tutorial-tags" id={`tutorial-tags-${tutorial.id}`}>
                  {tutorial.tags && tutorial.tags.map((tag, i) => (
                    <span key={`tag-${tutorial.id}-${i}`} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="video-count" id={`video-count-${tutorial.id}`}>
                  Videos: {tutorial.videos.length}
                </p>
                <div className="video-container" id={`video-container-${tutorial.id}`}>
                  {tutorial.videos.map((video, index) => (
                    <iframe
                      key={video.id}
                      width="100%"
                      height="315"
                      src={video.url}
                      title={`${tutorial.title} Video ${index + 1}`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      id={`video-${video.id}`}
                      loading="lazy"
                    ></iframe>
                  ))}
                </div>
                {tutorial.resources && (
                  <div className="resource-links" id={`resources-${tutorial.id}`}>
                    <h3>Additional Resources</h3>
                    <ul>
                      {tutorial.resources.map((resource, i) => (
                        <li key={`resource-${tutorial.id}-${i}`}>
                          <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            id={`resource-link-${tutorial.id}-${i}`}
                          >
                            {resource.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Tutorial;