import React from 'react';
import { Smartphone } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Smartphone className="h-6 w-6 text-blue-600" />
            <span className="font-bold text-xl text-gray-800">PhoneSpecs</span>
          </div>
          <nav className="hidden md:flex space-x-6">
            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">Home</a>
            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">Database</a>
            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">Compare</a>
            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">About</a>
          </nav>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm">
            Export Data
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;