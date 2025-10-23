import React, { useState } from 'react';
import { Plus, FileText, Image, Download, Trash2, Upload, Eye, X } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';

const AdminResources: React.FC = () => {
  const { resources, addResource, deleteResource } = useData();
  const { currentUser } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    type: 'pdf' as 'pdf' | 'image'
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [viewingResource, setViewingResource] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.title.trim() && selectedFile) {
      try {
        await addResource({
          title: formData.title.trim(),
          fileName: selectedFile.name,
          fileUrl: '', // Will be set by addResource function
          type: formData.type,
          uploadedBy: currentUser?.username || 'admin',
          uploadedAt: new Date().toISOString(),
          category: 'resource'
        }, selectedFile);

        setFormData({ title: '', type: 'pdf' });
        setSelectedFile(null);
        setShowAddForm(false);
      } catch (error) {
        console.error('Error adding resource:', error);
        alert('Failed to upload resource. Please try again.');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewFile(file);
      if (file.type.startsWith('image/')) {
        setFormData(prev => ({ ...prev, type: 'image' }));
      } else {
        setFormData(prev => ({ ...prev, type: 'pdf' }));
      }
    }
  };

  const handlePreviewFile = () => {
    if (previewFile) {
      const url = URL.createObjectURL(previewFile);
      window.open(url, '_blank');
    }
  };

  const handleViewResource = (resource: any) => {
    setViewingResource(resource);
  };

  const closeViewModal = () => {
    setViewingResource(null);
  };

  const handleDownload = (resource: any) => {
    const link = document.createElement('a');
    link.href = resource.fileUrl;
    link.download = resource.fileName;
    link.click();
  };

  const handleDelete = (resourceId: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteResource(resourceId);
    }
  };

  const resourcesByType = resources.filter(r => r.category === 'resource');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col items-center text-center space-y-2">
        <h3 className="text-3xl font-bold text-pink-700">Resources Management</h3>
        <p className="text-gray-600">Upload and manage educational resources for teachers</p>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition-colors duration-200 flex items-center space-x-2 mt-4"
        >
          <Plus className="h-5 w-5" />
          <span>Add Resource</span>
        </button>
      </div>

      {/* Add Resource Form */}
      {showAddForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-lg">
          <h4 className="text-xl font-semibold text-pink-700 mb-6 text-center">Add New Resource</h4>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Resource Title *
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Enter resource title"
                required
              />
            </div>

            {/* Upload */}
            <div>
              <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
                Upload File *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-pink-400 transition-colors duration-200">
                <input
                  type="file"
                  id="file"
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png,.gif"
                  className="hidden"
                  required
                />
                <label htmlFor="file" className="cursor-pointer block">
                  <Upload className="h-12 w-12 text-pink-500 mx-auto mb-4" />
                  <p className="text-gray-700 font-medium mb-1">Click to upload file</p>
                  <p className="text-sm text-gray-500">PDF, JPG, PNG, GIF up to 10MB</p>
                </label>
                {selectedFile && (
                  <div className="mt-4 p-4 bg-pink-50 border border-pink-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-pink-800 font-semibold">{selectedFile.name}</p>
                        <p className="text-pink-600 text-sm">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handlePreviewFile}
                        className="bg-pink-600 text-white px-3 py-1 rounded-lg hover:bg-pink-700 transition-colors duration-200 flex items-center space-x-1"
                      >
                        <Eye className="h-4 w-4" />
                        <span>Preview</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* File Type */}
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                File Type
              </label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'pdf' | 'image' })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="pdf">PDF Document</option>
                <option value="image">Image</option>
              </select>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-center space-x-6">
              <button
                type="submit"
                className="bg-pink-600 text-white px-8 py-2 rounded-lg hover:bg-pink-700 transition-colors duration-200 font-medium"
              >
                Upload Resource
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setFormData({ title: '', type: 'pdf' });
                  setSelectedFile(null);
                }}
                className="bg-gray-500 text-white px-8 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-200 font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Resources List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900">
            Uploaded Resources ({resourcesByType.length})
          </h4>
        </div>

        {resourcesByType.length === 0 ? (
          <div className="p-10 text-center">
            <FileText className="h-14 w-14 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No resources uploaded yet</p>
            <p className="text-gray-400 text-sm">Click "Add Resource" to get started</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {resourcesByType.map((resource) => (
              <div key={resource.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div className="bg-pink-100 p-2 rounded-full">
                    {resource.type === 'pdf' ? (
                      <FileText className="h-6 w-6 text-pink-600" />
                    ) : (
                      <Image className="h-6 w-6 text-pink-600" />
                    )}
                  </div>
                  <div>
                    <h5 className="text-lg font-medium text-gray-900">{resource.title}</h5>
                    <div className="flex flex-wrap items-center space-x-3 text-sm text-gray-500">
                      <span>{resource.fileName}</span>
                      <span>Uploaded: {new Date(resource.uploadedAt).toLocaleDateString()}</span>
                      <span className="capitalize bg-gray-100 px-2 py-1 rounded-full text-xs">
                        {resource.type}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleViewResource(resource)}
                    className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                    title="View"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDownload(resource)}
                    className="text-pink-600 hover:text-pink-800 p-2 rounded-lg hover:bg-pink-50 transition-colors duration-200"
                    title="Download"
                  >
                    <Download className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(resource.id, resource.title)}
                    className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors duration-200"
                    title="Delete"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* View Resource Modal */}
      {viewingResource && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">View Resource</h3>
              <button
                onClick={closeViewModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="mb-4">
              <h4 className="text-lg font-medium text-gray-900 mb-2">{viewingResource.title}</h4>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>{viewingResource.fileName}</span>
                <span>Uploaded: {new Date(viewingResource.uploadedAt).toLocaleDateString()}</span>
                <span className="capitalize bg-gray-100 px-2 py-1 rounded-full text-xs">
                  {viewingResource.type}
                </span>
              </div>
            </div>

            <div className="border rounded-lg p-4 bg-gray-50">
              {viewingResource.type === 'image' ? (
                <img
                  src={viewingResource.fileUrl}
                  alt={viewingResource.title}
                  className="max-w-full max-h-96 mx-auto"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling!.style.display = 'block';
                  }}
                />
              ) : (
                <iframe
                  src={viewingResource.fileUrl}
                  className="w-full h-96 border-0"
                  title={viewingResource.title}
                />
              )}
              <div style={{ display: 'none' }} className="text-center text-gray-500">
                <p>Unable to preview this file type</p>
                <p className="text-sm">Please download the file to view it</p>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 mt-4">
              <button
                onClick={() => handleDownload(viewingResource)}
                className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors duration-200 flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Download</span>
              </button>
              <button
                onClick={closeViewModal}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminResources;
