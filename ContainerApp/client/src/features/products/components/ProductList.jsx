import { useProducts } from "../hooks/useProducts";

export const ProductList = () => {
  const { products, loading, error } = useProducts();

  if (loading) return <p>Завантаження...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="product-grid">
      {products.map((product) => (
        <div key={product.id} className="card">
          <h3>{product.name}</h3>
          <p>{product.description}</p>
          <strong>{product.capacity} L</strong>
        </div>
      ))}
    </div>
  );
};