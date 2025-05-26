import React from 'react';
import type { IconProps } from '../../types';

const SparklesIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L1.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.25 7.5l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L25.000 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09L18.25 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L11.500 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L18.25 7.5Z" />
 </svg>
);


export default SparklesIcon;