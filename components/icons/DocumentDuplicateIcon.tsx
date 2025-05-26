import React from 'react';
import type { IconProps } from '../../types';

const DocumentDuplicateIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376H3.375M4.5 18.75h12.75A2.25 2.25 0 0 0 19.5 16.5v-9.75A2.25 2.25 0 0 0 17.25 4.5h-9.75A2.25 2.25 0 0 0 5.25 6.75v9.75c0 .621.504 1.125 1.125 1.125h1.5v3.375Z" />
  </svg>
);

export default DocumentDuplicateIcon;