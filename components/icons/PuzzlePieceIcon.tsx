import React from 'react';
import type { IconProps } from '../../types';

const PuzzlePieceIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 7.756a4.5 4.5 0 1 0 0 8.488M7.5 10.5H5.25A2.25 2.25 0 0 0 3 12.75v4.5A2.25 2.25 0 0 0 5.25 19.5h4.5A2.25 2.25 0 0 0 12 17.25v-4.5A2.25 2.25 0 0 0 9.75 10.5M14.25 7.756C14.25 6.637 13.624 5.625 12.75 5.006M14.25 7.756c0 .533.092 1.052.264 1.536M14.25 16.244c0-.533-.092-1.052-.264-1.536M7.5 10.5a4.501 4.501 0 0 0-2.436 1.107M7.5 10.5C9.38 10.5 10.5 9.38 10.5 7.5M7.5 10.5c0 1.88-.988 3.064-2.436 3.794M12 17.25c.876-.62 1.5-1.631 1.5-2.756M12 17.25C10.12 17.25 9 18.38 9 20.25M12 17.25c1.88 0 3.064-.988 3.794-2.436M12 17.25c-.876.62-1.5 1.631-1.5 2.756m0 0c0 .876.624 1.88 1.5 2.436M14.25 16.244c.172.484.264 1.003.264 1.536M18.75 10.5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z" />
  </svg>
);

export default PuzzlePieceIcon;