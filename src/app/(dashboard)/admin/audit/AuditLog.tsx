"use client";
import { useState } from "react";
import { Shield, Package, ArrowLeftRight, LogIn, Edit3, Trash2, Plus, Clock } from "lucide-react";
import { getAuditLogs } from "@/lib/user-actions";
import Pagination from "@/components/layout/Pagination";

interface AuditEntry {
  id: number;
  action: string;
  entity: string;
  entityId: number | null;
  details: any;
  createdAt: Date | null;
  user?: { username: string } | null;
}

interface AuditData {
  items: AuditEntry[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function AuditLog({ initialData }: { initialData: AuditData }) {
  const [data, setData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);

  const handlePageChange = async (newPage: number) => {
    setIsLoading(true);
    try {
      const result = await getAuditLogs(newPage, 30);
      setData(result);
    } catch {} finally { setIsLoading(false); }
  };

  const actionIcon = (action: string) => {
    switch (action) {
      case "created": return <Plus size={12} />;
      case "updated": return <Edit3 size={12} />;
      case "deleted": return <Trash2 size={12} />;
      case "login": return <LogIn size={12} />;
      default: return <Clock size={12} />;
    }
  };

  const actionColor = (action: string) => {
    switch (action) {
      case "created": return "bg-success/10 text-success";
      case "updated": return "bg-primary/10 text-primary";
      case "deleted": return "bg-error/10 text-error";
      case "login": return "bg-info/10 text-info";
      default: return "bg-base-200/60 text-base-content/50";
    }
  };

  const entityIcon = (entity: string) => {
    switch (entity) {
      case "product": return <Package size={13} className="text-base-content/40" />;
      case "user": return <Shield size={13} className="text-base-content/40" />;
      case "transaction": return <ArrowLeftRight size={13} className="text-base-content/40" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Audit Log</h2>
        <p className="text-base-content/50 text-sm mt-0.5">Track all system activity</p>
      </div>

      <div className={`card bg-base-100 border border-base-300/40 overflow-hidden ${isLoading ? "opacity-60" : ""} transition-opacity`}>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead><tr className="border-b border-base-300/40">
              <th className="text-[10px] font-semibold uppercase tracking-wider text-base-content/40 px-5 py-3">Action</th>
              <th className="text-[10px] font-semibold uppercase tracking-wider text-base-content/40 px-5 py-3">Entity</th>
              <th className="text-[10px] font-semibold uppercase tracking-wider text-base-content/40 px-5 py-3">User</th>
              <th className="text-[10px] font-semibold uppercase tracking-wider text-base-content/40 px-5 py-3">Details</th>
              <th className="text-[10px] font-semibold uppercase tracking-wider text-base-content/40 px-5 py-3">Time</th>
            </tr></thead>
            <tbody>
              {data.items.map((entry) => (
                <tr key={entry.id} className="hover:bg-base-200/30 transition-colors border-b border-base-200/40 last:border-0">
                  <td className="px-5 py-3">
                    <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold capitalize ${actionColor(entry.action)}`}>
                      {actionIcon(entry.action)}
                      {entry.action}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1.5">
                      {entityIcon(entry.entity)}
                      <span className="text-xs capitalize">{entry.entity}</span>
                      {entry.entityId && <span className="text-[10px] text-base-content/30">#{entry.entityId}</span>}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-xs font-medium">{entry.user?.username || "System"}</span>
                  </td>
                  <td className="px-5 py-3">
                    {entry.details ? (
                      <span className="text-[11px] text-base-content/50 font-mono truncate max-w-[200px] block">
                        {typeof entry.details === "object" ? Object.entries(entry.details).map(([k, v]) => `${k}: ${v}`).join(", ") : String(entry.details)}
                      </span>
                    ) : <span className="text-xs text-base-content/30">—</span>}
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap">
                    <div className="text-xs text-base-content/50">{entry.createdAt ? new Date(entry.createdAt).toLocaleDateString() : "—"}</div>
                    <div className="text-[10px] text-base-content/30">{entry.createdAt ? new Date(entry.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}</div>
                  </td>
                </tr>
              ))}
              {data.items.length === 0 && <tr><td colSpan={5} className="text-center py-12 text-base-content/30 text-sm">No audit entries yet</td></tr>}
            </tbody>
          </table>
        </div>
        <Pagination page={data.page} totalPages={data.totalPages} onPageChange={handlePageChange} total={data.total} />
      </div>
    </div>
  );
}
