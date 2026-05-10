import React, { useEffect, useState } from "react";
import { getCampaignsService } from "../services/emailService";
import toast from "react-hot-toast";

const statusColors = {
  draft: "#64748b",
  sent: "#3b82f6",
  opened: "#f59e0b",
  clicked: "#10b981",
};

const CampaignsPage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getCampaignsService();
        setCampaigns(data);
      } catch {
        toast.error("Failed to load campaigns");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📋 Campaigns</h2>

      {loading ? (
        <p style={styles.info}>Loading...</p>
      ) : campaigns.length === 0 ? (
        <p style={styles.info}>No campaigns yet.</p>
      ) : (
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                {["Target", "Company", "Subject", "Status", "Opens", "Clicks", "Sent At"].map((h) => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => (
                <tr key={c._id} style={styles.tr}>
                  <td style={styles.td}>{c.target?.name}</td>
                  <td style={styles.td}>{c.target?.company}</td>
                  <td style={styles.td}>{c.subject}</td>
                  <td style={styles.td}>
                    <span style={{ ...styles.statusBadge, background: statusColors[c.status] }}>
                      {c.status}
                    </span>
                  </td>
                  <td style={styles.td}>{c.openCount}</td>
                  <td style={styles.td}>{c.clickCount}</td>
                  <td style={styles.td}>{c.sentAt ? new Date(c.sentAt).toLocaleDateString() : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { padding: "2rem", background: "#0f172a", minHeight: "100vh" },
  title: { color: "#f1f5f9", marginBottom: "1.5rem" },
  info: { color: "#94a3b8", textAlign: "center", marginTop: "3rem" },
  tableWrap: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { color: "#94a3b8", padding: "0.75rem 1rem", textAlign: "left", borderBottom: "1px solid #334155", fontSize: "0.85rem" },
  tr: { borderBottom: "1px solid #1e293b" },
  td: { color: "#f1f5f9", padding: "0.75rem 1rem", fontSize: "0.9rem" },
  statusBadge: { padding: "0.25rem 0.6rem", borderRadius: "20px", fontSize: "0.75rem", color: "#fff" },
};

export default CampaignsPage;
