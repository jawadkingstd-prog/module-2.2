const OPTIONS = [
  { value: "All", label: "All Customers" },
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];

export default function StatusFilter({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-ink outline-none transition focus:border-ledger-600 focus:ring-2 focus:ring-ledger-600/15 sm:w-52"
    >
      {OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
