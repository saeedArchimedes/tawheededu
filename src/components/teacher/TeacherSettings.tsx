import React, { useState } from 'react';
import { Settings, Lock, User, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const TeacherSettings: React.FC = () => {
  const { currentUser, updateTeacherPassword } = useAuth();
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
    setMessage(null);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) return;

    // Validate current password
    if (passwordData.currentPassword !== currentUser.password) {
      setMessage({ type: 'error', text: 'Current password is incorrect' });
      return;
    }

    // Validate new password
    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'New password must be at least 6 characters long' });
      return;
    }

    // Validate password confirmation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    setIsUpdating(true);

    setTimeout(() => {
      updateTeacherPassword(currentUser.id, passwordData.newPassword);
      setMessage({ type: 'success', text: 'Password updated successfully!' });
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setIsUpdating(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
<div className="text-center space-y-2">
  <h3 className="text-3xl font-serif font-bold text-pink-700 tracking-wide">
    Settings
  </h3>
  <p className="text-gray-600 mt-1">
    Manage your account settings and preferences
  </p>
</div>


      {/* Profile Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <User className="h-5 w-5" />
          <span>Profile Information</span>
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <div className="bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
              <p className="text-gray-900">{currentUser?.name}</p>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
            <div className="bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
              <p className="text-gray-900">{currentUser?.username}</p>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <div className="bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
              <p className="text-gray-900 capitalize">{currentUser?.role}</p>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Account Status</label>
            <div className="bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
              <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                currentUser?.isFirstLogin 
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-green-100 text-green-800'
              }`}>
                {currentUser?.isFirstLogin ? (
                  <>
                    <AlertCircle className="h-3 w-3" />
                    <span>First Login - Update Password</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-3 w-3" />
                    <span>Active</span>
                  </>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Password Change */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <Lock className="h-5 w-5" />
          <span>Change Password</span>
        </h4>

        {currentUser?.isFirstLogin && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="text-yellow-800">
              <p className="font-medium">First Login Detected</p>
              <p className="text-sm mt-1">Please change your password from the default one assigned by admin.</p>
            </div>
          </div>
        )}

        {message && (
          <div className={`p-4 rounded-lg flex items-center space-x-3 mb-6 ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="h-5 w-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
            )}
            <p>{message.text}</p>
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Current Password *
            </label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              required
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your current password"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                New Password *
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                required
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter new password"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password *
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                required
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Confirm new password"
              />
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h5 className="font-medium text-blue-900 mb-2">Password Requirements:</h5>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• At least 6 characters long</li>
              <li>• Should be different from your current password</li>
              <li>• Use a combination of letters and numbers for better security</li>
              <li>• Avoid using easily guessable information</li>
            </ul>
          </div>

          <button
            type="submit"
            disabled={isUpdating}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-400 transition-all duration-200 flex items-center space-x-2"
          >
            {isUpdating ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Updating...</span>
              </>
            ) : (
              <>
                <Lock className="h-5 w-5" />
                <span>Update Password</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Account Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-blue-900 mb-3">Account Information</h4>
        <div className="space-y-2 text-blue-800 text-sm">
          <p><strong>Account Created:</strong> {currentUser?.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : 'N/A'}</p>
          <p><strong>Added By:</strong> {(currentUser as any)?.addedBy || 'Admin'}</p>
          <p><strong>Email:</strong> {currentUser?.username}@tawheed-edu.com</p>
          <p><strong>Portal Access:</strong> Teacher Dashboard with attendance, resources, and upload features</p>
        </div>
      </div>
    </div>
  );
};

export default TeacherSettings;