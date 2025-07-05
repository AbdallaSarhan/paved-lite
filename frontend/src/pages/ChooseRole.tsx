import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import { FaRegNewspaper, FaBullhorn } from "react-icons/fa";
import "./Auth.css";

const boxStyle: React.CSSProperties = {
  border: "2px solid #e5e7eb",
  borderRadius: "0.5rem",
  padding: "2rem 2.5rem",
  margin: "1rem",
  cursor: "pointer",
  fontSize: "1.3rem",
  fontWeight: 600,
  background: "#fff",
  transition: "border-color 0.2s, box-shadow 0.2s",
  boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
  textAlign: "center",
  width: "180px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const boxActiveStyle: React.CSSProperties = {
  ...boxStyle,
  border: "2px solid #4f46e5",
  boxShadow: "0 4px 16px rgba(79,70,229,0.08)",
};

const iconStyle: React.CSSProperties = {
  fontSize: "2.5rem",
  marginBottom: "1rem",
  color: "#4f46e5",
};

const containerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginTop: "2rem",
};

const ChooseRole: React.FC = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSelect = async (role: "publisher" | "advertiser") => {
    setSelected(role);
    setError("");
    setLoading(true);
    try {
      await authService.setRole(role);
      navigate("/profile-setup");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to set role.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ textAlign: "center" }}>
        <h2 className="auth-title" style={{ marginBottom: "1rem" }}>
          Choose your role
        </h2>
        <div className="choose-role-container">
          <button
            type="button"
            className={`role-box${selected === "publisher" ? " selected" : ""}`}
            onClick={() => !loading && handleSelect("publisher")}
          >
            <FaRegNewspaper style={iconStyle} />I am a Publisher
            <div className="role-desc">
              Monetize your newsletter by connecting with top advertisers and
              managing campaigns.
            </div>
          </button>
          <button
            type="button"
            className={`role-box${
              selected === "advertiser" ? " selected" : ""
            }`}
            onClick={() => !loading && handleSelect("advertiser")}
          >
            <FaBullhorn style={iconStyle} />I am an Advertiser
            <div className="role-desc">
              Promote your products or services to engaged newsletter audiences
              and grow your brand.
            </div>
          </button>
        </div>
        {error && (
          <div className="error-message">
            <p className="error-text">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChooseRole;
