import { getProducts } from "@/lib/actions";
import InventoryView from "./InventoryView";

export default async function InventoryPage() {
  const products = await getProducts();
  
  return <InventoryView initialProducts={products} />;
}
