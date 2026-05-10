import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const levelColor = { Safe: "#10b981", Vulnerable: "#f59e0b", "High Risk": "#f97316", Critical: "#ef4444" };
const levelBg   = { Safe: "#064e3b", Vulnerable: "#451a03", "High Risk": "#431407", Critical: "#450a0a" };

const RiskPage = () => {
  const [scores, setScores] = useState([]);
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const [s, r] = await Promise.all([
          axios.get("/api/risk/scores"),
          axios.get("/api/risk/summary"),
        ]);
        setScores(s.data);
        setSummary(r.data);
      } catch {
        toast.error("Failed to load risk data");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const filtered = scores.filter((s) =>
    s.target.name.toLowerCase().includes(search.toLowerCase()) ||
    s.target.company.toLowerCase().includes(search.toLowerCase())
  );

  const counts = { Safe: 0, Vulnerable: 0, "High Risk": 0, Critical: 0 };
  scores.forEach((s) => { if (counts[s.level] !== undefined) counts[s.level]++; });

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>🛡️ AI Risk Scoring Engine</h2>
          <p style={styles.subtitle}>Live security score per employee based on behavior</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={styles.summaryGrid}>
        {Object.entries(counts).map(([level, count]) => (
          <div key={level} style={{ ...styles.summaryCard, borderTop: `3px solid ${levelColor[level]}` }}>
            <div style={{ ...styles.levelDot, background: levelColor[level] }} />
            <div style={{ ...styles.summaryCount, color: levelColor[level] }}>{count}</div>
            <div style={styles.summaryLabel}>{level}</div>
          </div>
        ))}
      </div>

      {/* Department Heatmap */}
      {summary.length > 0 && (
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>🏢 Department Risk Heatmap</h3>
          <div style={styles.heatmapGrid}>
            {summary.map((d) => (
              <div key={d.company} style={{ ...styles.heatCell, background: d.avgScore >= 60 ? "#450a0a" : d.avgScore >= 30 ? "#451a03" : "#064e3b" }}>
                <div style={styles.heatCompany}>{d.company}</div>
                <div style={{ ...styles.heatScore, color: d.avgScore >= 60 ? "#ef4444" : d.avgScore >= 30 ? "#f97316" : "#10b981" }}>
                  {d.avgScore}
                </div>
                <div style={styles.heatMeta}>Avg Score</div>
                {d.critical > 0 && <div style={styles.heatAlert}>⚠️ {d.critical} critical</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Employee List */}
      <div style={styles.section}>
        <div style={styles.tableHeader}>
          <h3 style={styles.sectionTitle}>👥 Employee Risk Rankings</h3>
          <input
            style={styles.search}
            placeholder="🔍 Search by name or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div style={styles.loading}>Loading risk data...</div>
        ) : filtered.length === 0 ? (
          <div style={styles.empty}>No employees found. Add targets and send campaigns first.</div>
        ) : (
          <div style={styles.list}>
            {filtered.map((s, i) => (
              <div key={s.target._id} style={styles.row}>
                <div style={styles.rank}>#{i + 1}</div>
                <div style={styles.info}>
                  <div style={styles.name}>{s.target.name}</div>
                  <div style={styles.meta}>{s.target.email} · {s.target.company}</div>
                </div>
                <div style={styles.stats}>
                  <span style={styles.stat}>📧 {s.totalEmails} sent</span>
                  <span style={styles.stat}>👁 {s.opened} opened</span>
                  <span style={styles.stat}>🖱 {s.clicked} clicked</span>
                </div>
                {/* Score Bar */}
                <div style={styles.barWrap}>
                  <div style={{ ...styles.barFill, width: `${s.score}%`, background: levelColor[s.level] }} />
                  <span style={styles.barLabel}>{s.score}</span>
                </div>
                <div style={{ ...styles.badge, background: levelBg[s.level], color: levelColor[s.level] }}>
                  {s.level}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  page: { padding: "2rem", background: "#0f172a", minHeight: "100vh" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" },
  title: { color: "#f1f5f9", fontSize: "1.5rem", margin: 0 },
  subtitle: { color: "#64748b", fontSize: "0.9rem", marginTop: "0.25rem" },
  summaryGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "2rem" },
  summaryCard: { background: "#1e293b", borderRadius: "12px", padding: "1.25rem", textAlign: "center", position: "relative" },
  levelDot: { width: 10, height: 10, borderRadius: "50%", margin: "0 auto 0.5rem" },
  summaryCount: { fontSize: "2.5rem", fontWeight: "800" },
  summaryLabel: { color: "#94a3b8", fontSize: "0.85rem", marginTop: "0.25rem" },
  section: { marginBottom: "2rem" },
  sectionTitle: { color: "#f1f5f9", marginBottom: "1rem", fontSize: "1.1rem" },
  heatmapGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "0.75rem" },
  heatCell: { borderRadius: "10px", padding: "1rem", textAlign: "center", border: "1px solid #1e293b" },
  heatCompany: { color: "#f1f5f9", fontWeight: "600", fontSize: "0.9rem", marginBottom: "0.5rem" },
  heatScore: { fontSize: "2rem", fontWeight: "800" },
  heatMeta: { color: "#64748b", fontSize: "0.75rem" },
  heatAlert: { color: "#f97316", fontSize: "0.75rem", marginTop: "0.5rem" },
  tableHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" },
  search: { padding: "0.5rem 1rem", background: "#1e293b", border: "1px solid #334155", borderRadius: "8px", color: "#f1f5f9", fontSize: "0.9rem", width: "280px" },
  list: { display: "flex", flexDirection: "column", gap: "0.5rem" },
  row: { background: "#1e293b", borderRadius: "10px", padding: "1rem 1.25rem", display: "flex", alignItems: "center", gap: "1rem", border: "1px solid #334155" },
  rank: { color: "#475569", fontWeight: "700", fontSize: "0.85rem", minWidth: "28px" },
  info: { flex: 1 },
  name: { color: "#f1f5f9", fontWeight: "600" },
  meta: { color: "#64748b", fontSize: "0.8rem", marginTop: "0.1rem" },
  stats: { display: "flex", gap: "0.75rem" },
  stat: { color: "#94a3b8", fontSize: "0.8rem" },
  barWrap: { width: 120, height: 8, background: "#0f172a", borderRadius: "4px", position: "relative", overflow: "visible", display: "flex", alignItems: "center", gap: "0.5rem" },
  barFill: { height: "100%", borderRadius: "4px", transition: "width 0.3s" },
  barLabel: { color: "#94a3b8", fontSize: "0.8rem", minWidth: "24px" },
  badge: { padding: "0.3rem 0.7rem", borderRadius: "20px", fontSize: "0.75rem", fontWeight: "600", whiteSpace: "nowrap" },
  loading: { color: "#64748b", textAlign: "center", padding: "3rem" },
  empty: { color: "#64748b", textAlign: "center", padding: "3rem", background: "#1e293b", borderRadius: "10px" },
};

export default RiskPage;
