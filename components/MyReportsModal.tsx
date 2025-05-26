import React from 'react';
import Modal from './Modal';
import type { MyReportItem, ReportData } from '../types'; 
import { CONFIDENCE_TEXT_COLORS } from '../constants';
import IconButton from './IconButton';
import CheckCircleIcon from './icons/CheckCircleIcon';
import ShareIcon from './icons/ShareIcon'; 

interface MyReportsModalProps { 
  isOpen: boolean;
  onClose: () => void;
  myReportItems: MyReportItem[]; 
  onSelectMyReportItem: (reportData: ReportData) => void; 
}

const MyReportsModal: React.FC<MyReportsModalProps> = ({ isOpen, onClose, myReportItems, onSelectMyReportItem }) => {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString(undefined, { 
        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="My Reports (Current Session)" size="xl"> 
      {myReportItems.length === 0 ? (
        <p className="text-brand-gray-400 text-center py-4">No reports generated in this session yet.</p>
      ) : (
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
          {myReportItems.map((item) => (
            <div 
              key={item.id} 
              className="p-3 bg-brand-gray-800 rounded-md border border-brand-gray-700 hover:border-brand-premium-blue transition-colors group"
            >
              <div className="flex justify-between items-center">
                <div className="flex-grow mr-2 min-w-0"> 
                  <p className="text-sm font-semibold text-brand-gray-100 truncate " title={item.claim}>{item.claim}</p>
                  <p className={`text-xs ${CONFIDENCE_TEXT_COLORS[item.confidenceScore] || 'text-brand-gray-400'}`}>
                    Confidence: {item.confidenceScore}
                  </p>
                   <p className="text-xs text-brand-gray-500 mt-0.5">{formatDate(item.timestamp)}</p>
                </div>
                <div className="flex items-center flex-shrink-0 space-x-2">
                  <div data-tooltip="Share with team - Available on Pro Plan">
                    <IconButton
                      icon={<ShareIcon className="w-4 h-4"/>}
                      onClick={(e) => e.stopPropagation()} 
                      variant="ghost"
                      size="sm"
                      className="opacity-50 group-hover:opacity-80 transition-opacity"
                      disabled={true}
                      aria-label="Share report (Pro Feature)"
                    />
                  </div>
                  <IconButton
                    icon={<CheckCircleIcon className="w-4 h-4"/>}
                    label="View"
                    onClick={() => onSelectMyReportItem(item.fullReportData)}
                    variant="ghost"
                    size="sm"
                    className="opacity-70 group-hover:opacity-100 transition-opacity"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
};

export default MyReportsModal;