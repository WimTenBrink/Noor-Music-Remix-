import React from 'react';

export const NoorLogo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      {/* Cat Ears */}
      <path d="M30 30 L40 15 L50 30 Z" fill="currentColor" />
      <path d="M60 30 L70 15 L80 30 Z" fill="currentColor" />
      
      {/* Letter K */}
      <path 
        d="M35 30 V80 M35 55 L65 30 M35 55 L65 80" 
        stroke="currentColor" 
        strokeWidth="8" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      
      {/* Cat Tail */}
      <path 
        d="M65 80 C75 80 85 70 85 60 C85 50 75 45 70 45" 
        stroke="currentColor" 
        strokeWidth="6" 
        strokeLinecap="round" 
        fill="none" 
      />
    </svg>
  );
};
