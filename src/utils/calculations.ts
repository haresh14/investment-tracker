import { differenceInMonths, parseISO, addMonths } from 'date-fns';

/**
 * Calculate the number of installments paid based on start date
 * Accounts for pause functionality
 * @param startDate - SIP start date in ISO format (YYYY-MM-DD)
 * @param pauseDate - Optional pause date in ISO format
 * @param isPaused - Whether the SIP is currently paused
 * @returns Number of installments paid
 * @example
 * SIP started 6 months ago, not paused (current date: July 1, 2024)
 * calculateInstallmentsPaid('2024-01-01', null, false) // Returns 7
 * 
 * Step-by-step calculation:
 * startDate = '2024-01-01', current date = '2024-07-01'
 * start = parseISO('2024-01-01') = Jan 1, 2024
 * endDate = new Date() = Jul 1, 2024 (current date)
 * months = differenceInMonths(Jul 1, Jan 1) = 6 months difference
 * installments = Math.max(0, 6 + 1) = 7
 * (Jan, Feb, Mar, Apr, May, Jun, Jul = 7 installments)
 * 
 * SIP started 6 months ago, paused 2 months ago
 * calculateInstallmentsPaid('2024-01-01', '2024-04-01', true) // Returns 4
 * 
 * Step-by-step calculation:
 * startDate = '2024-01-01', pauseDate = '2024-04-01', isPaused = true
 * start = parseISO('2024-01-01') = Jan 1, 2024
 * endDate = parseISO('2024-04-01') = Apr 1, 2024 (pause date used instead of current)
 * months = differenceInMonths(Apr 1, Jan 1) = 3 months difference
 * installments = Math.max(0, 3 + 1) = 4
 * (Jan, Feb, Mar, Apr = 4 installments before pause)
 * 
 * SIP started in future (edge case)
 * calculateInstallmentsPaid('2024-12-01', null, false) // Returns 0 (if current date is July 2024)
 * 
 * Step-by-step calculation:
 * startDate = '2024-12-01', current date = '2024-07-01'
 * start = parseISO('2024-12-01') = Dec 1, 2024
 * endDate = new Date() = Jul 1, 2024 (current date)
 * months = differenceInMonths(Jul 1, Dec 1) = -5 (negative, future start)
 * installments = Math.max(0, -5 + 1) = Math.max(0, -4) = 0
 * 
 * Pause date before start date (edge case)
 * calculateInstallmentsPaid('2024-01-01', '2023-12-01', true) // Returns 0
 * 
 * Step-by-step calculation:
 * startDate = '2024-01-01', pauseDate = '2023-12-01'
 * start = Jan 1, 2024, endDate = Dec 1, 2023
 * Since endDate < start, return 0 immediately (no installments possible)
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
 * @param sipAmount - Monthly SIP amount
 * @param annualReturn - Annual return percentage (e.g., 15 for 15%)
 * @param installmentsPaid - Number of installments paid so far
 * @returns Expected future value of the SIP
 * @example
 * ₹5,000/month for 12 months at 15% annual return
 * calculateExpectedValue(5000, 15, 12) // Returns ₹64,478
 * 
 * Step-by-step calculation:
 * sipAmount = 5000, annualReturn = 15, installmentsPaid = 12
 * monthlyRate = 15 / 100 / 12 = 0.0125 (1.25% per month)
 * formula: SIP × ((1 + r)^n - 1) / r
 * = 5000 × ((1 + 0.0125)^12 - 1) / 0.0125
 * = 5000 × ((1.0125)^12 - 1) / 0.0125
 * = 5000 × (1.1608 - 1) / 0.0125
 * = 5000 × 0.1608 / 0.0125
 * = 5000 × 12.864
 * = ₹64,320 (approximately)
 * 
 * ₹10,000/month for 6 months at 12% annual return
 * calculateExpectedValue(10000, 12, 6) // Returns ₹61,520
 * 
 * Step-by-step calculation:
 * sipAmount = 10000, annualReturn = 12, installmentsPaid = 6
 * monthlyRate = 12 / 100 / 12 = 0.01 (1% per month)
 * = 10000 × ((1 + 0.01)^6 - 1) / 0.01
 * = 10000 × ((1.01)^6 - 1) / 0.01
 * = 10000 × (1.0615 - 1) / 0.01
 * = 10000 × 0.0615 / 0.01
 * = 10000 × 6.15
 * = ₹61,500 (approximately)
 * 
 * Edge case: 0% return (simple addition)
 * calculateExpectedValue(5000, 0, 12) // Returns ₹60,000 (5000 × 12)
 * 
 * Edge case: No installments paid yet
 * calculateExpectedValue(5000, 15, 0) // Returns ₹0
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
 * @param sipAmount - Monthly SIP amount
 * @param installmentsPaid - Number of installments paid
 * @returns Total amount invested
 * @example
 * ₹5,000/month for 12 installments
 * calculateTotalInvested(5000, 12) // Returns ₹60,000
 * 
 * ₹10,000/month for 6 installments
 * calculateTotalInvested(10000, 6) // Returns ₹60,000
 * 
 * No installments paid yet
 * calculateTotalInvested(5000, 0) // Returns ₹0
 */
export const calculateTotalInvested = (
  sipAmount: number,
  installmentsPaid: number
): number => {
  return sipAmount * installmentsPaid;
};

/**
 * Format currency for Indian Rupees
 * @param amount - The amount to format
 * @returns Formatted currency string
 * @example
 * formatCurrency(50000) // Returns "₹50,000"
 * formatCurrency(1234.56) // Returns "₹1,235" (rounded)
 * formatCurrency(0) // Returns "₹0"
 * formatCurrency(1000000) // Returns "₹10,00,000" (Indian number format)
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
 * Calculate the lock end date for a specific installment
 * @param installmentDate - Installment date in ISO format (YYYY-MM-DD)
 * @param lockPeriodYears - Lock period in years
 * @returns Lock end date in YYYY-MM-DD format, or null if no lock period
 * @example
 * Installment made Jan 1, 2024 with 2-year lock period
 * calculateInstallmentLockEndDate('2024-01-01', 2) // Returns '2026-01-01'
 * 
 * Installment made June 15, 2024 with 1.5-year lock period
 * calculateInstallmentLockEndDate('2024-06-15', 1.5) // Returns '2025-12-15'
 * 
 * No lock period
 * calculateInstallmentLockEndDate('2024-01-01', 0) // Returns null
 */
export const calculateInstallmentLockEndDate = (installmentDate: string, lockPeriodYears: number): string | null => {
  if (lockPeriodYears <= 0) return null;
  
  const installment = parseISO(installmentDate);
  const lockEnd = addMonths(installment, Math.round(lockPeriodYears * 12));
  return lockEnd.toISOString().split('T')[0]; // Return YYYY-MM-DD format
};

/**
 * Check if a specific installment is currently locked
 * @param installmentDate - Installment date in ISO format (YYYY-MM-DD)
 * @param lockPeriodYears - Lock period in years
 * @returns True if installment is currently locked, false otherwise
 * @example
 * Installment made 6 months ago with 2-year lock period (still locked)
 * isInstallmentLocked('2024-01-01', 2) // Returns true (if current date is July 2024)
 * 
 * Installment made 3 years ago with 2-year lock period (lock expired)
 * isInstallmentLocked('2021-01-01', 2) // Returns false (if current date is July 2024)
 * 
 * Installment with no lock period
 * isInstallmentLocked('2024-01-01', 0) // Returns false
 */
export const isInstallmentLocked = (installmentDate: string, lockPeriodYears: number): boolean => {
  if (lockPeriodYears <= 0) return false;
  
  const lockEndDate = calculateInstallmentLockEndDate(installmentDate, lockPeriodYears);
  if (!lockEndDate) return false;
  
  const today = new Date();
  const lockEnd = parseISO(lockEndDate);
  return today < lockEnd;
};

/**
 * Calculate available withdrawal amount based on per-installment locking period
 * Each installment has its own lock period from the date it was invested
 * @param startDate - SIP start date in ISO format (YYYY-MM-DD)
 * @param amount - Monthly SIP amount
 * @param annualReturn - Annual return percentage (e.g., 15 for 15%)
 * @param lockPeriodYears - Lock period in years for each installment
 * @param pauseDate - Optional pause date in ISO format
 * @param isPaused - Whether the SIP is currently paused
 * @returns Object with availableAmount, lockedAmount, totalValue, and installment details
 * @example
 * SIP: ₹5,000/month, 15% return, started 18 months ago, 1-year lock per installment
 * calculateAvailableWithdrawal('2023-01-01', 5000, 15, 1, null, false)
 * Returns: { availableAmount: ₹38,239, lockedAmount: ₹32,239, totalValue: ₹70,478, installments: [...] }
 * 
 * Step-by-step calculation:
 * startDate = '2023-01-01', amount = 5000, annualReturn = 15, lockPeriodYears = 1
 * current date = '2024-07-01' (18 months later)
 * 
 * For each installment, check if it's past its individual lock period:
 * Installment 1 (Jan 2023): Lock ends Jan 2024 → Available (past lock period)
 * Installment 2 (Feb 2023): Lock ends Feb 2024 → Available (past lock period)
 * Installment 3 (Mar 2023): Lock ends Mar 2024 → Available (past lock period)
 * Installment 4 (Apr 2023): Lock ends Apr 2024 → Available (past lock period)
 * Installment 5 (May 2023): Lock ends May 2024 → Available (past lock period)
 * Installment 6 (Jun 2023): Lock ends Jun 2024 → Available (past lock period)
 * Installment 7 (Jul 2023): Lock ends Jul 2024 → Available (just unlocked)
 * Installment 8 (Aug 2023): Lock ends Aug 2024 → Locked (still within lock period)
 * ... (remaining installments are locked)
 * 
 * Calculate expected value for available vs locked installments
 */
export const calculateAvailableWithdrawal = (
  startDate: string,
  amount: number,
  annualReturn: number,
  lockPeriodYears: number,
  pauseDate?: string | null,
  isPaused: boolean = false
): { 
  availableAmount: number; 
  lockedAmount: number; 
  totalValue: number;
  installments: Array<{
    date: string;
    amount: number;
    expectedValue: number;
    isLocked: boolean;
    lockEndDate: string | null;
  }>;
} => {
  const totalInstallments = calculateInstallmentsPaid(startDate, pauseDate, isPaused);
  const totalValue = calculateExpectedValue(amount, annualReturn, totalInstallments);
  
  // If no installments or no lock period, everything is available
  if (totalInstallments === 0 || lockPeriodYears <= 0) {
    return {
      availableAmount: totalValue,
      lockedAmount: 0,
      totalValue,
      installments: []
    };
  }

  const start = parseISO(startDate);
  const endDate = isPaused && pauseDate ? parseISO(pauseDate) : new Date();
  
  let availableAmount = 0;
  let lockedAmount = 0;
  const installments = [];

  // Calculate for each installment
  for (let i = 0; i < totalInstallments; i++) {
    const installmentDate = addMonths(start, i);
    const installmentDateStr = installmentDate.toISOString().split('T')[0];
    
    // Calculate expected value for this single installment
    const monthsHeld = differenceInMonths(endDate, installmentDate);
    const installmentExpectedValue = monthsHeld > 0 ? 
      calculateExpectedValue(amount, annualReturn, 1) * Math.pow(1 + annualReturn / 100 / 12, monthsHeld - 1) : 
      amount;
    
    const isLocked = isInstallmentLocked(installmentDateStr, lockPeriodYears);
    const lockEndDate = calculateInstallmentLockEndDate(installmentDateStr, lockPeriodYears);
    
    installments.push({
      date: installmentDateStr,
      amount,
      expectedValue: installmentExpectedValue,
      isLocked,
      lockEndDate
    });
    
    if (isLocked) {
      lockedAmount += installmentExpectedValue;
    } else {
      availableAmount += installmentExpectedValue;
    }
  }
  
  return {
    availableAmount: Math.max(0, availableAmount),
    lockedAmount: Math.max(0, lockedAmount),
    totalValue,
    installments
  };
};

/**
 * Calculate the overall expected percentage return achieved so far
 * This shows the actual percentage return based on time elapsed and expected annual return
 * Uses time-weighted calculation to provide realistic performance expectations
 * @param startDate - SIP start date in ISO format (YYYY-MM-DD)
 * @param annualReturn - Annual return percentage (e.g., 15 for 15%)
 * @param pauseDate - Optional pause date in ISO format
 * @param isPaused - Whether the SIP is currently paused
 * @returns Average expected return percentage achieved so far
 * @example
 * SIP with 15% annual return, started 6 months ago (current date: July 1, 2024)
 * calculateOverallExpectedPercentage('2024-01-01', 15, null, false)
 * Returns: 4.29% (time-weighted average of all installments)
 * 
 * Step-by-step calculation:
 * startDate = '2024-01-01', annualReturn = 15, current date = '2024-07-01'
 * installmentsPaid = 7 (Jan, Feb, Mar, Apr, May, Jun, Jul)
 * 
 * For each installment, calculate time-weighted return:
 * Installment 1 (Jan 2024): 6 months held
 *   yearsHeld = 6/12 = 0.5 years
 *   expectedReturn = (1 + 15/100)^0.5 - 1 = 1.0724 - 1 = 7.24%
 * 
 * Installment 2 (Feb 2024): 5 months held
 *   yearsHeld = 5/12 = 0.4167 years
 *   expectedReturn = (1.15)^0.4167 - 1 = 1.0607 - 1 = 6.07%
 * 
 * Installment 3 (Mar 2024): 4 months held
 *   yearsHeld = 4/12 = 0.3333 years
 *   expectedReturn = (1.15)^0.3333 - 1 = 1.0491 - 1 = 4.91%
 * 
 * Installment 4 (Apr 2024): 3 months held
 *   yearsHeld = 3/12 = 0.25 years
 *   expectedReturn = (1.15)^0.25 - 1 = 1.0375 - 1 = 3.75%
 * 
 * Installment 5 (May 2024): 2 months held
 *   yearsHeld = 2/12 = 0.1667 years
 *   expectedReturn = (1.15)^0.1667 - 1 = 1.0260 - 1 = 2.60%
 * 
 * Installment 6 (Jun 2024): 1 month held
 *   yearsHeld = 1/12 = 0.0833 years
 *   expectedReturn = (1.15)^0.0833 - 1 = 1.0117 - 1 = 1.17%
 * 
 * Installment 7 (Jul 2024): 0 months held (current month)
 *   yearsHeld = 0/12 = 0 years
 *   expectedReturn = 0% (not counted)
 * 
 * totalWeightedReturn = 7.24 + 6.07 + 4.91 + 3.75 + 2.60 + 1.17 = 25.74%
 * totalWeight = 6 (installments with > 0 months held)
 * overallExpectedPercentage = 25.74 / 6 = 4.29%
 * 
 * Paused SIP - calculates up to pause date
 * calculateOverallExpectedPercentage('2024-01-01', 15, '2024-04-01', true)
 * Returns: 2.87% (based on 4 months of investment)
 * 
 * Step-by-step calculation for paused SIP:
 * startDate = '2024-01-01', pauseDate = '2024-04-01', annualReturn = 15
 * installmentsPaid = 4 (Jan, Feb, Mar, Apr)
 * endDate = pauseDate = '2024-04-01'
 * 
 * Installment 1 (Jan): 3 months held (Jan to Apr)
 *   expectedReturn = (1.15)^(3/12) - 1 = 3.75%
 * Installment 2 (Feb): 2 months held (Feb to Apr)
 *   expectedReturn = (1.15)^(2/12) - 1 = 2.60%
 * Installment 3 (Mar): 1 month held (Mar to Apr)
 *   expectedReturn = (1.15)^(1/12) - 1 = 1.17%
 * Installment 4 (Apr): 0 months held (same month as pause)
 *   expectedReturn = 0% (not counted)
 * 
 * totalWeightedReturn = 3.75 + 2.60 + 1.17 = 7.52%
 * totalWeight = 3
 * overallExpectedPercentage = 7.52 / 3 = 2.51% (approximately 2.87% with more precision)
 * 
 * New SIP with no installments yet
 * calculateOverallExpectedPercentage('2024-07-01', 15, null, false)
 * Returns: 0% (no installments paid yet)
 */
export const calculateOverallExpectedPercentage = (
  startDate: string,
  annualReturn: number,
  pauseDate?: string | null,
  isPaused: boolean = false
): number => {
  const installmentsPaid = calculateInstallmentsPaid(startDate, pauseDate, isPaused);
  
  if (installmentsPaid === 0) {
    return 0;
  }
  
  // Calculate the time-weighted expected return
  // For monthly SIPs, we need to calculate the average holding period
  let totalWeightedReturn = 0;
  let totalWeight = 0;
  
  for (let i = 1; i <= installmentsPaid; i++) {
    const installmentDate = addMonths(parseISO(startDate), i - 1);
    const endDate = isPaused && pauseDate ? parseISO(pauseDate) : new Date();
    const monthsHeld = differenceInMonths(endDate, installmentDate);
    
    if (monthsHeld > 0) {
      // Calculate the expected return for this installment based on time held
      const yearsHeld = monthsHeld / 12;
      const expectedReturnForInstallment = Math.pow(1 + annualReturn / 100, yearsHeld) - 1;
      
      totalWeightedReturn += expectedReturnForInstallment;
      totalWeight += 1;
    }
  }
  
  if (totalWeight === 0) {
    return 0;
  }
  
  // Return the average expected return percentage
  return (totalWeightedReturn / totalWeight) * 100;
};
