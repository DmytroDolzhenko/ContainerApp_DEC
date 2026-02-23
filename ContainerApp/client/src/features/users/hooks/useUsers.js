import { useState, useEffect, useCallback } from "react";
import { userApi } from "../api/usersApi";

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await userApi.getAll();
      setUsers(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Не вдалося завантажити користувачів");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    users,
    loading,
    error,
    refetch: loadData
  };
};