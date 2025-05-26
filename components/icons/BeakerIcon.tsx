import React from 'react';
import type { IconProps } from '../../types';

const BeakerIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 2.25v1.5m0 0V5.25m0-1.5m0 1.5H12m0 0H9.75m0 0V2.25M9.75 5.25v1.5M12 12.75v3.75m0-3.75a3 3 0 0 0-3-3H7.5M12 12.75v3.75m0-3.75a3 3 0 0 1 3-3h1.5m-1.5 6.75H7.5a3.75 3.75 0 0 0-3.75 3.75v.038M7.5 16.5a3.75 3.75 0 0 1 3.75-3.75h1.5m0 0h1.5a3.75 3.75 0 0 1 3.75 3.75v.038M16.5 16.5a3.75 3.75 0 0 0-3.75-3.75h-1.5m0 0v3.75" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 16.5h16.5" /> {/* Liquid line */}
  </svg>
);

export default BeakerIcon;
