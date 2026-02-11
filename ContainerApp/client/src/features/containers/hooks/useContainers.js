import { useState, useEffect, useCallback } from "react";
import { containerApi } from "../api/containerApi";

export const useContainers = () => {
  const [containers, setContainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchContainers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await containerApi.getAll();
      setContainers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContainers();
  }, [fetchContainers]);

  return { containers, loading, error, refetch: fetchContainers };
};