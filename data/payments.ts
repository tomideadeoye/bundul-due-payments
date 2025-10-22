// Define the Payment type
export type Payment = {
  id: number;
  service: string;
  amount: number;
  dueDate: string;
  paid?: boolean; // Add optional paid status
};

// Mock payment data
export const mockPayments: Payment[] = [
  {
    id: 1,
    service: "Netflix",
    amount: 14.99,
    dueDate: "2025-10-19",
    paid: true, // Mark as paid for demo
  },
  {
    id: 2,
    service: "Apple One",
    amount: 29.99,
    dueDate: "2025-11-01",
  },
  {
    id: 3,
    service: "Spotify",
    amount: 9.99,
    dueDate: "2025-10-18",
    paid: true, // Mark as paid for demo
  },
  {
    id: 4,
    service: "Amazon Prime",
    amount: 12.99,
    dueDate: "2025-10-25",
  },
  {
    id: 5,
    service: "Disney+",
    amount: 7.99,
    dueDate: "2025-10-22", // Due today
  },
  {
    id: 6,
    service: "Hulu",
    amount: 6.99,
    dueDate: "2025-10-20",
    paid: true, // Mark as paid for demo
  },
  {
    id: 7,
    service: "Microsoft 365",
    amount: 99.99,
    dueDate: "2025-11-15",
  },
  {
    id: 8,
    service: "Adobe Creative Suite",
    amount: 52.99,
    dueDate: "2025-10-23", // Due in 1 day
  }
];

export default mockPayments;