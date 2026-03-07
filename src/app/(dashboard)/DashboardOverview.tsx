"use client";
import {
  Box, ArrowDownCircle, ArrowUpCircle, AlertTriangle,
  TrendingUp, Package, Clock, Layers, Calendar,
} from "lucide-react";
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, BarChart, Bar, Cell,
} from "recharts";
import { useRouter, useSearchParams } from "next/navigation";

interface DashboardStats { totalProducts: number; totalStock: number; lowStockItems: number; totalTransactions: number; }
interface ChartDataPoint { name: string; in: number; out: number; }
interface StockDataPoint { name: string; stock: number; }
interface Transaction {
  id: number; type: string; quantity: number;
  date: Date | string | null; notes: string | null;
  product?: { name: string; stockNumber: string; } | null;
}

interface DashboardOverviewProps {
  stats: DashboardStats;
  chartData: ChartDataPoint[];
  stockData: StockDataPoint[];
  recentTransactions: Transaction[];
  currentDays: number;
}

const DATE_RANGES = [
  { label: "7D", value: 7 },
  { label: "30D", value: 30 },
  { label: "90D", value: 90 },
];

export default function DashboardOverview({ stats, chartData, stockData, recentTransactions, currentDays }: DashboardOverviewProps) {
  const router = useRouter();

  const setDateRange = (days: number) => {
    router.push(`/?days=${days}`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8 animate-fade-in">
      {/* Header with Date Range */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Overview</h2>
          <p className="text-base-content/50 text-sm mt-0.5">Real-time inventory metrics and performance</p>
        </div>
        <div className="flex items-center gap-1 p-1 bg-base-200/50 rounded-lg">
          {DATE_RANGES.map((r) => (
            <button
              key={r.value}
              onClick={() => setDateRange(r.value)}
              className={`btn btn-xs rounded-md border-0 h-7 text-[11px] font-semibold transition-all ${
                currentDays === r.value
                  ? "bg-primary text-primary-content shadow-sm"
                  : "bg-transparent text-base-content/50 hover:bg-base-200"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Products" value={stats.totalProducts} icon={<Package size={18} />} label="In Catalog" color="primary" />
        <StatCard title="Total Stock" value={stats.totalStock} icon={<Box size={18} />} label="Available" color="secondary" />
        <StatCard title="Low Stock" value={stats.lowStockItems} icon={<AlertTriangle size={18} />} label="Critical" color="warning" />
        <StatCard title="Activity" value={stats.totalTransactions} icon={<TrendingUp size={18} />} label={`Last ${currentDays}d`} color="success" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card bg-base-100 border border-base-300/40 overflow-hidden">
          <div className="px-5 py-4 border-b border-base-300/40 flex items-center gap-2">
            <TrendingUp size={16} className="text-primary" />
            <h3 className="font-semibold text-sm">Stock Movement ({currentDays} Days)</h3>
          </div>
          <div className="h-64 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.15} /><stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} /></linearGradient>
                  <linearGradient id="colorOut" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--color-error)" stopOpacity={0.15} /><stop offset="100%" stopColor="var(--color-error)" stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-base-300)" strokeOpacity={0.5} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} dy={8} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11 }} width={30} />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid var(--color-base-300)", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", fontSize: "12px", padding: "8px 12px" }} />
                <Area type="monotone" dataKey="in" name="Receiving" stroke="var(--color-primary)" fillOpacity={1} fill="url(#colorIn)" strokeWidth={2} />
                <Area type="monotone" dataKey="out" name="Shipping" stroke="var(--color-error)" fillOpacity={1} fill="url(#colorOut)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card bg-base-100 border border-base-300/40 overflow-hidden">
          <div className="px-5 py-4 border-b border-base-300/40 flex items-center gap-2">
            <Layers size={16} className="text-secondary" />
            <h3 className="font-semibold text-sm">Top Stock Levels</h3>
          </div>
          <div className="h-64 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stockData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-base-300)" strokeOpacity={0.5} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} dy={8} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11 }} width={30} />
                <Tooltip cursor={{ fill: "transparent" }} contentStyle={{ borderRadius: "12px", border: "1px solid var(--color-base-300)", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", fontSize: "12px", padding: "8px 12px" }} />
                <Bar dataKey="stock" name="Current Stock" radius={[6, 6, 0, 0]} barSize={32}>
                  {stockData.map((_: StockDataPoint, index: number) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "var(--color-primary)" : "var(--color-secondary)"} opacity={0.85} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card bg-base-100 border border-base-300/40 overflow-hidden">
        <div className="px-5 py-4 border-b border-base-300/40 flex items-center justify-between">
          <div className="flex items-center gap-2"><Clock size={16} className="text-primary" /><h3 className="font-semibold text-sm">Recent Activity</h3></div>
          <a href="/admin/transactions" className="text-xs font-semibold text-primary hover:underline">View all</a>
        </div>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead><tr className="border-b border-base-300/40">
              <th className="text-[10px] font-semibold uppercase tracking-wider text-base-content/40 px-5 py-3">Type</th>
              <th className="text-[10px] font-semibold uppercase tracking-wider text-base-content/40 px-5 py-3">Product</th>
              <th className="text-[10px] font-semibold uppercase tracking-wider text-base-content/40 px-5 py-3">Qty</th>
              <th className="text-[10px] font-semibold uppercase tracking-wider text-base-content/40 px-5 py-3">Date</th>
              <th className="text-[10px] font-semibold uppercase tracking-wider text-base-content/40 px-5 py-3">Notes</th>
            </tr></thead>
            <tbody>
              {recentTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-base-200/40 transition-colors border-b border-base-200/40 last:border-0">
                  <td className="px-5 py-3">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${tx.type === "receiving" ? "bg-success/10 text-success" : "bg-error/10 text-error"}`}>
                      {tx.type === "receiving" ? <ArrowDownCircle size={14} /> : <ArrowUpCircle size={14} />}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="text-sm font-medium">{tx.product?.name || "Unknown"}</div>
                    <div className="text-[10px] font-mono text-base-content/40">{tx.product?.stockNumber}</div>
                  </td>
                  <td className="px-5 py-3"><span className={`text-sm font-bold ${tx.type === "receiving" ? "text-success" : "text-error"}`}>{tx.type === "receiving" ? "+" : "-"}{tx.quantity}</span></td>
                  <td className="px-5 py-3 text-xs text-base-content/50">{tx.date ? new Date(tx.date).toLocaleDateString() : "N/A"}</td>
                  <td className="px-5 py-3 text-xs text-base-content/40 truncate max-w-[180px]">{tx.notes || "—"}</td>
                </tr>
              ))}
              {recentTransactions.length === 0 && <tr><td colSpan={5} className="text-center py-12 text-base-content/30 text-sm">No activity recorded yet</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, label, color }: { title: string; value: number; icon: React.ReactNode; label: string; color: "primary" | "secondary" | "warning" | "success" | "error" }) {
  const iconBg: Record<string, string> = { primary: "bg-primary/10 text-primary", secondary: "bg-secondary/10 text-secondary", warning: "bg-warning/10 text-warning", success: "bg-success/10 text-success", error: "bg-error/10 text-error" };
  return (
    <div className="card bg-base-100 border border-base-300/40 hover:border-base-300/70 transition-all duration-200 group">
      <div className="card-body p-4">
        <div className="flex items-center justify-between mb-3">
          <div className={`p-2 rounded-lg transition-transform duration-200 group-hover:scale-105 ${iconBg[color]}`}>{icon}</div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-base-content/40">{label}</span>
        </div>
        <p className="text-xs font-medium text-base-content/50">{title}</p>
        <h4 className="text-2xl font-bold tracking-tight">{value}</h4>
      </div>
    </div>
  );
}
