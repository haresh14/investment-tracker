import type { FC } from 'react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import PortfolioSummary from '../components/PortfolioSummary';
import SIPList from '../components/SIPList';
import AddSIPForm from '../components/AddSIPForm';

const Dashboard: FC = () => {
  const { user } = useAuth();
  const [showAddSIPForm, setShowAddSIPForm] = useState(false);

  const handleAddSIP = () => {
    setShowAddSIPForm(true);
  };

  const handleCloseAddSIPForm = () => {
    setShowAddSIPForm(false);
  };

  return (
    <div className="min-h-screen bg-base-200">
      <Header 
        title="Investment Dashboard"
        subtitle={`Welcome back, ${user?.email?.split('@')[0]} • Track your SIP investments and returns`}
      />
      
      <div className="container mx-auto px-4 py-8">
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
    </div>
  );
};

export default Dashboard;
