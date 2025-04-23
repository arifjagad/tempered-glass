import React, { useEffect, useRef } from 'react';
import { PhoneType } from '../types/phoneTypes';
import { X, ExternalLink, Download } from 'lucide-react';

interface PhoneDetailModalProps {
  phone: PhoneType;
  onClose: () => void;
}

const PhoneDetailModal: React.FC<PhoneDetailModalProps> = ({ phone, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div 
        ref={modalRef}
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-fadeIn"
      >
        <div className="flex justify-between items-center p-5 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            {phone.brand} {phone.model}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center justify-center bg-gray-50 rounded-xl p-6">
              <img 
                src={phone.imageUrl} 
                alt={`${phone.brand} ${phone.model}`} 
                className="max-h-56 object-contain"
              />
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Display</h3>
                <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
                  <div className="flex justify-between py-3 px-4">
                    <span className="text-sm text-gray-600">Screen Size</span>
                    <span className="text-sm font-medium text-gray-900">{phone.screenSize}</span>
                  </div>
                  <div className="flex justify-between py-3 px-4">
                    <span className="text-sm text-gray-600">Resolution</span>
                    <span className="text-sm font-medium text-gray-900">{phone.resolution}</span>
                  </div>
                  <div className="flex justify-between py-3 px-4">
                    <span className="text-sm text-gray-600">Screen-to-body</span>
                    <span className="text-sm font-medium text-gray-900">{phone.screenToBody}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Physical Specs</h3>
                <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
                  <div className="flex justify-between py-3 px-4">
                    <span className="text-sm text-gray-600">Dimensions</span>
                    <span className="text-sm font-medium text-gray-900">{phone.dimensions}</span>
                  </div>
                  <div className="flex justify-between py-3 px-4">
                    <span className="text-sm text-gray-600">Camera Position</span>
                    <span className="text-sm font-medium text-gray-900">{phone.cameraPosition}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="flex items-center mb-3">
              <div className="h-px flex-1 bg-gray-200"></div>
              <span className="px-3 text-sm text-gray-500">Additional Information</span>
              <div className="h-px flex-1 bg-gray-200"></div>
            </div>
            
            <p className="text-sm text-gray-600 mt-2">
              This information was collected from GSMArena and processed to identify key specifications. The 
              camera position was determined through image classification based on the phone's appearance.
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-200 p-4 flex justify-between">
          <a 
            href={phone.gsmarenaUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
          >
            View on GSMArena <ExternalLink className="h-4 w-4 ml-1" />
          </a>
          
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm flex items-center">
            Export Data <Download className="h-4 w-4 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhoneDetailModal;