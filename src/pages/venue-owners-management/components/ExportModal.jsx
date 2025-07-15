import React, { useState } from 'react';
import { X, Download, FileText, FileSpreadsheet } from 'lucide-react';
import { format } from 'date-fns';

const ExportModal = ({ venueOwners, selectedVenueOwners, onClose }) => {
  const [exportFormat, setExportFormat] = useState('csv');
  const [exportScope, setExportScope] = useState('selected');
  const [includeFields, setIncludeFields] = useState({
    basicInfo: true,
    contactInfo: true,
    businessInfo: true,
    performanceData: true,
    financialData: false
  });

  const handleExport = () => {
    try {
      const ownersToExport = exportScope === 'selected' 
        ? venueOwners?.filter(owner => selectedVenueOwners?.includes(owner?.id))
        : venueOwners;

      if (!ownersToExport?.length) {
        alert('No venue owners to export');
        return;
      }

      const exportData = ownersToExport?.map(owner => {
        const data = {};
        
        if (includeFields?.basicInfo) {
          data['Full Name'] = owner?.full_name || '';
          data['Email'] = owner?.email || '';
          data['Role'] = owner?.role || '';
        }
        
        if (includeFields?.contactInfo) {
          data['Phone'] = owner?.phone || '';
          data['Location'] = owner?.location || '';
        }
        
        if (includeFields?.businessInfo) {
          data['Properties Count'] = owner?.venues?.length || 0;
          data['Active Venues'] = owner?.venues?.filter(v => v?.is_active)?.length || 0;
          data['Verification Status'] = owner?.venues?.length > 0 ? 'Verified' : 'Pending';
          data['Registration Date'] = owner?.created_at ? format(new Date(owner.created_at), 'yyyy-MM-dd') : '';
        }
        
        if (includeFields?.performanceData) {
          const venues = owner?.venues || [];
          const totalRating = venues?.reduce((sum, venue) => sum + (venue?.rating || 0), 0);
          const totalReviews = venues?.reduce((sum, venue) => sum + (venue?.review_count || 0), 0);
          const avgRating = venues?.length > 0 ? (totalRating / venues?.length).toFixed(1) : 0;
          
          data['Average Rating'] = avgRating;
          data['Total Reviews'] = totalReviews;
          data['Total Bookings'] = owner?.total_bookings?.[0]?.count || 0;
        }
        
        if (includeFields?.financialData) {
          data['Total Revenue'] = owner?.total_revenue?.[0]?.sum || 0;
          data['Average Booking Value'] = owner?.total_bookings?.[0]?.count > 0 
            ? ((owner?.total_revenue?.[0]?.sum || 0) / owner?.total_bookings?.[0]?.count).toFixed(2)
            : 0;
          data['Revenue Per Property'] = owner?.venues?.length > 0 
            ? ((owner?.total_revenue?.[0]?.sum || 0) / owner?.venues?.length).toFixed(2)
            : 0;
        }
        
        return data;
      });

      if (exportFormat === 'csv') {
        exportToCSV(exportData);
      } else {
        exportToJSON(exportData);
      }
      
      onClose?.();
    } catch (error) {
      console.log('Export error:', error);
      alert('Export failed. Please try again.');
    }
  };

  const exportToCSV = (data) => {
    if (!data?.length) return;
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers?.join(','),
      ...data?.map(row => 
        headers?.map(header => {
          const value = row[header] || '';
          return typeof value === 'string' && value?.includes(',') 
            ? `"${value}"` 
            : value;
        })?.join(',')
      )
    ]?.join('\n');

    downloadFile(csvContent, 'venue-owners-export.csv', 'text/csv');
  };

  const exportToJSON = (data) => {
    const jsonContent = JSON.stringify(data, null, 2);
    downloadFile(jsonContent, 'venue-owners-export.json', 'application/json');
  };

  const downloadFile = (content, filename, contentType) => {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleFieldToggle = (field) => {
    setIncludeFields(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          {/* Header */}
          <div className="bg-white px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Export Venue Owners</h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white px-6 py-6 space-y-6">
            {/* Export Scope */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Export Scope
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="exportScope"
                    value="selected"
                    checked={exportScope === 'selected'}
                    onChange={(e) => setExportScope(e.target.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Selected venue owners ({selectedVenueOwners?.length || 0})
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="exportScope"
                    value="all"
                    checked={exportScope === 'all'}
                    onChange={(e) => setExportScope(e.target.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    All venue owners ({venueOwners?.length || 0})
                  </span>
                </label>
              </div>
            </div>

            {/* Export Format */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Export Format
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="exportFormat"
                    value="csv"
                    checked={exportFormat === 'csv'}
                    onChange={(e) => setExportFormat(e.target.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <FileSpreadsheet className="h-5 w-5 ml-2 mr-2 text-green-500" />
                  <span className="text-sm font-medium">CSV</span>
                </label>
                <label className="flex items-center p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="exportFormat"
                    value="json"
                    checked={exportFormat === 'json'}
                    onChange={(e) => setExportFormat(e.target.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <FileText className="h-5 w-5 ml-2 mr-2 text-blue-500" />
                  <span className="text-sm font-medium">JSON</span>
                </label>
              </div>
            </div>

            {/* Fields to Include */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Fields to Include
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={includeFields?.basicInfo}
                    onChange={() => handleFieldToggle('basicInfo')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Basic Information (Name, Email, Role)</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={includeFields?.contactInfo}
                    onChange={() => handleFieldToggle('contactInfo')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Contact Information (Phone, Location)</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={includeFields?.businessInfo}
                    onChange={() => handleFieldToggle('businessInfo')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Business Information (Properties, Verification)</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={includeFields?.performanceData}
                    onChange={() => handleFieldToggle('performanceData')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Performance Data (Ratings, Reviews, Bookings)</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={includeFields?.financialData}
                    onChange={() => handleFieldToggle('financialData')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Financial Data (Revenue, Booking Values)</span>
                </label>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-3 sm:flex sm:flex-row-reverse">
            <button
              onClick={handleExport}
              className="w-full inline-flex justify-center items-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
            <button
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;