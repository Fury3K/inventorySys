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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-base-content">Receiving & Going Out</h2>
          <p className="text-base-content/60">Log stock movements and inventory updates</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transaction Form */}
        <div className="lg:col-span-1">
          <div className="card bg-base-100 shadow border border-base-300">
            <div className="card-body">
              <h3 className="card-title text-base-content mb-4">Record Movement</h3>
              
              <div className="flex gap-2 mb-4">
                <button 
                  className={`btn flex-1 gap-2 ${type === 'receiving' ? 'btn-success text-success-content' : 'btn-outline text-base-content'}`}
                  onClick={() => setType('receiving')}
                  type="button"
                >
                  <ArrowDownCircle size={18} />
                  Receiving
                </button>
                <button 
                  className={`btn flex-1 gap-2 ${type === 'shipping' ? 'btn-error text-error-content' : 'btn-outline text-base-content'}`}
                  onClick={() => setType('shipping')}
                  type="button"
                >
                  <ArrowUpCircle size={18} />
                  Shipping
                </button>
              </div>

              <form className="space-y-4">
                <div className="form-control">
                  <label className="label"><span className="label-text font-medium text-base-content">Stock Number</span></label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" size={18} />
                    <input 
                      type="text" 
                      placeholder="Type or search SN..." 
                      className="input input-bordered w-full pl-10 bg-base-100 text-base-content" 
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
                  <label className="label"><span className="label-text font-medium text-base-content">Quantity</span></label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" size={18} />
                    <input type="number" placeholder="0" className="input input-bordered w-full pl-10 bg-base-100 text-base-content" />
                  </div>
                </div>

                <div className="form-control">
                  <label className="label"><span className="label-text font-medium text-base-content">Date</span></label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" size={18} />
                    <input type="date" defaultValue={today} className="input input-bordered w-full pl-10 bg-base-100 text-base-content" />
                  </div>
                </div>

                <div className="form-control">
                  <label className="label"><span className="label-text font-medium text-base-content">Notes</span></label>
                  <textarea className="textarea textarea-bordered h-20 bg-base-100 text-base-content" placeholder="Optional notes..."></textarea>
                </div>

                <button type="submit" className={`btn w-full mt-4 ${type === 'receiving' ? 'btn-success' : 'btn-error'}`}>
                  Record {type === 'receiving' ? 'Incoming' : 'Outgoing'}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="lg:col-span-2">
          <div className="card bg-base-100 shadow border border-base-300 h-full">
            <div className="card-body p-0">
              <div className="p-4 border-b border-base-300">
                <h3 className="card-title text-base-content">Recent Activity</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="table w-full text-base-content">
                  <thead>
                    <tr className="text-base-content/70">
                      <th>Date</th>
                      <th>Type</th>
                      <th>Stock #</th>
                      <th>Qty</th>
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-base-200/50 border-b border-base-200">
                        <td className="text-xs whitespace-nowrap">{tx.date}</td>
                        <td>
                          <span className={`badge badge-sm font-bold ${tx.type === 'receiving' ? 'badge-success text-success-content' : 'badge-error text-error-content'}`}>
                            {tx.type.toUpperCase()}
                          </span>
                        </td>
                        <td className="font-mono">{tx.stockNumber}</td>
                        <td className="font-bold">{tx.quantity}</td>
                        <td className="text-xs text-base-content/70 max-w-[200px] truncate" title={tx.notes}>{tx.notes}</td>
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