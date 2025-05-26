
import React from 'react';
import type { IconProps } from '../../types';

const NewspaperIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25H5.625a2.25 2.25 0 0 1-2.25-2.25V6.375c0-.621.504-1.125 1.125-1.125H9M12 7.5V12m0 0H9m3 0h3m-3 0V7.5m0 6V15m0 0H9m3 0h3m-3 0V12m0 3h1.5m-1.5-6H9m3 3h1.5" />
  </svg>
);

export default NewspaperIcon;
