import { differenceInMonths, parseISO } from 'date-fns';

/**
 * Calculate the number of installments paid based on start date
 * Accounts for pause functionality
 */
export const calculateInstallmentsPaid = (
  startDate: string, 
  pauseDate?: string | null, 
  isPaused: boolean = false
): number => {
  const start = parseISO(startDate);
  const now = new Date();
  
  // Determine the end date for calculation
  let endDate = now;
  if (isPaused && pauseDate) {
    endDate = parseISO(pauseDate);
    // If pause date is before start date, no installments paid
    if (endDate < start) {
      return 0;
    }
  }
  
  const months = differenceInMonths(endDate, start);
  return Math.max(0, months + 1); // +1 to include the current month
};

/**
 * Calculate expected value using SIP compound interest formula
 * FutureValue = SIP × ((1 + r/12)^n - 1) / (r/12)
 */
export const calculateExpectedValue = (
  sipAmount: number,
  annualReturn: number,
  installmentsPaid: number
): number => {
  if (installmentsPaid === 0) return 0;
  
  const monthlyRate = annualReturn / 100 / 12;
  
  // If return is 0%, just return total invested
  if (monthlyRate === 0) {
    return sipAmount * installmentsPaid;
  }
  
  const futureValue = sipAmount * ((Math.pow(1 + monthlyRate, installmentsPaid) - 1) / monthlyRate);
  return Math.round(futureValue * 100) / 100; // Round to 2 decimal places
};

/**
 * Calculate total invested amount
 */
export const calculateTotalInvested = (
  sipAmount: number,
  installmentsPaid: number
): number => {
  return sipAmount * installmentsPaid;
};

/**
 * Format currency for Indian Rupees
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format percentage
 */
export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};
