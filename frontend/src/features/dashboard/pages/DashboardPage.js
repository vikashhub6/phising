import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get("/api/dashboard/stats");
        setStats(data.stats);
        setCampaigns(data.recentCampaigns || []);
      } catch {
        toast.error("Failed to load dashboard");
      }
    };
    fetchStats();
  }, []);

  const statCards = stats
    ? [
        { label: "Total Targets", value: stats.totalTargets, color: "#6366f1", icon: "🎯" },
        { label: "Emails Sent", value: stats.totalEmails, color: "#3b82f6", icon: "📧" },
        { label: "Open Rate", value: `${stats.openRate}%`, color: "#f59e0b", icon: "👁" },
        { label: "Click Rate", value: `${stats.clickRate}%`, color: "#10b981", icon: "🖱" },
      ]
    : [];

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📊 Dashboard</h2>

      <div style={styles.grid}>
        {statCards.map((s) => (
          <div key={s.label} style={{ ...styles.card, borderTop: `3px solid ${s.color}` }}>
            <div style={styles.cardIcon}>{s.icon}</div>
            <div style={{ ...styles.cardValue, color: s.color }}>{s.value}</div>
            <div style={styles.cardLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={styles.quickActions}>
        <button style={styles.actionBtn} onClick={() => navigate("/targets/add")}>+ Add Target</button>
        <button style={styles.actionBtn2} onClick={() => navigate("/targets")}>View Targets</button>
        <button style={styles.actionBtn2} onClick={() => navigate("/campaigns")}>View Campaigns</button>
      </div>

      <h3 style={styles.subtitle}>Recent Campaigns</h3>
      {campaigns.length === 0 ? (
        <p style={styles.info}>No campaigns yet.</p>
      ) : (
        campaigns.slice(0, 5).map((c) => (
          <div key={c._id} style={styles.row}>
            <span style={styles.rowName}>{c.target?.name || "N/A"}</span>
            <span style={styles.rowSubject}>{c.subject}</span>
            <span style={{ ...styles.badge, background: c.status === "clicked" ? "#10b981" : c.status === "opened" ? "#f59e0b" : "#3b82f6" }}>
              {c.status}
            </span>
          </div>
        ))
      )}
    </div>
  );
};

const styles = {
  container: { padding: "2rem", background: "#0f172a", minHeight: "100vh" },
  title: { color: "#f1f5f9", marginBottom: "1.5rem" },
  subtitle: { color: "#f1f5f9", marginTop: "2rem", marginBottom: "1rem" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "1rem", marginBottom: "1.5rem" },
  card: { background: "#1e293b", borderRadius: "10px", padding: "1.25rem", textAlign: "center" },
  cardIcon: { fontSize: "1.5rem", marginBottom: "0.5rem" },
  cardValue: { fontSize: "2rem", fontWeight: "bold", marginBottom: "0.25rem" },
  cardLabel: { color: "#94a3b8", fontSize: "0.85rem" },
  quickActions: { display: "flex", gap: "0.75rem", marginBottom: "1.5rem", flexWrap: "wrap" },
  actionBtn: { padding: "0.6rem 1.2rem", background: "#6366f1", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer" },
  actionBtn2: { padding: "0.6rem 1.2rem", background: "#1e293b", color: "#f1f5f9", border: "1px solid #334155", borderRadius: "8px", cursor: "pointer" },
  row: { background: "#1e293b", borderRadius: "8px", padding: "0.75rem 1rem", display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem" },
  rowName: { color: "#f1f5f9", fontWeight: "500", minWidth: "120px" },
  rowSubject: { color: "#94a3b8", flex: 1, fontSize: "0.9rem" },
  badge: { padding: "0.25rem 0.6rem", borderRadius: "20px", color: "#fff", fontSize: "0.75rem" },
  info: { color: "#94a3b8" },
};

export default DashboardPage;