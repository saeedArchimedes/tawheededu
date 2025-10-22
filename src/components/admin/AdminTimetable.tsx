import React, { useState } from 'react';
import { Plus, Calendar, Download, Trash2, Upload } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';

const AdminTimetable: React.FC = () => {
  const { resources, addResource, deleteResource } = useData();
  const { currentUser } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const timetables = resources.filter(r => r.category === 'timetable');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.title.trim() && selectedFile) {
      try {
        await addResource({
          title: formData.title.trim(),
          fileName: selectedFile.name,
          fileUrl: '', // Will be set by addResource function
          type: selectedFile.type.startsWith('image/') ? 'image' : 'pdf',
          uploadedBy: currentUser?.username || 'admin',
          uploadedAt: new Date().toISOString(),
          category: 'timetable'
        }, selectedFile);
        
        setFormData({ title: '' });
        setSelectedFile(null);
        setShowAddForm(false);
      } catch (error) {
        console.error('Error adding timetable:', error);
        alert('Failed to upload timetable. Please try again.');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDownload = (timetable: any) => {
    try {
      const link = document.createElement('a');
      link.href = timetable.fileUrl;
      link.download = timetable.fileName;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      console.log(`Downloading ${timetable.fileName}...`);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
    }
  };

  const handleDelete = (timetableId: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteResource(timetableId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-3xl font-serif font-bold text-pink-700 tracking-wide">
          Timetable Management
        </h3>
        <p className="text-gray-600 mt-1">Upload and manage class timetables for teachers</p>
      </div>

      {/* Centered Add Timetable Button */}
      <div className="flex justify-center">
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition-colors duration-200 flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add Timetable</span>
        </button>
      </div>

      {/* Add Timetable Form */}
      {showAddForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Upload New Timetable</h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Timetable Title *
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., Grade 5 Weekly Timetable, Term 2 Schedule"
                required
              />
            </div>

            <div>
              <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
                Upload Timetable File *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors duration-200">
                <input
                  type="file"
                  id="file"
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  required
                />
                <label htmlFor="file" className="cursor-pointer">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Click to upload timetable</p>
                  <p className="text-sm text-gray-500">PDF or Image files up to 10MB</p>
                </label>
                {selectedFile && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800 font-medium">{selectedFile.name}</p>
                    <p className="text-green-600 text-sm">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                Upload Timetable
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setFormData({ title: '' });
                  setSelectedFile(null);
                }}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Timetables List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900">
            Uploaded Timetables ({timetables.length})
          </h4>
        </div>
        
        {timetables.length === 0 ? (
          <div className="p-8 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No timetables uploaded yet</p>
            <p className="text-gray-400 text-sm">Click "Add Timetable" to get started</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {timetables
              .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
              .map((timetable) => (
                <div key={timetable.id} className="px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Calendar className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h5 className="text-lg font-medium text-gray-900">{timetable.title}</h5>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{timetable.fileName}</span>
                        <span>Uploaded: {new Date(timetable.uploadedAt).toLocaleDateString()}</span>
                        <span className="capitalize bg-gray-100 px-2 py-1 rounded-full text-xs">
                          {timetable.type}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleDownload(timetable)}
                      className="text-green-600 hover:text-green-800 p-2 rounded-lg hover:bg-green-50 transition-colors duration-200"
                      title="Download"
                    >
                      <Download className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(timetable.id, timetable.title)}
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

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-blue-900 mb-3">Timetable Management Tips</h4>
        <ul className="space-y-2 text-blue-800 text-sm">
          <li>• Upload clear, readable timetables in PDF or image format</li>
          <li>• Use descriptive titles to help teachers identify the correct timetable</li>
          <li>• Update timetables regularly when schedules change</li>
          <li>• All uploaded timetables are automatically available to teachers</li>
          <li>• Teachers can download timetables for offline reference</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminTimetable;
