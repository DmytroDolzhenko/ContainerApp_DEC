import { MainLayout } from "../layouts/MainLayout.jsx";
import { ProductList } from "../features/products/components/ProductList.jsx";
import { UserList } from "../features/users/components/UserList.jsx";
import { ContainerHistoryList } from "../features/containerHistory/components/ContainerHistory.jsx";

export const HomePage = () => {
  return (
    <MainLayout>
      <h1>Каталог товарів</h1>
      <ProductList />
      <UserList />
      <ContainerHistoryList />
    </MainLayout>
  );
};