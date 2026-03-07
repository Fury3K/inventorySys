"use client";
import { useState, useEffect } from "react";
import { ArrowDownCircle, ArrowUpCircle, Search, Calendar, Hash, CheckCircle2, AlertCircle } from "lucide-react";
import { recordTransaction } from "@/lib/actions";
import { useRouter } from "next/navigation";

interface Product {
  id: number;
  stockNumber: string;
  name: string;
}

interface Transaction {
  id: number;
  type: string;
  quantity: number;
  date: Date | string | null;
  notes: string | null;
  product?: {
    stockNumber: string;
    name: string;
  } | null;
}

export default function TransactionManager({
  initialTransactions,
  products,
}: {
  initialTransactions: Transaction[];
  products: Product[];
}) {
  const [type, setType] = useState<"receiving" | "shipping">("receiving");
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; kind: "success" | "error" } | null>(null);
  const router = useRouter();
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.append("type", type);

    try {
      const result = await recordTransaction(formData);
      if (result.success) {
        setToast({
          message: type === "receiving" ? "Incoming stock recorded" : "Outgoing order recorded",
          kind: "success",
        });
        form.reset();
        router.refresh();
      } else {
        setToast({ message: result.error || "Failed to record", kind: "error" });
      }
    } catch {
      setToast({ message: "An unexpected error occurred", kind: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8 animate-fade-in relative">
      {/* Toast */}
      {toast && (
        <div className="toast toast-top toast-center z-[100]">
          <div className={`alert ${toast.kind === "success" ? "alert-success" : "alert-error"} shadow-lg rounded-xl border-0 flex gap-2 text-sm font-medium animate-scale-in`}>
            {toast.kind === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold tracking-tight">Transactions</h2>
        <p className="text-base-content/50 text-sm mt-0.5">Record stock movements and view history</p>
      </div>

      <div className="grid grid-cols-12 gap-6 items-start">
        {/* Form */}
        <div className="col-span-12 lg:col-span-5">
          <div className="card bg-base-100 border border-base-300/40">
            <div className="card-body p-5">
              {/* Type Toggle */}
              <div className="flex gap-2 p-1 bg-base-200/50 rounded-lg mb-5">
                <button
                  className={`btn flex-1 gap-1.5 rounded-md border-0 h-9 text-xs font-semibold transition-all ${
                    type === "receiving"
                      ? "bg-success text-success-content shadow-sm"
                      : "bg-transparent text-base-content/50 hover:bg-base-200"
                  }`}
                  onClick={() => setType("receiving")}
                  type="button"
                >
                  <ArrowDownCircle size={14} strokeWidth={2.5} />
                  Receiving
                </button>
                <button
                  className={`btn flex-1 gap-1.5 rounded-md border-0 h-9 text-xs font-semibold transition-all ${
                    type === "shipping"
                      ? "bg-error text-error-content shadow-sm"
                      : "bg-transparent text-base-content/50 hover:bg-base-200"
                  }`}
                  onClick={() => setType("shipping")}
                  type="button"
                >
                  <ArrowUpCircle size={14} strokeWidth={2.5} />
                  Shipping
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-base-content/50 mb-1.5 block">Stock Number</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/30" size={15} />
                    <input
                      name="stockNumber"
                      type="text"
                      placeholder="Type or search..."
                      className="input input-bordered h-10 w-full pl-9 bg-base-200/30 rounded-lg text-sm"
                      list="stock-numbers"
                      required
                    />
                    <datalist id="stock-numbers">
                      {products.map((p) => (
                        <option key={p.id} value={p.stockNumber} />
                      ))}
                    </datalist>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-base-content/50 mb-1.5 block">Quantity</label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/30" size={15} />
                      <input
                        name="quantity"
                        type="number"
                        placeholder="0"
                        className="input input-bordered h-10 w-full pl-9 bg-base-200/30 rounded-lg text-sm font-semibold"
                        required
                        min="1"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-base-content/50 mb-1.5 block">Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/30" size={15} />
                      <input
                        name="date"
                        type="date"
                        defaultValue={today}
                        className="input input-bordered h-10 w-full pl-9 bg-base-200/30 rounded-lg text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-base-content/50 mb-1.5 block">Notes</label>
                  <textarea
                    name="notes"
                    className="textarea textarea-bordered h-20 w-full bg-base-200/30 rounded-lg resize-none p-3 text-sm"
                    placeholder="Optional notes..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`btn h-10 w-full rounded-lg text-sm font-semibold shadow-sm transition-all ${
                    type === "receiving" ? "btn-success" : "btn-error"
                  }`}
                >
                  {isLoading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    `Record ${type === "receiving" ? "Incoming" : "Outgoing"}`
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* History */}
        <div className="col-span-12 lg:col-span-7">
          <div className="card bg-base-100 border border-base-300/40 overflow-hidden">
            <div className="px-5 py-4 border-b border-base-300/40 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-sm">Recent Activity</h3>
                <p className="text-[10px] text-base-content/40 mt-0.5">{initialTransactions.length} entries</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr className="border-b border-base-300/40">
                    <th className="text-[10px] font-semibold uppercase tracking-wider text-base-content/40 px-5 py-3 text-center">Type</th>
                    <th className="text-[10px] font-semibold uppercase tracking-wider text-base-content/40 px-5 py-3">Product</th>
                    <th className="text-[10px] font-semibold uppercase tracking-wider text-base-content/40 px-5 py-3 text-right">Qty</th>
                    <th className="text-[10px] font-semibold uppercase tracking-wider text-base-content/40 px-5 py-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {initialTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-base-200/30 transition-colors border-b border-base-200/40 last:border-0">
                      <td className="px-5 py-3 text-center">
                        <div className={`w-7 h-7 rounded-lg inline-flex items-center justify-center ${
                          tx.type === "receiving" ? "bg-success/10 text-success" : "bg-error/10 text-error"
                        }`}>
                          {tx.type === "receiving" ? <ArrowDownCircle size={14} /> : <ArrowUpCircle size={14} />}
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span className="text-xs font-mono bg-base-200/50 px-1.5 py-0.5 rounded text-base-content/60">
                          {tx.product?.stockNumber || "Deleted"}
                        </span>
                        {tx.notes && (
                          <div className="text-[10px] text-base-content/40 mt-0.5 truncate max-w-[160px]">{tx.notes}</div>
                        )}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <span className={`text-lg font-bold ${tx.type === "receiving" ? "text-success" : "text-error"}`}>
                          {tx.type === "receiving" ? "+" : "-"}{tx.quantity}
                        </span>
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap">
                        <div className="text-xs text-base-content/60">
                          {tx.date ? new Date(tx.date).toLocaleDateString() : "N/A"}
                        </div>
                        <div className="text-[10px] text-base-content/35">
                          {tx.date ? new Date(tx.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {initialTransactions.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center py-12 text-base-content/30 text-sm">
                        No transactions recorded yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
