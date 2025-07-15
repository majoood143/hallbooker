import React from 'react';

import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const MessageThread = ({ conversation, onOpenConversation, onMarkAsRead }) => {
  // Return null if conversation is undefined
  if (!conversation) return null;

  const formatTime = (timestamp) => {
    if (!timestamp) return 'No timestamp';
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffInMinutes = (now - date) / (1000 * 60);
      
      if (diffInMinutes < 60) {
        return `${Math.floor(diffInMinutes)}m ago`;
      } else if (diffInMinutes < 1440) {
        return `${Math.floor(diffInMinutes / 60)}h ago`;
      } else {
        return date.toLocaleDateString();
      }
    } catch (error) {
      return 'Invalid date';
    }
  };

  const truncateMessage = (message, maxLength = 60) => {
    if (!message) return 'No message';
    return message.length > maxLength ? `${message.substring(0, maxLength)}...` : message;
  };

  const hasUnreadMessages = (conversation?.unreadCount || 0) > 0;

  return (
    <div className={`bg-surface border rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow duration-200 ${
      hasUnreadMessages ? 'border-primary' : 'border-border'
    }`}>
      <div className="flex items-center space-x-4">
        {/* Venue/User Avatar */}
        <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
          <Image 
            src={conversation?.venue?.image || conversation?.venue?.avatar || '/assets/images/no_image.png'} 
            alt={conversation?.venue?.name || 'Venue'}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Message Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center space-x-2">
              <h3 className={`font-medium ${hasUnreadMessages ? 'text-text-primary' : 'text-text-primary'}`}>
                {conversation?.venue?.name || 'Unknown Venue'}
              </h3>
              {conversation?.bookingId && (
                <span className="text-xs px-2 py-1 bg-secondary-100 text-secondary-700 rounded">
                  {conversation.bookingId}
                </span>
              )}
            </div>
            <span className="text-xs text-text-muted">
              {formatTime(conversation?.lastMessage?.timestamp)}
            </span>
          </div>
          
          <p className={`text-sm ${hasUnreadMessages ? 'text-text-primary font-medium' : 'text-text-secondary'}`}>
            {conversation?.lastMessage?.isFromUser ? 'You: ' : ''}
            {truncateMessage(conversation?.lastMessage?.content)}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {hasUnreadMessages && (
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-xs text-primary font-medium">
                {conversation.unreadCount}
              </span>
            </div>
          )}
          
          <Button
            variant="ghost"
            iconName="MessageSquare"
            iconSize={16}
            onClick={(e) => {
              e.stopPropagation();
              onOpenConversation?.(conversation);
            }}
            className="text-sm"
          >
            Open
          </Button>
          
          {hasUnreadMessages && (
            <Button
              variant="ghost"
              iconName="Check"
              iconSize={16}
              onClick={(e) => {
                e.stopPropagation();
                onMarkAsRead?.(conversation);
              }}
              className="text-sm"
            >
              Mark Read
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageThread;