// Mock user data for authentication.
// Replace this with a real Firebase Auth / Firestore lookup later.

const users = [
  {
    id: "USR-1001",
    name: "Ahmed Raza",
    email: "admin@ledgerhq.com",
    password: "admin123",
    role: "admin",
  },
  {
    id: "USR-1002",
    name: "Sara Khan",
    email: "staff@ledgerhq.com",
    password: "staff123",
    role: "staff",
  },
  {
    id: "USR-1003",
    name: "Bilal Ahmed",
    email: "viewer@ledgerhq.com",
    password: "viewer123",
    role: "viewer",
  },
];

export default users;