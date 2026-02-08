import { useProducts } from "../hooks/useProducts";

export const ProductList = () => {
  const { products, loading, error } = useProducts();

  if (loading) return <p>Завантаження...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="product-grid">
      {products.map((productItem) => (
        <div key={productItem.id} className="card">
          <h3>{productItem.name}</h3>
          <p>{productItem.productTypeId}</p>
          <p>{productItem.capacity} L</p>
          <p>{productItem.description}</p>
        </div>
      ))}
    </div>
  );
};