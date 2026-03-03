"use client";
import { 
  Box, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  AlertTriangle, 
  TrendingUp, 
  Package, 
  DollarSign, 
  Clock,
  Layers
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell
} from 'recharts';

export default function DashboardOverview({ stats, chartData, stockData, recentTransactions }: any) {
  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight">System Overview</h2>
        <p className="text-base-content/60 mt-1">Real-time inventory metrics and performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Products" 
          value={stats.totalProducts} 
          icon={<Package size={24} />} 
          trend="In Catalog" 
          color="primary"
        />
        <StatCard 
          title="Total Stock" 
          value={stats.totalStock} 
          icon={<Box size={24} />} 
          trend="Available" 
          color="secondary"
        />
        <StatCard 
          title="Low Stock Items" 
          value={stats.lowStockItems} 
          icon={<AlertTriangle size={24} />} 
          trend="Critical" 
          color="warning"
        />
        <StatCard 
          title="Total Activity" 
          value={stats.totalTransactions} 
          icon={<TrendingUp size={24} />} 
          trend="All Time" 
          color="success"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Area Chart: Stock Movement */}
        <div className="card bg-surface shadow-sm border border-base-200/60 overflow-hidden">
          <div className="card-body p-0">
            <div className="p-6 border-b border-base-200/60 bg-base-200/20 flex items-center justify-between">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <TrendingUp size={20} className="text-primary" />
                Stock Movement (Last 7 Days)
              </h3>
            </div>
            <div className="h-80 w-full p-6">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorOut" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-error)" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="var(--color-error)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                  />
                  <Area type="monotone" dataKey="in" name="Receiving" stroke="var(--color-primary)" fillOpacity={1} fill="url(#colorIn)" strokeWidth={3} />
                  <Area type="monotone" dataKey="out" name="Shipping" stroke="var(--color-error)" fillOpacity={1} fill="url(#colorOut)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Bar Chart: Top Products by Stock */}
        <div className="card bg-surface shadow-sm border border-base-200/60 overflow-hidden">
          <div className="card-body p-0">
            <div className="p-6 border-b border-base-200/60 bg-base-200/20 flex items-center justify-between">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Layers size={20} className="text-secondary" />
                Top Product Stock Levels
              </h3>
            </div>
            <div className="h-80 w-full p-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stockData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                  <Tooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                  />
                  <Bar dataKey="stock" name="Current Stock" radius={[8, 8, 0, 0]} barSize={40}>
                    {stockData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? 'var(--color-secondary)' : 'var(--color-primary)'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="card bg-surface shadow-sm border border-base-200/60 overflow-hidden">
        <div className="card-body p-0">
          <div className="p-6 border-b border-base-200/60 bg-base-200/20 flex items-center justify-between">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Clock size={20} className="text-primary" />
              Recent System Activity
            </h3>
            <a href="/admin/transactions" className="btn btn-ghost btn-sm rounded-lg font-bold text-primary">View Full Ledger</a>
          </div>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className="border-b-2 border-base-200 bg-base-200/10">
                  <th className="font-bold text-xs uppercase tracking-widest text-base-content/50 px-6 py-4">Status</th>
                  <th className="font-bold text-xs uppercase tracking-widest text-base-content/50 px-6 py-4">Product</th>
                  <th className="font-bold text-xs uppercase tracking-widest text-base-content/50 px-6 py-4">Quantity</th>
                  <th className="font-bold text-xs uppercase tracking-widest text-base-content/50 px-6 py-4">Date</th>
                  <th className="font-bold text-xs uppercase tracking-widest text-base-content/50 px-6 py-4">Notes</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((tx: any) => (
                  <tr key={tx.id} className="hover:bg-base-200/30 transition-colors border-b border-base-100 last:border-0">
                    <td className="px-6 py-4">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        tx.type === 'receiving' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
                      }`}>
                        {tx.type === 'receiving' ? <ArrowDownCircle size={16} /> : <ArrowUpCircle size={16} />}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-sm">{tx.product?.name || 'Unknown'}</div>
                      <div className="text-[10px] font-mono opacity-50">{tx.product?.stockNumber}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-black ${tx.type === 'receiving' ? 'text-success' : 'text-error'}`}>
                        {tx.type === 'receiving' ? '+' : '-'}{tx.quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-base-content/60">
                      {new Date(tx.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-xs text-base-content/50 truncate max-w-[200px]">
                      {tx.notes || '-'}
                    </td>
                  </tr>
                ))}
                {recentTransactions.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-20 text-base-content/30 font-bold uppercase tracking-widest italic">
                      No Activity Logged
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend, color }: any) {
  const colorClasses: any = {
    primary: "text-primary bg-primary/10",
    secondary: "text-secondary bg-secondary/10",
    warning: "text-warning bg-warning/10",
    success: "text-success bg-success/10",
    error: "text-error bg-error/10",
  };

  return (
    <div className="card bg-surface shadow-sm border border-base-200/60 hover:shadow-md transition-all duration-300 group">
      <div className="card-body p-6">
        <div className="flex justify-between items-start mb-4">
          <div className={`p-3 rounded-2xl transition-transform duration-300 group-hover:scale-110 ${colorClasses[color]}`}>
            {icon}
          </div>
          <div className="badge badge-sm font-bold border-0 px-2 py-2.5 bg-base-200/50 text-base-content/60">
            {trend}
          </div>
        </div>
        <div>
          <p className="text-sm font-bold text-base-content/50 uppercase tracking-widest">{title}</p>
          <h4 className="text-3xl font-black mt-1 tracking-tight">{value}</h4>
        </div>
      </div>
    </div>
  );
}
