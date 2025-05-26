
import React from 'react';
import type { IconProps } from '../../types';

const TrophyIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-4.5A3.375 3.375 0 0 0 12.75 9.75h-.5A3.375 3.375 0 0 0 9 13.125V18.75m5.25-6.375V6.375a3.375 3.375 0 0 0-3.375-3.375h-1.5A3.375 3.375 0 0 0 9 6.375v2.25" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 6.375 15 3m0 3.375-1.5-1.5m1.5 1.5 1.5-1.5M9 6.375 9 3m0 3.375 1.5-1.5M9 3.375 7.5 1.875" />
  </svg>
);

export default TrophyIcon;
