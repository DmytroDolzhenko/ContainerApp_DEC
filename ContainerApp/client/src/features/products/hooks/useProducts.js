import { useState, useEffect } from "react";
import { productApi } from "../api/productApi";

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await productApi.getAll();
        setProducts(data);
      } catch (err) {
        console.error(err);
        setError("Не вдалося завантажити продукти");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { products, loading, error };
};