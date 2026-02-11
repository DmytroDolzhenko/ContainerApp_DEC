import { Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { ProductList } from "../features/products/components/ProductList";
import { ContainerList } from "../features/containers/components/ContainerList";
import { UserList } from "../features/users/components/UserList";
import { LoginList } from "../features/auth/components/LoginList";



export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>

        <Route path="/" element={<Navigate to="/containers" replace />} />

        <Route path="/containers" element={<ContainerList />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/users" element={<UserList />} />

      </Route>

      <Route path="/login" element={<LoginList />} />

      <Route path="*" element={<h2>404 Not Found</h2>} />
    </Routes>
  );
};