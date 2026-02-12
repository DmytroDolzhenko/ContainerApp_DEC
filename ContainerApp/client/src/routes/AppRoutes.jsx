import { Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { LoginList } from "../features/auth/components/LoginList"; 

import { ContainerList } from "../features/containers/components/ContainerList";
import { ProductList } from "../features/products/components/ProductList";
import { UserList } from "../features/users/components/UserList";

import { ContainerDetailsPage } from "../features/containers/components/ContainerDetailsPage";
import { ContainerEditPage } from "../features/containers/components/ContainerEditPage";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginList />} />

      <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate to="/containers" replace />} />

        <Route path="containers" element={<ContainerList />} />
        <Route path="containers/:id" element={<ContainerDetailsPage />} />      {/* 👈 Тепер працюватиме */}
        <Route path="containers/edit/:id" element={<ContainerEditPage />} />  {/* 👈 Тепер працюватиме */}

        <Route path="products" element={<ProductList />} />
        <Route path="users" element={<UserList />} />
      </Route>
    </Routes>
  );
};