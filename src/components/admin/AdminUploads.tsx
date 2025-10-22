import React, { useState } from 'react';
import { FileText, Clock, CheckCircle, MessageSquare, Trash2, Eye, Download, X } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { motion } from 'framer-motion';

const AdminUploads: React.FC = () => {
  const { uploads, markUpload, clearAllUploads } = useData();
  const [selectedUpload, setSelectedUpload] = useState<string | null>(null);
  const [viewingUpload, setViewingUpload] = useState<string | null>(null);
  const [markingData, setMarkingData] = useState({
    comments: '',
    grade: ''
  });

  const handleMarkSubmit = (uploadId: string) => {
    if (markingData.comments.trim()) {
      markUpload(uploadId, markingData.comments.trim(), markingData.grade || undefined);
      setSelectedUpload(null);
      setMarkingData({ comments: '', grade: '' });
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all uploads? This action cannot be undone.')) {
      clearAllUploads();
    }
  };

  const handleViewFile = (upload: any) => {
    setViewingUpload(upload.id);
  };

  const handleDownloadFile = (upload: any) => {
    try {
      const link = document.createElement('a');
      link.href = upload.fileUrl;
      link.download = upload.fileName;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
    }
  };

  const getFileType = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (['pdf'].includes(extension || '')) return 'pdf';
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension || '')) return 'image';
    if (['doc', 'docx'].includes(extension || '')) return 'document';
    if (['txt'].includes(extension || '')) return 'text';
    return 'unknown';
  };

  const pendingUploads = uploads.filter(u => u.status === 'pending');
  const markedUploads = uploads.filter(u => u.status === 'marked');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <motion.h3
          className="text-3xl font-bold text-pink-700 font-sans"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Teacher Uploads
        </motion.h3>
        <p className="text-gray-600 mt-1">
          Review and mark lesson plans and progress reports
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-full">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{pendingUploads.length}</p>
              <p className="text-gray-600">Pending Review</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{markedUploads.length}</p>
              <p className="text-gray-600">Marked</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{uploads.length}</p>
              <p className="text-gray-600">Total Uploads</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Uploads */}
      {pendingUploads.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 bg-yellow-50 flex items-center justify-between">
            <h4 className="text-lg font-semibold text-yellow-800 flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Pending Review ({pendingUploads.length})</span>
            </h4>
            {uploads.length > 0 && (
              <button
                onClick={handleClearHistory}
                className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center space-x-1 text-sm"
              >
                <Trash2 className="h-4 w-4" />
                <span>Clear All</span>
              </button>
            )}
          </div>
          
          <div className="divide-y divide-gray-200">
            {pendingUploads.map((upload) => (
              <div key={upload.id} className="px-6 py-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900">{upload.teacherName}</h5>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="capitalize">{upload.type.replace('-', ' ')}</span>
                        <span>{upload.fileName}</span>
                        <span>{new Date(upload.uploadedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                    <button
                      onClick={() => handleViewFile(upload)}
                      className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-1"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View</span>
                    </button>
                    <button
                      onClick={() => handleDownloadFile(upload)}
                      className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center justify-center space-x-1"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download</span>
                    </button>
                    <button
                      onClick={() => setSelectedUpload(upload.id)}
                      className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors duration-200"
                    >
                      Mark & Comment
                    </button>
                  </div>
                </div>
                
                {selectedUpload === upload.id && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h6 className="font-medium text-gray-900 mb-3">Mark this submission</h6>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Grade (Optional)
                        </label>
                        <select
                          value={markingData.grade}
                          onChange={(e) => setMarkingData({ ...markingData, grade: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        >
                          <option value="">Select grade</option>
                          <option value="Excellent">Excellent</option>
                          <option value="Very Good">Very Good</option>
                          <option value="Good">Good</option>
                          <option value="Satisfactory">Satisfactory</option>
                          <option value="Needs Improvement">Needs Improvement</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Comments *
                        </label>
                        <textarea
                          value={markingData.comments}
                          onChange={(e) => setMarkingData({ ...markingData, comments: e.target.value })}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                          placeholder="Provide feedback and comments..."
                          required
                        />
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleMarkSubmit(upload.id)}
                          className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors duration-200"
                        >
                          Submit Marking
                        </button>
                        <button
                          onClick={() => {
                            setSelectedUpload(null);
                            setMarkingData({ comments: '', grade: '' });
                          }}
                          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-200"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Marked Uploads */}
      {markedUploads.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 bg-pink-50 flex items-center justify-between">
            <h4 className="text-lg font-semibold text-pink-800 flex items-center space-x-2">
              <CheckCircle className="h-5 w-5" />
              <span>Marked Submissions ({markedUploads.length})</span>
            </h4>
            {uploads.length > 0 && (
              <button
                onClick={handleClearHistory}
                className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center space-x-1 text-sm"
              >
                <Trash2 className="h-4 w-4" />
                <span>Clear All</span>
              </button>
            )}
          </div>
          
          <div className="divide-y divide-gray-200">
            {markedUploads.map((upload) => (
              <div key={upload.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-pink-100 p-2 rounded-full">
                      <CheckCircle className="h-5 w-5 text-pink-600" />
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900">{upload.teacherName}</h5>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="capitalize">{upload.type.replace('-', ' ')}</span>
                        <span>{upload.fileName}</span>
                        <span>{new Date(upload.uploadedAt).toLocaleDateString()}</span>
                        {upload.grade && (
                          <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded-full text-xs font-medium">
                            {upload.grade}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                    <button
                      onClick={() => handleViewFile(upload)}
                      className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-1"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View</span>
                    </button>
                    <button
                      onClick={() => handleDownloadFile(upload)}
                      className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center justify-center space-x-1"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
                
                {upload.comments && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-start space-x-2">
                      <MessageSquare className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-700 text-sm">{upload.comments}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {uploads.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No uploads yet</p>
          <p className="text-gray-400 text-sm">Teacher submissions will appear here</p>
        </div>
      )}

      {/* File Preview Modal */}
      {viewingUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {uploads.find(u => u.id === viewingUpload)?.fileName}
              </h3>
              <button
                onClick={() => setViewingUpload(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-4 overflow-auto max-h-[calc(90vh-80px)]">
              {(() => {
                const upload = uploads.find(u => u.id === viewingUpload);
                if (!upload) return null;
                
                const fileType = getFileType(upload.fileName);
                
                return (
                  <div className="space-y-4">
                    {/* File Info */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Teacher:</span>
                          <span className="ml-2 text-gray-900">{upload.teacherName}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Type:</span>
                          <span className="ml-2 text-gray-900 capitalize">{upload.type.replace('-', ' ')}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Uploaded:</span>
                          <span className="ml-2 text-gray-900">{new Date(upload.uploadedAt).toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Status:</span>
                          <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                            upload.status === 'pending' 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {upload.status === 'pending' ? 'Pending Review' : 'Marked'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* File Preview */}
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      {fileType === 'pdf' && (
                        <iframe
                          src={upload.fileUrl}
                          className="w-full h-96"
                          title={upload.fileName}
                        />
                      )}
                      
                      {fileType === 'image' && (
                        <img
                          src={upload.fileUrl}
                          alt={upload.fileName}
                          className="w-full h-auto max-h-96 object-contain"
                        />
                      )}
                      
                      {fileType === 'document' && (
                        <div className="p-8 text-center">
                          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600 mb-4">Document preview not available</p>
                          <button
                            onClick={() => handleDownloadFile(upload)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2 mx-auto"
                          >
                            <Download className="h-4 w-4" />
                            <span>Download to View</span>
                          </button>
                        </div>
                      )}
                      
                      {fileType === 'text' && (
                        <div className="p-4">
                          <iframe
                            src={upload.fileUrl}
                            className="w-full h-96 border-0"
                            title={upload.fileName}
                          />
                        </div>
                      )}
                      
                      {fileType === 'unknown' && (
                        <div className="p-8 text-center">
                          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600 mb-4">Preview not available for this file type</p>
                          <button
                            onClick={() => handleDownloadFile(upload)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2 mx-auto"
                          >
                            <Download className="h-4 w-4" />
                            <span>Download to View</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Admin Comments (if marked) */}
                    {upload.status === 'marked' && upload.comments && (
                      <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
                        <h4 className="font-medium text-pink-800 mb-2">Admin Comments:</h4>
                        <p className="text-pink-700">{upload.comments}</p>
                        {upload.grade && (
                          <div className="mt-2">
                            <span className="font-medium text-pink-800">Grade: </span>
                            <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded-full text-sm font-medium">
                              {upload.grade}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
            
            <div className="flex items-center justify-end space-x-3 p-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => handleDownloadFile(uploads.find(u => u.id === viewingUpload)!)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Download</span>
              </button>
              <button
                onClick={() => setViewingUpload(null)}
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

export default AdminUploads;
