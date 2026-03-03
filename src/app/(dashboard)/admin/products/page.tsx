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
    <div className="space-y-8 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">Master List</h2>
          <p className="text-base-content/60 mt-1">Manage your product catalog and stock details</p>
        </div>
        <button 
          className="btn btn-primary gap-2 shadow-lg shadow-primary/30 rounded-xl"
          onClick={() => (document.getElementById('add_product_modal') as any)?.showModal()}
        >
          <Plus size={20} strokeWidth={2.5} />
          Add New Product
        </button>
      </div>

      <div className="card bg-base-100 shadow-sm border border-base-200/60 overflow-hidden">
        <div className="card-body p-0">
          <div className="p-4 border-b border-base-200/60 flex flex-wrap gap-4 items-center justify-between bg-base-200/20">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" size={18} />
              <input
                type="text"
                placeholder="Search products..."
                className="input input-bordered w-full pl-10 bg-base-100 rounded-xl border-base-200/60 focus:border-primary transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <button className="btn btn-ghost bg-base-100 border border-base-200/60 btn-sm gap-2 rounded-lg hover:border-base-300">
                <Filter size={16} />
                Filter
              </button>
            </div>
          </div>

          <div className="overflow-x-auto p-2">
            <table className="table table-zebra w-full">
              <thead>
                <tr className="border-b-2 border-base-200">
                  <th className="font-bold text-base-content/60 px-6 py-4">Product</th>
                  <th className="font-bold text-base-content/60 px-6 py-4">Stock Number</th>
                  <th className="font-bold text-base-content/60 px-6 py-4">Supplier</th>
                  <th className="font-bold text-base-content/60 px-6 py-4">Price</th>
                  <th className="font-bold text-base-content/60 px-6 py-4">Sizes</th>
                  <th className="font-bold text-base-content/60 px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-base-200/50 transition-colors border-b border-base-100 last:border-0">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="avatar">
                          <div className="mask mask-squircle w-12 h-12 bg-base-200 flex items-center justify-center border border-base-300">
                            {product.image ? (
                              <img src={product.image} alt={product.name} />
                            ) : (
                              <ImageIcon size={20} className="text-base-content/30" />
                            )}
                          </div>
                        </div>
                        <div>
                          <div className="font-bold text-base">{product.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4"><span className="badge badge-ghost font-mono bg-base-200/50 border-0 px-2 py-3 rounded-md">{product.stockNumber}</span></td>
                    <td className="px-6 py-4 text-base-content/80">{product.supplier}</td>
                    <td className="px-6 py-4 font-semibold text-success">${product.price.toFixed(2)}</td>
                    <td className="px-6 py-4 text-base-content/80">{product.sizes}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button className="btn btn-ghost btn-sm btn-square text-info hover:bg-info/10">
                          <Edit size={16} />
                        </button>
                        <button className="btn btn-ghost btn-sm btn-square text-error hover:bg-error/10">
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
      <dialog id="add_product_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box sm:w-11/12 sm:max-w-2xl rounded-2xl shadow-2xl">
          <h3 className="font-bold text-2xl mb-6 tracking-tight">Encode New Product</h3>
          <form className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="form-control">
                <label className="label"><span className="label-text font-semibold text-base-content/80">Stock Number</span></label>
                <input type="text" placeholder="e.g. SN-100" className="input input-bordered w-full bg-base-200/30 focus:border-primary" />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text font-semibold text-base-content/80">Product Name</span></label>
                <input type="text" placeholder="e.g. Silk Scarf" className="input input-bordered w-full bg-base-200/30 focus:border-primary" />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text font-semibold text-base-content/80">Supplier</span></label>
                <input type="text" placeholder="Supplier Name" className="input input-bordered w-full bg-base-200/30 focus:border-primary" />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text font-semibold text-base-content/80">Unit Price</span></label>
                <input type="number" step="0.01" placeholder="0.00" className="input input-bordered w-full bg-base-200/30 focus:border-primary" />
              </div>
              <div className="form-control md:col-span-2">
                <label className="label"><span className="label-text font-semibold text-base-content/80">Range of Sizes Available</span></label>
                <input type="text" placeholder="e.g. S, M, L or 28, 30, 32" className="input input-bordered w-full bg-base-200/30 focus:border-primary" />
              </div>
              <div className="form-control md:col-span-2">
                <label className="label"><span className="label-text font-semibold text-base-content/80">Product Image URL</span></label>
                <input type="text" placeholder="https://example.com/image.jpg" className="input input-bordered w-full bg-base-200/30 focus:border-primary" />
              </div>
            </div>
            <div className="modal-action mt-8">
              <button type="button" className="btn btn-ghost rounded-xl" onClick={() => (document.getElementById('add_product_modal') as any).close()}>Cancel</button>
              <button type="submit" className="btn btn-primary rounded-xl shadow-lg shadow-primary/30">Save Product</button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}