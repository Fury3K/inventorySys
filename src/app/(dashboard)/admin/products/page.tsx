"use client";
import { useState } from "react";
import { Plus, Search, Filter, Edit, Trash2, Image as ImageIcon } from "lucide-react";

interface Product {
  id: number;
  stockNumber: string;
  name: string;
  supplier: string;
  price: number;
  sizes: string;
  image?: string;
}

const mockProducts: Product[] = [
  { id: 1, stockNumber: "SN-001", name: "Cotton T-Shirt", supplier: "Global Tex", price: 15.99, sizes: "S, M, L, XL" },
  { id: 2, stockNumber: "SN-002", name: "Denim Jeans", supplier: "Blue Ridge", price: 45.50, sizes: "28-36" },
  { id: 3, stockNumber: "SN-003", name: "Wool Sweater", supplier: "Global Tex", price: 35.00, sizes: "M, L" },
];

export default function MasterList() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Master List</h2>
          <p className="text-base-content/60">Manage your product catalog and stock details</p>
        </div>
        <button 
          className="btn btn-primary gap-2"
          onClick={() => (document.getElementById('add_product_modal') as any)?.showModal()}
        >
          <Plus size={20} />
          Add New Product
        </button>
      </div>

      <div className="card bg-base-100 shadow border border-base-300">
        <div className="card-body p-0">
          <div className="p-4 border-b border-base-300 flex flex-wrap gap-4 items-center justify-between">
            <div className="join">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" size={18} />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="input input-bordered join-item pl-10 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="btn btn-bordered join-item border-l-0">Search</button>
            </div>
            
            <div className="flex gap-2">
              <button className="btn btn-ghost btn-sm gap-2">
                <Filter size={16} />
                Filter
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Stock Number</th>
                  <th>Supplier</th>
                  <th>Price</th>
                  <th>Sizes</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="hover">
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="mask mask-squircle w-12 h-12 bg-base-200 flex items-center justify-center">
                            {product.image ? (
                              <img src={product.image} alt={product.name} />
                            ) : (
                              <ImageIcon size={20} className="text-base-content/30" />
                            )}
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">{product.name}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="badge badge-ghost font-mono">{product.stockNumber}</span></td>
                    <td>{product.supplier}</td>
                    <td className="font-semibold">${product.price.toFixed(2)}</td>
                    <td>{product.sizes}</td>
                    <td>
                      <div className="flex justify-end gap-2">
                        <button className="btn btn-ghost btn-xs text-info">
                          <Edit size={16} />
                        </button>
                        <button className="btn btn-ghost btn-xs text-error">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Product Modal */}
      <dialog id="add_product_modal" className="modal">
        <div className="modal-box w-11/12 max-w-2xl">
          <h3 className="font-bold text-lg mb-6">Encode New Product Details</h3>
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label"><span className="label-text font-medium">Stock Number</span></label>
                <input type="text" placeholder="e.g. SN-100" className="input input-bordered w-full" />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text font-medium">Product Name</span></label>
                <input type="text" placeholder="e.g. Silk Scarf" className="input input-bordered w-full" />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text font-medium">Supplier</span></label>
                <input type="text" placeholder="Supplier Name" className="input input-bordered w-full" />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text font-medium">Unit Price</span></label>
                <input type="number" step="0.01" placeholder="0.00" className="input input-bordered w-full" />
              </div>
              <div className="form-control md:col-span-2">
                <label className="label"><span className="label-text font-medium">Range of Sizes Available</span></label>
                <input type="text" placeholder="e.g. S, M, L or 28, 30, 32" className="input input-bordered w-full" />
              </div>
              <div className="form-control md:col-span-2">
                <label className="label"><span className="label-text font-medium">Product Image URL</span></label>
                <input type="text" placeholder="https://example.com/image.jpg" className="input input-bordered w-full" />
              </div>
            </div>
            <div className="modal-action">
              <button type="button" className="btn" onClick={() => (document.getElementById('add_product_modal') as any).close()}>Cancel</button>
              <button type="submit" className="btn btn-primary">Save Product</button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
}
