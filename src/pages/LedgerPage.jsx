import { useMemo, useState } from "react";
import { Plus, TrendingUp, TrendingDown, Wallet, Trash2, X } from "lucide-react";
import seedLedger from "../data/ledger";
import seedCustomers from "../data/customers";
import { useAuth } from "../context/AuthContext";

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(iso) {
  return new Date(iso).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function LedgerPage() {
  const { user, permissions } = useAuth();
  const [entries, setEntries] = useState(seedLedger);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    customerId: seedCustomers[0]?.id ?? "",
    type: "credit",
    amount: "",
    note: "",
  });

  const totals = useMemo(() => {
    const credit = entries
      .filter((e) => e.type === "credit")
      .reduce((sum, e) => sum + e.amount, 0);
    const debit = entries
      .filter((e) => e.type === "debit")
      .reduce((sum, e) => sum + e.amount, 0);
    return { credit, debit, net: credit - debit };
  }, [entries]);

  const openModal = () => {
    setForm({ customerId: seedCustomers[0]?.id ?? "", type: "credit", amount: "", note: "" });
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!permissions?.canManageLedger) return;

    const customer = seedCustomers.find((c) => c.id === form.customerId);
    const newEntry = {
      id: `TXN-${1000 + entries.length + 1}`,
      customerId: form.customerId,
      customerName: customer?.name ?? "Unknown",
      type: form.type,
      amount: Number(form.amount),
      note: form.note,
      recordedBy: user?.name ?? "Unknown",
      date: new Date().toISOString(),
    };
    setEntries((prev) => [newEntry, ...prev]);
    closeModal();
  };

  const handleDelete = (id) => {
    if (!permissions?.canDeleteLedgerEntries) return;
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-ledger-700">
            Admin Panel
          </p>
          <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
            Ledger Management
          </h1>
          <p className="mt-1.5 text-sm text-ink-soft">
            {entries.length} recorded transactions
          </p>
        </div>

        {permissions?.canManageLedger && (
          <button
            type="button"
            onClick={openModal}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-ledger-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-ledger-700"
          >
            <Plus className="h-4 w-4" strokeWidth={2.5} />
            Add Transaction
          </button>
        )}
      </header>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="mb-2 flex items-center gap-2 text-green-700">
            <TrendingUp className="h-4 w-4" strokeWidth={2.5} />
            <p className="text-xs font-semibold uppercase tracking-wide">Total Credit</p>
          </div>
          <p className="text-xl font-semibold text-ink">{formatCurrency(totals.credit)}</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="mb-2 flex items-center gap-2 text-red-700">
            <TrendingDown className="h-4 w-4" strokeWidth={2.5} />
            <p className="text-xs font-semibold uppercase tracking-wide">Total Debit</p>
          </div>
          <p className="text-xl font-semibold text-ink">{formatCurrency(totals.debit)}</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="mb-2 flex items-center gap-2 text-ledger-700">
            <Wallet className="h-4 w-4" strokeWidth={2.5} />
            <p className="text-xs font-semibold uppercase tracking-wide">Net Balance</p>
          </div>
          <p className="text-xl font-semibold text-ink">{formatCurrency(totals.net)}</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-ink-soft">
            <tr>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Note</th>
              <th className="px-4 py-3">Recorded By</th>
              <th className="px-4 py-3">Date</th>
              {permissions?.canDeleteLedgerEntries && <th className="px-4 py-3" />}
            </tr>
          </thead>
          <tbody>
            {entries.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-ink-soft">
                  No transactions recorded yet
                </td>
              </tr>
            ) : (
              entries.map((entry) => (
                <tr key={entry.id} className="border-t border-gray-100">
                  <td className="px-4 py-3 font-medium text-ink">{entry.customerName}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${
                        entry.type === "credit"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {entry.type === "credit" ? "Credit" : "Debit"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-ink">{formatCurrency(entry.amount)}</td>
                  <td className="px-4 py-3 text-ink-soft">{entry.note || "—"}</td>
                  <td className="px-4 py-3 text-ink-soft">{entry.recordedBy}</td>
                  <td className="px-4 py-3 text-ink-soft">{formatDate(entry.date)}</td>
                  {permissions?.canDeleteLedgerEntries && (
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="text-ink-soft hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" strokeWidth={2} />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50" onClick={closeModal} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md rounded-lg bg-white shadow-lg">
              <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                <h2 className="text-lg font-semibold text-ink">Add Transaction</h2>
                <button onClick={closeModal} className="text-ink-soft hover:text-ink">
                  <X className="h-5 w-5" strokeWidth={2} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 px-6 py-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-ink-soft">Customer</label>
                  <select
                    required
                    value={form.customerId}
                    onChange={(e) => setForm((f) => ({ ...f, customerId: e.target.value }))}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-ink outline-none focus:border-ledger-600"
                  >
                    {seedCustomers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-ink-soft">Type</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, type: "credit" }))}
                      className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition ${
                        form.type === "credit"
                          ? "border-green-600 bg-green-50 text-green-800"
                          : "border-gray-300 text-ink-soft"
                      }`}
                    >
                      Credit
                    </button>
                    <button
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, type: "debit" }))}
                      className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition ${
                        form.type === "debit"
                          ? "border-red-600 bg-red-50 text-red-800"
                          : "border-gray-300 text-ink-soft"
                      }`}
                    >
                      Debit
                    </button>
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-ink-soft">Amount</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={form.amount}
                    onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-ink outline-none focus:border-ledger-600"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-ink-soft">Note</label>
                  <input
                    type="text"
                    value={form.note}
                    onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-ink outline-none focus:border-ledger-600"
                  />
                </div>

                <div className="flex justify-end gap-2 border-t border-gray-200 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-ledger-600 px-4 py-2 text-sm font-medium text-white hover:bg-ledger-700"
                  >
                    Save Transaction
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}