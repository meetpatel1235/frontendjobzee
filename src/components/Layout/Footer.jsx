import React from "react";
import { Link } from "react-router-dom";
import { Mail, Facebook, Youtube, Linkedin, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section about">
          <h3>About Us</h3>
          <p>We are dedicated to delivering quality services and products that meet your needs and exceed your expectations.</p>
        </div>

        <div className="footer-section links">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/blog">Blog</Link></li>
          </ul>
        </div>

        <div className="footer-section contact">
          <h3>Contact Us</h3>
          <p><Mail size={14} className="icon" /> contact@example.com</p>
          <p>123 Business Avenue, Tech City</p>
          <p>+1 (555) 123-4567</p>
        </div>

        <div className="footer-section newsletter">
          <h3>Stay Updated</h3>
          <p>Subscribe to our newsletter for the latest updates.</p>
          <div className="newsletter-form">
            <input type="email" placeholder="Your email address" />
            <button type="submit">Subscribe</button>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="copyright">
          &copy; {new Date().getFullYear()} All Rights Reserved By You.
        </div>
        <div className="social-links">
          <Link to="https://www.facebook.com/" target="_blank" aria-label="Facebook">
            <Facebook />
          </Link>
          <Link to="https://www.youtube.com/" target="_blank" aria-label="Youtube">
            <Youtube />
          </Link>
          <Link to="https://www.linkedin.com/" target="_blank" aria-label="LinkedIn">
            <Linkedin />
          </Link>
          <Link to="https://www.instagram.com/" target="_blank" aria-label="Instagram">
            <Instagram />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;