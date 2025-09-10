import type { FC } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import PortfolioSummary from '../components/PortfolioSummary';
import SIPList from '../components/SIPList';
import AddSIPForm from '../components/AddSIPForm';

const Dashboard: FC = () => {
  const { user, signOut } = useAuth();
  const [showAddSIPForm, setShowAddSIPForm] = useState(false);

  const handleSignOut = async () => {
    await signOut();
  };

  const handleAddSIP = () => {
    setShowAddSIPForm(true);
  };

  const handleCloseAddSIPForm = () => {
    setShowAddSIPForm(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with user info and navigation */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-base-content">Investment Dashboard</h1>
          <p className="text-base-content/70 mt-2">
            Welcome back, {user?.email?.split('@')[0]} • Track your SIP investments and returns
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Navigation Links */}
          <Link 
            to="/withdrawals" 
            className="btn btn-ghost btn-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            Withdrawals
          </Link>
          
          <button 
            onClick={handleSignOut}
            className="btn btn-outline btn-sm"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Portfolio Summary Cards */}
      <PortfolioSummary />

      {/* SIP List */}
      <div className="mt-8">
        <SIPList onAddSIP={handleAddSIP} />
      </div>

      {/* Add SIP Modal */}
      {showAddSIPForm && (
        <AddSIPForm onClose={handleCloseAddSIPForm} />
      )}
    </div>
  );
};

export default Dashboard;
