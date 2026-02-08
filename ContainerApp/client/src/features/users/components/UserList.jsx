import { useUsers } from "../hooks/useUsers.js";

export const UserList = () => {
  const { users, loading, error } = useUsers();

  if (loading) return <p>Завантаження...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  if (!users || users.length === 0) {
      return <p>Користувачів немає.</p>;
  }

  return (
    <div className="user-grid">
      {users.map((userItem) => (
        <div key={userItem.id} className="card">
          <h3>{userItem.fullName}</h3>
          <h3>{userItem.email}</h3>
        </div>
      ))}
    </div>
  );
};