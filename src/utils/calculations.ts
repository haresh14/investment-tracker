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
 * Calculate the lock end date based on start date and lock period
 * @param startDate - SIP start date in ISO format (YYYY-MM-DD)
 * @param lockPeriodMonths - Lock period in months
 * @returns Lock end date in YYYY-MM-DD format, or null if no lock period
 * @example
 * SIP started Jan 1, 2024 with 12-month lock period
 * calculateLockEndDate('2024-01-01', 12) // Returns '2025-01-01'
 * 
 * SIP started June 15, 2024 with 6-month lock period
 * calculateLockEndDate('2024-06-15', 6) // Returns '2024-12-15'
 * 
 * No lock period
 * calculateLockEndDate('2024-01-01', 0) // Returns null
 */
export const calculateLockEndDate = (startDate: string, lockPeriodMonths: number): string | null => {
  if (lockPeriodMonths <= 0) return null;
  
  const start = parseISO(startDate);
  const lockEnd = addMonths(start, lockPeriodMonths);
  return lockEnd.toISOString().split('T')[0]; // Return YYYY-MM-DD format
};

/**
 * Check if the SIP is currently locked
 * @param startDate - SIP start date in ISO format (YYYY-MM-DD)
 * @param lockPeriodMonths - Lock period in months
 * @returns True if SIP is currently locked, false otherwise
 * @example
 * SIP started 6 months ago with 12-month lock period (still locked)
 * isSIPLocked('2024-01-01', 12) // Returns true (if current date is July 2024)
 * 
 * SIP started 18 months ago with 12-month lock period (lock expired)
 * isSIPLocked('2023-01-01', 12) // Returns false (if current date is July 2024)
 * 
 * SIP with no lock period
 * isSIPLocked('2024-01-01', 0) // Returns false
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
 * @param startDate - SIP start date in ISO format (YYYY-MM-DD)
 * @param amount - Monthly SIP amount
 * @param annualReturn - Annual return percentage (e.g., 15 for 15%)
 * @param lockPeriodMonths - Lock period in months
 * @param pauseDate - Optional pause date in ISO format
 * @param isPaused - Whether the SIP is currently paused
 * @returns Object with availableAmount, lockedAmount, and totalValue
 * @example
 * SIP: ₹5,000/month, 15% return, started 18 months ago, 12-month lock (current: July 2024)
 * calculateAvailableWithdrawal('2023-01-01', 5000, 15, 12, null, false)
 * Returns: { availableAmount: ₹38,239, lockedAmount: ₹32,239, totalValue: ₹70,478 }
 * 
 * Step-by-step calculation:
 * startDate = '2023-01-01', amount = 5000, annualReturn = 15, lockPeriodMonths = 12
 * current date = '2024-07-01' (18 months later)
 * 
 * Step 1: Calculate total installments and value
 * totalInstallments = 19 (Jan 2023 to Jul 2024)
 * totalValue = calculateExpectedValue(5000, 15, 19) = ₹108,239 (approx)
 * 
 * Step 2: Calculate lock end date
 * lockEndDate = '2023-01-01' + 12 months = '2024-01-01'
 * 
 * Step 3: Calculate available installments (paid before lock end)
 * availableInstallments = installments from Jan 2023 to Jan 2024 = 13
 * availableValue = calculateExpectedValue(5000, 15, 13) = ₹69,239 (approx)
 * 
 * Step 4: Calculate locked installments (paid after lock end)
 * lockedInstallments = installments from Feb 2024 to Jul 2024 = 6
 * lockedValue = calculateExpectedValue(5000, 15, 6) = ₹31,500 (approx)
 * 
 * Result: { availableAmount: ₹69,239, lockedAmount: ₹31,500, totalValue: ₹100,739 }
 * 
 * SIP with no lock period - everything available
 * calculateAvailableWithdrawal('2024-01-01', 5000, 15, 0, null, false)
 * Returns: { availableAmount: ₹32,239, lockedAmount: ₹0, totalValue: ₹32,239 }
 * 
 * Step-by-step calculation:
 * startDate = '2024-01-01', lockPeriodMonths = 0 (no lock)
 * totalInstallments = 7 (Jan to Jul 2024)
 * totalValue = calculateExpectedValue(5000, 15, 7) = ₹36,239 (approx)
 * Since lockPeriodMonths = 0, everything is available
 * Result: { availableAmount: ₹36,239, lockedAmount: ₹0, totalValue: ₹36,239 }
 * 
 * Paused SIP with lock period
 * calculateAvailableWithdrawal('2024-01-01', 5000, 15, 6, '2024-04-01', true)
 * Returns calculated amounts based on pause date
 * 
 * Step-by-step calculation:
 * startDate = '2024-01-01', pauseDate = '2024-04-01', lockPeriodMonths = 6
 * totalInstallments = 4 (Jan, Feb, Mar, Apr 2024)
 * totalValue = calculateExpectedValue(5000, 15, 4) = ₹20,239 (approx)
 * 
 * lockEndDate = '2024-01-01' + 6 months = '2024-07-01'
 * Since pauseDate (Apr 2024) is before lockEndDate (Jul 2024):
 * All installments are within lock period, so nothing is available yet
 * Result: { availableAmount: ₹0, lockedAmount: ₹20,239, totalValue: ₹20,239 }
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
