import React, { useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../features/auth/context/AuthContext";
import { connectSocket, disconnectSocket } from "../../features/notifications/services/socketService";
import NotificationBell from "../../features/notifications/components/NotificationBell";

const NAV_LINKS = [
  { path: "/dashboard", label: "📊 Dashboard" },
  { path: "/targets", label: "🎯 Targets" },
  { path: "/campaigns", label: "📧 Campaigns" },
  { path: "/simulator", label: "🎭 Simulator" },
  { path: "/risk", label: "🛡️ Risk" },
  { path: "/training", label: "🎓 Training" },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user?._id) connectSocket(user._id);
    return () => disconnectSocket();
  }, [user]);

  const handleLogout = () => {
    disconnectSocket();
    logout();
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.brand}>🎣 PhishGuard</div>
      <div style={styles.links}>
        {NAV_LINKS.map((link) => (
          <Link
            key={link.path}
            style={{
              ...styles.link,
              ...(location.pathname === link.path ? styles.linkActive : {}),
            }}
            to={link.path}
          >
            {link.label}
          </Link>
        ))}
      </div>
      <div style={styles.right}>
        <NotificationBell />
        <span style={styles.userEmail}>{user?.email}</span>
        <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

const styles = {
  nav: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem 2rem", background: "#1e293b", borderBottom: "1px solid #334155", flexWrap: "wrap", gap: "0.5rem" },
  brand: { color: "#6366f1", fontWeight: "700", fontSize: "1.1rem" },
  links: { display: "flex", gap: "0.25rem", flexWrap: "wrap" },
  link: { color: "#94a3b8", textDecoration: "none", fontSize: "0.85rem", padding: "0.4rem 0.75rem", borderRadius: "6px", transition: "all 0.2s" },
  linkActive: { color: "#f1f5f9", background: "#334155" },
  right: { display: "flex", alignItems: "center", gap: "1rem" },
  userEmail: { color: "#64748b", fontSize: "0.8rem" },
  logoutBtn: { padding: "0.4rem 0.9rem", background: "#ef4444", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "0.8rem" },
};

export default Navbar;
