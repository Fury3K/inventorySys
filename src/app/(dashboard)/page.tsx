import { getDashboardData } from "@/lib/actions";
import DashboardOverview from "./DashboardOverview";

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ days?: string }> }) {
  const params = await searchParams;
  const days = parseInt(params.days || "7") || 7;
  const { stats, chartData, stockData, recentTransactions } = await getDashboardData(days);

  return (
    <DashboardOverview
      stats={stats}
      chartData={chartData}
      stockData={stockData}
      recentTransactions={recentTransactions}
      currentDays={days}
    />
  );
}
