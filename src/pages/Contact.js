<<<<<<< HEAD
import React, { useState } from 'react';
import './Contact.css';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    review: '',
    rating: 0,
  });

  const [webDevFact, setWebDevFact] = useState('');
  const facts = [
    'The first website ever made is still online!',
    'JavaScript was created in just 10 days!',
    'CSS was first released in 1996.',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thanks for your suggestion! 🚀');
    console.log(formData);
  };

  const revealFact = () => {
    const randomFact = facts[Math.floor(Math.random() * facts.length)];
    setWebDevFact(randomFact);
  };

  return (
    <div className="contact-container">
      <h1>Contact WebDevHub</h1>

      <div className="creator-info">
        <h2>Creator: Mohd Amjad Ali</h2>
        <p>Email: 2003amjadali@gmail.com</p>
        <p>Motive: Building a community for web developers to learn, grow, and collaborate.</p>
        <div className="social-links">
          <a href="https://www.linkedin.com/in/amjad-ali-08489622a" target="_blank" rel="noreferrer">LinkedIn</a>
          <a href="https://github.com/AmjadAli9" target="_blank" rel="noreferrer">GitHub</a>
          <a href="https://webdevhub.com" target="_blank" rel="noreferrer">WebDevHub</a>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <select name="subject" value={formData.subject} onChange={handleChange}>
          <option>General Inquiry</option>
          <option>Feedback/Review</option>
          <option>Collaboration Request</option>
          <option>Feature Suggestion</option>
          <option>Technical Issue</option>
        </select>
        <textarea
          name="review"
          placeholder="Write your review or suggestion here..."
          value={formData.review}
          onChange={handleChange}
          required
        />
        <label>Rate your experience:</label>
        <input
          type="number"
          name="rating"
          min="1"
          max="5"
          value={formData.rating}
          onChange={handleChange}
        />
        <button type="submit" className="fancy-button">🚀 Submit Suggestion</button>
      </form>

      <div className="easter-egg" onClick={revealFact}>
        🥚 Click me for a WebDev fact!
      </div>
      {webDevFact && <p className="fact">{webDevFact}</p>}
    </div>
  );
};

export default ContactPage;
=======
import React, { useState } from 'react';
import './Contact.css';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    review: '',
    rating: 0,
  });

  const [webDevFact, setWebDevFact] = useState('');
  const facts = [
    'The first website ever made is still online!',
    'JavaScript was created in just 10 days!',
    'CSS was first released in 1996.',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thanks for your suggestion! 🚀');
    console.log(formData);
  };

  const revealFact = () => {
    const randomFact = facts[Math.floor(Math.random() * facts.length)];
    setWebDevFact(randomFact);
  };

  return (
    <div className="contact-container">
      <h1>Contact WebDevHub</h1>

      <div className="creator-info">
        <h2>Creator: Mohd Amjad Ali</h2>
        <p>Email: 2003amjadali@gmail.com</p>
        <p>Motive: Building a community for web developers to learn, grow, and collaborate.</p>
        <div className="social-links">
          <a href="https://www.linkedin.com/in/amjad-ali-08489622a" target="_blank" rel="noreferrer">LinkedIn</a>
          <a href="https://github.com/AmjadAli9" target="_blank" rel="noreferrer">GitHub</a>
          <a href="https://webdevhub.com" target="_blank" rel="noreferrer">WebDevHub</a>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <select name="subject" value={formData.subject} onChange={handleChange}>
          <option>General Inquiry</option>
          <option>Feedback/Review</option>
          <option>Collaboration Request</option>
          <option>Feature Suggestion</option>
          <option>Technical Issue</option>
        </select>
        <textarea
          name="review"
          placeholder="Write your review or suggestion here..."
          value={formData.review}
          onChange={handleChange}
          required
        />
        <label>Rate your experience:</label>
        <input
          type="number"
          name="rating"
          min="1"
          max="5"
          value={formData.rating}
          onChange={handleChange}
        />
        <button type="submit" className="fancy-button">🚀 Submit Suggestion</button>
      </form>

      <div className="easter-egg" onClick={revealFact}>
        🥚 Click me for a WebDev fact!
      </div>
      {webDevFact && <p className="fact">{webDevFact}</p>}
    </div>
  );
};

export default ContactPage;
>>>>>>> 9b2d469fd6f28892b7277d47845433741d5b49ba
