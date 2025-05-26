
import React from 'react';
import type { IconProps } from '../../types';

const ChatBubbleLeftRightIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3.68-3.091a4.501 4.501 0 0 0-3.022-.987H8.25c-1.136 0-2.1-.847-2.193-1.98a4.5 4.5 0 0 1-.072-1.02V8.25c0-1.136.847-2.1 1.98-2.193.34-.027.68-.052 1.02-.072m0 0c-.884-.284-1.5-1.128-1.5-2.097V4.286c0-1.136.847-2.1 1.98-2.193.34-.027.68-.052 1.02-.072V.75a.75.75 0 0 1 .75-.75H13.5a.75.75 0 0 1 .75.75v.75c.34.02.68.045 1.02.072a2.1 2.1 0 0 1 2.193 1.98V4.286c0 .97-.616 1.813-1.5 2.097M14.25 7.5c0 .344-.028.684-.083 1.012a2.69 2.69 0 0 1-.083 1.012M18.75 7.5c.884.284 1.5 1.128 1.5 2.097V14.5c0 .603-.223 1.163-.616 1.604a.75.75 0 0 1-1.232-.704V8.25c0-.603.223-1.163.616-1.604a.75.75 0 0 1 1.232.704Z" />
  </svg>
);

export default ChatBubbleLeftRightIcon;
