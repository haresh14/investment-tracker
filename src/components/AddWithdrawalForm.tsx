import type { FC } from 'react';
import { useState } from 'react';
import { useCreateWithdrawal } from '../hooks/useWithdrawals';
import { useSIPs } from '../hooks/useSIPs';

interface AddWithdrawalFormProps {
  onClose: () => void;
}

const AddWithdrawalForm: FC<AddWithdrawalFormProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    amount: '',
    date: new Date().toISOString().split('T')[0], // Today's date
    sip_id: '', // Optional SIP link
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createWithdrawal = useCreateWithdrawal();
  const { data: sips } = useSIPs();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.amount) {
      newErrors.amount = 'Withdrawal amount is required';
    } else {
      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount <= 0) {
        newErrors.amount = 'Amount must be a positive number';
      } else if (amount < 1) {
        newErrors.amount = 'Minimum withdrawal amount is ₹1';
      }
    }

    if (!formData.date) {
      newErrors.date = 'Withdrawal date is required';
    } else {
      const withdrawalDate = new Date(formData.date);
      const today = new Date();
      if (withdrawalDate > today) {
        newErrors.date = 'Withdrawal date cannot be in the future';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await createWithdrawal.mutateAsync({
        amount: parseFloat(formData.amount),
        date: formData.date,
        sip_id: formData.sip_id || undefined, // Convert empty string to undefined
      });
      
      onClose();
    } catch (error) {
      console.error('Failed to create withdrawal:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex justify-between items-center mb-4">
            <h2 className="card-title">Record Withdrawal</h2>
            <button 
              className="btn btn-ghost btn-sm btn-circle"
              onClick={onClose}
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Withdrawal Amount (₹) *</span>
              </label>
              <input
                type="number"
                name="amount"
                placeholder="10000"
                className={`input input-bordered w-full ${errors.amount ? 'input-error' : ''}`}
                value={formData.amount}
                onChange={handleChange}
                min="1"
                step="1"
              />
              {errors.amount && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.amount}</span>
                </label>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Withdrawal Date *</span>
              </label>
              <input
                type="date"
                name="date"
                className={`input input-bordered w-full ${errors.date ? 'input-error' : ''}`}
                value={formData.date}
                onChange={handleChange}
                max={new Date().toISOString().split('T')[0]}
              />
              {errors.date && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.date}</span>
                </label>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Link to SIP (Optional)</span>
              </label>
              <select
                name="sip_id"
                className="select select-bordered w-full"
                value={formData.sip_id}
                onChange={handleChange}
              >
                <option value="">No specific SIP</option>
                {sips?.map((sip) => (
                  <option key={sip.id} value={sip.id}>
                    {sip.name}
                  </option>
                ))}
              </select>
              <label className="label">
                <span className="label-text-alt">
                  Optionally link this withdrawal to a specific SIP investment
                </span>
              </label>
            </div>

            <div className="form-control mt-6">
              <div className="flex gap-2">
                <button
                  type="button"
                  className="btn btn-outline flex-1"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`btn btn-primary flex-1 ${createWithdrawal.isPending ? 'loading' : ''}`}
                  disabled={createWithdrawal.isPending}
                >
                  {createWithdrawal.isPending ? 'Recording...' : 'Record Withdrawal'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddWithdrawalForm;
