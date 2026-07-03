import { Search } from "lucide-react";

export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative w-full sm:max-w-xs">
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft"
        strokeWidth={2}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by name, phone, or email"
        className="w-full rounded-lg border border-border bg-card py-2.5 pl-9 pr-3 text-sm text-ink placeholder:text-ink-soft/70 outline-none transition focus:border-ledger-600 focus:ring-2 focus:ring-ledger-600/15"
      />
    </div>
  );
}
