import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import './Tutorial.css';

const tutorials = [
  // HTML
  {
    id: 'html-1',
    category: 'HTML',
    title: 'HTML Basics',
    description: 'Learn the foundations of HTML and how to structure a webpage.',
    tags: ['Semantics', 'Forms', 'Elements'],
    videos: [
      { type: 'YouTube', url: 'https://www.youtube.com/embed/dD2EISBDjWM', id: 'html-basics-1' },
      { type: 'YouTube', url: 'https://www.youtube.com/embed/BsDoLVMnmZs', id: 'html-basics-2' },
      { type: 'YouTube', url: 'https://www.youtube.com/embed/pQN-pnXPaVg', id: 'html-basics-3' },
      { type: 'YouTube', url: 'https://www.youtube.com/embed/UB1O30fR-EE', id: 'html-basics-4' },
    ],
    resources: [
      { name: 'MDN HTML Docs', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML' },
      { name: 'W3Schools HTML', url: 'https://www.w3schools.com/html/' },
    ],
  },
  {
    id: 'html-2',
    category: 'HTML',
    title: 'HTML5 Advanced Features',
    description: 'Explore HTML5 features like semantic elements, canvas, and more.',
    tags: ['HTML5', 'Canvas', 'Web APIs'],
    videos: [
      { type: 'YouTube', url: 'https://www.youtube.com/embed/E3ByCRqE7Lo?si=tdtENZnMtLBdpQuJ', id: 'html5-1' },
      { type: 'YouTube', url: 'https://www.youtube.com/embed/mJgBOIoGihA?si=gdCPfswEnYitF-rI', id: 'html5-2' },
    ],
    resources: [
      { name: 'HTML5 Rocks', url: 'https://www.html5rocks.com/' },
    ],
  },
  // CSS
  {
    id: 'css-1',
    category: 'CSS Basics',
    title: 'CSS Fundamentals',
    description: 'Master the art of styling web pages with CSS.',
    tags: ['Box Model', 'Flexbox', 'Grid'],
    videos: [
      { type: 'YouTube', url: 'https://www.youtube.com/embed/yfoY53QXEnI', id: 'css-fund-1' },
      { type: 'YouTube', url: 'https://www.youtube.com/embed/OXGznpKZ_sA', id: 'css-fund-2' },
      { type: 'YouTube', url: 'https://www.youtube.com/embed/1Rs2ND1ryYc', id: 'css-fund-3' },
      { type: 'YouTube', url: 'https://www.youtube.com/embed/6vJ8g0d3b9k', id: 'css-fund-4' },
    ],
    resources: [
      { name: 'MDN CSS Docs', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS' },
      { name: 'CSS-Tricks', url: 'https://css-tricks.com/' },
    ],
  },
  {
    id: 'css-2',
    category: 'CSS Basics',
    title: 'Advanced CSS',
    description: 'Learn animations, transitions, and responsive design.',
    tags: ['Animations', 'Media Queries', 'SASS'],
    videos: [
      { type: 'YouTube', url: 'https://www.youtube.com/embed/0hrJGWrCux0?si=nti0LGAIiPVnBtLI', id: 'css-adv-1' },
      { type: 'YouTube', url: 'https://www.youtube.com/embed/ZuZizqDF4q8', id: 'css-adv-2' },
    ],
    resources: [
      { name: 'SASS Docs', url: 'https://sass-lang.com/documentation' },
    ],
  },
  {
    id: 'css-3',
    category: 'CSS Basics',
    title: 'Tailwind CSS Basics',
    description: 'Get started with Tailwind CSS for rapid styling.',
    tags: ['Utility-First', 'Tailwind', 'Responsive'],
    videos: [
      { type: 'YouTube', url: 'https://www.youtube.com/embed/mr15Xzb1Ook', id: 'tailwind-1' },
      { type: 'YouTube', url: 'https://www.youtube.com/embed/6biMWgD6_JY?si=OpaaIet9CHnDQR90', id: 'tailwind-2' },
    ],
    resources: [
      { name: 'Tailwind CSS Docs', url: 'https://tailwindcss.com/docs' },
    ],
  },
  // JavaScript
  {
    id: 'js-1',
    category: 'JavaScript',
    title: 'JavaScript Fundamentals',
    description: 'Understand JavaScript concepts and start coding interactive websites.',
    tags: ['DOM', 'Events', 'Functions'],
    videos: [
      { type: 'YouTube', url: 'https://www.youtube.com/embed/hdI2bqOjy3c', id: 'js-fund-1' },
      { type: 'YouTube', url: 'https://www.youtube.com/embed/W6NZfCO5SIk', id: 'js-fund-2' },
      { type: 'YouTube', url: 'https://www.youtube.com/embed/PKwu15ldZ7k', id: 'js-fund-3' },
    ],
    resources: [
      { name: 'MDN JavaScript Docs', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript' },
      { name: 'JavaScript.info', url: 'https://javascript.info/' },
    ],
  },
  {
    id: 'js-2',
    category: 'JavaScript',
    title: 'Advanced JavaScript',
    description: 'Deep dive into JavaScript ES6+ features and best practices.',
    tags: ['ES6', 'Promises', 'Async/Await'],
    videos: [
      { type: 'YouTube', url: 'https://www.youtube.com/embed/NCwa_xi0Uuc', id: 'js-adv-1' },
      { type: 'YouTube', url: 'https://www.youtube.com/embed/8aGhZQkoFbQ', id: 'js-adv-2' },
      { type: 'YouTube', url: 'https://www.youtube.com/embed/rfObCuGLSek', id: 'js-adv-3' },
    ],
    resources: [
      { name: 'ES6 Features', url: 'https://es6.io/' },
    ],
  },
  // React
  {
    id: 'react-1',
    category: 'React',
    title: 'React Basics',
    description: 'Learn the fundamentals of React for building dynamic UIs.',
    tags: ['Components', 'Props', 'State'],
    videos: [
      { type: 'YouTube', url: 'https://www.youtube.com/embed/Tn6-PIqc4UM', id: 'react-basics-1' },
      { type: 'YouTube', url: 'https://www.youtube.com/embed/sBws8MSXN7A', id: 'react-basics-2' },
    ],
    resources: [
      { name: 'React Docs', url: 'https://react.dev/' },
      { name: 'React Tutorial', url: 'https://react.dev/learn' },
    ],
  },
  {
    id: 'react-2',
    category: 'React',
    title: 'Advanced React',
    description: 'Master hooks, context, and performance optimization in React.',
    tags: ['Hooks', 'Context', 'Redux'],
    videos: [
      { type: 'YouTube', url: 'https://www.youtube.com/embed/4mOkFXyxfsU', id: 'react-adv-1' },
      { type: 'YouTube', url: 'https://www.youtube.com/embed/M9O5AjEFzKw?si=A93lkMFX8UH_OcTT', id: 'react-adv-2' },
    ],
    resources: [
      { name: 'Redux Docs', url: 'https://redux.js.org/' },
    ],
  },
  // Node.js & Express
  {
    id: 'node-1',
    category: 'Node.js',
    title: 'Node.js Basics',
    description: 'Learn server-side JavaScript with Node.js.',
    tags: ['Server', 'NPM', 'Modules'],
    videos: [
      { type: 'YouTube', url: 'https://www.youtube.com/embed/TlB_eWDSMt4', id: 'node-basics-1' },
      { type: 'YouTube', url: 'https://www.youtube.com/embed/RLtyhwFtXQA', id: 'node-basics-2' },
    ],
    resources: [
      { name: 'Node.js Docs', url: 'https://nodejs.org/en/docs/' },
    ],
  },
  {
    id: 'express-1',
    category: 'Express',
    title: 'Express.js Basics',
    description: 'Build RESTful APIs with Express.js.',
    tags: ['API', 'Routing', 'Middleware'],
    videos: [
      { type: 'YouTube', url: 'https://www.youtube.com/embed/L72fhGm1tfE', id: 'express-basics-1' },
      { type: 'YouTube', url: 'https://www.youtube.com/embed/SccSCuHhOw0', id: 'express-basics-2' },
    ],
    resources: [
      { name: 'Express Docs', url: 'https://expressjs.com/' },
    ],
  },
  // Databases
  {
    id: 'mongo-1',
    category: 'MongoDB',
    title: 'MongoDB Basics',
    description: 'Learn NoSQL databases with MongoDB.',
    tags: ['NoSQL', 'CRUD', 'Mongoose'],
    videos: [
      { type: 'YouTube', url: 'https://www.youtube.com/embed/9OPP_1eAENg', id: 'mongo-basics-1' },
      { type: 'YouTube', url: 'https://www.youtube.com/embed/oSIv-E60NiU', id: 'mongo-basics-2' },
    ],
    resources: [
      { name: 'MongoDB Docs', url: 'https://www.mongodb.com/docs/' },
    ],
  },
  {
    id: 'psql-1',
    category: 'PostgreSQL',
    title: 'PostgreSQL Basics',
    description: 'Master relational databases with PostgreSQL.',
    tags: ['SQL', 'Tables', 'Queries'],
    videos: [
      { type: 'YouTube', url: 'https://www.youtube.com/embed/cnzka7kF5Zk?si=r47WcbiUAzSndNtC', id: 'psql-basics-1' },
      { type: 'YouTube', url: 'https://www.youtube.com/embed/qw--VYLpxG4?si=qipMgrPA2TwUkBRO', id: 'psql-basics-2' },
    ],
    resources: [
      { name: 'PostgreSQL Docs', url: 'https://www.postgresql.org/docs/' },
    ],
  },
  // Git & GitHub
  {
    id: 'git-1',
    category: 'Git & GitHub',
    title: 'Version Control with Git & GitHub',
    description: 'Master version control and collaborative development.',
    tags: ['Branching', 'Pull Requests', 'Commits'],
    videos: [
      { type: 'YouTube', url: 'https://www.youtube.com/embed/RGOj5yH7evk', id: 'git-1' },
      { type: 'YouTube', url: 'https://www.youtube.com/embed/sw0OW7gHEVg', id: 'git-2' },
      { type: 'YouTube', url: 'https://www.youtube.com/embed/1ffBJ4sVUb4', id: 'git-3' },
    ],
    resources: [
      { name: 'Git Docs', url: 'https://git-scm.com/doc' },
      { name: 'GitHub Guides', url: 'https://guides.github.com/' },
    ],
  },
  // TypeScript
  {
    id: 'ts-1',
    category: 'TypeScript',
    title: 'TypeScript Basics',
    description: 'Learn TypeScript for type-safe JavaScript development.',
    tags: ['Types', 'Interfaces', 'Generics'],
    videos: [
      { type: 'YouTube', url: 'https://www.youtube.com/embed/zQnBQ4tB3ZA', id: 'ts-basics-1' },
      { type: 'YouTube', url: 'https://www.youtube.com/embed/ahCwqrYpIuM', id: 'ts-basics-2' },
    ],
    resources: [
      { name: 'TypeScript Docs', url: 'https://www.typescriptlang.org/docs/' },
    ],
  },
  // Web Accessibility
  {
    id: 'a11y-1',
    category: 'Accessibility',
    title: 'Web Accessibility Basics',
    description: 'Make your websites accessible to all users.',
    tags: ['ARIA', 'WCAG', 'Screen Readers'],
    videos: [
      { type: 'YouTube', url: 'https://www.youtube.com/embed/3f31oufqFSM', id: 'a11y-1' },
      { type: 'YouTube', url: 'https://www.youtube.com/embed/6U3D6CN8wRw', id: 'a11y-2' },
    ],
    resources: [
      { name: 'WCAG Guidelines', url: 'https://www.w3.org/WAI/standards-guidelines/wcag/' },
    ],
  },
  // Testing
  {
    id: 'test-1',
    category: 'Testing',
    title: 'Testing Web Apps',
    description: 'Learn unit, integration, and end-to-end testing.',
    tags: ['Jest', 'Cypress', 'Mocha'],
    videos: [
      { type: 'YouTube', url: 'https://www.youtube.com/embed/2_lswM1S264?si=oWzqlU5n-ZVTz_u2', id: 'test-1' },
      { type: 'YouTube', url: 'https://www.youtube.com/embed/ZBi8Qa9m5c0?si=pvtLqq79n4wfWf_R', id: 'test-2' },
    ],
    resources: [
      { name: 'Jest Docs', url: 'https://jestjs.io/docs/getting-started' },
      { name: 'Cypress Docs', url: 'https://docs.cypress.io/' },
    ],
  },
  // Deployment
  {
    id: 'deploy-1',
    category: 'Deployment',
    title: 'Deploying Web Apps',
    description: 'Learn how to deploy apps to platforms like Vercel, Netlify, and AWS.',
    tags: ['CI/CD', 'Vercel', 'Netlify'],
    videos: [
      { type: 'YouTube', url: "https://www.youtube.com/embed/mT5siI19gtc?si=RnG9azVN7UUpvUEy", id: 'deploy-1' },
      { type: 'YouTube', url: "https://www.youtube.com/embed/0P53S34zm44?si=QRWnpoYBzHXnPB2i" , id: 'deploy-2' },
    ],
    resources: [
      { name: 'Vercel Docs', url: 'https://vercel.com/docs' },
      { name: 'Netlify Docs', url: 'https://docs.netlify.com/' },
    ],
  },
  // APIs & GraphQL
  {
    id: 'api-1',
    category: 'APIs',
    title: 'Working with REST APIs',
    description: 'Learn to consume and build REST APIs.',
    tags: ['Fetch', 'Axios', 'Postman'],
    videos: [
      { type: 'YouTube', url: 'https://www.youtube.com/embed/WXsD0ZgxjRw', id: 'api-1' },
      { type: 'YouTube', url: 'https://www.youtube.com/embed/7YcW25PHnAA', id: 'api-2' },
      { type: 'YouTube', url: 'https://www.youtube.com/embed/0sOvCWFmrtA', id: 'api-3' },
    ],
    resources: [
      { name: 'REST API Guide', url: 'https://restfulapi.net/' },
    ],
  },
  {
    id: 'graphql-1',
    category: 'GraphQL',
    title: 'GraphQL Basics',
    description: 'Learn GraphQL for flexible API queries.',
    tags: ['Queries', 'Mutations', 'Apollo'],
    videos: [
      { type: 'YouTube', url: 'https://www.youtube.com/embed/UBGg7m1IVis', id: 'graphql-1' },
      { type: 'YouTube', url: 'https://www.youtube.com/embed/Y0lDGjwRYKw', id: 'graphql-2' },
      { type: 'YouTube', url: 'https://www.youtube.com/embed/ed8SzALpx1Q', id: 'graphql-3' },
      { type: 'YouTube', url: 'https://www.youtube.com/embed/2r6c7d9a4b0', id: 'graphql-4' },
    ],
    resources: [
      { name: 'GraphQL Docs', url: 'https://graphql.org/learn/' },
    ],
  },
  // Next.js
  {
    id: 'next-1',
    category: 'Next.js',
    title: 'Next.js Basics',
    description: 'Build server-rendered React apps with Next.js.',
    tags: ['SSR', 'SSG', 'API Routes'],
    videos: [
      { type: 'YouTube', url: 'https://www.youtube.com/embed/9P8mASSREYM', id: 'next-1' },
      { type: 'YouTube', url: 'https://www.youtube.com/embed/ZVnjOPwW4ZA?si=Fr9-YYKdn-vwP2mQ', id: 'next-2' },
    ],
    resources: [
      { name: 'Next.js Docs', url: 'https://nextjs.org/docs' },
    ],
  },
  // Web Performance
  {
    id: 'perf-1',
    category: 'Performance',
    title: 'Web Performance Optimization',
    description: 'Optimize your websites for speed and efficiency.',
    tags: ['Lighthouse', 'Lazy Loading', 'Compression'],
    videos: [
      { type: 'YouTube', url: 'https://www.youtube.com/embed/2k2h9vY0l8E', id: 'perf-1' },
      { type: 'YouTube', url: 'https://www.youtube.com/embed/6iZ_9q50pq0', id: 'perf-2' },
      { type: 'YouTube', url: 'https://www.youtube.com/embed/4bG8d9a4b0', id: 'perf-3' },
      { type: 'YouTube', url: 'https://www.youtube.com/embed/8aGhZQkoFbQ', id: 'perf-4' },
    ],
    resources: [
      { name: 'Web.dev Performance', url: 'https://web.dev/learn/performance/' },
    ],
  },
];

function Tutorial() {
  const { category } = useParams(); // Support category routes (e.g., /tutorials/html)
  const [selectedCategory, setSelectedCategory] = useState(category || 'All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedTutorials, setExpandedTutorials] = useState({});

  const categories = useMemo(() => ['All', ...new Set(tutorials.map(t => t.category))], []);

  // Sync URL param with selected category
  useEffect(() => {
    if (category && categories.includes(category)) {
      setSelectedCategory(category);
    }
  }, [category, categories]);

  // Filter tutorials by category and search query
  const filteredTutorials = tutorials
    .filter(t => selectedCategory === 'All' || t.category === selectedCategory)
    .filter(t =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
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
                  {tutorial.tags.map((tag, i) => (
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
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Tutorial;