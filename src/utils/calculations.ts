import { differenceInMonths, parseISO, addMonths } from 'date-fns';

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

/**
 * Calculate the lock end date based on start date and lock period
 */
export const calculateLockEndDate = (startDate: string, lockPeriodMonths: number): string | null => {
  if (lockPeriodMonths <= 0) return null;
  
  const start = parseISO(startDate);
  const lockEnd = addMonths(start, lockPeriodMonths);
  return lockEnd.toISOString().split('T')[0]; // Return YYYY-MM-DD format
};

/**
 * Check if the SIP is currently locked
 */
export const isSIPLocked = (startDate: string, lockPeriodMonths: number): boolean => {
  if (lockPeriodMonths <= 0) return false;
  
  const lockEndDate = calculateLockEndDate(startDate, lockPeriodMonths);
  if (!lockEndDate) return false;
  
  const today = new Date();
  const lockEnd = parseISO(lockEndDate);
  return today < lockEnd;
};

/**
 * Calculate available withdrawal amount based on locking period
 * Only installments paid before the lock end date are available for withdrawal
 */
export const calculateAvailableWithdrawal = (
  startDate: string,
  amount: number,
  annualReturn: number,
  lockPeriodMonths: number,
  pauseDate?: string | null,
  isPaused: boolean = false
): { availableAmount: number; lockedAmount: number; totalValue: number } => {
  const totalInstallments = calculateInstallmentsPaid(startDate, pauseDate, isPaused);
  const totalValue = calculateExpectedValue(amount, annualReturn, totalInstallments);
  
  // If no lock period, everything is available
  if (lockPeriodMonths <= 0) {
    return {
      availableAmount: totalValue,
      lockedAmount: 0,
      totalValue
    };
  }
  
  const lockEndDate = calculateLockEndDate(startDate, lockPeriodMonths);
  if (!lockEndDate) {
    return {
      availableAmount: totalValue,
      lockedAmount: 0,
      totalValue
    };
  }
  
  const today = new Date();
  const lockEnd = parseISO(lockEndDate);
  
  // If lock period has ended, everything is available
  if (today >= lockEnd) {
    return {
      availableAmount: totalValue,
      lockedAmount: 0,
      totalValue
    };
  }
  
  // Calculate installments paid before lock end date
  const availableInstallments = calculateInstallmentsPaid(startDate, lockEndDate, false);
  const availableAmount = calculateExpectedValue(amount, annualReturn, availableInstallments);
  const lockedAmount = totalValue - availableAmount;
  
  return {
    availableAmount: Math.max(0, availableAmount),
    lockedAmount: Math.max(0, lockedAmount),
    totalValue
  };
};
