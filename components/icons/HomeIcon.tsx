
import React from 'react';
import type { IconProps } from '../../types';

const HomeIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a.75.75 0 011.06 0l8.955 8.955M3.75 12H20.25m-16.5 0V21.75c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V12m-16.5 0h16.5m-16.5 0V9.375c0-.621.504-1.125 1.125-1.125h1.5c.621 0 1.125.504 1.125 1.125V12m-3 0h3m10.5-2.625V12m0 0h3m-3 0V9.375a1.125 1.125 0 011.125-1.125h1.5c.621 0 1.125.504 1.125 1.125V12m-15-4.5h15" />
  </svg>
);

export default HomeIcon;