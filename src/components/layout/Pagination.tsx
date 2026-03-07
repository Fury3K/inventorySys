"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  total?: number;
}

export default function Pagination({ page, totalPages, onPageChange, total }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: (number | "...")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push("...");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <div className="flex items-center justify-between px-5 py-3 border-t border-base-300/40">
      {total !== undefined && (
        <span className="text-xs text-base-content/40">{total} total</span>
      )}
      <div className="flex items-center gap-1 ml-auto">
        <button
          className="btn btn-ghost btn-xs btn-square rounded-lg"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
        >
          <ChevronLeft size={14} />
        </button>
        {pages.map((p, i) =>
          p === "..." ? (
            <span key={`dots-${i}`} className="px-1 text-xs text-base-content/30">…</span>
          ) : (
            <button
              key={p}
              className={`btn btn-xs btn-square rounded-lg text-[11px] font-semibold ${
                p === page
                  ? "btn-primary"
                  : "btn-ghost text-base-content/50 hover:text-base-content"
              }`}
              onClick={() => onPageChange(p)}
            >
              {p}
            </button>
          )
        )}
        <button
          className="btn btn-ghost btn-xs btn-square rounded-lg"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
