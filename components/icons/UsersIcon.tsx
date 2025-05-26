import React from 'react';
import type { IconProps } from '../../types';

const UsersIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-3.741-1.063M15 15.75a3 3 0 0 1-6 0m6 0v-3A3 3 0 0 0 12 9.75M12 12.75v3m0 0V15M15 12.75H9M15 15.75A3 3 0 0 0 12 18.75m0 0c-1.148 0-2.22.406-3.034 1.087M3 15.75a3 3 0 0 1 6 0m6 0v-3a3 3 0 0 1 3-3m-3 3V15m-6-3H3m3 0V9.75a3 3 0 0 1 3-3m-3 3h12M3 12.75h.008v.008H3v-.008Zm0 3h.008v.008H3v-.008Zm0 3h.008v.008H3v-.008Zm0-9h.008v.008H3V9.75Zm.008 0A2.25 2.25 0 1 0 5.25 7.5M3 12.75a2.25 2.25 0 1 0 4.5 0m-4.5 0a2.25 2.25 0 1 1 4.5 0M3 15.75a2.25 2.25 0 1 0 4.5 0m-4.5 0a2.25 2.25 0 1 1 4.5 0m5.25 3.72a9.094 9.094 0 0 1-3.741-.479 3 3 0 0 1 3.741-1.063m-3.034 1.087a9.094 9.094 0 0 1 3.034-.363m3.034.363a9.094 9.094 0 0 1 3.034.363m-3.034-.363C11.22 19.156 10.148 18.75 9 18.75c-1.148 0-2.22.406-3.034 1.087M15 15.75a3 3 0 0 0-3-3m-3 3a3 3 0 0 0-3 3m0 0c-.715.406-1.5.637-2.318.72M15 15.75c.715.406 1.5.637 2.318.72M9 12.75a3 3 0 0 0-3 3m6 0a3 3 0 0 0 3-3" />
  </svg>
);

export default UsersIcon;