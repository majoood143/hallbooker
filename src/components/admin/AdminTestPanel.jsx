import React, { useState, useEffect } from 'react';
import { Shield, Users, Building, Calendar, BarChart3, TestTube, CheckCircle, XCircle, Loader } from 'lucide-react';
import testAdminSetup from '../../utils/testAdminSetup';
import { useAuth } from '../../contexts/AuthContext';
import Icon from '../AppIcon';


const AdminTestPanel = () => {
  const { user, userProfile } = useAuth();
  const [testResults, setTestResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);

  // Available tests
  const tests = [
    {
      id: 'login',
      name: 'Admin Login',
      description: 'Test admin user authentication',
      icon: Shield,
      color: 'text-blue-500'
    },
    {
      id: 'dashboard',
      name: 'Dashboard Access',
      description: 'Test admin dashboard data access',
      icon: BarChart3,
      color: 'text-green-500'
    },
    {
      id: 'users',
      name: 'User Management',
      description: 'Test user management functions',
      icon: Users,
      color: 'text-purple-500'
    },
    {
      id: 'venues',
      name: 'Venue Management',
      description: 'Test venue management functions',
      icon: Building,
      color: 'text-orange-500'
    },
    {
      id: 'bookings',
      name: 'Booking Management',
      description: 'Test booking management functions',
      icon: Calendar,
      color: 'text-red-500'
    }
  ];

  // Run individual test
  const runTest = async (testId) => {
    setLoading(true);
    setSelectedTest(testId);
    
    try {
      let result;
      switch (testId) {
        case 'login':
          result = await testAdminSetup.testAdminLogin();
          break;
        case 'dashboard':
          result = await testAdminSetup.testAdminDashboard();
          break;
        case 'users':
          result = await testAdminSetup.testUserManagement();
          break;
        case 'venues':
          result = await testAdminSetup.testVenueManagement();
          break;
        case 'bookings':
          result = await testAdminSetup.testBookingManagement();
          break;
        default:
          result = { success: false, error: 'Unknown test' };
      }
      
      setTestResults(prev => ({
        ...prev,
        [testId]: result
      }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [testId]: { success: false, error: error.message }
      }));
    } finally {
      setLoading(false);
      setSelectedTest(null);
    }
  };

  // Run all tests
  const runAllTests = async () => {
    setLoading(true);
    const results = await testAdminSetup.runAllTests();
    setTestResults(results.results);
    setLoading(false);
  };

  // Quick setup
  const quickSetup = async () => {
    setLoading(true);
    const result = await testAdminSetup.quickSetup();
    setLoading(false);
    
    if (result.success) {
      // Refresh test results
      await runAllTests();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TestTube className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin System Test Panel</h1>
                <p className="text-gray-600">Test and validate admin functionality</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={quickSetup}
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center space-x-2"
              >
                {loading ? <Loader className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                <span>Quick Setup</span>
              </button>
              <button
                onClick={runAllTests}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
              >
                {loading ? <Loader className="h-4 w-4 animate-spin" /> : <TestTube className="h-4 w-4" />}
                <span>Run All Tests</span>
              </button>
            </div>
          </div>
        </div>

        {/* Admin Credentials */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Admin Credentials</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <code className="text-sm text-blue-600">admin@hallbooker.com</code>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <code className="text-sm text-blue-600">admin123!</code>
            </div>
          </div>
        </div>

        {/* Test Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {tests.map((test) => {
            const Icon = test.icon;
            const result = testResults?.[test.id];
            const isRunning = loading && selectedTest === test.id;
            
            return (
              <div key={test.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Icon className={`h-8 w-8 ${test.color}`} />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{test.name}</h3>
                      <p className="text-sm text-gray-600">{test.description}</p>
                    </div>
                  </div>
                  {result && (
                    <div className={`p-1 rounded-full ${result.success ? 'bg-green-100' : 'bg-red-100'}`}>
                      {result.success ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                  )}
                </div>
                
                <button
                  onClick={() => runTest(test.id)}
                  disabled={loading}
                  className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {isRunning ? (
                    <>
                      <Loader className="h-4 w-4 animate-spin" />
                      <span>Running...</span>
                    </>
                  ) : (
                    <>
                      <TestTube className="h-4 w-4" />
                      <span>Run Test</span>
                    </>
                  )}
                </button>
                
                {result && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <div className={`text-sm font-medium ${result.success ? 'text-green-600' : 'text-red-600'}`}>
                      {result.success ? 'Test Passed' : 'Test Failed'}
                    </div>
                    {result.error && (
                      <div className="text-sm text-red-600 mt-1">{result.error}</div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Test Results Summary */}
        {testResults && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Test Results Summary</h2>
            <div className="space-y-3">
              {Object.entries(testResults).map(([testId, result]) => {
                const test = tests.find(t => t.id === testId);
                if (!test) return null;
                
                return (
                  <div key={testId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`p-1 rounded-full ${result.success ? 'bg-green-100' : 'bg-red-100'}`}>
                        {result.success ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <span className="font-medium">{test.name}</span>
                    </div>
                    <span className={`text-sm ${result.success ? 'text-green-600' : 'text-red-600'}`}>
                      {result.success ? 'Passed' : 'Failed'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTestPanel;