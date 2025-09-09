import type { FC } from 'react';
import { useState } from 'react';
import { useSIPs, useDeleteSIP } from '../hooks/useSIPs';
import { calculateInstallmentsPaid, calculateExpectedValue, calculateTotalInvested, formatCurrency } from '../utils/calculations';
import EditSIPForm from './EditSIPForm';
import type { SIP } from '../types';

interface SIPCardProps {
  sip: SIP;
  onEdit: (sip: SIP) => void;
  onDelete: (id: string) => void;
}

const SIPCard: FC<SIPCardProps> = ({ sip, onEdit, onDelete }) => {
  const installmentsPaid = calculateInstallmentsPaid(sip.start_date);
  const totalInvested = calculateTotalInvested(sip.amount, installmentsPaid);
  const expectedValue = calculateExpectedValue(sip.amount, sip.annual_return, installmentsPaid);
  const gainLoss = expectedValue - totalInvested;
  const gainLossPercentage = totalInvested > 0 ? (gainLoss / totalInvested) * 100 : 0;

  return (
    <div className="card bg-base-100 shadow-sm border border-base-300">
      <div className="card-body p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-semibold text-base-content">{sip.name}</h3>
            <p className="text-sm text-base-content/60">
              Started: {new Date(sip.start_date).toLocaleDateString('en-IN')}
            </p>
          </div>
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-xs">
              ⋮
            </div>
            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-32">
              <li><button onClick={() => onEdit(sip)}>Edit</button></li>
              <li><button onClick={() => onDelete(sip.id)} className="text-error">Delete</button></li>
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-base-content/60">Monthly SIP</p>
            <p className="font-medium">{formatCurrency(sip.amount)}</p>
          </div>
          <div>
            <p className="text-base-content/60">Expected Return</p>
            <p className="font-medium">{sip.annual_return}% p.a.</p>
          </div>
          <div>
            <p className="text-base-content/60">Installments Paid</p>
            <p className="font-medium">{installmentsPaid}</p>
          </div>
          <div>
            <p className="text-base-content/60">Total Invested</p>
            <p className="font-medium text-info">{formatCurrency(totalInvested)}</p>
          </div>
        </div>

        <div className="divider my-3"></div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-base-content/60">Expected Value</p>
            <p className="font-semibold text-success">{formatCurrency(expectedValue)}</p>
          </div>
          <div>
            <p className="text-base-content/60">Gain/Loss</p>
            <p className={`font-semibold ${gainLoss >= 0 ? 'text-success' : 'text-error'}`}>
              {formatCurrency(gainLoss)} ({gainLossPercentage >= 0 ? '+' : ''}{gainLossPercentage.toFixed(1)}%)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

interface SIPListProps {
  onAddSIP: () => void;
}

const SIPList: FC<SIPListProps> = ({ onAddSIP }) => {
  const { data: sips, isLoading, error } = useSIPs();
  const deleteSIP = useDeleteSIP();
  const [editingSIP, setEditingSIP] = useState<SIP | null>(null);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this SIP? This action cannot be undone.')) {
      try {
        await deleteSIP.mutateAsync(id);
      } catch (error) {
        console.error('Failed to delete SIP:', error);
      }
    }
  };

  const handleEdit = (sip: SIP) => {
    setEditingSIP(sip);
  };

  const handleCloseEdit = () => {
    setEditingSIP(null);
  };

  if (isLoading) {
    return (
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body">
          <div className="flex justify-between items-center mb-4">
            <h2 className="card-title">Your SIPs</h2>
            <button className="btn btn-primary" onClick={onAddSIP}>
              Add SIP
            </button>
          </div>
          <div className="flex justify-center py-8">
            <div className="loading loading-spinner loading-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body">
          <div className="flex justify-between items-center mb-4">
            <h2 className="card-title">Your SIPs</h2>
            <button className="btn btn-primary" onClick={onAddSIP}>
              Add SIP
            </button>
          </div>
          <div className="alert alert-error">
            <span>Failed to load SIPs. Please try again.</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-sm">
      <div className="card-body">
        <div className="flex justify-between items-center mb-4">
          <h2 className="card-title">Your SIPs ({sips?.length || 0})</h2>
          <button className="btn btn-primary" onClick={onAddSIP}>
            Add SIP
          </button>
        </div>

        {!sips || sips.length === 0 ? (
          <div className="text-center py-8 text-base-content/50">
            <div className="mb-4">
              <svg className="w-16 h-16 mx-auto text-base-content/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="text-lg font-medium mb-2">No SIPs added yet</p>
            <p>Start by adding your first SIP investment to track your portfolio.</p>
            <button className="btn btn-primary mt-4" onClick={onAddSIP}>
              Add Your First SIP
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sips.map((sip) => (
              <SIPCard
                key={sip.id}
                sip={sip}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {/* Edit SIP Modal */}
        {editingSIP && (
          <EditSIPForm sip={editingSIP} onClose={handleCloseEdit} />
        )}
      </div>
    </div>
  );
};

export default SIPList;
