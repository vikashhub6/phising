
import { useState, useEffect } from "react";
import { getTargetsService, deleteTargetService, createTargetService } from "../services/targetService";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const useTargets = () => {
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

  const handleCreate = async (form) => {
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

  return { targets, loading, handleDelete, handleCreate };
};

export default useTargets;