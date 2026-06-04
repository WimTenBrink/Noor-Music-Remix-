import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

interface TooltipContextType {
  showTooltip: (title: string, content: string, x: number, y: number) => void;
  hideTooltip: () => void;
}

const TooltipContext = createContext<TooltipContextType | undefined>(undefined);

export const useTooltip = () => {
  const context = useContext(TooltipContext);
  if (!context) {
    throw new Error('useTooltip must be used within a TooltipProvider');
  }
  return context;
};

interface TooltipProviderProps {
  children: React.ReactNode;
}

export const TooltipProvider: React.FC<TooltipProviderProps> = ({ children }) => {
  const [tooltip, setTooltip] = useState<{ title: string; content: string; x: number; y: number } | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const showTooltip = (title: string, content: string, x: number, y: number) => {
    setTooltip({ title, content, x, y });
  };

  const hideTooltip = () => {
    setTooltip(null);
  };

  // Adjust positioning inside viewport once dimensions are known
  useEffect(() => {
    if (!tooltip || !tooltipRef.current) return;

    const el = tooltipRef.current;
    const width = el.offsetWidth;
    const height = el.offsetHeight;

    let targetX = tooltip.x;
    let targetY = tooltip.y - height - 120; // far away: render 120px above trigger point

    // Horizontal boundaries
    if (targetX - width / 2 < 8) {
      targetX = width / 2 + 8;
    } else if (targetX + width / 2 > window.innerWidth - 8) {
      targetX = window.innerWidth - width / 2 - 8;
    }

    // Vertical boundaries: if going off-screen top, render far below trigger instead
    if (targetY < 8) {
      targetY = tooltip.y + 120; // 120px spacing below trigger point to keep it far away
    }

    setCoords({ x: targetX, y: targetY });
  }, [tooltip]);

  return (
    <TooltipContext.Provider value={{ showTooltip, hideTooltip }}>
      {children}
      {tooltip && (
        <div
          ref={tooltipRef}
          style={{
            position: 'fixed',
            left: `${coords.x}px`,
            top: `${coords.y}px`,
            transform: 'translateX(-50%)',
          }}
          className="z-[9999] pointer-events-none w-72 bg-lavender-bg/95 border-4 border-red-500 rounded-lg p-3.5 shadow-2xl backdrop-blur-md animate-fade-in text-left"
          id="global-tooltip-panel"
        >
          <div className="flex flex-col gap-1">
            <h4 className="text-sm font-black uppercase tracking-wider text-lavender-accent border-b border-lavender-border/40 pb-1 mb-1.5 font-mono">
              {tooltip.title}
            </h4>
            <p className="text-xs leading-relaxed text-lavender-text/90 font-sans font-medium">
              {tooltip.content}
            </p>
          </div>
        </div>
      )}
    </TooltipContext.Provider>
  );
};

interface TooltipProps {
  title: string;
  content: string;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ title, content, children, disabled = false, className = "inline-block" }) => {
  const { showTooltip, hideTooltip } = useTooltip();

  if (disabled || !content) {
    return <>{children}</>;
  }

  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top;
    showTooltip(title, content, x, y);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    // optional mouse move tracking can go here
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={hideTooltip}
      onClick={hideTooltip}
      className={className}
    >
      {children}
    </div>
  );
};
