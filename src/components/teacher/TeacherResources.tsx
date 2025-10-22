import React, { useState, useEffect } from 'react';
import { FileText, Image, Download, Search, Filter } from 'lucide-react';
import { useData } from '@/contexts/DataContext';

const TeacherResources: React.FC = () => {
  const { resources, markResourceViewed } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'pdf' | 'image'>('all');

  const resourceFiles = resources.filter(r => r.category === 'resource');

  // Auto-mark all resources as viewed when component mounts
  useEffect(() => {
    resourceFiles.forEach(resource => {
      markResourceViewed(resource.id);
    });
  }, [resourceFiles, markResourceViewed]);

  const filteredResources = resourceFiles.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.fileName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || resource.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleDownload = (resource: any) => {
    try {
      // Create a temporary link element for download
      const link = document.createElement('a');
      link.href = resource.fileUrl;
      link.download = resource.fileName;
      link.target = '_blank';
      
      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Show success message
      console.log(`Downloading ${resource.fileName}...`);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
<div className="text-center space-y-2">
  <h3 className="text-3xl font-serif font-bold text-pink-700 tracking-wide">
    Educational Resources
  </h3>
  <p className="text-gray-600">
    Access teaching materials and resources uploaded by admin
  </p>
</div>


      {/* Search and Filter */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="border border-gray-300 rounded-lg px-3 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="pdf">PDF Documents</option>
              <option value="image">Images</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex justify-center">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
          <div className="bg-blue-100 p-2 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
            <FileText className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">{resourceFiles.length}</h3>
          <p className="text-gray-600 text-sm">Total Resources</p>
        </div>
      </div>

      {/* Resources List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900">
            Available Resources ({filteredResources.length})
          </h4>
        </div>
        
        {filteredResources.length === 0 ? (
          <div className="p-8 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              {searchTerm || filterType !== 'all' ? 'No resources match your search' : 'No resources available yet'}
            </p>
            <p className="text-gray-400 text-sm">
              {searchTerm || filterType !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Resources uploaded by admin will appear here'
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredResources
              .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
              .map((resource) => (
                <div key={resource.id} className="px-6 py-4 hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="bg-blue-100 p-2 rounded-full">
                        {resource.type === 'pdf' ? (
                          <FileText className="h-6 w-6 text-blue-600" />
                        ) : (
                          <Image className="h-6 w-6 text-blue-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-lg font-medium text-gray-900 truncate">{resource.title}</h5>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                          <span>{resource.fileName}</span>
                          <span>Uploaded: {new Date(resource.uploadedAt).toLocaleDateString()}</span>
                          <span className="capitalize bg-gray-100 px-2 py-1 rounded-full text-xs">
                            {resource.type}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleDownload(resource)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Usage Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-blue-900 mb-3">How to Use Resources</h4>
        <ul className="space-y-2 text-blue-800 text-sm">
          <li>• Click the "Download" button to save resources to your device</li>
          <li>• Use the search bar to quickly find specific resources</li>
          <li>• Filter by file type (PDF or Image) to narrow your results</li>
          <li>• Resources are uploaded by admin and updated regularly</li>
          <li>• Downloaded files can be used offline for teaching preparation</li>
        </ul>
      </div>
    </div>
  );
};

export default TeacherResources;