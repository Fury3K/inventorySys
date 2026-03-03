import { getProducts, getTransactions } from "@/lib/actions";
import DashboardOverview from "./DashboardOverview";

export default async function DashboardPage() {
  const [products, allTransactions] = await Promise.all([
    getProducts(),
    getTransactions()
  ]);

  // Calculate Stats
  const stats = {
    totalProducts: products.length,
    totalStock: products.reduce((acc, p) => acc + (p.currentStock || 0), 0),
    lowStockItems: products.filter(p => (p.currentStock || 0) <= (p.minStock || 10)).length,
    totalTransactions: allTransactions.length,
  };

  // 1. Calculate Area Chart Data (Last 7 Days Movement)
  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  const movementData = last7Days.map(dateStr => {
    const dayTransactions = allTransactions.filter(tx => 
      tx.date && new Date(tx.date).toISOString().split('T')[0] === dateStr
    );
    
    return {
      name: new Date(dateStr).toLocaleDateString([], { weekday: 'short' }),
      in: dayTransactions.filter(tx => tx.type === 'receiving').reduce((acc, tx) => acc + tx.quantity, 0),
      out: dayTransactions.filter(tx => tx.type === 'shipping').reduce((acc, tx) => acc + tx.quantity, 0),
    };
  });

  // 2. Calculate Bar Chart Data (Top 5 Products by Stock)
  const stockData = products
    .sort((a, b) => (b.currentStock || 0) - (a.currentStock || 0))
    .slice(0, 5)
    .map(p => ({
      name: p.name.length > 10 ? p.name.substring(0, 10) + '...' : p.name,
      stock: p.currentStock || 0,
    }));

  return (
    <DashboardOverview 
      stats={stats} 
      chartData={movementData}
      stockData={stockData}
      recentTransactions={allTransactions.slice(0, 5)} 
    />
  );
}
