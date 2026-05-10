import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../features/auth/context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinks = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/targets", label: "Targets" },
    { path: "/campaigns", label: "Campaigns" },
  ];

  return (
    <nav style={styles.nav}>
      <Link to="/dashboard" style={styles.brand}>🎣 PhishSim</Link>
      <div style={styles.links}>
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            style={{ ...styles.link, ...(location.pathname === link.path ? styles.activeLink : {}) }}
          >
            {link.label}
          </Link>
        ))}
      </div>
      <div style={styles.right}>
        <span style={styles.username}>{user?.name}</span>
        <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

const styles = {
  nav: { background: "#1e293b", padding: "0 2rem", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #334155", position: "sticky", top: 0, zIndex: 100 },
  brand: { color: "#f1f5f9", fontSize: "1.2rem", fontWeight: "bold", textDecoration: "none" },
  links: { display: "flex", gap: "1.5rem" },
  link: { color: "#94a3b8", textDecoration: "none", fontSize: "0.95rem" },
  activeLink: { color: "#6366f1", fontWeight: "600" },
  right: { display: "flex", alignItems: "center", gap: "1rem" },
  username: { color: "#94a3b8", fontSize: "0.9rem" },
  logoutBtn: { background: "transparent", border: "1px solid #334155", color: "#94a3b8", padding: "0.4rem 0.8rem", borderRadius: "6px", cursor: "pointer" },
};

export default Navbar;
