import React from "react";

const logoStyleBase: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  fontFamily: "Inter, Arial, Helvetica, sans-serif",
  fontWeight: 700,
  letterSpacing: "-0.03em",
  lineHeight: 1.1,
};

const pavedStyle: React.CSSProperties = {
  color: "#10194B",
  fontWeight: 700,
};

const liteStyleBase: React.CSSProperties = {
  color: "#B0B3C6",
  fontWeight: 400,
  marginLeft: "0.4em",
  letterSpacing: "0",
};

interface LogoProps {
  size?: string; // e.g. '2rem', '3.5rem'
}

const Logo: React.FC<LogoProps> = ({ size = "3.5rem" }) => (
  <span style={{ ...logoStyleBase, fontSize: size }}>
    <span style={pavedStyle}>paved</span>
    <span style={{ ...liteStyleBase, fontSize: `calc(${size} * 0.5)` }}>
      lite
    </span>
  </span>
);

export default Logo;
