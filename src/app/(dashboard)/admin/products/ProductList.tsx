"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Trash2, Edit3, Download, Upload, Image as ImageIcon, CheckCircle2, AlertCircle, X, FileSpreadsheet } from "lucide-react";
import { addProduct, updateProduct, deleteProduct, getProducts } from "@/lib/actions";
import { exportToCSV, parseCSV } from "@/lib/export-utils";
import Pagination from "@/components/layout/Pagination";

interface Product {
  id: number;
  stockNumber: string;
  name: string;
  supplier: string | null;
  price: string | null;
  sizes: string | null;
  imageUrl: string | null;
  minStock: number | null;
  currentStock: number | null;
}

const PAGE_SIZE = 15;

export default function ProductList({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [page, setPage] = useState(1);
  const [importData, setImportData] = useState<Record<string, string>[] | null>(null);
  const router = useRouter();

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.stockNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / PAGE_SIZE);
  const paginatedProducts = filteredProducts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const refreshProducts = async () => {
    const fresh = await getProducts();
    setProducts(fresh as Product[]);
    router.refresh();
  };

  const handleDelete = async (id: number) => {
    if (confirm("Delete this product? This action cannot be undone.")) {
      const result = await deleteProduct(id);
      if (result.success) {
        setProducts(products.filter((p) => p.id !== id));
        showToast("Product deleted", "success");
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
        showToast("Product added", "success");
        await refreshProducts();
      } else {
        showToast(result.error || "Failed to add", "error");
      }
    } catch {
      showToast("An unexpected error occurred", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editProduct) return;
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      const result = await updateProduct(editProduct.id, formData);
      if (result.success) {
        (document.getElementById("edit_product_modal") as HTMLDialogElement).close();
        showToast("Product updated", "success");
        await refreshProducts();
        setEditProduct(null);
      } else {
        showToast(result.error || "Failed to update", "error");
      }
    } catch {
      showToast("An unexpected error occurred", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    const data = filteredProducts.map((p) => ({
      stockNumber: p.stockNumber,
      name: p.name,
      supplier: p.supplier || "",
      price: p.price || "",
      sizes: p.sizes || "",
      minStock: String(p.minStock ?? 10),
      currentStock: String(p.currentStock ?? 0),
    }));
    exportToCSV(data, `products_${new Date().toISOString().split("T")[0]}`);
    showToast("CSV exported", "success");
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const parsed = parseCSV(text);
      if (parsed.length === 0) {
        showToast("No valid data found in CSV", "error");
        return;
      }
      setImportData(parsed);
      (document.getElementById("import_modal") as HTMLDialogElement).showModal();
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleImportConfirm = async () => {
    if (!importData) return;
    setIsLoading(true);
    try {
      const { importProducts } = await import("@/lib/actions");
      const items = importData.map((row) => ({
        stockNumber: row.stockNumber || row["stock_number"] || row["Stock Number"] || "",
        name: row.name || row["Name"] || row["Product Name"] || "",
        supplier: row.supplier || row["Supplier"] || "",
        price: row.price || row["Price"] || "",
        sizes: row.sizes || row["Sizes"] || "",
        minStock: parseInt(row.minStock || row["Min Stock"] || "10") || 10,
      }));
      const result = await importProducts(items);
      if (result.success) {
        showToast(`Imported ${result.imported} products (${result.skipped} skipped)`, "success");
        (document.getElementById("import_modal") as HTMLDialogElement).close();
        setImportData(null);
        await refreshProducts();
      } else {
        showToast(result.error || "Import failed", "error");
      }
    } catch {
      showToast("Import failed", "error");
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
        <div className="flex items-center gap-2">
          <label className="btn btn-ghost btn-sm gap-1.5 rounded-lg text-xs h-9 px-3 cursor-pointer">
            <Upload size={14} />
            Import CSV
            <input type="file" accept=".csv" className="hidden" onChange={handleImportFile} />
          </label>
          <button onClick={handleExport} className="btn btn-ghost btn-sm gap-1.5 rounded-lg text-xs h-9 px-3">
            <Download size={14} />
            Export
          </button>
          <button
            className="btn btn-primary btn-sm gap-1.5 rounded-lg shadow-sm text-xs font-semibold h-9 px-4"
            onClick={() => (document.getElementById("add_product_modal") as HTMLDialogElement)?.showModal()}
          >
            <Plus size={15} strokeWidth={2.5} />
            Add Product
          </button>
        </div>
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
              onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
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
              {paginatedProducts.map((product) => (
                <tr key={product.id} className="hover:bg-base-200/30 transition-colors border-b border-base-200/40 last:border-0">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-base-200/60 flex items-center justify-center border border-base-300/30 overflow-hidden flex-shrink-0">
                        {product.imageUrl ? <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" /> : <ImageIcon size={14} className="text-base-content/25" />}
                      </div>
                      <span className="font-medium text-sm">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3"><span className="text-xs font-mono bg-base-200/50 px-1.5 py-0.5 rounded text-base-content/60">{product.stockNumber}</span></td>
                  <td className="px-5 py-3 text-sm text-base-content/60">{product.supplier || "—"}</td>
                  <td className="px-5 py-3 text-sm font-medium text-success">₱{product.price ? parseFloat(product.price).toFixed(2) : "0.00"}</td>
                  <td className="px-5 py-3 text-sm text-base-content/60">{product.sizes || "—"}</td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="btn btn-ghost btn-xs btn-square text-base-content/40 hover:text-primary hover:bg-primary/8" onClick={() => { setEditProduct(product); (document.getElementById("edit_product_modal") as HTMLDialogElement)?.showModal(); }}>
                        <Edit3 size={13} />
                      </button>
                      <button className="btn btn-ghost btn-xs btn-square text-base-content/40 hover:text-error hover:bg-error/8" onClick={() => handleDelete(product.id)}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr><td colSpan={6} className="text-center py-12 text-base-content/30 text-sm">{searchTerm ? "No products match your search" : "No products yet."}</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} total={filteredProducts.length} />
      </div>

      {/* Add Product Modal */}
      <dialog id="add_product_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box sm:w-11/12 sm:max-w-lg rounded-2xl p-6">
          <h3 className="font-bold text-lg mb-5">New Product</h3>
          <form onSubmit={handleAddProduct} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className="text-xs font-semibold uppercase tracking-wider text-base-content/50 mb-1 block">Stock Number</label><input name="stockNumber" type="text" placeholder="e.g. SN-100" className="input input-bordered input-sm w-full bg-base-200/30 rounded-lg h-9 text-sm" required /></div>
              <div><label className="text-xs font-semibold uppercase tracking-wider text-base-content/50 mb-1 block">Product Name</label><input name="name" type="text" placeholder="e.g. Silk Scarf" className="input input-bordered input-sm w-full bg-base-200/30 rounded-lg h-9 text-sm" required /></div>
              <div><label className="text-xs font-semibold uppercase tracking-wider text-base-content/50 mb-1 block">Supplier</label><input name="supplier" type="text" placeholder="Supplier Name" className="input input-bordered input-sm w-full bg-base-200/30 rounded-lg h-9 text-sm" /></div>
              <div><label className="text-xs font-semibold uppercase tracking-wider text-base-content/50 mb-1 block">Unit Price</label><input name="price" type="number" step="0.01" placeholder="0.00" className="input input-bordered input-sm w-full bg-base-200/30 rounded-lg h-9 text-sm" required /></div>
              <div><label className="text-xs font-semibold uppercase tracking-wider text-base-content/50 mb-1 block">Min Stock</label><input name="minStock" type="number" placeholder="10" defaultValue="10" className="input input-bordered input-sm w-full bg-base-200/30 rounded-lg h-9 text-sm" /></div>
              <div><label className="text-xs font-semibold uppercase tracking-wider text-base-content/50 mb-1 block">Sizes</label><input name="sizes" type="text" placeholder="S, M, L" className="input input-bordered input-sm w-full bg-base-200/30 rounded-lg h-9 text-sm" /></div>
              <div className="sm:col-span-2"><label className="text-xs font-semibold uppercase tracking-wider text-base-content/50 mb-1 block">Image URL</label><input name="imageUrl" type="text" placeholder="https://..." className="input input-bordered input-sm w-full bg-base-200/30 rounded-lg h-9 text-sm" /></div>
            </div>
            <div className="flex justify-end gap-2 pt-3">
              <button type="button" className="btn btn-ghost btn-sm rounded-lg" onClick={() => (document.getElementById("add_product_modal") as HTMLDialogElement).close()}>Cancel</button>
              <button type="submit" disabled={isLoading} className="btn btn-primary btn-sm rounded-lg shadow-sm">{isLoading ? <span className="loading loading-spinner loading-xs"></span> : "Save Product"}</button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop"><button>close</button></form>
      </dialog>

      {/* Edit Product Modal */}
      <dialog id="edit_product_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box sm:w-11/12 sm:max-w-lg rounded-2xl p-6">
          <h3 className="font-bold text-lg mb-5">Edit Product</h3>
          {editProduct && (
            <form onSubmit={handleEditProduct} className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono bg-base-200/50 px-2 py-0.5 rounded text-base-content/50">{editProduct.stockNumber}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2"><label className="text-xs font-semibold uppercase tracking-wider text-base-content/50 mb-1 block">Product Name</label><input name="name" type="text" defaultValue={editProduct.name} className="input input-bordered input-sm w-full bg-base-200/30 rounded-lg h-9 text-sm" required /></div>
                <div><label className="text-xs font-semibold uppercase tracking-wider text-base-content/50 mb-1 block">Supplier</label><input name="supplier" type="text" defaultValue={editProduct.supplier || ""} className="input input-bordered input-sm w-full bg-base-200/30 rounded-lg h-9 text-sm" /></div>
                <div><label className="text-xs font-semibold uppercase tracking-wider text-base-content/50 mb-1 block">Unit Price</label><input name="price" type="number" step="0.01" defaultValue={editProduct.price || ""} className="input input-bordered input-sm w-full bg-base-200/30 rounded-lg h-9 text-sm" /></div>
                <div><label className="text-xs font-semibold uppercase tracking-wider text-base-content/50 mb-1 block">Min Stock</label><input name="minStock" type="number" defaultValue={editProduct.minStock ?? 10} className="input input-bordered input-sm w-full bg-base-200/30 rounded-lg h-9 text-sm" /></div>
                <div><label className="text-xs font-semibold uppercase tracking-wider text-base-content/50 mb-1 block">Sizes</label><input name="sizes" type="text" defaultValue={editProduct.sizes || ""} className="input input-bordered input-sm w-full bg-base-200/30 rounded-lg h-9 text-sm" /></div>
                <div className="sm:col-span-2"><label className="text-xs font-semibold uppercase tracking-wider text-base-content/50 mb-1 block">Image URL</label><input name="imageUrl" type="text" defaultValue={editProduct.imageUrl || ""} className="input input-bordered input-sm w-full bg-base-200/30 rounded-lg h-9 text-sm" /></div>
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button type="button" className="btn btn-ghost btn-sm rounded-lg" onClick={() => { (document.getElementById("edit_product_modal") as HTMLDialogElement).close(); setEditProduct(null); }}>Cancel</button>
                <button type="submit" disabled={isLoading} className="btn btn-primary btn-sm rounded-lg shadow-sm">{isLoading ? <span className="loading loading-spinner loading-xs"></span> : "Save Changes"}</button>
              </div>
            </form>
          )}
        </div>
        <form method="dialog" className="modal-backdrop"><button>close</button></form>
      </dialog>

      {/* Import CSV Modal */}
      <dialog id="import_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box sm:w-11/12 sm:max-w-2xl rounded-2xl p-6">
          <h3 className="font-bold text-lg mb-1">Import Products</h3>
          <p className="text-xs text-base-content/50 mb-4">Preview of {importData?.length ?? 0} rows from CSV</p>
          {importData && (
            <>
              <div className="overflow-x-auto max-h-64 rounded-lg border border-base-300/40">
                <table className="table table-xs w-full">
                  <thead>
                    <tr className="bg-base-200/30">
                      {Object.keys(importData[0] || {}).map((h) => (
                        <th key={h} className="text-[10px] font-semibold uppercase tracking-wider text-base-content/40">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {importData.slice(0, 10).map((row, i) => (
                      <tr key={i}>
                        {Object.values(row).map((v, j) => (
                          <td key={j} className="text-xs">{v}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {importData.length > 10 && <p className="text-[10px] text-base-content/40 mt-1">...and {importData.length - 10} more rows</p>}
              <div className="flex justify-end gap-2 pt-4">
                <button className="btn btn-ghost btn-sm rounded-lg" onClick={() => { (document.getElementById("import_modal") as HTMLDialogElement).close(); setImportData(null); }}>Cancel</button>
                <button className="btn btn-primary btn-sm rounded-lg shadow-sm gap-1.5" onClick={handleImportConfirm} disabled={isLoading}>
                  {isLoading ? <span className="loading loading-spinner loading-xs"></span> : <><FileSpreadsheet size={14} /> Import {importData.length} Products</>}
                </button>
              </div>
            </>
          )}
        </div>
        <form method="dialog" className="modal-backdrop"><button>close</button></form>
      </dialog>
    </div>
  );
}
