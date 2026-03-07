"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, Package, ArrowLeftRight, X, ArrowRight, Loader2 } from "lucide-react";
import { searchAll } from "@/lib/actions";
import { useRouter } from "next/navigation";

export default function SearchModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ products: any[]; transactions: any[] }>({ products: [], transactions: [] });
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
      setResults({ products: [], transactions: [] });
    }
  }, [isOpen]);

  const doSearch = useCallback(
    async (q: string) => {
      if (q.length < 2) {
        setResults({ products: [], transactions: [] });
        return;
      }
      setIsLoading(true);
      try {
        const res = await searchAll(q);
        setResults(res);
      } catch {
        setResults({ products: [], transactions: [] });
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    const timer = setTimeout(() => doSearch(query), 300);
    return () => clearTimeout(timer);
  }, [query, doSearch]);

  const navigate = (path: string) => {
    setIsOpen(false);
    router.push(path);
  };

  const hasResults = results.products.length > 0 || results.transactions.length > 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh] bg-black/40 backdrop-blur-sm animate-fade-in" onClick={() => setIsOpen(false)}>
      <div className="w-full max-w-lg bg-base-100 rounded-2xl shadow-2xl border border-base-300/50 overflow-hidden animate-scale-in" onClick={(e) => e.stopPropagation()}>
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-base-300/40">
          <Search size={18} className="text-base-content/30" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search products, transactions..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-base-content/30"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {isLoading && <Loader2 size={16} className="text-primary animate-spin" />}
          <kbd className="hidden sm:flex items-center gap-0.5 text-[10px] font-semibold text-base-content/30 bg-base-200/60 px-1.5 py-0.5 rounded">ESC</kbd>
        </div>

        {/* Results */}
        <div className="max-h-[50vh] overflow-y-auto">
          {query.length >= 2 && !isLoading && !hasResults && (
            <div className="px-4 py-8 text-center text-sm text-base-content/30">No results found</div>
          )}

          {results.products.length > 0 && (
            <div className="px-2 pt-2">
              <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-base-content/35">Products</p>
              {results.products.map((p) => (
                <button
                  key={p.id}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-base-200/60 transition-colors text-left"
                  onClick={() => navigate("/admin/products")}
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                    <Package size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{p.name}</div>
                    <div className="text-[10px] text-base-content/40 font-mono">{p.stockNumber}</div>
                  </div>
                  <ArrowRight size={14} className="text-base-content/20" />
                </button>
              ))}
            </div>
          )}

          {results.transactions.length > 0 && (
            <div className="px-2 pt-2 pb-2">
              <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-base-content/35">Transactions</p>
              {results.transactions.map((tx: any) => (
                <button
                  key={tx.id}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-base-200/60 transition-colors text-left"
                  onClick={() => navigate("/admin/transactions")}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${tx.type === "receiving" ? "bg-success/10 text-success" : "bg-error/10 text-error"}`}>
                    <ArrowLeftRight size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">
                      {tx.type === "receiving" ? "+" : "-"}{tx.quantity} — {tx.product?.name || "Unknown"}
                    </div>
                    <div className="text-[10px] text-base-content/40">{tx.notes || tx.product?.stockNumber}</div>
                  </div>
                  <ArrowRight size={14} className="text-base-content/20" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-base-300/40 flex items-center gap-4 text-[10px] text-base-content/30">
          <span><kbd className="bg-base-200/60 px-1 rounded font-mono">↑↓</kbd> Navigate</span>
          <span><kbd className="bg-base-200/60 px-1 rounded font-mono">↵</kbd> Open</span>
          <span><kbd className="bg-base-200/60 px-1 rounded font-mono">esc</kbd> Close</span>
        </div>
      </div>
    </div>
  );
}
