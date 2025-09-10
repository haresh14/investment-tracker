import type { FC } from 'react';
import { useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSIPs, useDeleteSIP, useResumeSIP } from '../hooks/useSIPs';
import { calculateInstallmentsPaid, calculateExpectedValue, calculateTotalInvested, formatCurrency, calculateAvailableWithdrawal, isSIPLocked, calculateOverallExpectedPercentage } from '../utils/calculations';
import EditSIPForm from './EditSIPForm';
import PauseSIPForm from './PauseSIPForm';
import ContextMenu, { type ContextMenuItem, type ContextMenuRef } from './ContextMenu';
import type { SIP } from '../types';

type SortField = 'name' | 'start_date' | 'amount' | 'annual_return' | 'installments' | 'total_invested' | 'expected_value' | 'overall_expected_percentage';
type SortDirection = 'asc' | 'desc';

interface SIPRowProps {
  sip: SIP;
  onEdit: (sip: SIP) => void;
  onDelete: (id: string) => void;
  onPause: (sip: SIP) => void;
  onResume: (sip: SIP) => void;
  onViewDetails: (id: string) => void;
}

const SIPRow: FC<SIPRowProps> = ({ sip, onEdit, onDelete, onPause, onResume, onViewDetails }) => {
  const desktopContextMenuRef = useRef<ContextMenuRef>(null);
  const mobileContextMenuRef = useRef<ContextMenuRef>(null);
  
  const installmentsPaid = calculateInstallmentsPaid(sip.start_date, sip.pause_date, sip.is_paused);
  const totalInvested = calculateTotalInvested(sip.amount, installmentsPaid);
  const expectedValue = calculateExpectedValue(sip.amount, sip.annual_return, installmentsPaid);
  const overallExpectedPercentage = calculateOverallExpectedPercentage(sip.start_date, sip.annual_return, sip.pause_date, sip.is_paused);
  const isLocked = isSIPLocked(sip.start_date, sip.lock_period_months);
  const { availableAmount, lockedAmount } = calculateAvailableWithdrawal(
    sip.start_date,
    sip.amount,
    sip.annual_return,
    sip.lock_period_months,
    sip.pause_date,
    sip.is_paused
  );

  // Create context menu items
  const contextMenuItems: ContextMenuItem[] = [
    {
      id: 'view-details',
      label: 'View Details',
      icon: '👁️',
      onClick: () => onViewDetails(sip.id)
    },
    {
      id: 'edit',
      label: 'Edit SIP',
      icon: '✏️',
      onClick: () => onEdit(sip)
    },
    {
      id: 'pause-resume',
      label: sip.is_paused ? 'Resume SIP' : 'Pause SIP',
      icon: sip.is_paused ? '▶️' : '⏸️',
      onClick: () => sip.is_paused ? onResume(sip) : onPause(sip)
    },
    {
      id: 'delete',
      label: 'Delete SIP',
      icon: '🗑️',
      onClick: () => onDelete(sip.id),
      variant: 'danger' as const
    }
  ];

  // Handle row click to navigate to details
  const handleRowClick = (e: React.MouseEvent) => {
    if (!e) return;
    
    // Don't navigate if clicking on interactive elements
    const target = e.target as HTMLElement;
    if (target?.closest('button') || target?.closest('[role="button"]')) {
      return;
    }
    onViewDetails(sip.id);
  };

  return (
    <>
      {/* Desktop Table Row */}
      <ContextMenu 
        ref={desktopContextMenuRef}
        items={contextMenuItems} 
        className="contents"
      >
        <tr 
          className={`hidden lg:table-row hover:bg-base-200/50 cursor-pointer group ${sip.is_paused || sip.status === 'inactive' ? 'opacity-60' : ''}`}
          onClick={handleRowClick}
          title="Click to view details, right-click for more options"
        >
          <td className="font-medium w-1/4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="truncate">{sip.name}</span>
              <div className="flex gap-1 flex-wrap">
                {sip.status === 'inactive' && (
                  <div className="badge badge-error badge-xs">Inactive</div>
                )}
                {sip.status === 'completed' && (
                  <div className="badge badge-success badge-xs">Completed</div>
                )}
                {sip.is_paused && (
                  <div className="badge badge-warning badge-xs">Paused</div>
                )}
                {isLocked && (
                  <div className="badge badge-info badge-xs">🔒 Locked</div>
                )}
              </div>
            </div>
          </td>
          <td className="w-20 text-sm">{new Date(sip.start_date).toLocaleDateString('en-IN')}</td>
          <td className="w-16 text-center">{installmentsPaid}</td>
          <td className="w-24 text-info font-medium text-sm">{formatCurrency(totalInvested)}</td>
          <td className="w-24 text-success font-medium text-sm">{formatCurrency(expectedValue)}</td>
          <td className="w-20 text-center">
            <span className={`font-medium text-sm ${overallExpectedPercentage >= 0 ? 'text-success' : 'text-error'}`}>
              {overallExpectedPercentage.toFixed(2)}%
            </span>
          </td>
          <td className="w-28">
            <div className="text-xs">
              <div className="text-success font-medium">{formatCurrency(availableAmount)}</div>
              {lockedAmount > 0 && (
                <div className="text-warning text-xs">🔒 {formatCurrency(lockedAmount)} locked</div>
              )}
            </div>
          </td>
          <td className="w-16">
            <div className="flex justify-center">
              <button
                className="btn btn-ghost btn-xs"
                onClick={(e) => {
                  if (!e) return;
                  e.stopPropagation();
                  if (desktopContextMenuRef.current) {
                    const rect = e.currentTarget.getBoundingClientRect();
                    desktopContextMenuRef.current.openMenu(
                      rect.right - 200,
                      rect.bottom + 4
                    );
                  }
                }}
                aria-label="More actions"
                title="More actions"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
            </div>
          </td>
        </tr>
      </ContextMenu>

      {/* Mobile Card View */}
      <tr className="lg:hidden">
        <td colSpan={6} className="p-0">
          <ContextMenu 
            ref={mobileContextMenuRef}
            items={contextMenuItems}
          >
            <div 
              className={`card bg-base-50 border border-base-200 mb-3 cursor-pointer hover:bg-base-100 transition-colors group ${sip.is_paused || sip.status === 'inactive' ? 'opacity-60' : ''}`}
              onClick={handleRowClick}
              title="Tap to view details, long-press for more options"
            >
              <div className="card-body p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-base-content">{sip.name}</h3>
                      {sip.status === 'inactive' && (
                        <div className="badge badge-error badge-xs">Inactive</div>
                      )}
                      {sip.status === 'completed' && (
                        <div className="badge badge-success badge-xs">Completed</div>
                      )}
                      {sip.is_paused && (
                        <div className="badge badge-warning badge-xs">Paused</div>
                      )}
                      {isLocked && (
                        <div className="badge badge-info badge-xs">🔒 Locked</div>
                      )}
                    </div>
                    <p className="text-sm text-base-content/60">
                      Started: {new Date(sip.start_date).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <button
                      className="btn btn-ghost btn-xs"
                      onClick={(e) => {
                        if (!e) return;
                        e.stopPropagation();
                        if (mobileContextMenuRef.current) {
                          const rect = e.currentTarget.getBoundingClientRect();
                          mobileContextMenuRef.current.openMenu(
                            rect.right - 200,
                            rect.bottom + 4
                          );
                        }
                      }}
                      aria-label="More actions"
                      title="More actions"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </button>
                  </div>
                </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-base-content/60">Installments</p>
                  <p className="font-medium">{installmentsPaid}</p>
                </div>
                <div>
                  <p className="text-base-content/60">Total Invested</p>
                  <p className="font-medium text-info">{formatCurrency(totalInvested)}</p>
                </div>
                <div>
                  <p className="text-base-content/60">Expected Value</p>
                  <p className="font-medium text-success">{formatCurrency(expectedValue)}</p>
                </div>
                <div>
                  <p className="text-base-content/60">Overall Expected %</p>
                  <p className={`font-medium ${overallExpectedPercentage >= 0 ? 'text-success' : 'text-error'}`}>
                    {overallExpectedPercentage.toFixed(2)}%
                  </p>
                </div>
                <div>
                  <p className="text-base-content/60">Available</p>
                  <div>
                    <p className="font-medium text-success">{formatCurrency(availableAmount)}</p>
                    {lockedAmount > 0 && (
                      <p className="text-xs text-warning">🔒 {formatCurrency(lockedAmount)} locked</p>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-base-content/60">Monthly SIP</p>
                  <p className="font-medium">{formatCurrency(sip.amount)}</p>
                </div>
              </div>
            </div>
          </div>
          </ContextMenu>
        </td>
      </tr>
    </>
  );
};

interface SIPListProps {
  onAddSIP: () => void;
}

const SIPList: FC<SIPListProps> = ({ onAddSIP }) => {
  const navigate = useNavigate();
  const { data: sips, isLoading, error } = useSIPs();
  const deleteSIP = useDeleteSIP();
  // pauseSIP hook is used in PauseSIPForm component
  const resumeSIP = useResumeSIP();
  const [editingSIP, setEditingSIP] = useState<SIP | null>(null);
  const [pausingSIP, setPausingSIP] = useState<SIP | null>(null);
  const [sortField, setSortField] = useState<SortField>('total_invested');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const sortedSips = useMemo(() => {
    if (!sips) return [];

    return [...sips].sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortField) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'start_date':
          aValue = new Date(a.start_date).getTime();
          bValue = new Date(b.start_date).getTime();
          break;
        case 'amount':
          aValue = a.amount;
          bValue = b.amount;
          break;
        case 'annual_return':
          aValue = a.annual_return;
          bValue = b.annual_return;
          break;
        case 'installments':
          aValue = calculateInstallmentsPaid(a.start_date, a.pause_date, a.is_paused);
          bValue = calculateInstallmentsPaid(b.start_date, b.pause_date, b.is_paused);
          break;
        case 'total_invested':
          aValue = calculateTotalInvested(a.amount, calculateInstallmentsPaid(a.start_date, a.pause_date, a.is_paused));
          bValue = calculateTotalInvested(b.amount, calculateInstallmentsPaid(b.start_date, b.pause_date, b.is_paused));
          break;
        case 'expected_value':
          aValue = calculateExpectedValue(a.amount, a.annual_return, calculateInstallmentsPaid(a.start_date, a.pause_date, a.is_paused));
          bValue = calculateExpectedValue(b.amount, b.annual_return, calculateInstallmentsPaid(b.start_date, b.pause_date, b.is_paused));
          break;
        case 'overall_expected_percentage':
          aValue = calculateOverallExpectedPercentage(a.start_date, a.annual_return, a.pause_date, a.is_paused);
          bValue = calculateOverallExpectedPercentage(b.start_date, b.annual_return, b.pause_date, b.is_paused);
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [sips, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return '↕️';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

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

  const handlePause = (sip: SIP) => {
    setPausingSIP(sip);
  };

  const handleClosePause = () => {
    setPausingSIP(null);
  };

  const handleResume = async (sip: SIP) => {
    if (window.confirm(`Are you sure you want to resume "${sip.name}"? Installments will continue from today.`)) {
      try {
        await resumeSIP.mutateAsync(sip.id);
      } catch (error) {
        console.error('Failed to resume SIP:', error);
      }
    }
  };

  const handleViewDetails = (id: string) => {
    navigate(`/sip/${id}`);
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
          <h2 className="card-title">Your SIPs ({sortedSips?.length || 0})</h2>
          <button className="btn btn-primary" onClick={onAddSIP}>
            Add SIP
          </button>
        </div>

        {!sortedSips || sortedSips.length === 0 ? (
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
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              {/* Desktop Table Header */}
              <thead className="hidden lg:table-header-group">
                <tr>
                  <th 
                    className="cursor-pointer hover:bg-base-200 select-none w-1/4"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-2">
                      Name {getSortIcon('name')}
                    </div>
                  </th>
                  <th 
                    className="cursor-pointer hover:bg-base-200 select-none w-20"
                    onClick={() => handleSort('start_date')}
                  >
                    <div className="flex items-center gap-2">
                      Start Date {getSortIcon('start_date')}
                    </div>
                  </th>
                  <th 
                    className="cursor-pointer hover:bg-base-200 select-none w-16"
                    onClick={() => handleSort('installments')}
                  >
                    <div className="flex items-center gap-2">
                      Installments {getSortIcon('installments')}
                    </div>
                  </th>
                  <th 
                    className="cursor-pointer hover:bg-base-200 select-none w-24"
                    onClick={() => handleSort('total_invested')}
                  >
                    <div className="flex items-center gap-2">
                      Total Invested {getSortIcon('total_invested')}
                    </div>
                  </th>
                  <th 
                    className="cursor-pointer hover:bg-base-200 select-none w-24"
                    onClick={() => handleSort('expected_value')}
                  >
                    <div className="flex items-center gap-2">
                      Expected Value {getSortIcon('expected_value')}
                    </div>
                  </th>
                  <th 
                    className="cursor-pointer hover:bg-base-200 select-none w-20"
                    onClick={() => handleSort('overall_expected_percentage')}
                  >
                    <div className="flex items-center gap-2">
                      Overall Expected % {getSortIcon('overall_expected_percentage')}
                    </div>
                  </th>
                  <th className="w-28">Available for Withdrawal</th>
                  <th className="w-16">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedSips.map((sip) => (
                  <SIPRow
                    key={sip.id}
                    sip={sip}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onPause={handlePause}
                    onResume={handleResume}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Edit SIP Modal */}
        {editingSIP && (
          <EditSIPForm sip={editingSIP} onClose={handleCloseEdit} />
        )}

        {/* Pause SIP Modal */}
        {pausingSIP && (
          <PauseSIPForm sip={pausingSIP} onClose={handleClosePause} />
        )}

      </div>
    </div>
  );
};

export default SIPList;
