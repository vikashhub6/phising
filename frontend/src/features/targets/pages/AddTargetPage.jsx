import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTargetService } from "../services/targetService";
import toast from "react-hot-toast";

const AddTargetPage = () => {
  const [form, setForm] = useState({ name: "", email: "", company: "", jobTitle: "", linkedinUrl: "", notes: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createTargetService(form);
      toast.success("Target added!");
      navigate("/targets");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add target");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>🎯 Add Target</h2>
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
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: "100vh", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" },
  card: { background: "#1e293b", padding: "2rem", borderRadius: "12px", width: "100%", maxWidth: "500px" },
  title: { color: "#f1f5f9", marginBottom: "1.5rem" },
  input: { width: "100%", padding: "0.75rem", marginBottom: "1rem", borderRadius: "8px", border: "1px solid #334155", background: "#0f172a", color: "#f1f5f9", fontSize: "1rem", boxSizing: "border-box" },
  btnRow: { display: "flex", gap: "1rem" },
  cancelBtn: { flex: 1, padding: "0.75rem", background: "#334155", color: "#f1f5f9", border: "none", borderRadius: "8px", cursor: "pointer" },
  submitBtn: { flex: 1, padding: "0.75rem", background: "#6366f1", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer" },
};

export default AddTargetPage;
