"use client";
import { 
  TrendingUp, 
  Package, 
  AlertTriangle, 
  ArrowUpRight, 
  ArrowDownLeft,
  Users
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  Cell
} from "recharts";

const data = [
  { name: "Mon", incoming: 40, outgoing: 24 },
  { name: "Tue", incoming: 30, outgoing: 13 },
  { name: "Wed", incoming: 20, outgoing: 98 },
  { name: "Thu", incoming: 27, outgoing: 39 },
  { name: "Fri", incoming: 18, outgoing: 48 },
  { name: "Sat", incoming: 23, outgoing: 38 },
  { name: "Sun", incoming: 34, outgoing: 43 },
];

const topProducts = [
  { name: "Product A", sales: 400 },
  { name: "Product B", sales: 300 },
  { name: "Product C", sales: 200 },
  { name: "Product D", sales: 278 },
  { name: "Product E", sales: 189 },
];

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#FF8042', '#00C49F'];

// Helper to calculate custom ceiling for Y-Axis
const calculateCeiling = (dataMax: number) => {
  const base = Math.floor(dataMax / 100) * 100;
  const remainder = dataMax % 100;
  // If remainder is < 50, ceiling is base + 100 (e.g., 400 -> 500, 437 -> 500)
  // If remainder is >= 50, ceiling is base + 200 (e.g., 450 -> 600, 490 -> 600)
  return remainder < 50 ? base + 100 : base + 200;
};

const recentLogins = [
  { user: "Admin", time: "2 minutes ago", device: "Chrome / Windows" },
  { user: "John Doe", time: "1 hour ago", device: "Safari / macOS" },
  { user: "Jane Smith", time: "3 hours ago", device: "Firefox / Linux" },
  { user: "Warehouse Staff", time: "5 hours ago", device: "Mobile App" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-4 bg-base-100/90 backdrop-blur-md border border-base-200/80 rounded-xl shadow-xl">
        <p className="label text-base-content/80 font-bold mb-1">{label}</p>
        {payload.map((pld: any, index: number) => (
          <div key={index} style={{ color: pld.color }} className="flex items-center gap-3">
            <span className="font-semibold text-sm">{`${pld.name}:`}</span>
            <span className="font-bold">{pld.value}</span>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

export default function Dashboard() {
  // Calculate max values and ceilings for consistent intervals
  const areaMax = Math.max(...data.flatMap(d => [d.incoming, d.outgoing]));
  const areaCeiling = calculateCeiling(areaMax);
  const areaTicks = Array.from({ length: (areaCeiling / 100) + 1 }, (_, i) => i * 100);

  const barMax = Math.max(...topProducts.map(p => p.sales));
  const barCeiling = calculateCeiling(barMax);
  const barTicks = Array.from({ length: (barCeiling / 100) + 1 }, (_, i) => i * 100);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">Dashboard Overview</h2>
          <p className="text-base-content/60 mt-1">Here's what's happening with your inventory today.</p>
        </div>
        <div className="text-sm breadcrumbs bg-base-200/50 px-4 py-2 rounded-xl border border-base-200">
          <ul>
            <li><a className="font-medium hover:text-primary transition-colors">Home</a></li>
            <li className="text-base-content/70">Dashboard</li>
          </ul>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card bg-base-100 shadow-sm border border-base-200/60 transition-all hover:shadow-md hover:border-primary/20">
          <div className="card-body p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-base-content/70">Total Products</h3>
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                <Package size={20} strokeWidth={2.5} />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black tracking-tight">1,240</span>
              <span className="text-xs font-bold text-success bg-success/10 px-2 py-1 rounded-md">+21 this month</span>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-sm border border-base-200/60 transition-all hover:shadow-md hover:border-error/20">
          <div className="card-body p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-base-content/70">Low Stock Alerts</h3>
              <div className="w-10 h-10 rounded-xl bg-error/10 flex items-center justify-center text-error shadow-inner">
                <AlertTriangle size={20} strokeWidth={2.5} />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black tracking-tight">12</span>
              <span className="text-xs font-bold text-error bg-error/10 px-2 py-1 rounded-md">Requires attention</span>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-sm border border-base-200/60 transition-all hover:shadow-md hover:border-success/20">
          <div className="card-body p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-base-content/70">Receiving Today</h3>
              <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center text-success shadow-inner">
                <ArrowDownLeft size={20} strokeWidth={2.5} />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black tracking-tight">48</span>
              <span className="text-xs font-bold text-success bg-success/10 px-2 py-1 rounded-md">↗︎ 12%</span>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-sm border border-base-200/60 transition-all hover:shadow-md hover:border-secondary/20">
          <div className="card-body p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-base-content/70">Shipping Today</h3>
              <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary shadow-inner">
                <ArrowUpRight size={20} strokeWidth={2.5} />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black tracking-tight">32</span>
              <span className="text-xs font-bold text-error bg-error/10 px-2 py-1 rounded-md">↘︎ 5%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-12 gap-6 items-start">
        {/* Left Column: Charts */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Stock Trend Chart */}
          <div className="card bg-base-100 shadow-sm border border-base-200/60 overflow-hidden">
            <div className="card-body p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="card-title text-lg font-bold">Stock Movement Trend</h3>
                <div className="flex gap-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#36d399]"></div>
                    <span className="text-xs font-bold text-base-content/60">Incoming</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#f87272]"></div>
                    <span className="text-xs font-bold text-base-content/60">Outgoing</span>
                  </div>
                </div>
              </div>
              <div className="h-72 w-full text-base-content/60">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#36d399" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#36d399" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorOut" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f87272" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#f87272" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" strokeOpacity={0.1} />
                    <XAxis 
                      dataKey="name" 
                      stroke="currentColor" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                      dy={10}
                      tick={{ fill: 'currentColor' }}
                    />
                    <YAxis 
                      stroke="currentColor" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                      dx={-10}
                      tick={{ fill: 'currentColor' }}
                      domain={[0, areaCeiling]}
                      ticks={areaTicks}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" 
                      dataKey="incoming" 
                      stroke="#36d399" 
                      fillOpacity={1} 
                      fill="url(#colorInc)" 
                      strokeWidth={3}
                      isAnimationActive={true}
                      animationDuration={1500}
                      animationEasing="ease-in-out"
                    />
                    <Area type="monotone" 
                      dataKey="outgoing" 
                      stroke="#f87272" 
                      fillOpacity={1} 
                      fill="url(#colorOut)" 
                      strokeWidth={3}
                      isAnimationActive={true}
                      animationDuration={1500}
                      animationEasing="ease-in-out"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Top Products Chart */}
          <div className="card bg-base-100 shadow-sm border border-base-200/60 overflow-hidden">
            <div className="card-body p-6">
              <h3 className="card-title text-lg font-bold mb-6">Top Performing Products</h3>
              <div className="h-72 w-full text-base-content/60">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topProducts}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" strokeOpacity={0.1} />
                    <XAxis 
                      dataKey="name" 
                      stroke="currentColor" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                      dy={10} 
                      tick={{ fill: 'currentColor' }}
                    />
                    <YAxis 
                      stroke="currentColor" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                      dx={-10}
                      tick={{ fill: 'currentColor' }}
                      domain={[0, barCeiling]}
                      ticks={barTicks}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(200, 200, 200, 0.4)' }}/>
                    <Bar 
                      dataKey="sales" 
                      radius={[6, 6, 0, 0]}
                      isAnimationActive={true}
                      animationDuration={1500}
                      animationEasing="ease-in-out"
                    >
                      {topProducts.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Activity */}
        <div className="col-span-12 lg:col-span-4 h-full">
          <div className="card bg-base-100 shadow-sm border border-base-200/60 h-full flex flex-col">
            <div className="p-6 border-b border-base-200/60 bg-base-200/20 flex items-center justify-between">
              <h3 className="card-title text-lg font-bold">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                  <Users size={16} strokeWidth={2.5} />
                </div>
                Recent Login Activity
              </h3>
              <button className="btn btn-xs btn-ghost hover:bg-base-200 rounded-lg">View all</button>
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="overflow-x-auto p-2">
                <table className="table w-full">
                  <thead>
                    <tr className="border-b-2 border-base-200">
                      <th className="font-bold text-base-content/60 px-4 py-3">User</th>
                      <th className="font-bold text-base-content/60 px-4 py-3 text-right">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentLogins.map((login, i) => (
                      <tr key={i} className="hover:bg-base-200/50 transition-colors border-b border-base-100 last:border-0">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="avatar placeholder">
                              <div className="bg-neutral text-neutral-content rounded-full w-8 shadow-sm">
                                <span className="text-xs font-bold">{login.user.charAt(0)}</span>
                              </div>
                            </div>
                            <div>
                              <div className="font-bold text-sm">{login.user}</div>
                              <div className="text-[10px] opacity-50 font-medium truncate max-w-[100px]">{login.device}</div>
                            </div>
                          </div>
                        </td>
                        <td className="text-base-content/60 px-4 py-4 text-right text-xs font-semibold whitespace-nowrap">
                          {login.time}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="p-6 mt-auto bg-base-200/10 border-t border-base-200/60">
              <div className="alert bg-primary/5 border-primary/10 rounded-xl">
                <TrendingUp className="text-primary" size={20} />
                <div className="text-xs font-medium">
                  <span className="font-bold text-primary">System Notice:</span> 
                  Your inventory accuracy is up by 14% this week.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}