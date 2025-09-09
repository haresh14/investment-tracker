import type { FC } from 'react';
import { useState } from 'react';
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
      {/* Header with user info */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-base-content">Investment Dashboard</h1>
          <p className="text-base-content/70 mt-2">
            Welcome back, {user?.email?.split('@')[0]} • Track your SIP investments and returns
          </p>
        </div>
        <button 
          onClick={handleSignOut}
          className="btn btn-outline btn-sm"
        >
          Sign Out
        </button>
      </div>

      {/* Portfolio Summary Cards */}
      <PortfolioSummary />

      {/* SIP List */}
      <SIPList onAddSIP={handleAddSIP} />

      {/* Add SIP Modal */}
      {showAddSIPForm && (
        <AddSIPForm onClose={handleCloseAddSIPForm} />
      )}
    </div>
  );
};

export default Dashboard;
