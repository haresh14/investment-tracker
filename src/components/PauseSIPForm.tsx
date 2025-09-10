import type { FC } from 'react';
import { useState } from 'react';
import { usePauseSIP } from '../hooks/useSIPs';
import type { SIP } from '../types';

interface PauseSIPFormProps {
  sip: SIP;
  onClose: () => void;
}

const PauseSIPForm: FC<PauseSIPFormProps> = ({ sip, onClose }) => {
  const [pauseDate, setPauseDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const pauseSIP = usePauseSIP();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate pause date
      const pauseDateObj = new Date(pauseDate);
      const startDateObj = new Date(sip.start_date);
      const today = new Date();

      if (pauseDateObj < startDateObj) {
        setError('Pause date cannot be before the SIP start date');
        return;
      }

      if (pauseDateObj > today) {
        setError('Pause date cannot be in the future');
        return;
      }

      await pauseSIP.mutateAsync({
        id: sip.id,
        pauseDate: pauseDate
      });

      onClose();
    } catch (err) {
      setError('Failed to pause SIP. Please try again.');
      console.error('Error pausing SIP:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Pause SIP</h3>
        
        <div className="mb-4 p-4 bg-base-200 rounded-lg">
          <h4 className="font-semibold text-base-content">{sip.name}</h4>
          <p className="text-sm text-base-content/60">
            Monthly Amount: ₹{sip.amount.toLocaleString('en-IN')} | 
            Expected Return: {sip.annual_return}% p.a.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Pause Date *</span>
            </label>
            <input
              type="date"
              className="input input-bordered"
              value={pauseDate}
              onChange={(e) => setPauseDate(e.target.value)}
              min={sip.start_date}
              max={new Date().toISOString().split('T')[0]}
              required
            />
            <label className="label">
              <span className="label-text-alt text-base-content/60">
                Installments will be calculated up to this date
              </span>
            </label>
          </div>

          {error && (
            <div className="alert alert-error mb-4">
              <span>{error}</span>
            </div>
          )}

          <div className="modal-action">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`btn btn-warning ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? 'Pausing...' : 'Pause SIP'}
            </button>
          </div>
        </form>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
};

export default PauseSIPForm;
