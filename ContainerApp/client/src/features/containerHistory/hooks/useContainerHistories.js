import { useState, useEffect } from "react";
import { containerHistoryApi } from "../api/containerHistoryApi.js";

export const useContainerHistories = () => {
  const [containerHistories, setContainerHistories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await containerHistoryApi.getContainerHistory();
        setContainerHistories(data);
      } catch (err) {
        console.error(err);
        setError("Не вдалося завантажити історію");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { containerHistories, loading, error };
};