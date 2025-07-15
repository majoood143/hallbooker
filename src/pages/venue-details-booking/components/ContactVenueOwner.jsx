import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ContactVenueOwner = ({ venueOwner, venue, onMessageSent }) => {
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [messageForm, setMessageForm] = useState({
    subject: '',
    message: '',
    contactInfo: '',
    eventDate: '',
    guestCount: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const quickMessageTemplates = [
    {
      id: 'availability',
      title: 'Check Availability',
      subject: 'Availability Inquiry',
      message: `Hi ${venueOwner.name},\n\nI'm interested in booking ${venue.name} for an upcoming event. Could you please confirm availability and provide more details about pricing and packages?\n\nThank you!`
    },
    {
      id: 'pricing',title: 'Pricing Information',subject: 'Pricing Inquiry',
      message: `Hello ${venueOwner.name},\n\nI would like to get detailed pricing information for ${venue.name}, including any package deals or discounts you might offer.\n\nLooking forward to your response.`
    },
    {
      id: 'tour',title: 'Schedule Tour',subject: 'Venue Tour Request',
      message: `Dear ${venueOwner.name},\n\nI'm planning an event and would love to schedule a tour of ${venue.name}. When would be a good time for a visit?\n\nBest regards`
    },
    {
      id: 'custom',
      title: 'Custom Message',
      subject: '',
      message: ''
    }
  ];

  const handleInputChange = (field, value) => {
    setMessageForm(prev => ({ ...prev, [field]: value }));
  };

  const handleTemplateSelect = (template) => {
    setMessageForm(prev => ({
      ...prev,
      subject: template.subject,
      message: template.message
    }));
  };

  const handleSubmitMessage = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const messageData = {
      ...messageForm,
      venueId: venue.id,
      ownerId: venueOwner.id,
      timestamp: new Date().toISOString()
    };

    if (onMessageSent) {
      onMessageSent(messageData);
    }

    setIsSubmitting(false);
    setIsMessageModalOpen(false);
    setMessageForm({
      subject: '',
      message: '',
      contactInfo: '',
      eventDate: '',
      guestCount: ''
    });
  };

  const isFormValid = messageForm.subject.trim() && messageForm.message.trim() && messageForm.contactInfo.trim();

  return (
    <>
      {/* Contact Card */}
      <div className="bg-surface border border-border rounded-lg p-6">
        <h3 className="text-xl font-semibold text-text-primary mb-4">Contact Venue Owner</h3>
        
        <div className="flex items-center space-x-4 mb-6">
          <Image
            src={venueOwner.avatar}
            alt={venueOwner.name}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div className="flex-1">
            <h4 className="font-medium text-text-primary">{venueOwner.name}</h4>
            <p className="text-sm text-text-secondary">{venueOwner.title}</p>
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center space-x-1">
                <Icon name="Star" size={14} color="var(--color-accent)" className="fill-current" />
                <span className="text-sm font-medium text-text-primary">{venueOwner.rating}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="MessageSquare" size={14} color="var(--color-text-muted)" />
                <span className="text-sm text-text-secondary">{venueOwner.responseTime}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Owner Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="text-lg font-semibold text-text-primary">{venueOwner.totalBookings}</div>
            <div className="text-xs text-text-muted">Total Bookings</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-text-primary">{venueOwner.yearsExperience}</div>
            <div className="text-xs text-text-muted">Years Experience</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-text-primary">{venueOwner.responseRate}%</div>
            <div className="text-xs text-text-muted">Response Rate</div>
          </div>
        </div>

        {/* Contact Actions */}
        <div className="space-y-3">
          <Button
            variant="primary"
            onClick={() => setIsMessageModalOpen(true)}
            iconName="MessageSquare"
            iconPosition="left"
            fullWidth
          >
            Send Message
          </Button>
          
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              iconName="Phone"
              iconPosition="left"
              onClick={() => window.open(`tel:${venueOwner.phone}`)}
            >
              Call
            </Button>
            <Button
              variant="outline"
              iconName="Mail"
              iconPosition="left"
              onClick={() => window.open(`mailto:${venueOwner.email}`)}
            >
              Email
            </Button>
          </div>
        </div>

        {/* Response Time Notice */}
        <div className="mt-4 p-3 bg-success-50 border border-success-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <Icon name="Clock" size={16} color="var(--color-success)" className="mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-success-700">Quick Response</p>
              <p className="text-success-600">Usually responds within {venueOwner.responseTime}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Message Modal */}
      {isMessageModalOpen && (
        <div className="fixed inset-0 z-500 bg-surface/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-text-primary">
                  Send Message to {venueOwner.name}
                </h3>
                <button
                  onClick={() => setIsMessageModalOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-secondary-100 transition-colors duration-200"
                >
                  <Icon name="X" size={16} color="var(--color-text-secondary)" />
                </button>
              </div>

              {/* Quick Templates */}
              <div className="mb-6">
                <h4 className="font-medium text-text-primary mb-3">Quick Templates</h4>
                <div className="grid grid-cols-2 gap-2">
                  {quickMessageTemplates.map(template => (
                    <button
                      key={template.id}
                      onClick={() => handleTemplateSelect(template)}
                      className="p-3 text-left border border-border rounded-lg hover:border-primary hover:bg-primary-50 transition-all duration-200"
                    >
                      <div className="font-medium text-text-primary text-sm">{template.title}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    Subject *
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter message subject"
                    value={messageForm.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    className="w-full"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                      Event Date
                    </label>
                    <Input
                      type="date"
                      value={messageForm.eventDate}
                      onChange={(e) => handleInputChange('eventDate', e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                      Guest Count
                    </label>
                    <Input
                      type="number"
                      placeholder="Number of guests"
                      value={messageForm.guestCount}
                      onChange={(e) => handleInputChange('guestCount', e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    Your Contact Information *
                  </label>
                  <Input
                    type="text"
                    placeholder="Phone number or email"
                    value={messageForm.contactInfo}
                    onChange={(e) => handleInputChange('contactInfo', e.target.value)}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    Message *
                  </label>
                  <textarea
                    placeholder="Type your message here..."
                    value={messageForm.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    rows={6}
                    className="w-full px-3 py-2 border border-border rounded-md bg-surface text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex space-x-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setIsMessageModalOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSubmitMessage}
                  disabled={!isFormValid || isSubmitting}
                  loading={isSubmitting}
                  iconName="Send"
                  iconPosition="left"
                  className="flex-1"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ContactVenueOwner;