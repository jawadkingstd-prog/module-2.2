import { Users, BookText, LogOut, BookOpenText } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar({ activeTab, onTabChange }) {
  const { user, logout, permissions } = useAuth();

  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ledger-600 text-white">
            <BookOpenText className="h-4 w-4" strokeWidth={2} />
          </div>
          <span className="hidden font-display text-base font-semibold text-ink sm:block">
            LedgerHQ
          </span>
        </div>

        <div className="flex items-center gap-1 rounded-lg bg-gray-100 p-1">
          <button
            onClick={() => onTabChange("customers")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition ${
              activeTab === "customers"
                ? "bg-white text-ink shadow-sm"
                : "text-ink-soft hover:text-ink"
            }`}
          >
            <Users className="h-4 w-4" strokeWidth={2} />
            Customers
          </button>

          <button
            onClick={() => onTabChange("ledger")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition ${
              activeTab === "ledger"
                ? "bg-white text-ink shadow-sm"
                : "text-ink-soft hover:text-ink"
            }`}
          >
            <BookText className="h-4 w-4" strokeWidth={2} />
            Ledger
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-ink">{user?.name}</p>
            <p className="text-xs capitalize text-ink-soft">
              {permissions?.label ?? user?.role}
            </p>
          </div>

          <button
            onClick={logout}
            title="Sign out"
            className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-100"
          >
            <LogOut className="h-4 w-4" strokeWidth={2} />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </div>
    </div>
  );
}