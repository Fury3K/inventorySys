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
  Area
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

const recentLogins = [
  { user: "Admin", time: "2 minutes ago", device: "Chrome / Windows" },
  { user: "John Doe", time: "1 hour ago", device: "Safari / macOS" },
  { user: "Jane Smith", time: "3 hours ago", device: "Firefox / Linux" },
  { user: "Warehouse Staff", time: "5 hours ago", device: "Mobile App" },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Dashboard Overview</h2>
        <div className="text-sm breadcrumbs">
          <ul>
            <li><a>Home</a></li>
            <li>Dashboard</li>
          </ul>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="stat bg-base-100 shadow rounded-xl border border-base-300">
          <div className="stat-figure text-primary">
            <Package size={32} />
          </div>
          <div className="stat-title">Total Products</div>
          <div className="stat-value text-primary">1,240</div>
          <div className="stat-desc">21 new this month</div>
        </div>

        <div className="stat bg-base-100 shadow rounded-xl border border-base-300">
          <div className="stat-figure text-error">
            <AlertTriangle size={32} />
          </div>
          <div className="stat-title">Low Stock</div>
          <div className="stat-value text-error">12</div>
          <div className="stat-desc">Requires attention</div>
        </div>

        <div className="stat bg-base-100 shadow rounded-xl border border-base-300">
          <div className="stat-figure text-success">
            <ArrowDownLeft size={32} />
          </div>
          <div className="stat-title">Receiving Today</div>
          <div className="stat-value text-success">48</div>
          <div className="stat-desc">↗︎ 12% more than yesterday</div>
        </div>

        <div className="stat bg-base-100 shadow rounded-xl border border-base-300">
          <div className="stat-figure text-secondary">
            <ArrowUpRight size={32} />
          </div>
          <div className="stat-title">Shipping Today</div>
          <div className="stat-value text-secondary">32</div>
          <div className="stat-desc">↘︎ 5% less than yesterday</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card bg-base-100 shadow border border-base-300">
          <div className="card-body">
            <h3 className="card-title mb-4">Stock Movement Trend</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#36d399" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#36d399" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorOut" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f87272" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#f87272" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(var(--bc) / 0.1)" />
                  <XAxis dataKey="name" stroke="oklch(var(--bc) / 0.5)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="oklch(var(--bc) / 0.5)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "oklch(var(--b1))", border: "1px solid oklch(var(--bc) / 0.1)", borderRadius: "8px" }}
                  />
                  <Area type="monotone" dataKey="incoming" stroke="#36d399" fillOpacity={1} fill="url(#colorInc)" strokeWidth={2} />
                  <Area type="monotone" dataKey="outgoing" stroke="#f87272" fillOpacity={1} fill="url(#colorOut)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow border border-base-300">
          <div className="card-body">
            <h3 className="card-title mb-4">Top Performing Products</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topProducts}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(var(--bc) / 0.1)" />
                  <XAxis dataKey="name" stroke="oklch(var(--bc) / 0.5)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="oklch(var(--bc) / 0.5)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "oklch(var(--b1))", border: "1px solid oklch(var(--bc) / 0.1)", borderRadius: "8px" }}
                  />
                  <Bar dataKey="sales" fill="oklch(var(--p))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Login Activity */}
      <div className="card bg-base-100 shadow border border-base-300">
        <div className="card-body">
          <div className="flex items-center justify-between mb-4">
            <h3 className="card-title">
              <Users size={20} className="text-primary" />
              Recent Login Activity
            </h3>
            <button className="btn btn-ghost btn-xs underline">View all logs</button>
          </div>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Activity</th>
                  <th>Device</th>
                </tr>
              </thead>
              <tbody>
                {recentLogins.map((login, i) => (
                  <tr key={i} className="hover">
                    <td className="font-bold">{login.user}</td>
                    <td>{login.time}</td>
                    <td>
                      <span className="badge badge-ghost badge-sm">{login.device}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
