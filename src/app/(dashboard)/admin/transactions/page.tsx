"use client";
import { useState } from "react";
import { ArrowDownCircle, ArrowUpCircle, Search, Calendar, Hash } from "lucide-react";

interface Transaction {
  id: number;
  stockNumber: string;
  type: 'receiving' | 'shipping';
  quantity: number;
  date: string;
  notes: string;
}

const mockTransactions: Transaction[] = [
  { id: 1, stockNumber: "SN-001", type: 'receiving', quantity: 50, date: "2026-02-23 10:00 AM", notes: "Restock from supplier" },
  { id: 2, stockNumber: "SN-002", type: 'shipping', quantity: 10, date: "2026-02-23 11:30 AM", notes: "Order #12345" },
];

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [type, setType] = useState<'receiving' | 'shipping'>('receiving');

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-base-content">Receiving & Going Out</h2>
          <p className="text-base-content/60 mt-1">Log stock movements and inventory updates</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Transaction Form */}
        <div className="lg:col-span-1">
          <div className="card bg-base-100 shadow-sm border border-base-200/60 sticky top-6">
            <div className="card-body p-6">
              <h3 className="card-title text-xl font-bold mb-6">Record Movement</h3>
              
              <div className="flex gap-3 mb-6 p-1 bg-base-200/50 rounded-xl">
                <button 
                  className={`btn flex-1 gap-2 rounded-lg border-0 ${type === 'receiving' ? 'bg-success text-success-content shadow-sm hover:bg-success/90' : 'bg-transparent text-base-content/60 hover:bg-base-200'}`}
                  onClick={() => setType('receiving')}
                  type="button"
                >
                  <ArrowDownCircle size={18} strokeWidth={2.5} />
                  Receiving
                </button>
                <button 
                  className={`btn flex-1 gap-2 rounded-lg border-0 ${type === 'shipping' ? 'bg-error text-error-content shadow-sm hover:bg-error/90' : 'bg-transparent text-base-content/60 hover:bg-base-200'}`}
                  onClick={() => setType('shipping')}
                  type="button"
                >
                  <ArrowUpCircle size={18} strokeWidth={2.5} />
                  Shipping
                </button>
              </div>

              <form className="space-y-5">
                <div className="form-control">
                  <label className="label"><span className="label-text font-semibold text-base-content/80">Stock Number</span></label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" size={18} />
                    <input 
                      type="text" 
                      placeholder="Type or search SN..." 
                      className="input input-bordered w-full pl-10 bg-base-100 rounded-xl border-base-200/60 focus:border-primary transition-all" 
                      list="stock-numbers"
                    />
                    <datalist id="stock-numbers">
                      <option value="SN-001">Cotton T-Shirt</option>
                      <option value="SN-002">Denim Jeans</option>
                      <option value="SN-003">Wool Sweater</option>
                    </datalist>
                  </div>
                </div>

                <div className="form-control">
                  <label className="label"><span className="label-text font-semibold text-base-content/80">Quantity</span></label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" size={18} />
                    <input type="number" placeholder="0" className="input input-bordered w-full pl-10 bg-base-100 rounded-xl border-base-200/60 focus:border-primary transition-all" />
                  </div>
                </div>

                <div className="form-control">
                  <label className="label"><span className="label-text font-semibold text-base-content/80">Date</span></label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" size={18} />
                    <input type="date" defaultValue={today} className="input input-bordered w-full pl-10 bg-base-100 rounded-xl border-base-200/60 focus:border-primary transition-all" />
                  </div>
                </div>

                <div className="form-control">
                  <label className="label"><span className="label-text font-semibold text-base-content/80">Notes</span></label>
                  <textarea className="textarea textarea-bordered h-24 bg-base-100 rounded-xl border-base-200/60 focus:border-primary transition-all resize-none" placeholder="Optional notes..."></textarea>
                </div>

                <button type="submit" className={`btn w-full mt-6 rounded-xl shadow-lg ${type === 'receiving' ? 'btn-success shadow-success/30' : 'btn-error shadow-error/30'}`}>
                  Record {type === 'receiving' ? 'Incoming' : 'Outgoing'}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="lg:col-span-2">
          <div className="card bg-base-100 shadow-sm border border-base-200/60 h-full">
            <div className="card-body p-0">
              <div className="p-6 border-b border-base-200/60 bg-base-200/20">
                <h3 className="card-title text-xl font-bold">Recent Activity</h3>
              </div>
              <div className="overflow-x-auto p-2">
                <table className="table w-full table-zebra">
                  <thead>
                    <tr className="border-b-2 border-base-200">
                      <th className="font-bold text-base-content/60 px-6 py-4">Date</th>
                      <th className="font-bold text-base-content/60 px-6 py-4">Type</th>
                      <th className="font-bold text-base-content/60 px-6 py-4">Stock #</th>
                      <th className="font-bold text-base-content/60 px-6 py-4">Qty</th>
                      <th className="font-bold text-base-content/60 px-6 py-4">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-base-200/50 transition-colors border-b border-base-100 last:border-0">
                        <td className="text-sm font-medium text-base-content/70 px-6 py-4 whitespace-nowrap">{tx.date}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${tx.type === 'receiving' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
                            {tx.type === 'receiving' ? <ArrowDownCircle size={14} /> : <ArrowUpCircle size={14} />}
                            {tx.type.toUpperCase()}
                          </span>
                        </td>
                        <td className="font-mono font-medium px-6 py-4"><span className="bg-base-200/50 px-2 py-1 rounded-md">{tx.stockNumber}</span></td>
                        <td className="font-black text-lg px-6 py-4">{tx.quantity}</td>
                        <td className="text-sm text-base-content/70 max-w-[200px] truncate px-6 py-4" title={tx.notes}>{tx.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}