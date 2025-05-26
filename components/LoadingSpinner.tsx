import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', message, className }) => {
  const dotSizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
  };

  const containerSizeClasses = {
    sm: 'h-4', // Adjusted for dot size
    md: 'h-5',
    lg: 'h-6',
  }

  return (
    <div className={`flex flex-col items-center justify-center p-4 ${className || ''}`} role="status" aria-live="polite">
      <div className={`flex items-center justify-center space-x-1.5 ${containerSizeClasses[size]}`}>
        <div 
          className={`${dotSizeClasses[size]} bg-brand-premium-blue rounded-full animate-bounce-dot`} 
          style={{ animationDelay: '-0.32s' }}
          aria-hidden="true"
        ></div>
        <div 
          className={`${dotSizeClasses[size]} bg-brand-premium-blue rounded-full animate-bounce-dot`} 
          style={{ animationDelay: '-0.16s' }}
          aria-hidden="true"
        ></div>
        <div 
          className={`${dotSizeClasses[size]} bg-brand-premium-blue rounded-full animate-bounce-dot`}
          aria-hidden="true"
        ></div>
      </div>
      {message && <p className="mt-3 text-brand-gray-300">{message}</p>}
      <span className="sr-only">{message || "Loading..."}</span>
    </div>
  );
};

export default LoadingSpinner;