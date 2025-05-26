import React from 'react';
import type { IconProps } from '../../types';

interface StarIconProps extends IconProps {
  filled?: boolean;
}

const StarIcon: React.FC<StarIconProps> = ({ className = "w-5 h-5", filled = true }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill={filled ? "currentColor" : "none"} 
    stroke="currentColor" 
    strokeWidth={filled ? 0 : 1.5} // No stroke if filled, otherwise a thin stroke
    className={className}
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.479.038.673.646.314.941l-4.098 3.926a.563.563 0 0 0-.182.527l1.28 5.331a.562.562 0 0 1-.825.638l-4.9-2.562a.562.562 0 0 0-.546 0l-4.9 2.562a.562.562 0 0 1-.825-.638l1.28-5.331a.562.562 0 0 0-.182-.527l-4.098-3.926c-.36-.295-.165-.903.314-.941l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" 
    />
  </svg>
);

export default StarIcon;