import { getProducts, getTransactions } from "@/lib/actions";
import TransactionManager from "./TransactionManager";

export default async function TransactionsPage() {
  const [products, transactions] = await Promise.all([
    getProducts(),
    getTransactions()
  ]);

  return (
    <TransactionManager 
      initialTransactions={transactions} 
      products={products} 
    />
  );
}
