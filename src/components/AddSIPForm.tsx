import type { FC } from 'react';
import { useState } from 'react';
import { useCreateSIP } from '../hooks/useSIPs';

interface AddSIPFormProps {
  onClose: () => void;
}

const AddSIPForm: FC<AddSIPFormProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    start_date: '',
    amount: '',
    annual_return: '',
    lock_period_months: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createSIP = useCreateSIP();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'SIP name is required';
    }

    if (!formData.start_date) {
      newErrors.start_date = 'Start date is required';
    } else {
      const startDate = new Date(formData.start_date);
      const today = new Date();
      if (startDate > today) {
        newErrors.start_date = 'Start date cannot be in the future';
      }
    }

    if (!formData.amount) {
      newErrors.amount = 'SIP amount is required';
    } else {
      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount <= 0) {
        newErrors.amount = 'Amount must be a positive number';
      } else if (amount < 100) {
        newErrors.amount = 'Minimum SIP amount is ₹100';
      }
    }

    if (!formData.annual_return) {
      newErrors.annual_return = 'Expected annual return is required';
    } else {
      const returnRate = parseFloat(formData.annual_return);
      if (isNaN(returnRate) || returnRate < 0 || returnRate > 100) {
        newErrors.annual_return = 'Return rate must be between 0% and 100%';
      }
    }

    if (formData.lock_period_months) {
      const lockPeriod = parseInt(formData.lock_period_months);
      if (isNaN(lockPeriod) || lockPeriod < 0 || lockPeriod > 120) {
        newErrors.lock_period_months = 'Lock period must be between 0 and 120 months';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await createSIP.mutateAsync({
        name: formData.name.trim(),
        start_date: formData.start_date,
        amount: parseFloat(formData.amount),
        annual_return: parseFloat(formData.annual_return),
        lock_period_months: formData.lock_period_months ? parseInt(formData.lock_period_months) : 0,
      });
      
      onClose();
    } catch (error) {
      console.error('Failed to create SIP:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex justify-between items-center mb-4">
            <h2 className="card-title">Add New SIP</h2>
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
                <span className="label-text">SIP Name *</span>
              </label>
              <input
                type="text"
                name="name"
                placeholder="e.g., HDFC Equity Fund"
                className={`input input-bordered w-full ${errors.name ? 'input-error' : ''}`}
                value={formData.name}
                onChange={handleChange}
                maxLength={100}
              />
              {errors.name && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.name}</span>
                </label>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Start Date *</span>
              </label>
              <input
                type="date"
                name="start_date"
                className={`input input-bordered w-full ${errors.start_date ? 'input-error' : ''}`}
                value={formData.start_date}
                onChange={handleChange}
                max={new Date().toISOString().split('T')[0]}
              />
              {errors.start_date && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.start_date}</span>
                </label>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Monthly Amount (₹) *</span>
              </label>
              <input
                type="number"
                name="amount"
                placeholder="5000"
                className={`input input-bordered w-full ${errors.amount ? 'input-error' : ''}`}
                value={formData.amount}
                onChange={handleChange}
                min="100"
                step="100"
              />
              {errors.amount && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.amount}</span>
                </label>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Expected Annual Return (%) *</span>
              </label>
              <input
                type="number"
                name="annual_return"
                placeholder="12.0"
                className={`input input-bordered w-full ${errors.annual_return ? 'input-error' : ''}`}
                value={formData.annual_return}
                onChange={handleChange}
                min="0"
                max="100"
                step="0.1"
              />
              {errors.annual_return && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.annual_return}</span>
                </label>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Lock Period (months)</span>
              </label>
              <input
                type="number"
                name="lock_period_months"
                placeholder="0"
                className={`input input-bordered w-full ${errors.lock_period_months ? 'input-error' : ''}`}
                value={formData.lock_period_months}
                onChange={handleChange}
                min="0"
                max="120"
                step="1"
              />
              <label className="label">
                <span className="label-text-alt">Optional: Set a locking period to prevent early withdrawals (0 = no lock)</span>
              </label>
              {errors.lock_period_months && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.lock_period_months}</span>
                </label>
              )}
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
                  className={`btn btn-primary flex-1 ${createSIP.isPending ? 'loading' : ''}`}
                  disabled={createSIP.isPending}
                >
                  {createSIP.isPending ? 'Adding...' : 'Add SIP'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddSIPForm;
