import React, { useState } from 'react';
import { Plus, Trash2, User, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const TeacherManagement: React.FC = () => {
  const { teachers, addTeacher, deleteTeacher } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    password: ''
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.name.trim() && formData.password.trim()) {
      addTeacher(formData.name.trim(), formData.password);
      setFormData({ name: '', password: '' });
      setShowAddForm(false);
      setMessage({ type: 'success', text: `Teacher ${formData.name} added successfully!` });
      
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleDelete = (teacherId: string, teacherName: string) => {
    if (window.confirm(`Are you sure you want to delete teacher ${teacherName}?`)) {
      deleteTeacher(teacherId);
      setMessage({ type: 'success', text: `Teacher ${teacherName} deleted successfully!` });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        {/* Centered + pink heading */}
        <h3 className="text-3xl font-bold text-pink-600 font-serif">Teacher Management</h3>
        <p className="text-gray-600 mt-2">Add, view, and manage teachers in the system</p>

        {/* Modern pink Add Teacher button */}
        <button
          onClick={() => setShowAddForm(true)}
          className="mt-6 px-6 py-3 rounded-lg text-white font-semibold bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 shadow-lg transition-all duration-300 inline-flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add Teacher</span>
        </button>
      </div>

      {/* Success/Error Message */}
      {message && (
        <div
          className={`p-4 rounded-lg flex items-center space-x-3 ${
            message.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle className="h-5 w-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
          )}
          <p>{message.text}</p>
        </div>
      )}

      {/* Add Teacher Form */}
      {showAddForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-md">
          {/* Centered form heading */}
          <h4 className="text-xl font-bold text-center text-pink-600 mb-6 font-serif">
            Add New Teacher
          </h4>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Teacher Name *
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Enter teacher's full name"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Initial Password *
                </label>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Set initial password"
                  required
                />
              </div>
            </div>

            {/* Centered buttons */}
            <div className="flex justify-center space-x-4">
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-semibold rounded-lg shadow-lg hover:from-pink-600 hover:to-pink-700 transition-all duration-300"
              >
                Add Teacher
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setFormData({ name: '', password: '' });
                }}
                className="px-8 py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Teachers List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900">
            Current Teachers ({teachers.length})
          </h4>
        </div>

        {teachers.length === 0 ? (
          <div className="p-8 text-center">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No teachers added yet</p>
            <p className="text-gray-400 text-sm">Click "Add Teacher" to get started</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {teachers.map((teacher) => (
              <div key={teacher.id} className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-pink-100 p-2 rounded-full">
                    <User className="h-6 w-6 text-pink-600" />
                  </div>
                  <div>
                    <h5 className="text-lg font-medium text-gray-900">{teacher.name}</h5>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Username: {teacher.username}</span>
                      <span>Added: {new Date(teacher.createdAt).toLocaleDateString()}</span>
                      {teacher.isFirstLogin && (
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                          First Login Pending
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(teacher.id, teacher.name)}
                  className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors duration-200"
                  title="Delete teacher"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherManagement;
