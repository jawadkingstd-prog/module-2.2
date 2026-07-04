import { useEffect, useState } from "react";
import { BookOpenText } from "lucide-react";

export default function LaunchScreen({ onFinished }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onFinished, 300); // let the fade-out finish before unmounting
    }, 1200);
    return () => clearTimeout(timer);
  }, [onFinished]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-paper transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-ledger-600 text-white shadow-md">
        <BookOpenText className="h-8 w-8" strokeWidth={2} />
      </div>
      <h1 className="mt-4 font-display text-xl font-semibold text-ink">
        LedgerHQ
      </h1>
      <p className="mt-1 text-sm text-ink-soft">Loading your workspace…</p>

      <div className="mt-6 h-1 w-40 overflow-hidden rounded-full bg-gray-200">
        <div className="h-full w-1/2 animate-pulse rounded-full bg-ledger-600" />
      </div>
    </div>
  );
}