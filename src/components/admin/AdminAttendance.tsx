import React, { useState } from 'react';
import { Calendar, Clock, Users, Download, Filter } from 'lucide-react';
import { useData } from '@/contexts/DataContext';

const AdminAttendance: React.FC = () => {
  const { attendanceRecords } = useData();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState<'daily' | 'monthly'>('daily');

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

  // Get monthly attendance
  const currentMonth = selectedDate.substring(0, 7); // YYYY-MM format
  const monthlyAttendance = Object.entries(attendanceByDate)
    .filter(([date]) => date.startsWith(currentMonth))
    .sort(([a], [b]) => b.localeCompare(a));

  const generateReport = () => {
    const data = viewMode === 'daily' ? dailyAttendance : attendanceRecords;
    const reportData = data.map(record => ({
      Date: record.date,
      Teacher: record.teacherName,
      Time: record.time,
      Status: record.status
    }));
    console.log('Generating report:', reportData);
    alert(`${viewMode === 'daily' ? 'Daily' : 'Monthly'} attendance report generated!`);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-3xl font-bold text-pink-600 font-serif">Attendance Management</h3>
        <p className="text-gray-600 mt-2">View and manage teacher attendance records</p>

        {/* Generate Report Button */}
        <button
          onClick={generateReport}
          className="mt-6 px-6 py-3 rounded-lg text-white font-semibold bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 shadow-lg transition-all duration-300 inline-flex items-center space-x-2"
        >
          <Download className="h-5 w-5" />
          <span>Generate Report</span>
        </button>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-wrap items-center gap-6">
            {/* View Mode */}
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-pink-500" />
              <label className="text-sm font-medium text-gray-700">View Mode:</label>
              <select
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value as 'daily' | 'monthly')}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="daily">Daily View</option>
                <option value="monthly">Monthly View</option>
              </select>
            </div>

            {/* Date Selector */}
            {viewMode === 'daily' && (
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-pink-500" />
                <label className="text-sm font-medium text-gray-700">Date:</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
            )}
          </div>

          {/* Total Records */}
          <div className="text-sm font-medium text-pink-600">
            Total Records: {viewMode === 'daily' ? dailyAttendance.length : attendanceRecords.length}
          </div>
        </div>
      </div>

      {/* Attendance Display */}
      {viewMode === 'daily' ? (
        <div className="bg-white rounded-lg shadow-md border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h4 className="text-lg font-semibold text-pink-600 flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>
                {new Date(selectedDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </h4>
          </div>

          {dailyAttendance.length === 0 ? (
            <div className="p-8 text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No attendance records for this date</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {dailyAttendance.map((record) => (
                <div key={record.id} className="px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        record.status === 'on-time' ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    />
                    <div>
                      <h5 className="font-medium text-gray-900">{record.teacherName}</h5>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center space-x-1">
                          <Clock className="h-4 w-4 text-pink-500" />
                          <span>{record.time}</span>
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            record.status === 'on-time'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {record.status === 'on-time' ? 'On Time' : 'Late'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h4 className="text-lg font-semibold text-pink-600">Monthly Attendance Overview</h4>
          </div>

          {monthlyAttendance.length === 0 ? (
            <div className="p-8 text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No attendance records for this month</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {monthlyAttendance.map(([date, records]) => (
                <div key={date} className="px-6 py-4">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="font-medium text-gray-900">
                      {new Date(date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </h5>
                    <span className="text-sm text-pink-600">
                      {records.length} teacher{records.length !== 1 ? 's' : ''} signed in
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {records.map((record) => (
                      <div
                        key={record.id}
                        className="flex items-center space-x-3 p-3 bg-pink-50 rounded-lg"
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${
                            record.status === 'on-time' ? 'bg-green-500' : 'bg-red-500'
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {record.teacherName}
                          </p>
                          <p className="text-xs text-gray-500">{record.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminAttendance;
