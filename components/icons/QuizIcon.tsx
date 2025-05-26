
import React from 'react';
import type { IconProps } from '../../types';

const QuizIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.354a15.055 15.055 0 0 1-4.5 0M10.5 18.75h3M10.5 12.75h3M5.25 12a6.75 6.75 0 0 1 13.5 0M1.5 12a10.5 10.5 0 0 1 21 0" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5h.008v.008H12v-.008Z" />
  </svg>
);

export default QuizIcon;
