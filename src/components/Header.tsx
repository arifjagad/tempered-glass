import React from 'react';
import { Smartphone } from 'lucide-react';

interface HeaderProps {
  currentPage: 'search' | 'categories' | 'brands';
  onPageChange: (page: 'search' | 'categories' | 'brands') => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, onPageChange }) => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Smartphone className="h-6 w-6 text-blue-600" />
            <span className="font-bold text-xl text-gray-800">PhoneSpecs</span>
          </div>
          <nav className="flex space-x-6">
            <button
              onClick={() => onPageChange('search')}
              className={`text-gray-600 hover:text-blue-600 transition-colors duration-200 ${
                currentPage === 'search' ? 'text-blue-600 font-medium' : ''
              }`}
            >
              Search
            </button>
            <button
              onClick={() => onPageChange('brands')}
              className={`text-gray-600 hover:text-blue-600 transition-colors duration-200 ${
                currentPage === 'brands' ? 'text-blue-600 font-medium' : ''
              }`}
            >
              Brands
            </button>
            <button
              onClick={() => onPageChange('categories')}
              className={`text-gray-600 hover:text-blue-600 transition-colors duration-200 ${
                currentPage === 'categories' ? 'text-blue-600 font-medium' : ''
              }`}
            >
              Categories
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;