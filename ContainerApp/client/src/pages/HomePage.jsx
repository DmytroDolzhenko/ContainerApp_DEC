import { MainLayout } from "../layouts/MainLayout.jsx";
import { ProductList } from "../features/products/components/ProductList.jsx";

export const HomePage = () => {
  return (
    <MainLayout>
      <h1>Каталог товарів</h1>
      <ProductList />
    </MainLayout>
  );
};