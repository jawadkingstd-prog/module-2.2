import { AlertTriangle } from "lucide-react";

export default function ConfirmDialog({ customer, onConfirm, onCancel }) {
  if (!customer) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4">
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-xl">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rust-50 text-rust-600">
            <AlertTriangle className="h-5 w-5" strokeWidth={2} />
          </div>
          <div>
            <h2 className="font-display text-base font-semibold text-ink">
              Delete customer
            </h2>
            <p className="mt-1 text-sm text-ink-soft">
              Are you sure you want to delete{" "}
              <span className="font-medium text-ink">{customer.name}</span>?
              This action can't be undone.
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-ink transition hover:bg-paper"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-lg bg-rust-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-rust-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
