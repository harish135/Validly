import React from 'react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode; // Icon is now optional
  label?: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'custom';
  size?: 'sm' | 'md' | 'lg';
  customColorClass?: string; // For 'custom' variant
}

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  label,
  variant = 'primary',
  size = 'md',
  className,
  children, // To allow text content if label is not used
  customColorClass,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-premium-blue focus-visible:ring-offset-2 focus-visible:ring-offset-brand-gray-950 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm hover:shadow-md";

  const variantStyles = {
    primary: "bg-brand-premium-blue text-white hover:bg-brand-premium-blue-hover disabled:bg-brand-premium-blue", // Changed hover
    secondary: "bg-brand-gray-700 text-brand-gray-100 hover:bg-brand-gray-600 border border-brand-gray-600 disabled:bg-brand-gray-700",
    ghost: "text-brand-premium-blue hover:bg-brand-gray-700 hover:text-blue-400 disabled:text-brand-premium-blue/70",
    danger: "bg-red-600 text-white hover:bg-red-500 disabled:bg-red-600",
    custom: customColorClass || "bg-brand-gray-700 text-brand-gray-100 hover:bg-brand-gray-600"
  };

  const sizeStyles = {
    sm: `p-1.5 text-xs ${label || children ? 'px-2.5' : ''}`,
    md: `p-2 text-sm ${label || children ? 'px-3' : ''}`,
    lg: `p-2.5 text-base ${label || children ? 'px-4' : ''}`,
  };
  
  const iconSize = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }

  return (
    <button
      type="button"
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className || ''}`}
      {...props}
    >
      {icon && React.isValidElement(icon) && React.cloneElement(icon as React.ReactElement<any>, { 
        className: `${iconSize[size]} ${(label || children) ? 'mr-2' : ''}` 
      })}
      {label || children}
    </button>
  );
};

export default IconButton;