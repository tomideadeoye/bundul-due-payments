import { format } from 'date-fns';
import { Payment } from '../data/payments';

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return format(date, 'MMM d, yyyy');
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const isDueSoon = (dateString: string): boolean => {
  const today = new Date();
  const dueDate = new Date(dateString);
  
  const diffTime = dueDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays <= 3 && diffDays >= 0;
};

export const calculateTotalDue = (payments: Payment[]): number => {
  return payments.reduce((total, payment) => total + payment.amount, 0);
};

export const sortPaymentsByDueDate = (payments: Payment[]): Payment[] => {
  return [...payments].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
};