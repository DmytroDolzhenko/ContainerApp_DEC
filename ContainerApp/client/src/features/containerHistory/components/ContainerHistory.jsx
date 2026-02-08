import { useContainerHistories } from "../hooks/useContainerHistories";

export const ContainerHistoryList = () => {
  const { containerHistories, loading, error } = useContainerHistories();

  if (loading) return <p>Завантаження...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  if (!containerHistories || containerHistories.length === 0) {
    return <p>Історія порожня.</p>;
  }

  return (
    <div className="containerHistory-grid">
      {containerHistories.map((containerHistoryItem) => (
        <div key={containerHistoryItem.id} className="card">
          <h3>{containerHistoryItem.containerId}</h3>
          <p>{containerHistoryItem.productId}</p>
          <p>{containerHistoryItem.action}</p>
          <p>{containerHistoryItem.updatedAt}</p>
          <p>{containerHistoryItem.userId}</p>
        </div>
      ))}
    </div>
  );
};