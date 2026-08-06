import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer" id="contact">
      <div className="footer-top">
        <div className="footer-brand">
          <h3>HumanGrid</h3>
          <p>Help. Anytime. Anywhere.</p>
        </div>

        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul>
            <li>Home</li>
            <li>Services</li>
            <li>How It Works</li>
            <li>About Us</li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Services</h4>
          <ul>
            <li>Hospital</li>
            <li>Police</li>
            <li>Fire Station</li>
            <li>Blood Bank</li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Contact</h4>
          <ul>
            <li>commercekabaccha@gmail.com</li>
            <li>+91 7740 092 524</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2026 HumanGrid. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;