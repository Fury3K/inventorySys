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

  // Mock chart data (In a real app, you'd aggregate this from transactions by date)
  const chartData = [
    { name: 'Mon', in: 40, out: 24 },
    { name: 'Tue', in: 30, out: 13 },
    { name: 'Wed', in: 20, out: 98 },
    { name: 'Thu', in: 27, out: 39 },
    { name: 'Fri', in: 18, out: 48 },
    { name: 'Sat', in: 23, out: 38 },
    { name: 'Sun', in: 34, out: 43 },
  ];

  return (
    <DashboardOverview 
      stats={stats} 
      chartData={chartData} 
      recentTransactions={allTransactions.slice(0, 5)} 
    />
  );
}
