import React from 'react';
import InfoIcon from './icons/InfoIcon';
import IconButton from './IconButton'; // Using IconButton for consistency
import CloseIcon from './icons/CloseIcon';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
}

const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  showCloseButton = true 
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-md',
    lg: 'sm:max-w-lg',
    xl: 'sm:max-w-xl',
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-brand-gray-950 bg-opacity-80 transition-opacity duration-300 ease-in-out animate-fade-in"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      onClick={onClose} // Close on overlay click
    >
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div 
          className={`inline-block align-bottom bg-brand-gray-900 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-dialog transform transition-all sm:my-8 sm:align-middle w-full ${sizeClasses[size]} sm:p-6 border border-brand-gray-700 animate-fade-in-up`}
          onClick={e => e.stopPropagation()} // Prevent close on modal content click
        >
          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-brand-premium-blue bg-opacity-10 sm:mx-0">
              <InfoIcon className="h-6 w-6 text-brand-premium-blue" />
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex-grow">
              <h3 className="text-lg leading-6 font-semibold text-brand-gray-50" id="modal-title">
                {title}
              </h3>
            </div>
            {showCloseButton && (
              <div className="sm:ml-4 flex-shrink-0">
                 <IconButton 
                    icon={<CloseIcon className="w-5 h-5"/>}
                    onClick={onClose}
                    variant="ghost"
                    size="sm"
                    aria-label="Close modal"
                    className="text-brand-gray-400 hover:text-brand-gray-200"
                />
              </div>
            )}
          </div>
           <div className="mt-4 ml-0 sm:ml-14"> {/* Aligns content with title text */}
            <div className="text-sm text-brand-gray-300 leading-relaxed">
              {children}
            </div>
          </div>
          <div className="mt-6 sm:mt-5 sm:flex sm:flex-row-reverse">
            <IconButton
              label="OK"
              onClick={onClose}
              variant="primary"
              size="md"
              className="w-full sm:w-auto sm:ml-3"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;