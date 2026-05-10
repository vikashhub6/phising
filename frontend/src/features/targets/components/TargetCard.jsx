
import React from "react";
import { useNavigate } from "react-router-dom";

const TargetCard = ({ target, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div style={styles.card}>
      <h3 style={styles.name}>{target.name}</h3>
      <p style={styles.meta}>{target.email}</p>
      <p style={styles.meta}>{target.company} {target.jobTitle ? `· ${target.jobTitle}` : ""}</p>
      <div style={styles.actions}>
        <button style={styles.emailBtn} onClick={() => navigate(`/email/compose/${target._id}`)}>📧 Send Email</button>
        <button style={styles.deleteBtn} onClick={() => onDelete(target._id)}>🗑 Delete</button>
      </div>
    </div>
  );
};

const styles = {
  card: { background: "#1e293b", borderRadius: "10px", padding: "1.25rem", border: "1px solid #334155" },
  name: { color: "#f1f5f9", marginBottom: "0.25rem" },
  meta: { color: "#94a3b8", fontSize: "0.9rem", marginBottom: "0.25rem" },
  actions: { display: "flex", gap: "0.5rem", marginTop: "1rem" },
  emailBtn: { flex: 1, background: "#10b981", color: "#fff", border: "none", padding: "0.5rem", borderRadius: "6px", cursor: "pointer" },
  deleteBtn: { flex: 1, background: "#ef4444", color: "#fff", border: "none", padding: "0.5rem", borderRadius: "6px", cursor: "pointer" },
};

export default TargetCard;