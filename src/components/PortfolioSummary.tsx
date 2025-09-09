import type { FC } from 'react';
import { useSIPs } from '../hooks/useSIPs';
import { calculateInstallmentsPaid, calculateExpectedValue, calculateTotalInvested, formatCurrency } from '../utils/calculations';
import type { PortfolioSummary as PortfolioSummaryType } from '../types';

const PortfolioSummary: FC = () => {
  const { data: sips, isLoading } = useSIPs();

  const calculatePortfolioSummary = (): PortfolioSummaryType => {
    if (!sips || sips.length === 0) {
      return {
        total_invested: 0,
        total_withdrawals: 0, // TODO: Implement withdrawals
        net_portfolio: 0,
        expected_value: 0,
        total_gain_loss: 0,
      };
    }

    let totalInvested = 0;
    let expectedValue = 0;

    sips.forEach((sip) => {
      const installmentsPaid = calculateInstallmentsPaid(sip.start_date);
      totalInvested += calculateTotalInvested(sip.amount, installmentsPaid);
      expectedValue += calculateExpectedValue(sip.amount, sip.annual_return, installmentsPaid);
    });

    const totalWithdrawals = 0; // TODO: Calculate from withdrawals table
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card bg-base-200 shadow-sm">
            <div className="card-body">
              <div className="animate-pulse">
                <div className="h-4 bg-base-300 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-base-300 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="card bg-gradient-to-br from-info/10 to-info/5 border border-info/20 shadow-sm">
        <div className="card-body">
          <h2 className="card-title text-sm font-medium text-base-content/70">Total Invested</h2>
          <p className="text-2xl font-bold text-info">{formatCurrency(summary.total_invested)}</p>
          <div className="text-xs text-base-content/60 mt-1">
            Across {sips?.length || 0} SIP{(sips?.length || 0) !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      <div className="card bg-gradient-to-br from-success/10 to-success/5 border border-success/20 shadow-sm">
        <div className="card-body">
          <h2 className="card-title text-sm font-medium text-base-content/70">Expected Value</h2>
          <p className="text-2xl font-bold text-success">{formatCurrency(summary.expected_value)}</p>
          <div className="text-xs text-base-content/60 mt-1">
            Based on expected returns
          </div>
        </div>
      </div>

      <div className="card bg-gradient-to-br from-warning/10 to-warning/5 border border-warning/20 shadow-sm">
        <div className="card-body">
          <h2 className="card-title text-sm font-medium text-base-content/70">Total Withdrawals</h2>
          <p className="text-2xl font-bold text-warning">{formatCurrency(summary.total_withdrawals)}</p>
          <div className="text-xs text-base-content/60 mt-1">
            Coming soon
          </div>
        </div>
      </div>

      <div className={`card bg-gradient-to-br shadow-sm border ${
        summary.total_gain_loss >= 0 
          ? 'from-success/10 to-success/5 border-success/20' 
          : 'from-error/10 to-error/5 border-error/20'
      }`}>
        <div className="card-body">
          <h2 className="card-title text-sm font-medium text-base-content/70">Total Gain/Loss</h2>
          <p className={`text-2xl font-bold ${summary.total_gain_loss >= 0 ? 'text-success' : 'text-error'}`}>
            {formatCurrency(summary.total_gain_loss)}
          </p>
          <div className="text-xs text-base-content/60 mt-1">
            {gainLossPercentage >= 0 ? '+' : ''}{gainLossPercentage.toFixed(1)}% overall
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioSummary;
