
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const TargetForm = ({ onSubmit, loading }) => {
  const [form, setForm] = useState({ name: "", email: "", company: "", jobTitle: "", linkedinUrl: "", notes: "" });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit}>
      {[
        { name: "name", placeholder: "Full Name *", required: true },
        { name: "email", placeholder: "Email *", type: "email", required: true },
        { name: "company", placeholder: "Company *", required: true },
        { name: "jobTitle", placeholder: "Job Title" },
        { name: "linkedinUrl", placeholder: "LinkedIn URL" },
      ].map((field) => (
        <input
          key={field.name}
          style={styles.input}
          type={field.type || "text"}
          name={field.name}
          placeholder={field.placeholder}
          value={form[field.name]}
          onChange={handleChange}
          required={field.required}
        />
      ))}
      <textarea
        style={{ ...styles.input, height: "80px", resize: "vertical" }}
        name="notes"
        placeholder="Notes (interests, recent news, etc.)"
        value={form.notes}
        onChange={handleChange}
      />
      <div style={styles.btnRow}>
        <button type="button" style={styles.cancelBtn} onClick={() => navigate("/targets")}>Cancel</button>
        <button type="submit" style={styles.submitBtn} disabled={loading}>
          {loading ? "Adding..." : "Add Target"}
        </button>
      </div>
    </form>
  );
};

const styles = {
  input: { width: "100%", padding: "0.75rem", marginBottom: "1rem", borderRadius: "8px", border: "1px solid #334155", background: "#0f172a", color: "#f1f5f9", fontSize: "1rem", boxSizing: "border-box" },
  btnRow: { display: "flex", gap: "1rem" },
  cancelBtn: { flex: 1, padding: "0.75rem", background: "#334155", color: "#f1f5f9", border: "none", borderRadius: "8px", cursor: "pointer" },
  submitBtn: { flex: 1, padding: "0.75rem", background: "#6366f1", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer" },
};

export default TargetForm;