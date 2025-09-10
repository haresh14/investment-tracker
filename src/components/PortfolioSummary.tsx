import type { FC } from 'react';
import { useSIPs } from '../hooks/useSIPs';
import { useWithdrawals } from '../hooks/useWithdrawals';
import { calculateInstallmentsPaid, calculateExpectedValue, calculateTotalInvested, formatCurrency } from '../utils/calculations';
import type { PortfolioSummary as PortfolioSummaryType } from '../types';

const PortfolioSummary: FC = () => {
  const { data: sips, isLoading: sipsLoading } = useSIPs();
  const { data: withdrawals, isLoading: withdrawalsLoading } = useWithdrawals();
  
  const isLoading = sipsLoading || withdrawalsLoading;

  const calculatePortfolioSummary = (): PortfolioSummaryType => {
    // Calculate total invested from SIPs
    let totalInvested = 0;
    let expectedValue = 0;

    if (sips && sips.length > 0) {
      sips.forEach((sip) => {
        const installmentsPaid = calculateInstallmentsPaid(sip.start_date);
        totalInvested += calculateTotalInvested(sip.amount, installmentsPaid);
        expectedValue += calculateExpectedValue(sip.amount, sip.annual_return, installmentsPaid);
      });
    }

    // Calculate total withdrawals
    const totalWithdrawals = withdrawals?.reduce((sum, withdrawal) => sum + withdrawal.amount, 0) || 0;
    
    // Calculate net portfolio and gains/losses
    const netPortfolio = totalInvested - totalWithdrawals;
    const totalGainLoss = expectedValue - totalInvested;

    return {
      total_invested: totalInvested,
      total_withdrawals: totalWithdrawals,
      net_portfolio: netPortfolio,
      expected_value: expectedValue,
      total_gain_loss: totalGainLoss,
    };
  };

  const summary = calculatePortfolioSummary();
  const gainLossPercentage = summary.total_invested > 0 ? (summary.total_gain_loss / summary.total_invested) * 100 : 0;

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card bg-base-200 shadow-sm">
            <div className="card-body p-3 sm:p-4 lg:p-6">
              <div className="animate-pulse">
                <div className="h-3 sm:h-4 bg-base-300 rounded w-3/4 mb-2"></div>
                <div className="h-6 sm:h-8 bg-base-300 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
      <div className="card bg-gradient-to-br from-info/10 to-info/5 border border-info/20 shadow-sm">
        <div className="card-body p-3 sm:p-4 lg:p-6">
          <h2 className="card-title text-xs sm:text-sm font-medium text-base-content/70 leading-tight">Total Invested</h2>
          <p className="text-lg sm:text-xl lg:text-2xl font-bold text-info leading-tight mt-1">{formatCurrency(summary.total_invested)}</p>
          <div className="text-xs text-base-content/60 mt-1 leading-tight">
            {sips?.length || 0} SIP{(sips?.length || 0) !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      <div className="card bg-gradient-to-br from-success/10 to-success/5 border border-success/20 shadow-sm">
        <div className="card-body p-3 sm:p-4 lg:p-6">
          <h2 className="card-title text-xs sm:text-sm font-medium text-base-content/70 leading-tight">Expected Value</h2>
          <p className="text-lg sm:text-xl lg:text-2xl font-bold text-success leading-tight mt-1">{formatCurrency(summary.expected_value)}</p>
          <div className="text-xs text-base-content/60 mt-1 leading-tight">
            Expected returns
          </div>
        </div>
      </div>

      <div className="card bg-gradient-to-br from-warning/10 to-warning/5 border border-warning/20 shadow-sm">
        <div className="card-body p-3 sm:p-4 lg:p-6">
          <h2 className="card-title text-xs sm:text-sm font-medium text-base-content/70 leading-tight">Withdrawals</h2>
          <p className="text-lg sm:text-xl lg:text-2xl font-bold text-warning leading-tight mt-1">{formatCurrency(summary.total_withdrawals)}</p>
          <div className="text-xs text-base-content/60 mt-1 leading-tight">
            {withdrawals?.length || 0} withdrawal{(withdrawals?.length || 0) !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      <div className={`card bg-gradient-to-br shadow-sm border ${
        summary.total_gain_loss >= 0 
          ? 'from-success/10 to-success/5 border-success/20' 
          : 'from-error/10 to-error/5 border-error/20'
      }`}>
        <div className="card-body p-3 sm:p-4 lg:p-6">
          <h2 className="card-title text-xs sm:text-sm font-medium text-base-content/70 leading-tight">Gain/Loss</h2>
          <p className={`text-lg sm:text-xl lg:text-2xl font-bold leading-tight mt-1 ${summary.total_gain_loss >= 0 ? 'text-success' : 'text-error'}`}>
            {formatCurrency(summary.total_gain_loss)}
          </p>
          <div className="text-xs text-base-content/60 mt-1 leading-tight">
            {gainLossPercentage >= 0 ? '+' : ''}{gainLossPercentage.toFixed(1)}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioSummary;
