import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';


const MessageCenter = ({ messages, onSendMessage, onMarkAsRead }) => {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [filter, setFilter] = useState('all'); // all, unread, urgent

  const filteredMessages = messages.filter(message => {
    if (filter === 'unread') return !message.isRead;
    if (filter === 'urgent') return message.priority === 'urgent';
    return true;
  });

  const handleSendReply = () => {
    if (replyText.trim() && selectedMessage) {
      onSendMessage({
        to: selectedMessage.customerEmail,
        subject: `Re: ${selectedMessage.subject}`,
        message: replyText,
        bookingId: selectedMessage.bookingId
      });
      setReplyText('');
      setSelectedMessage(null);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'text-error-600';
      case 'high':
        return 'text-warning-600';
      default:
        return 'text-text-secondary';
    }
  };

  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden">
      <div className="border-b border-border p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary">Messages</h3>
          <div className="flex items-center space-x-2">
            <Button
              variant={filter === 'all' ? 'primary' : 'ghost'}
              onClick={() => setFilter('all')}
            >
              All
            </Button>
            <Button
              variant={filter === 'unread' ? 'primary' : 'ghost'}
              onClick={() => setFilter('unread')}
            >
              Unread
            </Button>
            <Button
              variant={filter === 'urgent' ? 'primary' : 'ghost'}
              onClick={() => setFilter('urgent')}
            >
              Urgent
            </Button>
          </div>
        </div>
      </div>

      <div className="flex h-96">
        {/* Message List */}
        <div className="w-1/2 border-r border-border overflow-y-auto">
          {filteredMessages.map((message) => (
            <div
              key={message.id}
              className={`p-4 border-b border-border cursor-pointer hover:bg-secondary-50 transition-colors duration-200 ${
                selectedMessage?.id === message.id ? 'bg-primary-50 border-primary-200' : ''
              } ${!message.isRead ? 'bg-warning-50' : ''}`}
              onClick={() => {
                setSelectedMessage(message);
                if (!message.isRead) {
                  onMarkAsRead(message.id);
                }
              }}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h4 className={`text-sm font-medium truncate ${
                      !message.isRead ? 'text-text-primary' : 'text-text-secondary'
                    }`}>
                      {message.customerName}
                    </h4>
                    {!message.isRead && (
                      <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                    )}
                  </div>
                  <p className="text-xs text-text-muted">{message.customerEmail}</p>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs text-text-muted">{formatTime(message.timestamp)}</span>
                  {message.priority !== 'normal' && (
                    <Icon 
                      name="AlertCircle" 
                      size={12} 
                      className={`mt-1 ${getPriorityColor(message.priority)}`}
                    />
                  )}
                </div>
              </div>
              
              <p className={`text-sm font-medium mb-1 ${
                !message.isRead ? 'text-text-primary' : 'text-text-secondary'
              }`}>
                {message.subject}
              </p>
              <p className="text-sm text-text-muted truncate">{message.preview}</p>
              
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-text-muted">
                  Booking #{message.bookingId}
                </span>
                {message.hasAttachment && (
                  <Icon name="Paperclip" size={12} className="text-text-muted" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Message Detail */}
        <div className="w-1/2 flex flex-col">
          {selectedMessage ? (
            <>
              <div className="p-4 border-b border-border">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-lg font-semibold text-text-primary">
                      {selectedMessage.subject}
                    </h4>
                    <div className="flex items-center space-x-2 text-sm text-text-secondary mt-1">
                      <span>From: {selectedMessage.customerName}</span>
                      <span>•</span>
                      <span>{formatTime(selectedMessage.timestamp)}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      iconName="Archive"
                      iconSize={16}
                    />
                    <Button
                      variant="ghost"
                      iconName="Trash2"
                      iconSize={16}
                    />
                  </div>
                </div>
                
                <div className="bg-secondary-50 rounded-lg p-3">
                  <p className="text-sm text-text-primary whitespace-pre-wrap">
                    {selectedMessage.content}
                  </p>
                </div>
              </div>

              <div className="flex-1 p-4">
                <div className="mb-3">
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Reply
                  </label>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your reply..."
                    className="w-full h-32 px-3 py-2 border border-border rounded-md bg-surface text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      iconName="Paperclip"
                      iconSize={16}
                    >
                      Attach
                    </Button>
                    <Button
                      variant="ghost"
                      iconName="Smile"
                      iconSize={16}
                    >
                      Emoji
                    </Button>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedMessage(null)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      iconName="Send"
                      iconSize={16}
                      onClick={handleSendReply}
                      disabled={!replyText.trim()}
                    >
                      Send Reply
                    </Button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Icon name="MessageSquare" size={48} className="text-text-muted mx-auto mb-3" />
                <p className="text-text-secondary">Select a message to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageCenter;