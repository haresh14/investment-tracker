import type { FC } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import WithdrawalList from '../components/WithdrawalList';
import AddWithdrawalForm from '../components/AddWithdrawalForm';

const Withdrawals: FC = () => {
  const [showAddWithdrawal, setShowAddWithdrawal] = useState(false);

  const handleAddWithdrawal = () => {
    setShowAddWithdrawal(true);
  };

  const handleCloseAddWithdrawal = () => {
    setShowAddWithdrawal(false);
  };

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link 
              to="/" 
              className="btn btn-ghost btn-sm"
              aria-label="Back to Dashboard"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </Link>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-base-content">Withdrawals</h1>
              <p className="text-base-content/60 mt-1">
                Manage your SIP withdrawals and track your investment exits
              </p>
            </div>
            
            <button 
              className="btn btn-primary"
              onClick={handleAddWithdrawal}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Withdrawal
            </button>
          </div>
        </div>

        {/* Withdrawals List */}
        <div className="bg-base-100 rounded-lg shadow-sm border border-base-300">
          <div className="p-6">
            <WithdrawalList onAddWithdrawal={handleAddWithdrawal} />
          </div>
        </div>

        {/* Add Withdrawal Modal */}
        {showAddWithdrawal && (
          <AddWithdrawalForm onClose={handleCloseAddWithdrawal} />
        )}
      </div>
    </div>
  );
};

export default Withdrawals;
