import { Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { LoginList } from "../features/auth/components/LoginList";

import { ContainerList } from "../features/containers/components/ContainerList";
import { ProductList } from "../features/products/components/ProductList";
import { UserList } from "../features/users/components/UserList";

import { ContainerDetailsPage } from "../features/containers/components/ContainerDetailsPage";
import { ContainerEditPage } from "../features/containers/components/ContainerEditPage";
import { ContainerCreatePage } from "../features/containers/components/ContainerCreatePage";
import { ContainerFillPage } from "../features/containers/components/ContainerFillPage";

import { ProductDetailsPage } from "../features/products/components/ProductDetailsPage";
import { ProductEditPage } from "../features/products/components/ProductEditPage";
import { ProductCreatePage } from '../features/products/components/ProductCreatePage';

import { UserDetailsPage } from "../features/users/components/UserDetailsPage";
import { UserEditPage } from "../features/users/components/UserEditPage";
import { UserCreatePage } from "../features/users/components/UserCreatePage";

import { CompliancePage } from "../features/products/components/CompliancePage";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginList />} />

      <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate to="/containers" replace />} />

        <Route path="containers" element={<ContainerList />} />
        <Route path="containers/:id" element={<ContainerDetailsPage />} />
        <Route path="containers/edit/:id" element={<ContainerEditPage />} />
        <Route path="containers/create" element={<ContainerCreatePage />} />
        <Route path="containers/fill/" element={<ContainerFillPage />} />

        <Route path="products" element={<ProductList />} />
        <Route path="products/:id" element={<ProductDetailsPage />} />
        <Route path="products/edit/:id" element={<ProductEditPage />} />
        <Route path="products/create" element={<ProductCreatePage />} />

        <Route path="users/:id" element={<UserDetailsPage />} />
        <Route path="users/edit/:id" element={<UserEditPage />} />
        <Route path="users/create" element={<UserCreatePage />} />

        <Route path="users" element={<UserList />} />

        <Route path="product-container-compliance" element={<CompliancePage />} />
      </Route>
    </Routes>
  );
};