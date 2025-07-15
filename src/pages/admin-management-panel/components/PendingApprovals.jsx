import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const PendingApprovals = () => {
  const pendingItems = [
    {
      id: 1,
      type: 'venue',
      title: 'Grand Ballroom',
      submittedBy: 'Sarah Johnson',
      submittedDate: '2024-01-15',
      priority: 'high',
      image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&h=300&fit=crop',
      description: 'Luxury ballroom with capacity for 500 guests',
      location: 'Downtown, New York'
    },
    {
      id: 2,
      type: 'user',
      title: 'Venue Owner Application',
      submittedBy: 'Michael Chen',
      submittedDate: '2024-01-14',
      priority: 'medium',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      description: 'Application to become a venue owner',
      documents: ['Business License', 'Tax ID', 'Insurance Certificate']
    },
    {
      id: 3,
      type: 'venue',
      title: 'Elegant Gardens',
      submittedBy: 'Lisa Thompson',
      submittedDate: '2024-01-13',
      priority: 'medium',
      image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&h=300&fit=crop',
      description: 'Outdoor garden venue for weddings and events',
      location: 'Suburbs, California'
    },
    {
      id: 4,
      type: 'dispute',
      title: 'Booking Dispute #BK-2024-001',
      submittedBy: 'Emma Wilson',
      submittedDate: '2024-01-12',
      priority: 'high',
      description: 'Customer complaint about venue condition',
      amount: '$2,500'
    }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-error-100 text-error-700 border-error-200';
      case 'medium':
        return 'bg-warning-100 text-warning-700 border-warning-200';
      case 'low':
        return 'bg-success-100 text-success-700 border-success-200';
      default:
        return 'bg-secondary-100 text-secondary-700 border-secondary-200';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'venue':
        return 'Building2';
      case 'user':
        return 'User';
      case 'dispute':
        return 'AlertTriangle';
      default:
        return 'FileText';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'venue':
        return 'var(--color-primary)';
      case 'user':
        return 'var(--color-success)';
      case 'dispute':
        return 'var(--color-warning)';
      default:
        return 'var(--color-secondary)';
    }
  };

  const handleApprove = (id) => {
    console.log('Approving item:', id);
  };

  const handleReject = (id) => {
    console.log('Rejecting item:', id);
  };

  const handleViewDetails = (id) => {
    console.log('Viewing details for item:', id);
  };

  return (
    <div className="card">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-text-primary">Pending Approvals</h3>
          <span className="bg-error-100 text-error-700 text-sm font-medium px-3 py-1 rounded-full">
            {pendingItems.length} pending
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="space-y-4">
          {pendingItems.map((item) => (
            <div key={item.id} className="border border-border rounded-lg p-4 hover:shadow-sm transition-shadow duration-200">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  {item.type === 'user' ? (
                    <Image
                      src={item.image}
                      alt={item.submittedBy}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : item.image ? (
                    <Image
                      src={item.image}
                      alt={item.title}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
                      <Icon name={getTypeIcon(item.type)} size={20} color={getTypeColor(item.type)} />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="text-sm font-medium text-text-primary">{item.title}</h4>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(item.priority)}`}>
                          {item.priority}
                        </span>
                      </div>
                      
                      <p className="text-sm text-text-secondary mb-2">{item.description}</p>
                      
                      <div className="flex items-center space-x-4 text-xs text-text-muted">
                        <span>By {item.submittedBy}</span>
                        <span>•</span>
                        <span>{new Date(item.submittedDate).toLocaleDateString()}</span>
                        {item.location && (
                          <>
                            <span>•</span>
                            <span>{item.location}</span>
                          </>
                        )}
                        {item.amount && (
                          <>
                            <span>•</span>
                            <span className="font-medium">{item.amount}</span>
                          </>
                        )}
                      </div>
                      
                      {item.documents && (
                        <div className="mt-2">
                          <div className="flex flex-wrap gap-1">
                            {item.documents.map((doc, index) => (
                              <span key={index} className="inline-flex items-center px-2 py-1 rounded-md bg-secondary-100 text-xs text-secondary-700">
                                <Icon name="FileText" size={12} className="mr-1" />
                                {doc}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 mt-3">
                    <Button
                      variant="success"
                      iconName="Check"
                      iconSize={14}
                      onClick={() => handleApprove(item.id)}
                      className="text-xs px-3 py-1"
                    >
                      Approve
                    </Button>
                    <Button
                      variant="danger"
                      iconName="X"
                      iconSize={14}
                      onClick={() => handleReject(item.id)}
                      className="text-xs px-3 py-1"
                    >
                      Reject
                    </Button>
                    <Button
                      variant="ghost"
                      iconName="Eye"
                      iconSize={14}
                      onClick={() => handleViewDetails(item.id)}
                      className="text-xs px-3 py-1"
                    >
                      Details
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PendingApprovals;