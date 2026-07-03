import { useState } from "react";
import { X } from "lucide-react";
import { validateCustomer } from "../utils/validate";

const emptyForm = {
  name: "",
  phone: "",
  email: "",
  address: "",
  walletBalance: "",
  status: "Active",
};

export default function CustomerModal({ customer, onSave, onClose }) {
  const isEdit = Boolean(customer);

  const [form, setForm] = useState(
    customer
      ? {
          name: customer.name,
          phone: customer.phone,
          email: customer.email,
          address: customer.address,
          walletBalance: String(customer.walletBalance ?? ""),
          status: customer.status,
        }
      : emptyForm
  );
  const [errors, setErrors] = useState({});

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateCustomer(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    onSave({
      id: customer?.id,
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      address: form.address.trim(),
      walletBalance: form.walletBalance.trim() === "" ? 0 : Number(form.walletBalance),
      status: form.status,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-border bg-card shadow-xl">
        <div className="flex items-center justify-between border-b border-border-soft px-6 py-4">
          <h2 className="font-display text-base font-semibold text-ink">
            {isEdit ? "Edit customer" : "Add customer"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1 text-ink-soft transition hover:bg-paper hover:text-ink"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4 px-6 py-5">
          <Field label="Full Name" required error={errors.name}>
            <input
              type="text"
              value={form.name}
              onChange={handleChange("name")}
              placeholder="e.g. Ayesha Raza"
              className={inputClass(errors.name)}
            />
          </Field>

          <Field label="Phone Number" required error={errors.phone}>
            <input
              type="text"
              inputMode="numeric"
              value={form.phone}
              onChange={handleChange("phone")}
              placeholder="e.g. 03211234567"
              className={inputClass(errors.phone)}
            />
          </Field>

          <Field label="Email" required error={errors.email}>
            <input
              type="text"
              value={form.email}
              onChange={handleChange("email")}
              placeholder="e.g. name@example.com"
              className={inputClass(errors.email)}
            />
          </Field>

          <Field label="Address" required error={errors.address}>
            <textarea
              value={form.address}
              onChange={handleChange("address")}
              placeholder="Street, area, city"
              rows={2}
              className={inputClass(errors.address) + " resize-none"}
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Wallet Balance">
              <input
                type="number"
                step="0.01"
                value={form.walletBalance}
                onChange={handleChange("walletBalance")}
                placeholder="0.00"
                className={inputClass()}
              />
            </Field>

            <Field label="Status">
              <select
                value={form.status}
                onChange={handleChange("status")}
                className={inputClass()}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </Field>
          </div>

          <div className="mt-2 flex justify-end gap-3 border-t border-border-soft pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-ink transition hover:bg-paper"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-ledger-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-ledger-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, required, error, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink">
        {label}
        {required && <span className="text-rust-600"> *</span>}
      </span>
      {children}
      {error && <span className="mt-1 block text-xs text-rust-600">{error}</span>}
    </label>
  );
}

function inputClass(error) {
  return [
    "w-full rounded-lg border bg-card px-3 py-2 text-sm text-ink outline-none transition",
    "focus:ring-2 focus:ring-ledger-600/15",
    error
      ? "border-rust-600 focus:border-rust-600"
      : "border-border focus:border-ledger-600",
  ].join(" ");
}
