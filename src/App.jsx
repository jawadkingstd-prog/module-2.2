import { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LaunchScreen from "./components/LaunchScreen";
import LoginScreen from "./components/LoginScreen";
import Navbar from "./components/Navbar";
import CustomersPage from "./pages/CustomersPage";
import LedgerPage from "./pages/LedgerPage";

function AppShell() {
  const { user, initializing } = useAuth();
  const [activeTab, setActiveTab] = useState("customers");

  if (initializing) return null;

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <div className="min-h-screen bg-paper">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      {activeTab === "customers" ? <CustomersPage /> : <LedgerPage />}
    </div>
  );
}

export default function App() {
  const [launching, setLaunching] = useState(true);

  return (
    <AuthProvider>
      {launching ? (
        <LaunchScreen onFinished={() => setLaunching(false)} />
      ) : (
        <AppShell />
      )}
    </AuthProvider>
  );
}