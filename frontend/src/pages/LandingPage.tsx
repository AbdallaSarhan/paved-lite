import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaRegNewspaper,
  FaBullhorn,
  FaArrowRight,
  FaCheck,
  FaSearch,
  FaBuilding,
  FaEnvelopeOpenText,
} from "react-icons/fa";
import "./LandingPage.css";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="nav-container">
          <div className="nav-content">
            <div className="nav-brand">
              <span className="brand-logo-paved">paved</span>
              <span className="brand-logo-lite">lite</span>
            </div>
            <div className="nav-actions">
              <button
                className="btn btn-outline"
                onClick={() => navigate("/login")}
              >
                Log In
              </button>
              <button
                className="btn btn-primary"
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Where brands connect <br /> <strong>with newsletters.</strong>
            </h1>
            <p className="hero-subtitle">
              The industry standard for newsletter sponsorships.
              <br />
              Launch and scale effortlessly.
            </p>
            <div className="hero-search-bar">
              <FaSearch
                style={{ color: "#2563eb", fontSize: 20, marginRight: 8 }}
              />
              <input
                type="text"
                placeholder="Start searching for your audience ..."
                disabled
                style={{
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  flex: 1,
                }}
              />
              <button
                type="button"
                className="btn btn-primary"
                style={{ padding: "0.7rem 1.1rem" }}
                disabled
              >
                <FaArrowRight />
              </button>
            </div>
            <div className="hero-actions" style={{ marginTop: 32 }}>
              <button
                className="btn btn-primary btn-large"
                onClick={() => navigate("/signup")}
              >
                Get Started
              </button>
              <button
                className="btn btn-outline btn-large"
                onClick={() => navigate("/login")}
              >
                Log In
              </button>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-cards">
              <div className="hero-card publisher-card">
                <FaEnvelopeOpenText />
                <h3>For publishers</h3>
                <p>
                  Manage and streamline your newsletter sponsorship process with
                  Paved Lite.
                </p>
                <button
                  className="btn btn-outline"
                  style={{ marginTop: 16 }}
                  onClick={() => navigate("/signup")}
                >
                  Learn More
                </button>
              </div>
              <div className="hero-card advertiser-card">
                <FaBuilding />
                <h3>For advertisers</h3>
                <p>
                  Discover thousands of newsletters and reach your target
                  audience at scale.
                </p>
                <button
                  className="btn btn-outline"
                  style={{ marginTop: 16 }}
                  onClick={() => navigate("/signup")}
                >
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-container">
          <div className="section-header">
            <h2>
              Why <span className="brand-logo-paved">paved</span>
              <span className="brand-logo-lite"> lite</span>?
            </h2>
            <p>
              Join publishers and advertisers who trust our platform to connect,
              collaborate, and grow.
            </p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <FaRegNewspaper />
              </div>
              <h3>For Publishers</h3>
              <p className="feature-description">
                Find quality advertisers, manage sponsorships, and track
                campaign performance with ease.
              </p>
              <ul className="feature-benefits">
                <li>
                  <FaCheck /> Streamlined sponsorship workflow
                </li>
                <li>
                  <FaCheck /> Set your own rates and terms
                </li>
                <li>
                  <FaCheck /> Analytics and reporting
                </li>
              </ul>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FaBullhorn />
              </div>
              <h3>For Advertisers</h3>
              <p className="feature-description">
                Discover relevant newsletters, reach targeted audiences, and
                scale your advertising efforts.
              </p>
              <ul className="feature-benefits">
                <li>
                  <FaCheck /> Access to thousands of publishers
                </li>
                <li>
                  <FaCheck /> Targeted audience matching
                </li>
                <li>
                  <FaCheck /> Track campaign ROI
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <h2>Ready to Get Started?</h2>
          <p>
            Join our platform and start connecting with quality partners today.
          </p>
          <div className="cta-actions">
            <button
              className="btn btn-primary btn-large"
              onClick={() => navigate("/signup")}
            >
              Create Your Account <FaArrowRight />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-brand">
              <span className="brand-logo-paved">paved</span>
              <span className="brand-logo-lite">lite</span>
              <p>Connecting newsletters with advertisers</p>
            </div>
            <div className="footer-links">
              <div className="footer-section">
                <h4>Platform</h4>
                <ul>
                  <li>
                    <a href="#features">Features</a>
                  </li>
                  <li>
                    <a href="#about">About</a>
                  </li>
                </ul>
              </div>
              <div className="footer-section">
                <h4>Support</h4>
                <ul>
                  <li>
                    <a href="#help">Help Center</a>
                  </li>
                  <li>
                    <a href="#contact">Contact</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 Paved Lite. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
