import type { FC } from 'react';

const Dashboard: FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-base-content">Investment Dashboard</h1>
        <p className="text-base-content/70 mt-2">Track your SIP investments and returns</p>
      </div>

      {/* Portfolio Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card bg-base-200 shadow-sm">
          <div className="card-body">
            <h2 className="card-title text-sm font-medium text-base-content/70">Total Invested</h2>
            <p className="text-2xl font-bold text-success">₹0</p>
          </div>
        </div>
        
        <div className="card bg-base-200 shadow-sm">
          <div className="card-body">
            <h2 className="card-title text-sm font-medium text-base-content/70">Expected Value</h2>
            <p className="text-2xl font-bold text-info">₹0</p>
          </div>
        </div>
        
        <div className="card bg-base-200 shadow-sm">
          <div className="card-body">
            <h2 className="card-title text-sm font-medium text-base-content/70">Total Withdrawals</h2>
            <p className="text-2xl font-bold text-warning">₹0</p>
          </div>
        </div>
        
        <div className="card bg-base-200 shadow-sm">
          <div className="card-body">
            <h2 className="card-title text-sm font-medium text-base-content/70">Net Portfolio</h2>
            <p className="text-2xl font-bold text-primary">₹0</p>
          </div>
        </div>
      </div>

      {/* SIP List */}
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body">
          <div className="flex justify-between items-center mb-4">
            <h2 className="card-title">Your SIPs</h2>
            <button className="btn btn-primary">Add SIP</button>
          </div>
          
          <div className="text-center py-8 text-base-content/50">
            <p>No SIPs added yet. Start by adding your first SIP investment.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
