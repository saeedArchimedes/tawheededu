import React from 'react';
import { Users, Calendar, Clock, TrendingUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';

interface SMCDashboardProps {
  onLogout: () => void;
}

const SMCDashboard: React.FC<SMCDashboardProps> = ({ onLogout }) => {
  const { currentUser, logout, teachers } = useAuth();
  const { attendanceRecords } = useData();
  const [selectedDate, setSelectedDate] = React.useState(new Date().toISOString().split('T')[0]);

  // Group attendance by date
  const attendanceByDate = attendanceRecords.reduce((acc, record) => {
    const date = record.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(record);
    return acc;
  }, {} as Record<string, typeof attendanceRecords>);

  // Get attendance for selected date
  const dailyAttendance = attendanceByDate[selectedDate] || [];

  // Calculate statistics
  const totalTeachers = teachers.length;
  const todayAttendance = attendanceByDate[new Date().toISOString().split('T')[0]] || [];
  const onTimeToday = todayAttendance.filter(r => r.status === 'on-time').length;
  const lateToday = todayAttendance.filter(r => r.status === 'late').length;

  // Get recent dates with attendance
  const recentDates = Object.keys(attendanceByDate)
    .sort((a, b) => b.localeCompare(a))
    .slice(0, 7);

  const handleLogout = () => {
    logout();
    onLogout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">SMC Dashboard</h1>
            <p className="text-gray-600">School Management Committee Portal</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">Welcome,</p>
              <p className="font-semibold text-gray-900">{currentUser?.name}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{totalTeachers}</p>
                <p className="text-gray-600">Total Teachers</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{todayAttendance.length}</p>
                <p className="text-gray-600">Today's Attendance</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{onTimeToday}</p>
                <p className="text-gray-600">On Time Today</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="bg-red-100 p-3 rounded-full">
                <Clock className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{lateToday}</p>
                <p className="text-gray-600">Late Today</p>
              </div>
            </div>
          </div>
        </div>

        {/* Attendance View */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Teacher Attendance</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <label className="text-sm font-medium text-gray-700">Date:</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-2">
                {new Date(selectedDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </h4>
              <p className="text-sm text-gray-600">
                {dailyAttendance.length} teacher{dailyAttendance.length !== 1 ? 's' : ''} signed in
              </p>
            </div>

            {dailyAttendance.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No attendance records for this date</p>
              </div>
            ) : (
              <div className="space-y-3">
                {dailyAttendance
                  .sort((a, b) => a.time.localeCompare(b.time))
                  .map((record) => (
                    <div key={record.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-3 h-3 rounded-full ${
                          record.status === 'on-time' ? 'bg-green-500' : 'bg-red-500'
                        }`} />
                        <div>
                          <h5 className="font-medium text-gray-900">{record.teacherName}</h5>
                          <p className="text-sm text-gray-500">Signed in at {record.time}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        record.status === 'on-time' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {record.status === 'on-time' ? 'On Time' : 'Late'}
                      </span>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Attendance Summary */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Attendance Summary</h3>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentDates.map((date) => {
                const dayAttendance = attendanceByDate[date];
                const onTime = dayAttendance.filter(r => r.status === 'on-time').length;
                const late = dayAttendance.filter(r => r.status === 'late').length;
                const total = dayAttendance.length;
                const attendanceRate = totalTeachers > 0 ? Math.round((total / totalTeachers) * 100) : 0;

                return (
                  <div key={date} className="bg-gray-50 rounded-lg p-4">
                    <h5 className="font-medium text-gray-900 mb-2">
                      {new Date(date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Present:</span>
                        <span className="font-medium">{total}/{totalTeachers}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-600">On Time:</span>
                        <span className="font-medium text-green-800">{onTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-red-600">Late:</span>
                        <span className="font-medium text-red-800">{late}</span>
                      </div>
                      <div className="flex justify-between border-t border-gray-200 pt-2">
                        <span className="text-gray-600">Rate:</span>
                        <span className="font-medium">{attendanceRate}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SMCDashboard;