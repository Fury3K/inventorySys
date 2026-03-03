import { getProducts } from "@/lib/actions";
import ProductList from "./ProductList";

export default async function MasterListPage() {
  const products = await getProducts();
  
  return <ProductList initialProducts={products} />;
}
