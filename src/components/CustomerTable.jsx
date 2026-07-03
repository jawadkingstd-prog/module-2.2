import { Pencil, Trash2 } from "lucide-react";
import StatusBadge from "./StatusBadge";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

export default function CustomerTable({ customers, onEdit, onDelete }) {
  if (customers.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card px-6 py-16 text-center">
        <p className="font-display text-sm font-semibold text-ink">
          No customers found
        </p>
        <p className="mt-1 text-sm text-ink-soft">
          Try a different search term or status filter.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border-soft bg-paper/60 text-left text-xs font-semibold uppercase tracking-wide text-ink-soft">
              <th className="py-3 pl-5 pr-3 font-semibold">Customer ID</th>
              <th className="px-3 py-3 font-semibold">Name</th>
              <th className="px-3 py-3 font-semibold">Phone</th>
              <th className="px-3 py-3 font-semibold">Email</th>
              <th className="px-3 py-3 font-semibold">Address</th>
              <th className="px-3 py-3 font-semibold">Status</th>
              <th className="px-3 py-3 text-right font-semibold">Wallet Balance</th>
              <th className="py-3 pl-3 pr-5 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr
                key={customer.id}
                className="group border-b border-border-soft last:border-b-0 hover:bg-paper/50"
              >
                <td className="relative py-3.5 pl-5 pr-3 tabular-nums text-ink-soft">
                  <span
                    className={[
                      "absolute left-0 top-0 h-full w-1",
                      customer.status === "Active"
                        ? "bg-ledger-600"
                        : "bg-rust-600",
                    ].join(" ")}
                    aria-hidden="true"
                  />
                  {customer.id}
                </td>
                <td className="px-3 py-3.5 font-medium text-ink">
                  {customer.name}
                </td>
                <td className="px-3 py-3.5 tabular-nums text-ink-soft">
                  {customer.phone}
                </td>
                <td className="px-3 py-3.5 text-ink-soft">{customer.email}</td>
                <td className="max-w-[220px] px-3 py-3.5 text-ink-soft">
                  <span className="line-clamp-2">{customer.address}</span>
                </td>
                <td className="px-3 py-3.5">
                  <StatusBadge status={customer.status} />
                </td>
                <td className="px-3 py-3.5 text-right tabular-nums font-medium text-ink">
                  {currency.format(customer.walletBalance)}
                </td>
                <td className="py-3.5 pl-3 pr-5">
                  <div className="flex justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => onEdit(customer)}
                      aria-label={`Edit ${customer.name}`}
                      className="rounded-md p-1.5 text-ink-soft transition hover:bg-ledger-50 hover:text-ledger-700"
                    >
                      <Pencil className="h-4 w-4" strokeWidth={2} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(customer)}
                      aria-label={`Delete ${customer.name}`}
                      className="rounded-md p-1.5 text-ink-soft transition hover:bg-rust-50 hover:text-rust-600"
                    >
                      <Trash2 className="h-4 w-4" strokeWidth={2} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
