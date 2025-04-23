import React, { useState, useEffect } from 'react';
import { Search, Smartphone, X } from 'lucide-react';
import Header from './components/Header';
import PhoneCard from './components/PhoneCard';
import PhoneDetailModal from './components/PhoneDetailModal';
import Footer from './components/Footer';
import { phoneData } from './data/phoneData';
import { PhoneType } from './types/phoneTypes';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPhones, setFilteredPhones] = useState<PhoneType[]>([]);
  const [selectedPhone, setSelectedPhone] = useState<PhoneType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredPhones([]);
    } else {
      const filtered = phoneData.filter(phone => 
        `${phone.brand} ${phone.model}`.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPhones(filtered);
    }
  }, [searchQuery]);

  const handlePhoneSelect = (phone: PhoneType) => {
    setSelectedPhone(phone);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPhone(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm"
              placeholder="Search for phones (e.g., Samsung A01, Xiaomi Redmi 9A)"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
        </div>

        {searchQuery.trim() === '' ? (
          <div className="text-center py-10">
            <Smartphone className="h-16 w-16 mx-auto text-blue-500 mb-4" />
            <h2 className="text-xl font-medium text-gray-700 mb-2">Search for Phone Specifications</h2>
            <p className="text-gray-500 max-w-md mx-auto">
              Enter a phone model to see detailed specifications from PhoneArena including screen size, resolution, and camera positions.
            </p>
          </div>
        ) : filteredPhones.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">No phones found matching "{searchQuery}"</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPhones.map((phone) => (
              <PhoneCard 
                key={`${phone.brand}-${phone.model}`}
                phone={phone}
                onClick={() => handlePhoneSelect(phone)}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
      
      {isModalOpen && selectedPhone && (
        <PhoneDetailModal 
          phone={selectedPhone} 
          onClose={closeModal} 
        />
      )}
    </div>
  );
}

export default App;