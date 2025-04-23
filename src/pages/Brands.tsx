import React from 'react';
import { phoneData } from '../data/phoneData';
import PhoneCard from '../components/PhoneCard';
import { PhoneDetailModal } from '../components/PhoneDetailModal';
import { PhoneType } from '../types/phoneTypes';

const Brands: React.FC = () => {
  const [selectedPhone, setSelectedPhone] = React.useState<PhoneType | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  // Group phones by brand
  const phonesByBrand = phoneData.reduce((acc, phone) => {
    if (!acc[phone.brand]) {
      acc[phone.brand] = [];
    }
    acc[phone.brand].push(phone);
    return acc;
  }, {} as Record<string, PhoneType[]>);

  const handlePhoneSelect = (phone: PhoneType) => {
    setSelectedPhone(phone);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPhone(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">All Phones by Brand</h1>
      
      <div className="space-y-12">
        {Object.entries(phonesByBrand).map(([brand, phones]) => (
          <div key={brand} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="border-b border-gray-200 bg-gray-50 p-4">
              <h2 className="text-xl font-semibold text-gray-800">{brand}</h2>
              <p className="text-sm text-gray-600 mt-1">
                {phones.length} model{phones.length !== 1 ? 's' : ''} available
              </p>
            </div>
            
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {phones.map((phone) => (
                  <PhoneCard
                    key={`${phone.brand}-${phone.model}`}
                    phone={phone}
                    onClick={() => handlePhoneSelect(phone)}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && selectedPhone && (
        <PhoneDetailModal 
          phone={selectedPhone} 
          onClose={closeModal} 
        />
      )}
    </div>
  );
};

export default Brands;