// src/pages/Terms.tsx
import React from 'react';
import { Link } from 'react-router-dom'; // Make sure Link is imported here too

const TermsPage: React.FC = () => {
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
      <h1>Terms and Conditions</h1>
      <p>
        Welcome to HumanGrid! These terms and conditions outline the rules and regulations for the use of HumanGrid's Website.
      </p>
      <p>
        By accessing this website we assume you accept these terms and conditions. Do not continue to use HumanGrid if you do not agree to take all of the terms and conditions stated on this page.
      </p>
      <h2>Cookies</h2>
      <p>
        We employ the use of cookies. By accessing HumanGrid, you agreed to use cookies in agreement with the HumanGrid's Privacy Policy.
      </p>
      {/* Add more legal text here */}
      <p style={{ marginTop: '20px' }}>
        <Link to="/signup" style={{ color: '#C9A050', textDecoration: 'none', fontWeight: 'bold' }}>Back to Signup</Link>
      </p>
    </div>
  );
};

export default TermsPage;