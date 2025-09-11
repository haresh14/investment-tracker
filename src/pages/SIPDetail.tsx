import type { FC } from 'react';
import { useParams } from 'react-router-dom';
import { useSIPs } from '../hooks/useSIPs';
import Header from '../components/Header';
import { calculateInstallmentsPaid, calculateExpectedValue, calculateTotalInvested, formatCurrency, calculateAvailableWithdrawal } from '../utils/calculations';
import { format, addMonths, parseISO } from 'date-fns';

const SIPDetail: FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: sips, isLoading, error } = useSIPs();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-base-200 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <div className="flex items-center justify-center py-8">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-base-200 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="alert alert-error">
            <span>Error loading SIP details. Please try again.</span>
          </div>
        </div>
      </div>
    );
  }

  const sip = sips?.find(s => s.id === id);

  if (!sip) {
    return (
      <div className="min-h-screen bg-base-200 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="alert alert-warning">
            <span>SIP not found.</span>
          </div>
        </div>
      </div>
    );
  }

  const installmentsPaid = calculateInstallmentsPaid(sip.start_date, sip.pause_date, sip.is_paused);
  const totalInvested = calculateTotalInvested(sip.amount, installmentsPaid);
  const expectedValue = calculateExpectedValue(sip.amount, sip.annual_return, installmentsPaid);
  const currentGain = expectedValue - totalInvested;
  const { availableAmount, lockedAmount, installments } = calculateAvailableWithdrawal(
    sip.start_date,
    sip.amount,
    sip.annual_return,
    sip.lock_period_years,
    sip.pause_date,
    sip.is_paused
  );

  // Generate transaction history with lock status
  const generateTransactionHistory = () => {
    const transactions = [];
    const startDate = parseISO(sip.start_date);
    const endDate = sip.is_paused && sip.pause_date ? parseISO(sip.pause_date) : new Date();
    
    for (let i = 0; i < installmentsPaid; i++) {
      const installmentDate = addMonths(startDate, i);
      if (installmentDate > endDate) break;
      
      const installmentDateStr = installmentDate.toISOString().split('T')[0];
      const monthsInvested = i + 1;
      const totalInvestedTillDate = sip.amount * monthsInvested;
      const expectedValueTillDate = calculateExpectedValue(sip.amount, sip.annual_return, monthsInvested);
      const gainTillDate = expectedValueTillDate - totalInvestedTillDate;
      
      // Find corresponding installment data for lock status
      const installmentData = installments.find(inst => inst.date === installmentDateStr);
      
      transactions.push({
        installmentNumber: monthsInvested,
        date: installmentDate,
        amount: sip.amount,
        totalInvested: totalInvestedTillDate,
        expectedValue: expectedValueTillDate,
        gain: gainTillDate,
        returnPercentage: totalInvestedTillDate > 0 ? (gainTillDate / totalInvestedTillDate) * 100 : 0,
        isLocked: installmentData?.isLocked || false,
        lockEndDate: installmentData?.lockEndDate || null
      });
    }
    
    return transactions.reverse(); // Show latest first
  };

  const transactions = generateTransactionHistory();

  return (
    <div className="min-h-screen bg-base-200">
      <Header 
        title={sip.name}
        subtitle={`SIP Details • ${sip.annual_return}% Annual Return • Started ${new Date(sip.start_date).toLocaleDateString('en-IN')}`}
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">

        {/* SIP Overview Card */}
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-base-content flex items-center gap-2">
                  {sip.name}
                  {sip.is_paused && (
                    <span className="badge badge-warning badge-sm">Paused</span>
                  )}
                </h1>
                <p className="text-base-content/60 mt-1">
                  Started on {format(parseISO(sip.start_date), 'dd MMM yyyy')}
                  {sip.is_paused && sip.pause_date && (
                    <span> • Paused on {format(parseISO(sip.pause_date), 'dd MMM yyyy')}</span>
                  )}
                </p>
              </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="stat bg-base-200 rounded-lg p-4">
                <div className="stat-title text-xs">Monthly Amount</div>
                <div className="stat-value text-lg">{formatCurrency(sip.amount)}</div>
              </div>
              
              <div className="stat bg-base-200 rounded-lg p-4">
                <div className="stat-title text-xs">Expected Return</div>
                <div className="stat-value text-lg">{sip.annual_return}% p.a.</div>
              </div>
              
              <div className="stat bg-base-200 rounded-lg p-4">
                <div className="stat-title text-xs">Installments Paid</div>
                <div className="stat-value text-lg">{installmentsPaid}</div>
              </div>
              
              <div className="stat bg-base-200 rounded-lg p-4">
                <div className="stat-title text-xs">Status</div>
                <div className="stat-value text-lg">
                  {sip.is_paused ? (
                    <span className="text-warning">Paused</span>
                  ) : (
                    <span className="text-success">Active</span>
                  )}
                </div>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div className="stat bg-primary/10 rounded-lg p-4">
                <div className="stat-title text-sm">Total Invested</div>
                <div className="stat-value text-xl text-primary">{formatCurrency(totalInvested)}</div>
              </div>
              
              <div className="stat bg-secondary/10 rounded-lg p-4">
                <div className="stat-title text-sm">Expected Value</div>
                <div className="stat-value text-xl text-secondary">{formatCurrency(expectedValue)}</div>
              </div>
              
              <div className="stat bg-success/10 rounded-lg p-4">
                <div className="stat-title text-sm">Available for Withdrawal</div>
                <div className="stat-value text-xl text-success">{formatCurrency(availableAmount)}</div>
                <div className="stat-desc">
                  {((availableAmount / expectedValue) * 100).toFixed(1)}% of total value
                </div>
              </div>
              
              {lockedAmount > 0 ? (
                <div className="stat bg-warning/10 rounded-lg p-4">
                  <div className="stat-title text-sm">Locked Amount</div>
                  <div className="stat-value text-xl text-warning">{formatCurrency(lockedAmount)}</div>
                  <div className="stat-desc">
                    Per-installment lock periods apply
                  </div>
                </div>
              ) : (
                <div className={`stat rounded-lg p-4 ${currentGain >= 0 ? 'bg-success/10' : 'bg-error/10'}`}>
                  <div className="stat-title text-sm">Current Gain/Loss</div>
                  <div className={`stat-value text-xl ${currentGain >= 0 ? 'text-success' : 'text-error'}`}>
                    {formatCurrency(currentGain)}
                  </div>
                  <div className="stat-desc">
                    {totalInvested > 0 ? `${((currentGain / totalInvested) * 100).toFixed(2)}%` : '0%'}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
            
            {transactions.length === 0 ? (
              <div className="text-center py-8 text-base-content/60">
                No transactions yet. First installment will be processed on the start date.
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="table table-zebra w-full">
                    <thead>
                      <tr>
                        <th>Installment #</th>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Total Invested</th>
                        <th>Expected Value</th>
                        <th>Gain/Loss</th>
                        <th>Return %</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((transaction) => (
                        <tr key={transaction.installmentNumber}>
                          <td className="font-medium">#{transaction.installmentNumber}</td>
                          <td>{format(transaction.date, 'dd MMM yyyy')}</td>
                          <td>{formatCurrency(transaction.amount)}</td>
                          <td>{formatCurrency(transaction.totalInvested)}</td>
                          <td>{formatCurrency(transaction.expectedValue)}</td>
                          <td className={transaction.gain >= 0 ? 'text-success' : 'text-error'}>
                            {formatCurrency(transaction.gain)}
                          </td>
                          <td className={transaction.returnPercentage >= 0 ? 'text-success' : 'text-error'}>
                            {transaction.returnPercentage.toFixed(2)}%
                          </td>
                          <td>
                            {transaction.isLocked ? (
                              <div className="tooltip" data-tip={`Locked until ${transaction.lockEndDate ? format(parseISO(transaction.lockEndDate), 'dd MMM yyyy') : 'N/A'}`}>
                                <div className="badge badge-warning badge-sm">🔒 Locked</div>
                              </div>
                            ) : (
                              <div className="badge badge-success badge-sm">✓ Available</div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="lg:hidden space-y-3">
                  {transactions.map((transaction) => (
                    <div key={transaction.installmentNumber} className="card bg-base-200 shadow-sm">
                      <div className="card-body p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold">Installment #{transaction.installmentNumber}</h3>
                            <p className="text-sm text-base-content/60">
                              {format(transaction.date, 'dd MMM yyyy')}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{formatCurrency(transaction.amount)}</div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-base-content/60">Total Invested:</span>
                            <div className="font-medium">{formatCurrency(transaction.totalInvested)}</div>
                          </div>
                          <div>
                            <span className="text-base-content/60">Expected Value:</span>
                            <div className="font-medium">{formatCurrency(transaction.expectedValue)}</div>
                          </div>
                          <div>
                            <span className="text-base-content/60">Gain/Loss:</span>
                            <div className={`font-medium ${transaction.gain >= 0 ? 'text-success' : 'text-error'}`}>
                              {formatCurrency(transaction.gain)}
                            </div>
                          </div>
                          <div>
                            <span className="text-base-content/60">Return:</span>
                            <div className={`font-medium ${transaction.returnPercentage >= 0 ? 'text-success' : 'text-error'}`}>
                              {transaction.returnPercentage.toFixed(2)}%
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-2 pt-2 border-t border-base-300">
                          <div className="flex justify-between items-center">
                            <span className="text-base-content/60 text-sm">Withdrawal Status:</span>
                            {transaction.isLocked ? (
                              <div className="badge badge-warning badge-sm">
                                🔒 Locked until {transaction.lockEndDate ? format(parseISO(transaction.lockEndDate), 'dd MMM yyyy') : 'N/A'}
                              </div>
                            ) : (
                              <div className="badge badge-success badge-sm">✓ Available</div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default SIPDetail;
