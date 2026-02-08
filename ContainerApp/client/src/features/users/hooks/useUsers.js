import { useState, useEffect } from "react";
import { userApi } from "../api/usersApi";

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await userApi.getAll();
        setUsers(data);
      } catch (err) {
        console.error(err);
        setError("Не вдалося завантажити користувачів");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { users, loading, error };
};