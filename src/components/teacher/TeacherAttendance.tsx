import React, { useState, useEffect } from 'react';
import { MapPin, Clock, CheckCircle, AlertTriangle, Loader } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { isWithinSchoolRadius, getCurrentTime, getCurrentDate, isLate } from '@/utils/auth';

const TeacherAttendance: React.FC = () => {
  const { currentUser } = useAuth();
  const { addAttendanceRecord, attendanceRecords } = useData();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [signInStatus, setSignInStatus] = useState<'none' | 'success' | 'late' | 'error' | 'location-error'>('none');
  const [message, setMessage] = useState('');
  const [hasSignedToday, setHasSignedToday] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    // Check if user has already signed in today
    const todayRecord = attendanceRecords.find(
      record => record.teacherId === currentUser?.id && record.date === today
    );
    setHasSignedToday(!!todayRecord);
  }, [attendanceRecords, currentUser?.id, today]);

  const handleSignIn = async () => {
    if (!currentUser || hasSignedToday) return;

    setIsSigningIn(true);
    setSignInStatus('none');

    try {
      // Request location permission
      if (!navigator.geolocation) {
        setSignInStatus('error');
        setMessage('Geolocation is not supported by this browser.');
        setIsSigningIn(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          
          // Check if within school radius
          if (!isWithinSchoolRadius(latitude, longitude)) {
            setSignInStatus('location-error');
            setMessage('You are currently not in school. Please sign in from the school premises.');
            setIsSigningIn(false);
            return;
          }

          // Get current time and check if late
          const currentTime = getCurrentTime();
          const currentDate = getCurrentDate();
          const isTeacherLate = isLate(currentTime);

          // Add attendance record
          addAttendanceRecord({
            teacherId: currentUser.id,
            teacherName: currentUser.name,
            date: today,
            time: currentTime,
            status: isTeacherLate ? 'late' : 'on-time',
            location: { latitude, longitude }
          });

          // Set status and message
          if (isTeacherLate) {
            setSignInStatus('late');
            setMessage(`Hi ${currentUser.name}, you are late please, try earlier tomorrow. Have a nice day!`);
          } else {
            setSignInStatus('success');
            setMessage(`Hi ${currentUser.name}, you reported to school at ${currentTime}. Have a great day!`);
          }

          setHasSignedToday(true);
          setIsSigningIn(false);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setSignInStatus('error');
          setMessage('Location services are required to sign in. Please enable GPS and try again.');
          setIsSigningIn(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    } catch (error) {
      setSignInStatus('error');
      setMessage('An error occurred while signing in. Please try again.');
      setIsSigningIn(false);
    }
  };

  const getStatusColor = () => {
    switch (signInStatus) {
      case 'success':
        return 'text-green-800 bg-green-50 border-green-200';
      case 'late':
        return 'text-red-800 bg-red-50 border-red-200';
      case 'error':
      case 'location-error':
        return 'text-red-800 bg-red-50 border-red-200';
      default:
        return 'text-blue-800 bg-blue-50 border-blue-200';
    }
  };

  const getStatusIcon = () => {
    switch (signInStatus) {
      case 'success':
        return <CheckCircle className="h-6 w-6 text-green-600" />;
      case 'late':
        return <AlertTriangle className="h-6 w-6 text-red-600" />;
      case 'error':
      case 'location-error':
        return <AlertTriangle className="h-6 w-6 text-red-600" />;
      default:
        return <Clock className="h-6 w-6 text-blue-600" />;
    }
  };

  // Get today's attendance record
  const todayRecord = attendanceRecords.find(
    record => record.teacherId === currentUser?.id && record.date === today
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900">Daily Sign In</h3>
        <p className="text-gray-600 mt-1">Sign in to record your attendance for today</p>
      </div>

      {/* Current Status */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center">
          <div className="mb-4">
            <Clock className="h-12 w-12 text-blue-600 mx-auto mb-2" />
            <h4 className="text-xl font-semibold text-gray-900">
              {getCurrentDate()}
            </h4>
            <p className="text-gray-600">{getCurrentTime()}</p>
          </div>

          {hasSignedToday ? (
            <div className="space-y-4">
              <div className={`p-4 rounded-lg border ${
                todayRecord?.status === 'on-time' 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center justify-center space-x-2 mb-2">
                  {todayRecord?.status === 'on-time' ? (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  )}
                  <span className={`font-semibold ${
                    todayRecord?.status === 'on-time' ? 'text-green-800' : 'text-red-800'
                  }`}>
                    Already Signed In
                  </span>
                </div>
                <p className={`text-sm ${
                  todayRecord?.status === 'on-time' ? 'text-green-700' : 'text-red-700'
                }`}>
                  You signed in at {todayRecord?.time} - {todayRecord?.status === 'on-time' ? 'On Time' : 'Late'}
                </p>
              </div>
              
              <div className="text-sm text-gray-500">
                You can only sign in once per day. See you tomorrow!
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <button
                onClick={handleSignIn}
                disabled={isSigningIn}
                className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-400 transition-all duration-200 flex items-center justify-center space-x-2 mx-auto"
              >
                {isSigningIn ? (
                  <>
                    <Loader className="h-5 w-5 animate-spin" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <MapPin className="h-5 w-5" />
                    <span>Sign In Now</span>
                  </>
                )}
              </button>

              <div className="text-sm text-gray-500">
                <p>⏰ Sign in before 7:30 AM to be marked on time</p>
                <p>📍 Location services required for attendance verification</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status Message */}
      {message && (
        <div className={`p-4 rounded-lg border flex items-start space-x-3 ${getStatusColor()}`}>
          {getStatusIcon()}
          <p className="font-medium">{message}</p>
        </div>
      )}

      {/* Location Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-blue-900 mb-3">School Location Information</h4>
        <div className="space-y-2 text-blue-800 text-sm">
          <p><strong>Digital Address:</strong> BW-0082-2413</p>
          <p><strong>Location Requirement:</strong> You must be within school premises to sign in</p>
          <p><strong>Attendance Policy:</strong></p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>Sign in before 7:30 AM to be marked on time</li>
            <li>Late arrivals after 7:30 AM will be marked as late</li>
            <li>Only one sign-in allowed per day</li>
            <li>GPS location verification required</li>
          </ul>
        </div>
      </div>

      {/* Recent Attendance */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900">Your Recent Attendance</h4>
        </div>
        
        <div className="p-6">
          {attendanceRecords
            .filter(record => record.teacherId === currentUser?.id)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 7)
            .map((record) => (
              <div key={record.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    record.status === 'on-time' ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  <div>
                    <p className="font-medium text-gray-900">
                      {new Date(record.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                    <p className="text-sm text-gray-500">{record.time}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  record.status === 'on-time' 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {record.status === 'on-time' ? 'On Time' : 'Late'}
                </span>
              </div>
            ))}
          
          {attendanceRecords.filter(record => record.teacherId === currentUser?.id).length === 0 && (
            <p className="text-gray-500 text-center py-4">No attendance records yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherAttendance;