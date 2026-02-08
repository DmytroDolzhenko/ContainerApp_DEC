import { useContainers } from "../hooks/useContainers";

export const ContainerList = () => {
  const { containers, loading, error } = useContainers();

  if (loading) return <p>Завантаження...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="container-grid">
      {containers.map((container) => (
        <div key={container.id} className="card">
          <h3>{container.id}</h3>
          <h3>{container.name}</h3>
          <p>{container.description}</p>
          <strong>{container.capacity} L</strong>
          <strong>{container.currentCapacity} L</strong>
          <strong>{container.productId}</strong>
          <strong>{container.productName}</strong>
        </div>
      ))}
    </div>
  );
};