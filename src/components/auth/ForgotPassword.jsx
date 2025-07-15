import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Icon from '../AppIcon';

const ForgotPassword = () => {
  const { resetPassword, authError, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleChange = (e) => {
    setEmail(e.target.value);
    setValidationError('');
    if (authError) {
      clearError();
    }
  };

  const validateEmail = () => {
    if (!email.trim()) {
      setValidationError('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setValidationError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateEmail()) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await resetPassword(email);
      
      if (result?.success) {
        setIsEmailSent(true);
      }
    } catch (error) {
      console.log('Reset password error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isEmailSent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-success-100">
              <Icon name="Mail" size={24} className="text-success-600" />
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-text-primary">
              Check your email
            </h2>
            <p className="mt-2 text-center text-sm text-text-secondary">
              We have sent a password reset link to{' '}
              <span className="font-medium text-text-primary">{email}</span>
            </p>
            <p className="mt-4 text-center text-sm text-text-muted">
              Did not receive the email? Check your spam folder or{' '}
              <button
                onClick={() => {
                  setIsEmailSent(false);
                  setEmail('');
                }}
                className="font-medium text-primary hover:text-primary-600"
              >
                try again
              </button>
            </p>
          </div>

          <div className="mt-8">
            <Link
              to="/login"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-primary bg-primary-50 hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <Icon name="ArrowLeft" size={16} className="mr-2" />
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-primary">
            <Icon name="Building2" size={24} className="text-white" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-text-primary">
            Reset your password
          </h2>
          <p className="mt-2 text-center text-sm text-text-secondary">
            Enter your email address and we will send you a link to reset your password
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {authError && (
            <div className="bg-error-100 border border-error-300 text-error-700 px-4 py-3 rounded relative">
              <span className="block sm:inline">{authError}</span>
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-1">
              Email address
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={handleChange}
              placeholder="Enter your email address"
              className={`appearance-none relative block w-full ${
                validationError ? 'border-error' : ''
              }`}
            />
            {validationError && (
              <p className="mt-1 text-sm text-error">{validationError}</p>
            )}
          </div>

          <div>
            <Button
              type="submit"
              variant="primary"
              className="group relative w-full flex justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Sending reset link...
                </>
              ) : (
                'Send reset link'
              )}
            </Button>
          </div>

          <div className="text-center">
            <Link
              to="/login"
              className="font-medium text-primary hover:text-primary-600"
            >
              <Icon name="ArrowLeft" size={16} className="inline mr-1" />
              Back to sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;