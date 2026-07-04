// Mock ledger transactions.
// Replace this with Firestore reads/writes later.

import seedCustomers from "./customers";

const c0 = seedCustomers[0];
const c1 = seedCustomers[1] ?? c0;

const seedLedger = [
  {
    id: "TXN-1001",
    customerId: c0?.id ?? "CUST-1001",
    customerName: c0?.name ?? "Customer",
    type: "credit",
    amount: 5000,
    note: "Opening balance",
    recordedBy: "Ahmed Raza",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
  },
  {
    id: "TXN-1002",
    customerId: c0?.id ?? "CUST-1001",
    customerName: c0?.name ?? "Customer",
    type: "debit",
    amount: 1500,
    note: "Cash withdrawal",
    recordedBy: "Sara Khan",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
  },
  {
    id: "TXN-1003",
    customerId: c1?.id ?? "CUST-1002",
    customerName: c1?.name ?? "Customer",
    type: "credit",
    amount: 2500,
    note: "Deposit received",
    recordedBy: "Ahmed Raza",
    date: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
];

export default seedLedger;