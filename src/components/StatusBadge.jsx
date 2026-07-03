export default function StatusBadge({ status }) {
  const isActive = status === "Active";

  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        isActive
          ? "bg-ledger-50 text-ledger-700"
          : "bg-rust-50 text-rust-700",
      ].join(" ")}
    >
      <span
        className={[
          "h-1.5 w-1.5 rounded-full",
          isActive ? "bg-ledger-600" : "bg-rust-600",
        ].join(" ")}
      />
      {status}
    </span>
  );
}
