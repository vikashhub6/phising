import React, { useState } from "react";
import useNotifications from "../hooks/useNotifications";

const NotificationBell = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [open, setOpen] = useState(false);

  return (
    <div style={styles.wrapper}>
      <button style={styles.bell} onClick={() => setOpen(!open)}>
        🔔
        {unreadCount > 0 && (
          <span style={styles.badge}>{unreadCount > 99 ? "99+" : unreadCount}</span>
        )}
      </button>

      {open && (
        <div style={styles.dropdown}>
          <div style={styles.header}>
            <span style={styles.headerTitle}>Notifications</span>
            {unreadCount > 0 && (
              <button style={styles.markAll} onClick={markAllAsRead}>
                Mark all read
              </button>
            )}
          </div>

          <div style={styles.list}>
            {notifications.length === 0 ? (
              <div style={styles.empty}>No notifications yet</div>
            ) : (
              notifications.slice(0, 20).map((n) => (
                <div
                  key={n._id}
                  style={{ ...styles.item, background: n.read ? "#1e293b" : "#1e3a5f" }}
                  onClick={() => { if (!n.read) markAsRead(n._id); }}
                >
                  <div style={styles.itemMsg}>{n.message}</div>
                  <div style={styles.itemTime}>
                    {new Date(n.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  wrapper: { position: "relative" },
  bell: { background: "transparent", border: "none", fontSize: "1.3rem", cursor: "pointer", position: "relative", padding: "4px" },
  badge: { position: "absolute", top: "-4px", right: "-4px", background: "#ef4444", color: "#fff", borderRadius: "50%", fontSize: "10px", minWidth: "16px", height: "16px", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 3px" },
  dropdown: { position: "absolute", right: 0, top: "calc(100% + 8px)", width: "320px", background: "#0f172a", border: "1px solid #334155", borderRadius: "10px", boxShadow: "0 10px 30px rgba(0,0,0,0.5)", zIndex: 1000 },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem 1rem", borderBottom: "1px solid #334155" },
  headerTitle: { color: "#f1f5f9", fontWeight: "600", fontSize: "0.9rem" },
  markAll: { background: "transparent", border: "none", color: "#6366f1", cursor: "pointer", fontSize: "0.75rem" },
  list: { maxHeight: "350px", overflowY: "auto" },
  item: { padding: "0.75rem 1rem", borderBottom: "1px solid #1e293b", cursor: "pointer", transition: "background 0.2s" },
  itemMsg: { color: "#f1f5f9", fontSize: "0.82rem", lineHeight: "1.4", marginBottom: "4px" },
  itemTime: { color: "#64748b", fontSize: "0.72rem" },
  empty: { padding: "1.5rem", textAlign: "center", color: "#64748b", fontSize: "0.85rem" },
};

export default NotificationBell;
