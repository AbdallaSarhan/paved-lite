import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import PublisherDashboard from "../components/PublisherDashboard";
import AdvertiserDashboard from "../components/AdvertiserDashboard";
import Logo from "../components/Logo";
import "./Auth.css";

// Mock data
const mockAdvertiserRequests = [
  {
    id: 1,
    advertiser: "Acme Corp",
    message: "We'd like to sponsor your newsletter!",
  },
  {
    id: 2,
    advertiser: "Brandify",
    message: "Interested in a partnership for Q3.",
  },
];

const mockPublishers = [
  { id: 1, name: "The Daily Byte", description: "Tech news and insights." },
  { id: 2, name: "Health Weekly", description: "Wellness tips and trends." },
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    navigate("/login");
  };

  if (!user) {
    return null; // or a loading spinner
  }

  return (
    <div className="dashboard">
      <nav className="dashboard-nav">
        <div className="nav-container">
          <div className="nav-content">
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
            >
              <Logo size="2.2rem" />
              <span
                style={{
                  fontWeight: 600,
                  fontSize: "1.35rem",
                  color: "#10194B",
                  letterSpacing: "-0.01em",
                  marginLeft: "0.2rem",
                }}
              >
                Dashboard
              </span>
            </div>
            <div style={{ position: "relative" }} ref={dropdownRef}>
              <button
                className="profile-icon-btn"
                onClick={() => setDropdownOpen((open) => !open)}
                aria-label="Account menu"
                style={{
                  background: "#f3f4f6",
                  border: "none",
                  borderRadius: "50%",
                  width: 40,
                  height: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  boxShadow: dropdownOpen
                    ? "0 2px 8px rgba(0,0,0,0.08)"
                    : undefined,
                  transition: "box-shadow 0.2s",
                }}
              >
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                  <circle
                    cx="12"
                    cy="8"
                    r="4"
                    stroke="#2563eb"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M4 20c0-2.5 3.5-4.5 8-4.5s8 2 8 4.5"
                    stroke="#2563eb"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
              {dropdownOpen && (
                <div className="profile-dropdown-menu">
                  <button
                    className="profile-dropdown-item"
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate("/profile-setup");
                    }}
                  >
                    Profile
                  </button>
                  <button
                    className="profile-dropdown-item"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="dashboard-main">
        {user.role === "publisher" ? (
          <PublisherDashboard />
        ) : user.role === "advertiser" ? (
          <AdvertiserDashboard />
        ) : (
          <div className="dashboard-content">
            <div className="dashboard-placeholder">
              <div
                className="dashboard-header"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <h2>Welcome, {user.name || user.email}!</h2>
                  {user.company_name && (
                    <p>Representing: {user.company_name}</p>
                  )}
                </div>
                <span className={`account-type-badge ${user.role}`}>
                  {user.role === "publisher" ? "Publisher" : "Advertiser"}
                </span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
