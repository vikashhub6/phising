import React from "react";

const AwarenessPage = () => {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.icon}>⚠️</div>
        <h2 style={styles.title}>You Clicked a Simulated Phishing Link!</h2>
        <p style={styles.text}>
          This was a <strong>security awareness simulation</strong>. In a real attack, clicking this link could have compromised your account or installed malware.
        </p>
        <h3 style={styles.subtitle}>How to protect yourself:</h3>
        <ul style={styles.list}>
          <li>Always verify the sender's email address</li>
          <li>Hover over links before clicking to check the URL</li>
          <li>Never enter credentials on unexpected login pages</li>
          <li>Report suspicious emails to your IT/security team</li>
          <li>When in doubt, call the sender directly to verify</li>
        </ul>
        <div style={styles.footer}>
          This simulation was conducted for security training purposes only.
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: "100vh", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" },
  card: { background: "#1e293b", borderRadius: "12px", padding: "2.5rem", maxWidth: "600px", width: "100%", border: "2px solid #ef4444" },
  icon: { fontSize: "3rem", textAlign: "center", marginBottom: "1rem" },
  title: { color: "#ef4444", textAlign: "center", marginBottom: "1rem" },
  text: { color: "#f1f5f9", marginBottom: "1.5rem", lineHeight: "1.7" },
  subtitle: { color: "#f59e0b", marginBottom: "0.75rem" },
  list: { color: "#94a3b8", lineHeight: "2", paddingLeft: "1.5rem" },
  footer: { marginTop: "1.5rem", color: "#64748b", fontSize: "0.85rem", textAlign: "center" },
};

export default AwarenessPage;
