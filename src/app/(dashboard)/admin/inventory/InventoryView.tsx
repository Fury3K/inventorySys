"use client";
import { useState } from "react";
import { Search, ArrowUpDown, Download, Eye, Image as ImageIcon, CheckCircle2, AlertCircle, XCircle } from "lucide-react";

interface Product {
  id: number;
  stockNumber: string;
  name: string;
  currentStock: number;
  minStock: number;
  supplier: string | null;
  price: string | null;
  sizes: string | null;
  imageUrl: string | null;
  updatedAt: Date | null;
}

export default function InventoryView({ initialProducts }: { initialProducts: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  const filteredItems = initialProducts.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.stockNumber.toLowerCase().includes(searchTerm.toLowerCase())
  ).map(item => {
    let status: 'In Stock' | 'Low Stock' | 'Out of Stock' = 'In Stock';
    if (item.currentStock <= 0) status = 'Out of Stock';
    else if (item.currentStock <= (item.minStock || 10)) status = 'Low Stock';
    
    return { ...item, status };
  });

  const openModal = (item: any) => {
    setSelectedItem(item);
    (document.getElementById('product_details_modal') as any).showModal();
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">Inventory Status</h2>
          <p className="text-base-content/60 mt-1">Real-time overview of your current stock levels</p>
        </div>
      </div>

      <div className="card bg-surface shadow-sm border border-base-200/60 overflow-hidden">
        <div className="card-body p-0">
          <div className="p-4 border-b border-base-200/60 flex flex-wrap gap-4 items-center justify-between bg-base-200/20">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" size={18} />
              <input
                type="text"
                placeholder="Filter by name or stock number..."
                className="input input-bordered w-full pl-10 bg-base-100 rounded-xl border-base-200/60 focus:border-primary transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto p-2">
            <table className="table w-full table-zebra">
              <thead>
                <tr className="border-b-2 border-base-200">
                  <th className="font-bold text-base-content/60 px-6 py-4">Product Details</th>
                  <th className="font-bold text-base-content/60 px-6 py-4">Stock Number</th>
                  <th className="font-bold text-base-content/60 px-6 py-4 text-center">Current Qty</th>
                  <th className="font-bold text-base-content/60 px-6 py-4">Status</th>
                  <th className="font-bold text-base-content/60 px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-base-200/50 transition-colors border-b border-base-100 last:border-0">
                    <td className="px-6 py-4">
                      <div className="font-bold text-base">{item.name}</div>
                    </td>
                    <td className="px-6 py-4"><span className="badge badge-ghost font-mono bg-base-200/50 border-0 px-2 py-3 rounded-md">{item.stockNumber}</span></td>
                    <td className="px-6 py-4 text-center">
                      <div className="font-bold text-xl">{item.currentStock}</div>
                      <div className="text-xs font-medium text-base-content/50">Min: {item.minStock}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                        item.status === 'In Stock' ? 'bg-success/10 text-success' : 
                        item.status === 'Low Stock' ? 'bg-warning/10 text-warning' : 'bg-error/10 text-error'
                      }`}>
                        {item.status === 'In Stock' && <CheckCircle2 size={14} />}
                        {item.status === 'Low Stock' && <AlertCircle size={14} />}
                        {item.status === 'Out of Stock' && <XCircle size={14} />}
                        {item.status}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="btn btn-ghost btn-sm gap-2 rounded-lg hover:bg-primary/10 hover:text-primary" onClick={() => openModal(item)}>
                        <Eye size={16} />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredItems.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-20 text-base-content/40">No inventory data available.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      <dialog id="product_details_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box sm:w-11/12 sm:max-w-2xl rounded-2xl shadow-2xl p-8">
          {selectedItem && (
            <>
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="font-extrabold text-2xl tracking-tight">{selectedItem.name}</h3>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="badge badge-ghost font-mono bg-base-200/50 border-0 px-2 py-3 rounded-md">{selectedItem.stockNumber}</span>
                    <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-bold ${
                        selectedItem.status === 'In Stock' ? 'bg-success/10 text-success' : 
                        selectedItem.status === 'Low Stock' ? 'bg-warning/10 text-warning' : 'bg-error/10 text-error'
                      }`}>
                        {selectedItem.status}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                <div className="md:col-span-2 aspect-square rounded-2xl bg-base-200/50 flex items-center justify-center overflow-hidden border border-base-200/60 shadow-inner">
                  {selectedItem.imageUrl ? (
                    <img src={selectedItem.imageUrl} alt={selectedItem.name} className="object-cover w-full h-full" />
                  ) : (
                    <ImageIcon size={48} className="text-base-content/20" />
                  )}
                </div>
                
                <div className="md:col-span-3 space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <div className="text-xs uppercase tracking-wider font-bold text-base-content/50 mb-1">Supplier</div>
                      <div className="font-semibold text-lg">{selectedItem.supplier || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-wider font-bold text-base-content/50 mb-1">Unit Price</div>
                      <div className="font-bold text-xl text-primary">₱{selectedItem.price ? parseFloat(selectedItem.price).toFixed(2) : '0.00'}</div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-xs uppercase tracking-wider font-bold text-base-content/50 mb-1">Available Sizes</div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedItem.sizes?.split(',').map((size: string, idx: number) => (
                          <span key={idx} className="badge badge-outline badge-md font-medium border-base-300">{size.trim()}</span>
                        )) || <span className="text-base-content/40">No sizes specified</span>}
                      </div>
                    </div>
                  </div>

                  <div className="divider opacity-50"></div>

                  <div>
                    <div className="text-xs uppercase tracking-wider font-bold text-base-content/50 mb-2">Current Stock Level</div>
                    <div className="flex items-end gap-3">
                      <div className={`text-4xl font-black tracking-tight ${
                        selectedItem.status === 'Low Stock' ? 'text-warning' : 
                        selectedItem.status === 'Out of Stock' ? 'text-error' : 'text-success'
                      }`}>
                        {selectedItem.currentStock}
                      </div>
                      <div className="text-base font-semibold text-base-content/60 mb-1">units available</div>
                    </div>
                    <div className="text-xs font-medium text-base-content/50 mt-2 text-right">Minimum required: {selectedItem.minStock}</div>
                  </div>
                </div>
              </div>
              
              <div className="modal-action mt-8">
                <form method="dialog">
                  <button className="btn btn-ghost rounded-xl">Close Details</button>
                </form>
              </div>
            </>
          )}
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}
