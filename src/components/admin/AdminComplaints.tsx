import React, { useState } from 'react';
import { MessageSquare, User, Globe, CheckCircle, Clock, Reply, Send, Trash2 } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';

const AdminComplaints: React.FC = () => {
  const { suggestions, markSuggestionRead, addSuggestionReply, clearAllSuggestions } = useData();
  const { currentUser } = useAuth();
  const [filter, setFilter] = useState<'all' | 'public' | 'teacher' | 'unread'>('all');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const filteredSuggestions = suggestions.filter(suggestion => {
    switch (filter) {
      case 'public':
        return suggestion.source === 'public';
      case 'teacher':
        return suggestion.source === 'teacher';
      case 'unread':
        return !suggestion.isRead;
      default:
        return true;
    }
  }).sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

  const handleMarkRead = (suggestionId: string) => {
    markSuggestionRead(suggestionId);
  };

  const handleReply = (suggestionId: string) => {
    setReplyingTo(suggestionId);
    setReplyText('');
  };

  const handleSendReply = () => {
    if (!replyingTo || !replyText.trim() || !currentUser) return;
    
    addSuggestionReply(replyingTo, replyText.trim(), currentUser.name);
    setReplyingTo(null);
    setReplyText('');
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
    setReplyText('');
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all suggestions and complaints? This action cannot be undone.')) {
      clearAllSuggestions();
    }
  };

  const getSourceIcon = (source: string) => {
    return source === 'public' ? <Globe className="h-4 w-4" /> : <User className="h-4 w-4" />;
  };

  const getSourceColor = (source: string) => {
    return source === 'public' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-blue-100 text-blue-800';
  };

  const unreadCount = suggestions.filter(s => !s.isRead).length;
  const publicCount = suggestions.filter(s => s.source === 'public').length;
  const teacherCount = suggestions.filter(s => s.source === 'teacher').length;

  return (
    <div className="space-y-6">
      {/* Header */}
<div className="text-center space-y-2">
  <h3 className="text-3xl font-serif font-bold text-pink-700 tracking-wide">
    Complaints & Suggestions
  </h3>
  <p className="text-gray-600">Review feedback from teachers and the public</p>
</div>


      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-red-100 p-2 rounded-full">
              <Clock className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">{unreadCount}</p>
              <p className="text-sm text-gray-600">Unread</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-2 rounded-full">
              <Globe className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">{publicCount}</p>
              <p className="text-sm text-gray-600">From Public</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">{teacherCount}</p>
              <p className="text-sm text-gray-600">From Teachers</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-gray-100 p-2 rounded-full">
              <MessageSquare className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">{suggestions.length}</p>
              <p className="text-sm text-gray-600">Total</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
        <div className="flex flex-wrap items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">Filter by:</span>
          {[
            { value: 'all', label: 'All Messages' },
            { value: 'unread', label: 'Unread' },
            { value: 'public', label: 'From Public' },
            { value: 'teacher', label: 'From Teachers' }
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value as any)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                filter === option.value
                  ? 'bg-green-100 text-green-800 border border-green-200'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Suggestions List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h4 className="text-lg font-semibold text-gray-900">
            Messages ({filteredSuggestions.length})
          </h4>
          {suggestions.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center space-x-2"
            >
              <Trash2 className="h-4 w-4" />
              <span>Clear History</span>
            </button>
          )}
        </div>
        
        {filteredSuggestions.length === 0 ? (
          <div className="p-8 text-center">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              {filter === 'all' ? 'No messages yet' : `No ${filter} messages`}
            </p>
            <p className="text-gray-400 text-sm">
              {filter === 'all' 
                ? 'Messages and suggestions will appear here'
                : 'Try changing the filter to see more messages'
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredSuggestions.map((suggestion) => (
              <div 
                key={suggestion.id} 
                className={`px-6 py-4 ${!suggestion.isRead ? 'bg-yellow-50 border-l-4 border-l-yellow-400' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h5 className="font-medium text-gray-900">{suggestion.name}</h5>
                      <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getSourceColor(suggestion.source)}`}>
                        {getSourceIcon(suggestion.source)}
                        <span className="capitalize">{suggestion.source}</span>
                      </span>
                      {!suggestion.isRead && (
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                          New
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-700 mb-3 leading-relaxed">{suggestion.message}</p>
                    
                    {/* Reply Section */}
                    {suggestion.reply && (
                      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-start space-x-2">
                          <Reply className="h-4 w-4 text-blue-600 mt-1 flex-shrink-0" />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="text-sm font-medium text-blue-900">Admin Reply</span>
                              <span className="text-xs text-blue-600">
                                by {suggestion.repliedBy} on {suggestion.repliedAt && new Date(suggestion.repliedAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-blue-800 text-sm leading-relaxed">{suggestion.reply}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        {suggestion.email && <span>{suggestion.email}</span>}
                        <span>{new Date(suggestion.submittedAt).toLocaleDateString()}</span>
                        <span>{new Date(suggestion.submittedAt).toLocaleTimeString()}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {!suggestion.reply && (
                          <button
                            onClick={() => handleReply(suggestion.id)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1"
                          >
                            <Reply className="h-4 w-4" />
                            <span>Reply</span>
                          </button>
                        )}
                        
                        {!suggestion.isRead && (
                          <button
                            onClick={() => handleMarkRead(suggestion.id)}
                            className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center space-x-1"
                          >
                            <CheckCircle className="h-4 w-4" />
                            <span>Mark as Read</span>
                          </button>
                        )}
                      </div>
                    </div>
                    
                    {/* Reply Form */}
                    {replyingTo === suggestion.id && (
                      <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                        <div className="space-y-3">
                          <label className="block text-sm font-medium text-gray-700">
                            Your Reply
                          </label>
                          <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Type your reply here..."
                          />
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={handleSendReply}
                              disabled={!replyText.trim()}
                              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors duration-200 flex items-center space-x-2"
                            >
                              <Send className="h-4 w-4" />
                              <span>Send Reply</span>
                            </button>
                            <button
                              onClick={handleCancelReply}
                              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-200"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Response Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-blue-900 mb-3">Response Guidelines</h4>
        <ul className="space-y-2 text-blue-800 text-sm">
          <li>• Review all messages regularly to maintain good communication</li>
          <li>• For urgent matters, contact the sender directly using provided contact information</li>
          <li>• Use feedback to improve school services and address concerns</li>
          <li>• Mark messages as read after reviewing to keep track of what's been handled</li>
          <li>• Consider creating announcements to address common concerns publicly</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminComplaints;