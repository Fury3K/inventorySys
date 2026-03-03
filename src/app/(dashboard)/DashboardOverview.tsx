"use client";
import { 
  Box, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  AlertTriangle, 
  TrendingUp, 
  Package, 
  DollarSign, 
  Clock 
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
  Area
} from 'recharts';

export default function DashboardOverview({ stats, chartData, recentTransactions }: any) {
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
          trend="+2.5%" 
          color="primary"
        />
        <StatCard 
          title="Total Stock" 
          value={stats.totalStock} 
          icon={<Box size={24} />} 
          trend="+120" 
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
          title="Monthly Trans." 
          value={stats.totalTransactions} 
          icon={<TrendingUp size={24} />} 
          trend="+18%" 
          color="success"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Area */}
        <div className="lg:col-span-2 card bg-surface shadow-sm border border-base-200/60 overflow-hidden">
          <div className="card-body p-0">
            <div className="p-6 border-b border-base-200/60 bg-base-200/20 flex items-center justify-between">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <TrendingUp size={20} className="text-primary" />
                Stock Movement Trend
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
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                  />
                  <Area type="monotone" dataKey="in" stroke="var(--color-primary)" fillOpacity={1} fill="url(#colorIn)" strokeWidth={3} />
                  <Area type="monotone" dataKey="out" stroke="var(--color-error)" fillOpacity={0} strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card bg-surface shadow-sm border border-base-200/60">
          <div className="card-body p-0">
            <div className="p-6 border-b border-base-200/60 bg-base-200/20">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Clock size={20} className="text-primary" />
                Recent Activity
              </h3>
            </div>
            <div className="divide-y divide-base-200/60">
              {recentTransactions.map((tx: any) => (
                <div key={tx.id} className="p-4 flex items-center gap-4 hover:bg-base-200/30 transition-colors">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    tx.type === 'receiving' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
                  }`}>
                    {tx.type === 'receiving' ? <ArrowDownCircle size={18} /> : <ArrowUpCircle size={18} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate">{tx.product?.name || 'Unknown'}</p>
                    <p className="text-xs text-base-content/50 font-medium">{new Date(tx.date).toLocaleDateString()}</p>
                  </div>
                  <div className={`text-sm font-black ${
                    tx.type === 'receiving' ? 'text-success' : 'text-error'
                  }`}>
                    {tx.type === 'receiving' ? '+' : '-'}{tx.quantity}
                  </div>
                </div>
              ))}
              {recentTransactions.length === 0 && (
                <div className="p-10 text-center text-base-content/40 font-medium text-sm">No recent activity.</div>
              )}
            </div>
            <div className="p-4 bg-base-200/10 border-t border-base-200/60 mt-auto">
              <a href="/admin/transactions" className="btn btn-ghost btn-sm btn-block rounded-lg font-bold text-base-content/50 hover:text-primary">View All History</a>
            </div>
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
          <div className={`badge badge-sm font-bold border-0 px-2 py-2.5 ${
            trend.includes('+') ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
          }`}>
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
