import React from 'react';
import { PhoneType } from '../types/phoneTypes';
import { ChevronRight } from 'lucide-react';

interface PhoneCardProps {
  phone: PhoneType;
  onClick: () => void;
}

const PhoneCard: React.FC<PhoneCardProps> = ({ phone, onClick }) => {
  return (
    <div 
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300 cursor-pointer"
      onClick={onClick}
    >
      <div className="relative h-48 bg-gray-100 overflow-hidden flex items-center justify-center">
        <img 
          src={phone.imageUrl} 
          alt={`${phone.brand} ${phone.model}`}
          className="w-32 object-contain"
        />
        <div 
          className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 text-xs font-medium"
        >
          Camera: {phone.cameraPosition}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-2">
          {phone.brand} {phone.model}
        </h3>
        <div className="space-y-1 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Screen:</span>
            <span className="text-gray-800">{phone.screenSize}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Resolution:</span>
            <span className="text-gray-800">{phone.resolution}</span>
          </div>
        </div>
        <button className="w-full flex items-center justify-center text-blue-600 text-sm font-medium mt-2 py-1 hover:text-blue-800 transition-colors duration-200">
          View Details <ChevronRight className="h-4 w-4 ml-1" />
        </button>
      </div>
    </div>
  );
};

export default PhoneCard;