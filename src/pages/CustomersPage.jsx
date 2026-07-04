import { useMemo, useState } from "react";
import { Plus, Users, History, X, Clock } from "lucide-react";
import seedCustomers from "../data/customers";
import SearchBar from "../components/SearchBar";
import StatusFilter from "../components/StatusFilter";
import CustomerTable from "../components/CustomerTable";
import CustomerModal from "../components/CustomerModal";
import ConfirmDialog from "../components/ConfirmDialog";
import { useAuth } from "../context/AuthContext";

let nextIdCounter = seedCustomers.length + 1;
function generateId() {
  const id = `CUST-${1000 + nextIdCounter}`;
  nextIdCounter += 1;
  return id;
}

export default function CustomersPage() {
  const { permissions } = useAuth();

  const [customers, setCustomers] = useState(seedCustomers);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [deletingCustomer, setDeletingCustomer] = useState(null);

  // History State
  const [history, setHistory] = useState([]);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [selectedCustomerForHistory, setSelectedCustomerForHistory] = useState(null);

  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return customers.filter((c) => {
      const matchesStatus = statusFilter === "All" || c.status === statusFilter;
      if (!matchesStatus) return false;

      if (!query) return true;
      return (
        c.name.toLowerCase().includes(query) ||
        c.phone.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query)
      );
    });
  }, [customers, search, statusFilter]);

  const activeCount = useMemo(
    () => customers.filter((c) => c.status === "Active").length,
    [customers]
  );

  // Add history entry
  const addHistoryEntry = (customerId, customerName, action, details = "") => {
    const timestamp = new Date();
    setHistory((prev) => [
      {
        id: `${customerId}-${timestamp.getTime()}`,
        customerId,
        customerName,
        action,
        details,
        timestamp,
      },
      ...prev,
    ]);
  };

  const openAddModal = () => {
    setEditingCustomer(null);
    setModalOpen(true);
  };

  const openEditModal = (customer) => {
    setEditingCustomer(customer);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingCustomer(null);
  };

  const openHistoryModal = (customer = null) => {
    setSelectedCustomerForHistory(customer);
    setHistoryModalOpen(true);
  };

  const closeHistoryModal = () => {
    setHistoryModalOpen(false);
    setSelectedCustomerForHistory(null);
  };

  const handleSave = (formData) => {
    if (formData.id) {
      // Edit
      const oldCustomer = customers.find((c) => c.id === formData.id);
      const changes = [];
      if (oldCustomer.name !== formData.name) changes.push(`Name: ${oldCustomer.name} → ${formData.name}`);
      if (oldCustomer.email !== formData.email) changes.push(`Email: ${oldCustomer.email} → ${formData.email}`);
      if (oldCustomer.phone !== formData.phone) changes.push(`Phone: ${oldCustomer.phone} → ${formData.phone}`);
      if (oldCustomer.status !== formData.status) changes.push(`Status: ${oldCustomer.status} → ${formData.status}`);

      setCustomers((prev) =>
        prev.map((c) => (c.id === formData.id ? { ...c, ...formData } : c))
      );
      addHistoryEntry(
        formData.id,
        formData.name,
        "EDITED",
        changes.length > 0 ? changes.join(", ") : "No changes"
      );
    } else {
      // Add new
      const newId = generateId();
      setCustomers((prev) => [{ ...formData, id: newId }, ...prev]);
      addHistoryEntry(newId, formData.name, "CREATED", `Email: ${formData.email}, Phone: ${formData.phone}`);
    }
    closeModal();
  };

  const confirmDelete = () => {
    const customer = deletingCustomer;
    setCustomers((prev) => prev.filter((c) => c.id !== customer.id));
    addHistoryEntry(customer.id, customer.name, "DELETED", `Status was: ${customer.status}`);
    setDeletingCustomer(null);
  };

  const getCustomerHistory = (customerId) => {
    return history.filter((h) => h.customerId === customerId);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const getActionColor = (action) => {
    switch (action) {
      case "CREATED":
        return "bg-green-100 text-green-800";
      case "EDITED":
        return "bg-blue-100 text-blue-800";
      case "DELETED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const displayHistory = selectedCustomerForHistory
    ? getCustomerHistory(selectedCustomerForHistory.id)
    : history;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-ledger-700">
            Admin Panel
          </p>
          <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
            Customer Management
          </h1>
          <p className="mt-1.5 flex items-center gap-1.5 text-sm text-ink-soft">
            <Users className="h-4 w-4" strokeWidth={2} />
            {customers.length} customers · {activeCount} active
          </p>
        </div>

        <div className="flex gap-2 flex-wrap">
          {permissions?.canViewHistory && (
            <button
              type="button"
              onClick={() => openHistoryModal()}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-200 px-4 py-2.5 text-sm font-medium text-gray-800 shadow-sm transition hover:bg-gray-300"
            >
              <History className="h-4 w-4" strokeWidth={2.5} />
              History ({history.length})
            </button>
          )}

          {permissions?.canManageCustomers && (
            <button
              type="button"
              onClick={openAddModal}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-ledger-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-ledger-700"
            >
              <Plus className="h-4 w-4" strokeWidth={2.5} />
              Add Customer
            </button>
          )}
        </div>
      </header>

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar value={search} onChange={setSearch} />
        <StatusFilter value={statusFilter} onChange={setStatusFilter} />
      </div>

      <CustomerTable
        customers={filteredCustomers}
        onEdit={(customer) => permissions?.canManageCustomers && openEditModal(customer)}
        onDelete={(customer) => permissions?.canDeleteCustomers && setDeletingCustomer(customer)}
        onHistory={(customer) => permissions?.canViewHistory && openHistoryModal(customer)}
      />

      {modalOpen && (
        <CustomerModal
          customer={editingCustomer}
          onSave={handleSave}
          onClose={closeModal}
        />
      )}

      <ConfirmDialog
        customer={deletingCustomer}
        onConfirm={confirmDelete}
        onCancel={() => setDeletingCustomer(null)}
      />

      {/* History Modal */}
      {historyModalOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={closeHistoryModal}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl rounded-lg bg-white shadow-lg">
              <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                <div>
                  <h2 className="text-lg font-semibold text-ink">
                    {selectedCustomerForHistory ? `History - ${selectedCustomerForHistory.name}` : "Activity Log"}
                  </h2>
                  <p className="text-sm text-ink-soft mt-1">
                    {displayHistory.length} {displayHistory.length === 1 ? "entry" : "entries"}
                  </p>
                </div>
                <button
                  onClick={closeHistoryModal}
                  className="text-ink-soft hover:text-ink transition"
                >
                  <X className="h-5 w-5" strokeWidth={2} />
                </button>
              </div>

              <div className="max-h-96 overflow-y-auto px-6 py-4">
                {displayHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-ink-soft">No activity recorded yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {displayHistory.map((entry) => (
                      <div
                        key={entry.id}
                        className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full ${getActionColor(entry.action)}`}>
                                {entry.action}
                              </span>
                              <span className="text-sm font-medium text-ink">
                                {entry.customerName}
                              </span>
                            </div>
                            {entry.details && (
                              <p className="text-sm text-ink-soft mb-2">
                                {entry.details}
                              </p>
                            )}
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatTime(entry.timestamp)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 px-6 py-4 flex justify-end">
                <button
                  onClick={closeHistoryModal}
                  className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}