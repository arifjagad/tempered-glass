import React from 'react';
import { phoneGroups } from '../utils/phoneGroups';
import { Download } from 'lucide-react';

const Categories: React.FC = () => {
  const handleExport = () => {
    const csvContent = phoneGroups.map(group => {
      const header = `\nGroup: ${group.name}\n`;
      const phones = group.phones.map(phone => `${group.id},${phone.brand} ${phone.model}`).join('\n');
      return header + phones;
    }).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'phone-groups.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Phone Categories</h1>
        <button
          onClick={handleExport}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Export Groups
        </button>
      </div>

      <div className="space-y-8">
        {phoneGroups.map((group) => (
          <div
            key={group.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
          >
            <div className="border-b border-gray-200 bg-gray-50 p-4">
              <h2 className="text-lg font-semibold text-gray-800">{group.name}</h2>
              <p className="text-sm text-gray-600 mt-1">{group.description}</p>
            </div>
            
            <div className="divide-y divide-gray-200">
              {group.phones.map((phone) => (
                <div
                  key={`${phone.brand}-${phone.model}`}
                  className="p-4 hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-800">
                        {phone.brand} {phone.model}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {phone.screenSize} • {phone.dimensions}
                      </p>
                    </div>
                    <div className="text-sm text-gray-500">
                      Group ID: {group.id}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;