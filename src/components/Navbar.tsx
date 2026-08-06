import { Link } from "react-router-dom";
import "./Navbar.css";
import { useState } from "react";
import logo from "../assets/logo/humangrid-logo.png";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "Services", href: "#services" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "About Us", href: "#about" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={logo} alt="HumanGrid Logo" className="logo-img" />
        <div className="logo-text">
          <span className="brand-name">HumanGrid</span>
          <span className="brand-tagline">Help. Anytime. Anywhere.</span>
        </div>
      </div>

      <ul className={`navbar-links ${menuOpen ? "active" : ""}`}>
        {navLinks.map((link, index) => (
          <li key={index}>
            <a href={link.href} className={index === 0 ? "active-link" : ""}>
              {link.name}
            </a>
          </li>
        ))}
      </ul>

      <div className="navbar-buttons">
        <Link to="/login" className="btn-login">Login</Link>
        <button className="btn-getstarted">Get Started</button>
      </div>

      <div
        className="navbar-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>
    </nav>
  );
};

export default Navbar;