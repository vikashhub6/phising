import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const difficultyColor = { Easy: "#10b981", Medium: "#f59e0b", Hard: "#ef4444" };
const statusColor = { scheduled: "#6366f1", sent: "#3b82f6", opened: "#f59e0b", clicked: "#ef4444" };

const SimulatorPage = () => {
  const [targets, setTargets] = useState([]);
  const [simulations, setSimulations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [loadingRec, setLoadingRec] = useState(false);
  const [launching, setLaunching] = useState(false);
  const [tab, setTab] = useState("launch"); // launch | history

  useEffect(() => {
    axios.get("/api/targets").then((r) => setTargets(r.data)).catch(() => {});
    axios.get("/api/simulator/campaigns").then((r) => setSimulations(r.data)).catch(() => {});
  }, []);

  const handleSelectTarget = async (targetId) => {
    setSelected(targetId);
    setRecommendation(null);
    if (!targetId) return;
    setLoadingRec(true);
    try {
      const { data } = await axios.get(`/api/simulator/recommend/${targetId}`);
      setRecommendation(data);
    } catch {
      toast.error("Failed to get AI recommendation");
    } finally {
      setLoadingRec(false);
    }
  };

  const handleLaunch = async () => {
    if (!selected || !recommendation) return;
    setLaunching(true);
    try {
      await axios.post("/api/simulator/launch", {
        targetId: selected,
        attackType: recommendation.attackType,
        difficulty: recommendation.difficulty,
      });
      toast.success("🚀 Simulation launched!");
      const { data } = await axios.get("/api/simulator/campaigns");
      setSimulations(data);
      setSelected(null);
      setRecommendation(null);
      setTab("history");
    } catch (err) {
      toast.error(err.response?.data?.message || "Launch failed");
    } finally {
      setLaunching(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>🎭 AI Adaptive Phishing Simulator</h2>
          <p style={styles.subtitle}>AI auto-selects attack type based on employee risk behavior</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        <button style={{ ...styles.tab, ...(tab === "launch" ? styles.tabActive : {}) }} onClick={() => setTab("launch")}>
          🚀 Launch Simulation
        </button>
        <button style={{ ...styles.tab, ...(tab === "history" ? styles.tabActive : {}) }} onClick={() => setTab("history")}>
          📋 History ({simulations.length})
        </button>
      </div>

      {tab === "launch" && (
        <div style={styles.launchWrap}>
          {/* Target Selector */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>1️⃣ Select Target Employee</h3>
            <select
              style={styles.select}
              value={selected || ""}
              onChange={(e) => handleSelectTarget(e.target.value)}
            >
              <option value="">— Choose a target —</option>
              {targets.map((t) => (
                <option key={t._id} value={t._id}>{t.name} · {t.company}</option>
              ))}
            </select>
          </div>

          {/* AI Recommendation */}
          {loadingRec && (
            <div style={styles.card}>
              <div style={styles.loading}>🤖 AI is analyzing employee behavior...</div>
            </div>
          )}

          {recommendation && !loadingRec && (
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>2️⃣ AI Recommendation</h3>
              <div style={styles.recGrid}>
                <div style={styles.recItem}>
                  <div style={styles.recLabel}>Attack Type</div>
                  <div style={styles.recValue}>🎯 {recommendation.attackType}</div>
                </div>
                <div style={styles.recItem}>
                  <div style={styles.recLabel}>Difficulty</div>
                  <div style={{ ...styles.recValue, color: difficultyColor[recommendation.difficulty] }}>
                    {recommendation.difficulty}
                  </div>
                </div>
                <div style={styles.recItem}>
                  <div style={styles.recLabel}>Risk Score</div>
                  <div style={styles.recValue}>{recommendation.score}/100</div>
                </div>
                <div style={styles.recItem}>
                  <div style={styles.recLabel}>Best Send Time</div>
                  <div style={styles.recValue}>⏰ {recommendation.sendTime}</div>
                </div>
              </div>
              <div style={styles.reasoningBox}>
                <div style={styles.reasoningLabel}>🧠 AI Reasoning</div>
                <p style={styles.reasoningText}>{recommendation.reasoning}</p>
              </div>

              <div style={styles.attackTypes}>
                <div style={styles.attackTypesLabel}>All available attack types:</div>
                <div style={styles.attackChips}>
                  {["Fake Invoice", "HR Policy Update", "OTP Alert", "CEO Fraud", "Google Drive Share", "Salary Increment"].map((a) => (
                    <span key={a} style={{ ...styles.chip, ...(a === recommendation.attackType ? styles.chipActive : {}) }}>
                      {a}
                    </span>
                  ))}
                </div>
              </div>

              <button style={styles.launchBtn} onClick={handleLaunch} disabled={launching}>
                {launching ? "⏳ Launching..." : "🚀 Launch AI Simulation"}
              </button>
            </div>
          )}
        </div>
      )}

      {tab === "history" && (
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>📋 Simulation History</h3>
          {simulations.length === 0 ? (
            <div style={styles.empty}>No simulations launched yet.</div>
          ) : (
            <div style={styles.historyList}>
              {simulations.map((s) => (
                <div key={s._id} style={styles.historyRow}>
                  <div style={styles.historyInfo}>
                    <div style={styles.historyName}>{s.target?.name}</div>
                    <div style={styles.historyMeta}>{s.target?.company} · {s.attackType}</div>
                  </div>
                  <span style={{ ...styles.diffBadge, color: difficultyColor[s.difficulty], background: "#0f172a" }}>
                    {s.difficulty}
                  </span>
                  <span style={{ ...styles.statusBadge, background: statusColor[s.emailCampaign?.status || s.status] || "#334155" }}>
                    {s.emailCampaign?.status || s.status}
                  </span>
                  <div style={styles.historyStats}>
                    <span>👁 {s.emailCampaign?.openCount || 0}</span>
                    <span>🖱 {s.emailCampaign?.clickCount || 0}</span>
                  </div>
                  <div style={styles.historyDate}>
                    {s.createdAt ? new Date(s.createdAt).toLocaleDateString() : "-"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  page: { padding: "2rem", background: "#0f172a", minHeight: "100vh" },
  header: { marginBottom: "1.5rem" },
  title: { color: "#f1f5f9", fontSize: "1.5rem", margin: 0 },
  subtitle: { color: "#64748b", fontSize: "0.9rem", marginTop: "0.25rem" },
  tabs: { display: "flex", gap: "0.5rem", marginBottom: "1.5rem", borderBottom: "1px solid #1e293b", paddingBottom: "0" },
  tab: { padding: "0.6rem 1.25rem", background: "transparent", border: "none", color: "#64748b", cursor: "pointer", fontSize: "0.95rem", borderBottom: "2px solid transparent", marginBottom: "-1px" },
  tabActive: { color: "#6366f1", borderBottom: "2px solid #6366f1" },
  launchWrap: { display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "700px" },
  card: { background: "#1e293b", borderRadius: "12px", padding: "1.5rem", border: "1px solid #334155" },
  cardTitle: { color: "#f1f5f9", fontSize: "1rem", marginBottom: "1rem", margin: "0 0 1rem 0" },
  select: { width: "100%", padding: "0.75rem", background: "#0f172a", border: "1px solid #334155", borderRadius: "8px", color: "#f1f5f9", fontSize: "1rem" },
  loading: { color: "#64748b", textAlign: "center", padding: "1.5rem" },
  recGrid: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "1rem", marginBottom: "1.25rem" },
  recItem: { background: "#0f172a", borderRadius: "8px", padding: "0.85rem", textAlign: "center" },
  recLabel: { color: "#64748b", fontSize: "0.75rem", marginBottom: "0.35rem" },
  recValue: { color: "#f1f5f9", fontWeight: "700", fontSize: "0.95rem" },
  reasoningBox: { background: "#0f172a", borderRadius: "8px", padding: "1rem", marginBottom: "1.25rem", borderLeft: "3px solid #6366f1" },
  reasoningLabel: { color: "#6366f1", fontSize: "0.85rem", fontWeight: "600", marginBottom: "0.5rem" },
  reasoningText: { color: "#94a3b8", fontSize: "0.9rem", lineHeight: 1.6, margin: 0 },
  attackTypes: { marginBottom: "1.25rem" },
  attackTypesLabel: { color: "#64748b", fontSize: "0.8rem", marginBottom: "0.5rem" },
  attackChips: { display: "flex", flexWrap: "wrap", gap: "0.5rem" },
  chip: { padding: "0.3rem 0.7rem", background: "#0f172a", border: "1px solid #334155", borderRadius: "20px", color: "#64748b", fontSize: "0.8rem" },
  chipActive: { background: "#1e3a5f", borderColor: "#3b82f6", color: "#3b82f6" },
  launchBtn: { width: "100%", padding: "0.85rem", background: "#6366f1", color: "#fff", border: "none", borderRadius: "10px", fontSize: "1rem", cursor: "pointer", fontWeight: "600" },
  historyList: { display: "flex", flexDirection: "column", gap: "0.5rem" },
  historyRow: { display: "flex", alignItems: "center", gap: "1rem", padding: "0.85rem 1rem", background: "#0f172a", borderRadius: "8px", border: "1px solid #1e293b" },
  historyInfo: { flex: 1 },
  historyName: { color: "#f1f5f9", fontWeight: "600", fontSize: "0.9rem" },
  historyMeta: { color: "#64748b", fontSize: "0.8rem", marginTop: "0.1rem" },
  diffBadge: { padding: "0.25rem 0.6rem", borderRadius: "20px", fontSize: "0.75rem", fontWeight: "600", border: "1px solid currentColor" },
  statusBadge: { padding: "0.25rem 0.6rem", borderRadius: "20px", fontSize: "0.75rem", color: "#fff" },
  historyStats: { display: "flex", gap: "0.75rem", color: "#64748b", fontSize: "0.85rem" },
  historyDate: { color: "#475569", fontSize: "0.8rem" },
  empty: { color: "#64748b", textAlign: "center", padding: "2rem" },
};

export default SimulatorPage;
