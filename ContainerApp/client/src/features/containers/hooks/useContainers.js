import { useState, useEffect } from "react";
import { containerApi } from "../api/containerApi";

export const useContainers = () => {
  const [containers, setContainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await containerApi.getAll();
        setContainers(data);
      } catch (err) {
        console.error(err);
        setError("Не вдалося завантажити контейнери");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { containers, loading, error };
};