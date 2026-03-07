"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Trash2, Image as ImageIcon, CheckCircle2, AlertCircle } from "lucide-react";
import { addProduct, deleteProduct } from "@/lib/actions";

interface Product {
  id: number;
  stockNumber: string;
  name: string;
  supplier: string | null;
  price: string | null;
  sizes: string | null;
  imageUrl: string | null;
}

export default function ProductList({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const router = useRouter();

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.stockNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      const result = await deleteProduct(id);
      if (result.success) {
        setProducts(products.filter((p) => p.id !== id));
        showToast("Product deleted successfully", "success");
      } else {
        showToast(result.error || "Failed to delete", "error");
      }
    }
  };

  const handleAddProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);

    try {
      const result = await addProduct(formData);
      if (result.success) {
        (document.getElementById("add_product_modal") as HTMLDialogElement).close();
        showToast("Product added successfully", "success");
        router.refresh();
      } else {
        showToast(result.error || "Failed to add product", "error");
      }
    } catch {
      showToast("An unexpected error occurred", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8 animate-fade-in relative">
      {/* Toast */}
      {toast && (
        <div className="toast toast-top toast-center z-[100]">
          <div className={`alert ${toast.type === "success" ? "alert-success" : "alert-error"} shadow-lg rounded-xl border-0 flex gap-2 text-sm font-medium animate-scale-in`}>
            {toast.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Master List</h2>
          <p className="text-base-content/50 text-sm mt-0.5">Manage your product catalog</p>
        </div>
        <button
          className="btn btn-primary btn-sm gap-1.5 rounded-lg shadow-sm text-xs font-semibold h-9 px-4"
          onClick={() => (document.getElementById("add_product_modal") as HTMLDialogElement)?.showModal()}
        >
          <Plus size={15} strokeWidth={2.5} />
          Add Product
        </button>
      </div>

      {/* Table */}
      <div className="card bg-base-100 border border-base-300/40 overflow-hidden">
        <div className="px-4 py-3 border-b border-base-300/40 flex items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/30" size={15} />
            <input
              type="text"
              placeholder="Search products..."
              className="input input-sm bg-base-200/50 border-0 w-full pl-9 rounded-lg text-sm h-8 focus:bg-base-200 focus:outline-primary/40 transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="border-b border-base-300/40">
                <th className="text-[10px] font-semibold uppercase tracking-wider text-base-content/40 px-5 py-3">Product</th>
                <th className="text-[10px] font-semibold uppercase tracking-wider text-base-content/40 px-5 py-3">Stock No.</th>
                <th className="text-[10px] font-semibold uppercase tracking-wider text-base-content/40 px-5 py-3">Supplier</th>
                <th className="text-[10px] font-semibold uppercase tracking-wider text-base-content/40 px-5 py-3">Price</th>
                <th className="text-[10px] font-semibold uppercase tracking-wider text-base-content/40 px-5 py-3">Sizes</th>
                <th className="text-[10px] font-semibold uppercase tracking-wider text-base-content/40 px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-base-200/30 transition-colors border-b border-base-200/40 last:border-0">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-base-200/60 flex items-center justify-center border border-base-300/30 overflow-hidden flex-shrink-0">
                        {product.imageUrl ? (
                          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon size={14} className="text-base-content/25" />
                        )}
                      </div>
                      <span className="font-medium text-sm">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-xs font-mono bg-base-200/50 px-1.5 py-0.5 rounded text-base-content/60">{product.stockNumber}</span>
                  </td>
                  <td className="px-5 py-3 text-sm text-base-content/60">{product.supplier || "—"}</td>
                  <td className="px-5 py-3 text-sm font-medium text-success">
                    ₱{product.price ? parseFloat(product.price).toFixed(2) : "0.00"}
                  </td>
                  <td className="px-5 py-3 text-sm text-base-content/60">{product.sizes || "—"}</td>
                  <td className="px-5 py-3 text-right">
                    <button
                      className="btn btn-ghost btn-xs btn-square text-base-content/40 hover:text-error hover:bg-error/8"
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-base-content/30 text-sm">
                    {searchTerm ? "No products match your search" : "No products yet. Add your first product to get started."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      <dialog id="add_product_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box sm:w-11/12 sm:max-w-lg rounded-2xl p-6">
          <h3 className="font-bold text-lg mb-5">New Product</h3>
          <form onSubmit={handleAddProduct} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-base-content/50 mb-1 block">Stock Number</label>
                <input name="stockNumber" type="text" placeholder="e.g. SN-100" className="input input-bordered input-sm w-full bg-base-200/30 rounded-lg h-9 text-sm" required />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-base-content/50 mb-1 block">Product Name</label>
                <input name="name" type="text" placeholder="e.g. Silk Scarf" className="input input-bordered input-sm w-full bg-base-200/30 rounded-lg h-9 text-sm" required />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-base-content/50 mb-1 block">Supplier</label>
                <input name="supplier" type="text" placeholder="Supplier Name" className="input input-bordered input-sm w-full bg-base-200/30 rounded-lg h-9 text-sm" />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-base-content/50 mb-1 block">Unit Price</label>
                <input name="price" type="number" step="0.01" placeholder="0.00" className="input input-bordered input-sm w-full bg-base-200/30 rounded-lg h-9 text-sm" required />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-base-content/50 mb-1 block">Min Stock</label>
                <input name="minStock" type="number" placeholder="10" defaultValue="10" className="input input-bordered input-sm w-full bg-base-200/30 rounded-lg h-9 text-sm" />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-base-content/50 mb-1 block">Sizes</label>
                <input name="sizes" type="text" placeholder="S, M, L or 28, 30, 32" className="input input-bordered input-sm w-full bg-base-200/30 rounded-lg h-9 text-sm" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-base-content/50 mb-1 block">Image URL</label>
                <input name="imageUrl" type="text" placeholder="https://..." className="input input-bordered input-sm w-full bg-base-200/30 rounded-lg h-9 text-sm" />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3">
              <button type="button" className="btn btn-ghost btn-sm rounded-lg" onClick={() => (document.getElementById("add_product_modal") as HTMLDialogElement).close()}>
                Cancel
              </button>
              <button type="submit" disabled={isLoading} className="btn btn-primary btn-sm rounded-lg shadow-sm">
                {isLoading ? <span className="loading loading-spinner loading-xs"></span> : "Save Product"}
              </button>
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
