import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const TrainingPage = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/api/training/sessions")
      .then((r) => setSessions(r.data))
      .catch(() => toast.error("Failed to load sessions"))
      .finally(() => setLoading(false));
  }, []);

  const completed = sessions.filter((s) => s.completed).length;
  const avgQuiz = sessions.filter((s) => s.quizScore != null).length
    ? Math.round(sessions.filter((s) => s.quizScore != null).reduce((a, s) => a + s.quizScore, 0) / sessions.filter((s) => s.quizScore != null).length)
    : 0;

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>🎓 Training Sessions</h2>
      <p style={styles.subtitle}>Auto-triggered when employees click phishing links</p>

      <div style={styles.statsRow}>
        <div style={styles.statCard}>
          <div style={styles.statNum}>{sessions.length}</div>
          <div style={styles.statLabel}>Total Sessions</div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statNum, color: "#10b981" }}>{completed}</div>
          <div style={styles.statLabel}>Completed</div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statNum, color: "#f59e0b" }}>{sessions.length - completed}</div>
          <div style={styles.statLabel}>Pending</div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statNum, color: "#6366f1" }}>{avgQuiz}%</div>
          <div style={styles.statLabel}>Avg Quiz Score</div>
        </div>
      </div>

      {loading ? (
        <div style={styles.empty}>Loading...</div>
      ) : sessions.length === 0 ? (
        <div style={styles.emptyBox}>
          <div style={styles.emptyIcon}>🎓</div>
          <div style={styles.emptyText}>No training sessions yet.</div>
          <div style={styles.emptyHint}>Sessions are auto-created when employees click phishing simulation links.</div>
        </div>
      ) : (
        <div style={styles.list}>
          {sessions.map((s) => (
            <div key={s._id} style={styles.row}>
              <div style={styles.info}>
                <div style={styles.name}>{s.target?.name}</div>
                <div style={styles.meta}>{s.target?.email} · {s.target?.company}</div>
                <div style={styles.reason}>Trigger: {s.triggerReason}</div>
              </div>
              <div style={styles.coaching}>
                <div style={styles.coachingLabel}>🤖 AI Coaching</div>
                <div style={styles.coachingPreview}>{s.aiCoaching?.slice(0, 100)}...</div>
              </div>
              <div style={styles.right}>
                {s.quizScore != null && (
                  <div style={{ ...styles.quizScore, color: s.quizScore >= 75 ? "#10b981" : s.quizScore >= 50 ? "#f59e0b" : "#ef4444" }}>
                    Quiz: {s.quizScore}%
                  </div>
                )}
                <div style={{ ...styles.badge, background: s.completed ? "#064e3b" : "#1e293b", color: s.completed ? "#10b981" : "#64748b" }}>
                  {s.completed ? "✓ Completed" : "⏳ Pending"}
                </div>
                <div style={styles.date}>{new Date(s.createdAt).toLocaleDateString()}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  page: { padding: "2rem", background: "#0f172a", minHeight: "100vh" },
  title: { color: "#f1f5f9", fontSize: "1.5rem", margin: "0 0 0.25rem" },
  subtitle: { color: "#64748b", fontSize: "0.9rem", marginBottom: "1.5rem" },
  statsRow: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1rem", marginBottom: "2rem" },
  statCard: { background: "#1e293b", borderRadius: "10px", padding: "1.25rem", textAlign: "center" },
  statNum: { fontSize: "2rem", fontWeight: "800", color: "#f1f5f9" },
  statLabel: { color: "#64748b", fontSize: "0.8rem", marginTop: "0.25rem" },
  list: { display: "flex", flexDirection: "column", gap: "0.75rem" },
  row: { background: "#1e293b", borderRadius: "12px", padding: "1.25rem", display: "flex", gap: "1.5rem", border: "1px solid #334155", alignItems: "flex-start" },
  info: { minWidth: "180px" },
  name: { color: "#f1f5f9", fontWeight: "600" },
  meta: { color: "#64748b", fontSize: "0.8rem", marginTop: "0.15rem" },
  reason: { color: "#f59e0b", fontSize: "0.8rem", marginTop: "0.35rem" },
  coaching: { flex: 1 },
  coachingLabel: { color: "#6366f1", fontSize: "0.8rem", fontWeight: "600", marginBottom: "0.35rem" },
  coachingPreview: { color: "#94a3b8", fontSize: "0.85rem", lineHeight: 1.5 },
  right: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.5rem" },
  quizScore: { fontWeight: "700", fontSize: "0.9rem" },
  badge: { padding: "0.3rem 0.7rem", borderRadius: "20px", fontSize: "0.75rem", fontWeight: "600" },
  date: { color: "#475569", fontSize: "0.75rem" },
  empty: { color: "#64748b", textAlign: "center", padding: "3rem" },
  emptyBox: { background: "#1e293b", borderRadius: "12px", padding: "3rem", textAlign: "center" },
  emptyIcon: { fontSize: "3rem", marginBottom: "1rem" },
  emptyText: { color: "#f1f5f9", fontSize: "1.1rem", marginBottom: "0.5rem" },
  emptyHint: { color: "#64748b", fontSize: "0.9rem" },
};

export default TrainingPage;
