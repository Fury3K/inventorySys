"use client";
import { useState } from "react";
import { Search, Filter, ArrowUpDown, Download, Eye, Image as ImageIcon } from "lucide-react";

interface InventoryItem {
  id: number;
  stockNumber: string;
  name: string;
  currentStock: number;
  minStock: number;
  lastUpdated: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  image?: string;
  supplier: string;
  price: number;
  sizes: string;
}

const mockInventory: InventoryItem[] = [
  { id: 1, stockNumber: "SN-001", name: "Cotton T-Shirt", currentStock: 150, minStock: 20, lastUpdated: "2026-02-23", status: 'In Stock', supplier: "Global Tex", price: 15.99, sizes: "S, M, L, XL" },
  { id: 2, stockNumber: "SN-002", name: "Denim Jeans", currentStock: 5, minStock: 15, lastUpdated: "2026-02-23", status: 'Low Stock', supplier: "Blue Ridge", price: 45.50, sizes: "28-36" },
  { id: 3, stockNumber: "SN-003", name: "Wool Sweater", currentStock: 0, minStock: 10, lastUpdated: "2026-02-22", status: 'Out of Stock', supplier: "Global Tex", price: 35.00, sizes: "M, L" },
];

export default function InventoryList() {
  const [items, setItems] = useState<InventoryItem[]>(mockInventory);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.stockNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openModal = (item: InventoryItem) => {
    setSelectedItem(item);
    (document.getElementById('product_details_modal') as any).showModal();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Inventory Status</h2>
          <p className="text-base-content/60">Real-time overview of your current stock levels</p>
        </div>
        <button className="btn btn-outline gap-2">
          <Download size={18} />
          Export Report
        </button>
      </div>

      <div className="card bg-base-100 shadow border border-base-300">
        <div className="card-body p-0">
          <div className="p-4 border-b border-base-300 flex flex-wrap gap-4 items-center justify-between">
            <div className="form-control relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" size={18} />
              <input
                type="text"
                placeholder="Filter by name or stock number..."
                className="input input-bordered w-full pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <select className="select select-bordered select-sm">
                <option disabled selected>Status</option>
                <option>In Stock</option>
                <option>Low Stock</option>
                <option>Out of Stock</option>
              </select>
              <button className="btn btn-ghost btn-sm gap-2">
                <ArrowUpDown size={16} />
                Sort
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Product Details</th>
                  <th>Stock Number</th>
                  <th className="text-center">Current Qty</th>
                  <th>Status</th>
                  <th>Last Updated</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover">
                    <td>
                      <div className="font-bold">{item.name}</div>
                    </td>
                    <td><span className="badge badge-ghost font-mono">{item.stockNumber}</span></td>
                    <td className="text-center">
                      <div className="font-semibold text-lg">{item.currentStock}</div>
                      <div className="text-xs opacity-50">Min: {item.minStock}</div>
                    </td>
                    <td>
                      <span className={`badge ${
                        item.status === 'In Stock' ? 'badge-success' : 
                        item.status === 'Low Stock' ? 'badge-warning' : 'badge-error'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td>{item.lastUpdated}</td>
                    <td className="text-right">
                      <button className="btn btn-ghost btn-xs" onClick={() => openModal(item)}>
                        <Eye size={16} />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      <dialog id="product_details_modal" className="modal">
        <div className="modal-box max-w-lg">
          {selectedItem && (
            <>
              <div className="flex justify-between items-start mb-6">
                <h3 className="font-bold text-xl">{selectedItem.name}</h3>
                <span className="badge badge-primary font-mono">{selectedItem.stockNumber}</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="aspect-square rounded-xl bg-base-200 flex items-center justify-center overflow-hidden border border-base-300">
                  {selectedItem.image ? (
                    <img src={selectedItem.image} alt={selectedItem.name} className="object-cover w-full h-full" />
                  ) : (
                    <ImageIcon size={48} className="text-base-content/20" />
                  )}
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="text-xs uppercase font-bold opacity-50">Supplier</div>
                    <div className="font-medium">{selectedItem.supplier}</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase font-bold opacity-50">Unit Price</div>
                    <div className="font-medium text-lg text-success">${selectedItem.price.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase font-bold opacity-50">Available Sizes</div>
                    <div className="font-medium">{selectedItem.sizes}</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase font-bold opacity-50">Current Stock</div>
                    <div className={`text-xl font-bold ${
                      selectedItem.status === 'Low Stock' ? 'text-warning' : 
                      selectedItem.status === 'Out of Stock' ? 'text-error' : 'text-primary'
                    }`}>
                      {selectedItem.currentStock} units
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="modal-action">
                <form method="dialog">
                  <button className="btn">Close</button>
                </form>
              </div>
            </>
          )}
        </div>
      </dialog>
    </div>
  );
}
