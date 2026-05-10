import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTargetsService, deleteTargetService } from "../services/targetService";
import toast from "react-hot-toast";

const TargetsPage = () => {
  const [targets, setTargets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchTargets = async () => {
    try {
      const { data } = await getTargetsService();
      setTargets(data);
    } catch {
      toast.error("Failed to load targets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTargets(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this target?")) return;
    try {
      await deleteTargetService(id);
      toast.success("Target deleted");
      fetchTargets();
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>🎯 Targets</h2>
        <button style={styles.addBtn} onClick={() => navigate("/targets/add")}>+ Add Target</button>
      </div>

      {loading ? (
        <p style={styles.info}>Loading...</p>
      ) : targets.length === 0 ? (
        <p style={styles.info}>No targets yet. Add one!</p>
      ) : (
        <div style={styles.grid}>
          {targets.map((t) => (
            <div key={t._id} style={styles.card}>
              <h3 style={styles.name}>{t.name}</h3>
              <p style={styles.meta}>{t.email}</p>
              <p style={styles.meta}>{t.company} {t.jobTitle ? `· ${t.jobTitle}` : ""}</p>
              <div style={styles.actions}>
                <button style={styles.emailBtn} onClick={() => navigate(`/email/compose/${t._id}`)}>📧 Send Email</button>
                <button style={styles.deleteBtn} onClick={() => handleDelete(t._id)}>🗑 Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { padding: "2rem", background: "#0f172a", minHeight: "100vh" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" },
  title: { color: "#f1f5f9", fontSize: "1.5rem" },
  addBtn: { background: "#6366f1", color: "#fff", border: "none", padding: "0.6rem 1.2rem", borderRadius: "8px", cursor: "pointer", fontSize: "0.95rem" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" },
  card: { background: "#1e293b", borderRadius: "10px", padding: "1.25rem", border: "1px solid #334155" },
  name: { color: "#f1f5f9", marginBottom: "0.25rem" },
  meta: { color: "#94a3b8", fontSize: "0.9rem", marginBottom: "0.25rem" },
  actions: { display: "flex", gap: "0.5rem", marginTop: "1rem" },
  emailBtn: { flex: 1, background: "#10b981", color: "#fff", border: "none", padding: "0.5rem", borderRadius: "6px", cursor: "pointer" },
  deleteBtn: { flex: 1, background: "#ef4444", color: "#fff", border: "none", padding: "0.5rem", borderRadius: "6px", cursor: "pointer" },
  info: { color: "#94a3b8", textAlign: "center", marginTop: "3rem" },
};

export default TargetsPage;
