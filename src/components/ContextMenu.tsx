import type { ReactNode } from 'react';
import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

export interface ContextMenuItem {
  id: string;
  label: string;
  icon?: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'default' | 'danger';
}

interface ContextMenuProps {
  items: ContextMenuItem[];
  children: ReactNode;
  className?: string;
}

export interface ContextMenuRef {
  openMenu: (x: number, y: number) => void;
}

const ContextMenu = forwardRef<ContextMenuRef, ContextMenuProps>(({ items, children, className = '' }, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  // Expose openMenu function to parent via ref
  useImperativeHandle(ref, () => ({
    openMenu: (x: number, y: number) => {
      setPosition({ x, y });
      setIsOpen(true);
    }
  }), []);

  // Handle right-click context menu
  const handleContextMenu = (e: React.MouseEvent) => {
    if (!e) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const rect = triggerRef.current?.getBoundingClientRect();
    if (rect) {
      setPosition({
        x: e.clientX,
        y: e.clientY
      });
      setIsOpen(true);
    }
  };


  // Handle touch start for long press
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!e || !e.touches || e.touches.length === 0) return;
    
    const touch = e.touches[0];
    longPressTimer.current = setTimeout(() => {
      setPosition({
        x: touch.clientX,
        y: touch.clientY
      });
      setIsOpen(true);
    }, 500); // 500ms long press
  };

  // Handle touch end/cancel to clear long press timer
  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };


  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
    };
  }, [isOpen]);

  const handleItemClick = (item: ContextMenuItem) => {
    if (!item.disabled) {
      item.onClick();
      setIsOpen(false);
    }
  };

  return (
    <>
      <div
        ref={triggerRef}
        onContextMenu={handleContextMenu}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        className={className}
      >
        {children}
        
        {/* Three-dots button for explicit trigger - removed from here, will be handled in parent */}
      </div>

      {/* Context Menu Overlay */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          
          {/* Menu */}
          <div
            ref={menuRef}
            className="fixed z-50 bg-base-100 border border-base-300 rounded-lg shadow-lg py-2 min-w-48"
            style={{
              left: Math.min(position.x, window.innerWidth - 200),
              top: Math.min(position.y, window.innerHeight - (items.length * 40 + 16))
            }}
          >
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item)}
                disabled={item.disabled}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-base-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 ${
                  item.variant === 'danger' ? 'text-error hover:bg-error/10' : 'text-base-content'
                }`}
              >
                {item.icon && (
                  <span className="text-base" role="img" aria-hidden="true">
                    {item.icon}
                  </span>
                )}
                {item.label}
              </button>
            ))}
          </div>
        </>
      )}
    </>
  );
});

ContextMenu.displayName = 'ContextMenu';

export default ContextMenu;
