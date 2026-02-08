export const MainLayout = ({ children }) => {
  return (
    <div>
      <nav style={{ padding: "1rem", background: "#eee" }}>
        <h2>Мій Магазин</h2>
      </nav>
      <main style={{ padding: "1rem" }}>{children}</main>
    </div>
  );
};