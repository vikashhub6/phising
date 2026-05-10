import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { getSocket } from "../../notifications/services/socketService";

const useDashboard = () => {
  const [stats, setStats] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/dashboard/stats");
      setStats(data.stats);
      setCampaigns(data.recentCampaigns);
    } catch {
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();

    // Real-time dashboard update via Socket.io
    const socket = getSocket();
    if (!socket) return;

    const handleDashboardUpdate = ({ campaignId, status }) => {
      // Update campaign status in list
      setCampaigns((prev) =>
        prev.map((c) => (c._id === campaignId ? { ...c, status } : c))
      );
      // Refetch stats for updated open/click rates
      fetchStats();
    };

    socket.on("dashboard_update", handleDashboardUpdate);
    return () => socket.off("dashboard_update", handleDashboardUpdate);
  }, [fetchStats]);

  return { stats, campaigns, loading, fetchStats };
};

export default useDashboard;
