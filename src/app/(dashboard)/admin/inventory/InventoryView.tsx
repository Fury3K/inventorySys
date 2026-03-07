"use client";
import { useState, useMemo } from "react";
import { Search, Eye, Image as ImageIcon, CheckCircle2, AlertCircle, XCircle, Download } from "lucide-react";
import { exportToCSV } from "@/lib/export-utils";
import Pagination from "@/components/layout/Pagination";

interface Product {
  id: number; stockNumber: string; name: string;
  currentStock: number | null; minStock: number | null;
  supplier: string | null; price: string | null;
  sizes: string | null; imageUrl: string | null;
  updatedAt: Date | null;
}

interface InventoryItem extends Product {
  status: "In Stock" | "Low Stock" | "Out of Stock";
}

const PAGE_SIZE = 15;

export default function InventoryView({ initialProducts }: { initialProducts: Product[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [page, setPage] = useState(1);

  const filteredItems: InventoryItem[] = useMemo(() => {
    return initialProducts
      .filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.stockNumber.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .map((item) => {
        let status: InventoryItem["status"] = "In Stock";
        if ((item.currentStock ?? 0) <= 0) status = "Out of Stock";
        else if ((item.currentStock ?? 0) <= (item.minStock ?? 10)) status = "Low Stock";
        return { ...item, status };
      });
  }, [initialProducts, searchTerm]);

  const totalPages = Math.ceil(filteredItems.length / PAGE_SIZE);
  const paginatedItems = filteredItems.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const openModal = (item: InventoryItem) => {
    setSelectedItem(item);
    (document.getElementById("product_details_modal") as HTMLDialogElement).showModal();
  };

  const handleExport = () => {
    const data = filteredItems.map((p) => ({
      name: p.name,
      stockNumber: p.stockNumber,
      currentStock: String(p.currentStock ?? 0),
      minStock: String(p.minStock ?? 10),
      status: p.status,
      supplier: p.supplier || "",
      price: p.price || "",
    }));
    exportToCSV(data, `inventory_${new Date().toISOString().split("T")[0]}`);
  };

  const statusConfig = {
    "In Stock":     { icon: <CheckCircle2 size={12} />, cls: "bg-success/10 text-success" },
    "Low Stock":    { icon: <AlertCircle size={12} />,  cls: "bg-warning/10 text-warning" },
    "Out of Stock": { icon: <XCircle size={12} />,      cls: "bg-error/10 text-error" },
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Inventory</h2>
          <p className="text-base-content/50 text-sm mt-0.5">Real-time stock levels and status</p>
        </div>
        <button onClick={handleExport} className="btn btn-ghost btn-sm gap-1.5 rounded-lg text-xs h-9 px-3">
          <Download size={14} /> Export
        </button>
      </div>

      <div className="card bg-base-100 border border-base-300/40 overflow-hidden">
        <div className="px-4 py-3 border-b border-base-300/40 flex items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/30" size={15} />
            <input type="text" placeholder="Filter by name or stock number..." className="input input-sm bg-base-200/50 border-0 w-full pl-9 rounded-lg text-sm h-8 focus:bg-base-200 focus:outline-primary/40 transition-colors" value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead><tr className="border-b border-base-300/40">
              <th className="text-[10px] font-semibold uppercase tracking-wider text-base-content/40 px-5 py-3">Product</th>
              <th className="text-[10px] font-semibold uppercase tracking-wider text-base-content/40 px-5 py-3">Stock No.</th>
              <th className="text-[10px] font-semibold uppercase tracking-wider text-base-content/40 px-5 py-3 text-center">Qty</th>
              <th className="text-[10px] font-semibold uppercase tracking-wider text-base-content/40 px-5 py-3">Status</th>
              <th className="text-[10px] font-semibold uppercase tracking-wider text-base-content/40 px-5 py-3 text-right">Action</th>
            </tr></thead>
            <tbody>
              {paginatedItems.map((item) => {
                const badge = statusConfig[item.status];
                return (
                  <tr key={item.id} className="hover:bg-base-200/30 transition-colors border-b border-base-200/40 last:border-0">
                    <td className="px-5 py-3"><span className="font-medium text-sm">{item.name}</span></td>
                    <td className="px-5 py-3"><span className="text-xs font-mono bg-base-200/50 px-1.5 py-0.5 rounded text-base-content/60">{item.stockNumber}</span></td>
                    <td className="px-5 py-3 text-center">
                      <div className="text-base font-bold">{item.currentStock ?? 0}</div>
                      <div className="text-[10px] text-base-content/40">min: {item.minStock ?? 10}</div>
                    </td>
                    <td className="px-5 py-3">
                      <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${badge.cls}`}>{badge.icon}{item.status}</div>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button className="btn btn-ghost btn-xs gap-1 rounded-lg text-primary hover:bg-primary/8 text-[11px]" onClick={() => openModal(item)}><Eye size={13} /> View</button>
                    </td>
                  </tr>
                );
              })}
              {filteredItems.length === 0 && <tr><td colSpan={5} className="text-center py-12 text-base-content/30 text-sm">No inventory data available</td></tr>}
            </tbody>
          </table>
        </div>
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} total={filteredItems.length} />
      </div>

      {/* Details Modal */}
      <dialog id="product_details_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box sm:w-11/12 sm:max-w-lg rounded-2xl p-6">
          {selectedItem && (
            <>
              <div className="mb-5">
                <h3 className="font-bold text-lg">{selectedItem.name}</h3>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-xs font-mono bg-base-200/50 px-1.5 py-0.5 rounded text-base-content/60">{selectedItem.stockNumber}</span>
                  <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${statusConfig[selectedItem.status].cls}`}>{statusConfig[selectedItem.status].icon}{selectedItem.status}</div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-5">
                <div className="sm:col-span-2 aspect-square rounded-xl bg-base-200/40 flex items-center justify-center overflow-hidden border border-base-300/30">
                  {selectedItem.imageUrl ? <img src={selectedItem.imageUrl} alt={selectedItem.name} className="object-cover w-full h-full" /> : <ImageIcon size={36} className="text-base-content/15" />}
                </div>
                <div className="sm:col-span-3 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div><div className="text-[10px] uppercase tracking-wider font-semibold text-base-content/40 mb-0.5">Supplier</div><div className="font-medium text-sm">{selectedItem.supplier || "N/A"}</div></div>
                    <div><div className="text-[10px] uppercase tracking-wider font-semibold text-base-content/40 mb-0.5">Unit Price</div><div className="font-bold text-primary">₱{selectedItem.price ? parseFloat(selectedItem.price).toFixed(2) : "0.00"}</div></div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider font-semibold text-base-content/40 mb-1">Sizes</div>
                    <div className="flex flex-wrap gap-1.5">{selectedItem.sizes?.split(",").map((s, i) => <span key={i} className="badge badge-outline badge-sm text-[11px] border-base-300/60">{s.trim()}</span>) || <span className="text-xs text-base-content/40">No sizes</span>}</div>
                  </div>
                  <div className="divider my-1 opacity-30"></div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider font-semibold text-base-content/40 mb-1">Current Stock</div>
                    <div className="flex items-end gap-2">
                      <span className={`text-3xl font-bold ${selectedItem.status === "Low Stock" ? "text-warning" : selectedItem.status === "Out of Stock" ? "text-error" : "text-success"}`}>{selectedItem.currentStock ?? 0}</span>
                      <span className="text-sm text-base-content/50 mb-0.5">units</span>
                    </div>
                    <div className="text-[10px] text-base-content/40 mt-1">Min required: {selectedItem.minStock ?? 10}</div>
                  </div>
                </div>
              </div>
              <div className="modal-action mt-5"><form method="dialog"><button className="btn btn-ghost btn-sm rounded-lg">Close</button></form></div>
            </>
          )}
        </div>
        <form method="dialog" className="modal-backdrop"><button>close</button></form>
      </dialog>
    </div>
  );
}
