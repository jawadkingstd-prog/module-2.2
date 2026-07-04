import { useState } from "react";
import { LogIn, Lock, Mail, Eye, EyeOff, BookOpenText } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    // Simulated delay so it's easy to swap for a real Firebase call later
    setTimeout(() => {
      const result = login(email, password);
      if (!result.success) {
        setError(result.error);
      }
      setSubmitting(false);
    }, 400);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-ledger-600 text-white shadow-sm">
            <BookOpenText className="h-6 w-6" strokeWidth={2} />
          </div>
          <h1 className="mt-3 font-display text-2xl font-semibold text-ink">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-ink-soft">
            Sign in to LedgerHQ Admin Panel
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <label className="mb-1 block text-xs font-medium text-ink-soft">
            Email
          </label>
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 focus-within:border-ledger-600">
            <Mail className="h-4 w-4 text-ink-soft" strokeWidth={2} />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@ledgerhq.com"
              className="w-full text-sm text-ink outline-none"
            />
          </div>

          <label className="mb-1 block text-xs font-medium text-ink-soft">
            Password
          </label>
          <div className="mb-5 flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 focus-within:border-ledger-600">
            <Lock className="h-4 w-4 text-ink-soft" strokeWidth={2} />
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full text-sm text-ink outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="text-ink-soft hover:text-ink"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" strokeWidth={2} />
              ) : (
                <Eye className="h-4 w-4" strokeWidth={2} />
              )}
            </button>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-ledger-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-ledger-700 disabled:opacity-60"
          >
            <LogIn className="h-4 w-4" strokeWidth={2.5} />
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <div className="mt-4 rounded-lg bg-gray-100 px-4 py-3 text-xs text-ink-soft">
          <p className="mb-1 font-semibold text-ink">Demo accounts</p>
          <p>Admin: admin@ledgerhq.com / admin123</p>
          <p>Staff: staff@ledgerhq.com / staff123</p>
          <p>Viewer: viewer@ledgerhq.com / viewer123</p>
        </div>
      </div>
    </div>
  );
}