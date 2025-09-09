import type { FC } from 'react';
import { useState } from 'react';
import { useWithdrawals, useDeleteWithdrawal } from '../hooks/useWithdrawals';
import { formatCurrency } from '../utils/calculations';
import EditWithdrawalForm from './EditWithdrawalForm';
import type { Withdrawal } from '../types';

interface WithdrawalCardProps {
  withdrawal: Withdrawal;
  onEdit: (withdrawal: Withdrawal) => void;
  onDelete: (id: string) => void;
}

const WithdrawalCard: FC<WithdrawalCardProps> = ({ withdrawal, onEdit, onDelete }) => {
  return (
    <div className="card bg-base-100 shadow-sm border border-base-300">
      <div className="card-body p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-semibold text-base-content">
              {formatCurrency(withdrawal.amount)}
            </h3>
            <p className="text-sm text-base-content/60">
              {new Date(withdrawal.date).toLocaleDateString('en-IN')}
            </p>
          </div>
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-xs">
              ⋮
            </div>
            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-32">
              <li><button onClick={() => onEdit(withdrawal)}>Edit</button></li>
              <li><button onClick={() => onDelete(withdrawal.id)} className="text-error">Delete</button></li>
            </ul>
          </div>
        </div>

        <div className="text-sm">
          {withdrawal.sip_id ? (
            <div className="flex items-center gap-2">
              <div className="badge badge-outline badge-sm">
                Linked to SIP
              </div>
              <span className="text-base-content/60">
                {/* @ts-ignore - sips relation from join */}
                {withdrawal.sips?.name || 'Unknown SIP'}
              </span>
            </div>
          ) : (
            <div className="badge badge-ghost badge-sm">
              General withdrawal
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface WithdrawalListProps {
  onAddWithdrawal: () => void;
}

const WithdrawalList: FC<WithdrawalListProps> = ({ onAddWithdrawal }) => {
  const { data: withdrawals, isLoading, error } = useWithdrawals();
  const deleteWithdrawal = useDeleteWithdrawal();
  const [editingWithdrawal, setEditingWithdrawal] = useState<Withdrawal | null>(null);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this withdrawal? This action cannot be undone.')) {
      try {
        await deleteWithdrawal.mutateAsync(id);
      } catch (error) {
        console.error('Failed to delete withdrawal:', error);
      }
    }
  };

  const handleEdit = (withdrawal: Withdrawal) => {
    setEditingWithdrawal(withdrawal);
  };

  const handleCloseEdit = () => {
    setEditingWithdrawal(null);
  };

  if (isLoading) {
    return (
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body">
          <div className="flex justify-between items-center mb-4">
            <h2 className="card-title">Withdrawals</h2>
            <button className="btn btn-warning" onClick={onAddWithdrawal}>
              Record Withdrawal
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
            <h2 className="card-title">Withdrawals</h2>
            <button className="btn btn-warning" onClick={onAddWithdrawal}>
              Record Withdrawal
            </button>
          </div>
          <div className="alert alert-error">
            <span>Failed to load withdrawals. Please try again.</span>
          </div>
        </div>
      </div>
    );
  }

  const totalWithdrawals = withdrawals?.reduce((sum, w) => sum + w.amount, 0) || 0;

  return (
    <div className="card bg-base-100 shadow-sm">
      <div className="card-body">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="card-title">Withdrawals ({withdrawals?.length || 0})</h2>
            {totalWithdrawals > 0 && (
              <p className="text-sm text-base-content/60">
                Total: {formatCurrency(totalWithdrawals)}
              </p>
            )}
          </div>
          <button className="btn btn-warning" onClick={onAddWithdrawal}>
            Record Withdrawal
          </button>
        </div>

        {!withdrawals || withdrawals.length === 0 ? (
          <div className="text-center py-8 text-base-content/50">
            <div className="mb-4">
              <svg className="w-16 h-16 mx-auto text-base-content/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-lg font-medium mb-2">No withdrawals recorded</p>
            <p>Record withdrawals to track money taken out of your investments.</p>
            <button className="btn btn-warning mt-4" onClick={onAddWithdrawal}>
              Record First Withdrawal
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {withdrawals.map((withdrawal) => (
              <WithdrawalCard
                key={withdrawal.id}
                withdrawal={withdrawal}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {/* Edit Withdrawal Modal */}
        {editingWithdrawal && (
          <EditWithdrawalForm withdrawal={editingWithdrawal} onClose={handleCloseEdit} />
        )}
      </div>
    </div>
  );
};

export default WithdrawalList;
