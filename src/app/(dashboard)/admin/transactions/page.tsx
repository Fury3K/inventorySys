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

      <div className="grid grid-cols-12 gap-8 items-stretch">
        {/* Left Column: Transaction Form */}
        <div className="col-span-12 lg:col-span-5">
          <div className="card bg-surface shadow-sm border border-base-200/60 h-full">
            <div className="card-body p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <ArrowDownCircle size={24} strokeWidth={2.5} />
                </div>
                <h3 className="text-2xl font-bold tracking-tight">Record Movement</h3>
              </div>
              
              <div className="flex gap-3 mb-8 p-1.5 bg-base-200/50 rounded-2xl">
                <button 
                  className={`btn flex-1 gap-2 rounded-xl border-0 h-12 transition-all ${type === 'receiving' ? 'bg-success text-success-content shadow-lg shadow-success/20 hover:bg-success/90' : 'bg-transparent text-base-content/60 hover:bg-base-200'}`}
                  onClick={() => setType('receiving')}
                  type="button"
                >
                  <ArrowDownCircle size={18} strokeWidth={2.5} />
                  <span className="font-bold">Receiving</span>
                </button>
                <button 
                  className={`btn flex-1 gap-2 rounded-xl border-0 h-12 transition-all ${type === 'shipping' ? 'bg-error text-error-content shadow-lg shadow-error/20 hover:bg-error/90' : 'bg-transparent text-base-content/60 hover:bg-base-200'}`}
                  onClick={() => setType('shipping')}
                  type="button"
                >
                  <ArrowUpCircle size={18} strokeWidth={2.5} />
                  <span className="font-bold">Shipping</span>
                </button>
              </div>

              <form className="space-y-6">
                <fieldset className="fieldset w-full">
                  <legend className="fieldset-legend font-bold text-sm uppercase tracking-wide opacity-70 mb-1">Stock Number</legend>
                  <div className="relative w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/30" size={20} />
                    <input 
                      type="text" 
                      placeholder="Type or search SN..." 
                      className="input input-bordered h-14 w-full pl-12 bg-base-200/30 rounded-2xl border-base-200/60 focus:border-primary transition-all font-medium" 
                      list="stock-numbers"
                    />
                    <datalist id="stock-numbers">
                      <option value="SN-001">Cotton T-Shirt</option>
                      <option value="SN-002">Denim Jeans</option>
                      <option value="SN-003">Wool Sweater</option>
                    </datalist>
                  </div>
                </fieldset>

                <div className="grid grid-cols-2 gap-6">
                  <fieldset className="fieldset w-full">
                    <legend className="fieldset-legend font-bold text-sm uppercase tracking-wide opacity-70 mb-1">Quantity</legend>
                    <div className="relative w-full">
                      <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/30" size={20} />
                      <input type="number" placeholder="0" className="input input-bordered h-14 w-full pl-12 bg-base-200/30 rounded-2xl border-base-200/60 focus:border-primary transition-all font-bold text-lg" />
                    </div>
                  </fieldset>

                  <fieldset className="fieldset w-full">
                    <legend className="fieldset-legend font-bold text-sm uppercase tracking-wide opacity-70 mb-1">Date</legend>
                    <div className="relative w-full">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/30" size={20} />
                      <input type="date" defaultValue={today} className="input input-bordered h-14 w-full pl-12 bg-base-200/30 rounded-2xl border-base-200/60 focus:border-primary transition-all font-medium" />
                    </div>
                  </fieldset>
                </div>

                <fieldset className="fieldset w-full">
                  <legend className="fieldset-legend font-bold text-sm uppercase tracking-wide opacity-70 mb-1">Notes</legend>
                  <textarea className="textarea textarea-bordered h-28 w-full bg-base-200/30 rounded-2xl border-base-200/60 focus:border-primary transition-all resize-none p-4 font-medium" placeholder="Optional notes..."></textarea>
                </fieldset>

                <button type="submit" className={`btn h-14 w-full mt-4 rounded-2xl text-lg font-bold shadow-2xl transition-all ${type === 'receiving' ? 'btn-success shadow-success/30' : 'btn-error shadow-error/30'}`}>
                  Record {type === 'receiving' ? 'Incoming Stock' : 'Outgoing Order'}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Right Column: Transaction History */}
        <div className="col-span-12 lg:col-span-7">
          <div className="card bg-surface shadow-sm border border-base-200/60 h-full overflow-hidden">
            <div className="card-body p-0">
              <div className="p-8 border-b border-base-200/60 bg-base-200/20 flex items-center justify-between">
                <div>
                  <h3 className="card-title text-2xl font-bold tracking-tight">Recent Activity</h3>
                  <p className="text-xs font-bold text-base-content/50 uppercase tracking-widest mt-1">Real-time update stream</p>
                </div>
                <div className="badge badge-outline border-base-300 font-bold px-4 py-3">{transactions.length} entries today</div>
              </div>
              <div className="overflow-x-auto p-4">
                <table className="table w-full">
                  <thead>
                    <tr className="border-b-2 border-base-200">
                      <th className="font-bold text-base-content/60 px-6 py-4 text-xs uppercase tracking-wider text-center">Type</th>
                      <th className="font-bold text-base-content/60 px-6 py-4 text-xs uppercase tracking-wider">Product Info</th>
                      <th className="font-bold text-base-content/60 px-6 py-4 text-xs uppercase tracking-wider text-right">Qty</th>
                      <th className="font-bold text-base-content/60 px-6 py-4 text-xs uppercase tracking-wider">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-base-200/50 transition-colors border-b border-base-100 last:border-0">
                        <td className="px-6 py-6 text-center">
                          <div className={`w-10 h-10 rounded-xl inline-flex items-center justify-center ${tx.type === 'receiving' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
                            {tx.type === 'receiving' ? <ArrowDownCircle size={20} strokeWidth={2.5} /> : <ArrowUpCircle size={20} strokeWidth={2.5} />}
                          </div>
                        </td>
                        <td className="px-6 py-6">
                          <div className="font-mono font-bold text-sm mb-1"><span className="bg-base-200 text-base-content/70 px-2 py-1 rounded-md">{tx.stockNumber}</span></div>
                          <div className="text-xs text-base-content/50 font-medium truncate max-w-[180px]">{tx.notes}</div>
                        </td>
                        <td className="px-6 py-6 text-right">
                          <div className={`text-2xl font-black ${tx.type === 'receiving' ? 'text-success' : 'text-error'}`}>
                            {tx.type === 'receiving' ? '+' : '-'}{tx.quantity}
                          </div>
                        </td>
                        <td className="px-6 py-6 whitespace-nowrap">
                          <div className="text-sm font-bold text-base-content/80">{tx.date.split(' ')[0]}</div>
                          <div className="text-[10px] font-bold text-base-content/40 uppercase">{tx.date.split(' ').slice(1).join(' ')}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-8 bg-base-200/10 border-t border-base-200/60 mt-auto">
                <button className="btn btn-ghost btn-block rounded-xl font-bold text-base-content/50 hover:text-primary">Load more history</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}