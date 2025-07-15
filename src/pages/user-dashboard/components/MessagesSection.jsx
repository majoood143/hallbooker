import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import MessageThread from './MessageThread';

const MessagesSection = ({ conversations = [], onOpenConversation, onMarkAsRead, onMarkAllAsRead }) => {
  const [filter, setFilter] = useState('all');

  const filterOptions = [
    { value: 'all', label: 'All Messages' },
    { value: 'unread', label: 'Unread' },
    { value: 'read', label: 'Read' }
  ];

  const filterConversations = () => {
    // Safe array initialization
    const safeConversations = Array.isArray(conversations) ? conversations : [];
    let filtered = [...safeConversations];

    if (filter === 'unread') {
      filtered = filtered.filter(conv => (conv?.unreadCount || 0) > 0);
    } else if (filter === 'read') {
      filtered = filtered.filter(conv => (conv?.unreadCount || 0) === 0);
    }

    // Sort by last message time (newest first)
    filtered.sort((a, b) => {
      const timeA = a?.lastMessage?.timestamp ? new Date(a.lastMessage.timestamp) : new Date(0);
      const timeB = b?.lastMessage?.timestamp ? new Date(b.lastMessage.timestamp) : new Date(0);
      return timeB - timeA;
    });

    return filtered;
  };

  const filteredConversations = filterConversations();
  const unreadCount = conversations.reduce((sum, conv) => sum + (conv?.unreadCount || 0), 0);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-text-primary">Messages</h2>
          {unreadCount > 0 && (
            <p className="text-sm text-text-secondary mt-1">
              {unreadCount} unread message{unreadCount !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border border-border rounded-md bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {filterOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              iconName="CheckCheck"
              iconSize={16}
              onClick={onMarkAllAsRead}
              className="text-sm"
            >
              Mark All Read
            </Button>
          )}
        </div>
      </div>

      {/* Conversations List */}
      {filteredConversations.length > 0 ? (
        <div className="space-y-4">
          {filteredConversations.map((conversation) => (
            <MessageThread
              key={conversation?.id || Math.random()}
              conversation={conversation}
              onOpenConversation={onOpenConversation}
              onMarkAsRead={onMarkAsRead}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="MessageSquare" size={32} color="var(--color-text-muted)" />
          </div>
          <h3 className="text-lg font-medium text-text-primary mb-2">
            {filter === 'all' ? 'No messages yet' : `No ${filter} messages`}
          </h3>
          <p className="text-text-secondary mb-4">
            {filter === 'all' 
              ? "Messages with venue owners will appear here." 
              : `You don't have any ${filter} messages.`
            }
          </p>
          {filter !== 'all' && (
            <Button
              variant="outline"
              onClick={() => setFilter('all')}
              className="text-sm"
            >
              View All Messages
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default MessagesSection;