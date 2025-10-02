import React, { useMemo, useState } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export interface ExpenseItem {
  id: string;
  date: string; // ISO
  category: string;
  description: string;
  amount: number; // USD for now
}

interface ExpensesTableProps {
  items: ExpenseItem[];
  categories: string[];
}

export const ExpensesTable: React.FC<ExpensesTableProps> = ({ items, categories }) => {
  const [category, setCategory] = useState<string>('all');
  const [month, setMonth] = useState<string>('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return items.filter(it => {
      const matchCategory = category === 'all' || it.category === category;
      const matchMonth = month === 'all' || it.date.startsWith(month + '-'); // month: YYYY-MM
      const matchSearch = !search || it.description.toLowerCase().includes(search.toLowerCase());
      return matchCategory && matchMonth && matchSearch;
    });
  }, [items, category, month, search]);

  const months = Array.from(new Set(items.map(i => i.date.slice(0,7)))).sort();
  const total = filtered.reduce((acc, i) => acc + i.amount, 0);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3 items-end">
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1">Category</label>
          <select value={category} onChange={e => setCategory(e.target.value)} className="border border-border rounded px-2 py-1 text-sm bg-background">
            <option value="all">All</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1">Month</label>
          <select value={month} onChange={e => setMonth(e.target.value)} className="border border-border rounded px-2 py-1 text-sm bg-background">
            <option value="all">All</option>
            {months.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <div className="flex-1 min-w-[140px]">
          <label className="block text-xs font-medium text-text-secondary mb-1">Search</label>
            <Input placeholder="Search expense" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Button variant="outline" onClick={() => { setCategory('all'); setMonth('all'); setSearch(''); }}>
          Reset
        </Button>
      </div>

      <div className="overflow-x-auto border border-border rounded-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-background-light text-text-secondary">
            <tr>
              <th className="text-left px-3 py-2 font-medium">Date</th>
              <th className="text-left px-3 py-2 font-medium">Category</th>
              <th className="text-left px-3 py-2 font-medium">Description</th>
              <th className="text-right px-3 py-2 font-medium">Amount</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(item => (
              <tr key={item.id} className="border-t border-border hover:bg-background-light/70">
                <td className="px-3 py-2 whitespace-nowrap">{item.date}</td>
                <td className="px-3 py-2">{item.category}</td>
                <td className="px-3 py-2 max-w-xs truncate" title={item.description}>{item.description}</td>
                <td className="px-3 py-2 text-right font-medium">${item.amount.toLocaleString()}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="px-3 py-6 text-center text-text-tertiary text-sm">No expenses found</td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr className="border-t border-border bg-background">
              <td colSpan={3} className="px-3 py-2 text-right font-medium">Total</td>
              <td className="px-3 py-2 text-right font-semibold">${total.toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default ExpensesTable;
