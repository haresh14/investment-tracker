import type { FC } from 'react';
import { useState } from 'react';
import Header from '../components/Header';
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
      <Header 
        title="Withdrawals"
        subtitle="Manage your SIP withdrawals and track your investment exits"
      />
      
      <div className="container mx-auto px-4 py-8">
        {/* Add Withdrawal Button */}
        <div className="flex justify-end mb-6">
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
