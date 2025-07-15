import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const TestingPanel = ({ config, onTest, gatewayStatus }) => {
  const [testResults, setTestResults] = useState([]);
  const [runningTests, setRunningTests] = useState([]);
  const [testAmount, setTestAmount] = useState('10.00');
  const [testCurrency, setTestCurrency] = useState('OMR');

  const testSuites = [
    {
      id: 'connection',
      name: 'Connection Test',
      description: 'Test basic API connectivity',
      icon: 'Wifi',
      tests: [
        { id: 'ping', name: 'API Ping', description: 'Test API endpoint availability' },
        { id: 'auth', name: 'Authentication', description: 'Verify API credentials' },
        { id: 'ssl', name: 'SSL Certificate', description: 'Check SSL certificate validity' }
      ]
    },
    {
      id: 'payment',
      name: 'Payment Flow',
      description: 'Test payment processing flows',
      icon: 'CreditCard',
      tests: [
        { id: 'create', name: 'Create Payment', description: 'Test payment creation' },
        { id: 'capture', name: 'Capture Payment', description: 'Test payment capture' },
        { id: 'refund', name: 'Refund Payment', description: 'Test refund processing' }
      ]
    },
    {
      id: 'webhook',
      name: 'Webhook Tests',
      description: 'Test webhook functionality',
      icon: 'Webhook',
      tests: [
        { id: 'delivery', name: 'Webhook Delivery', description: 'Test webhook endpoint' },
        { id: 'signature', name: 'Signature Validation', description: 'Test webhook signature verification' },
        { id: 'retry', name: 'Retry Logic', description: 'Test webhook retry mechanism' }
      ]
    }
  ];

  const runTest = async (suiteId, testId) => {
    const testKey = `${suiteId}-${testId}`;
    setRunningTests(prev => [...prev, testKey]);
    
    try {
      // Simulate test execution
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock test results
      const success = Math.random() > 0.3; // 70% success rate
      const result = {
        id: testKey,
        suiteId,
        testId,
        success,
        message: success ? 'Test passed successfully' : 'Test failed - check configuration',
        timestamp: new Date(),
        duration: Math.floor(Math.random() * 2000) + 500
      };
      
      setTestResults(prev => {
        const filtered = prev.filter(r => r.id !== testKey);
        return [...filtered, result];
      });
    } catch (error) {
      console.error('Test execution failed:', error);
    } finally {
      setRunningTests(prev => prev.filter(key => key !== testKey));
    }
  };

  const runAllTests = async () => {
    for (const suite of testSuites) {
      for (const test of suite.tests) {
        await runTest(suite.id, test.id);
      }
    }
  };

  const runTestSuite = async (suiteId) => {
    const suite = testSuites.find(s => s.id === suiteId);
    if (suite) {
      for (const test of suite.tests) {
        await runTest(suiteId, test.id);
      }
    }
  };

  const getTestResult = (suiteId, testId) => {
    return testResults.find(r => r.suiteId === suiteId && r.testId === testId);
  };

  const isTestRunning = (suiteId, testId) => {
    return runningTests.includes(`${suiteId}-${testId}`);
  };

  const getTestIcon = (suiteId, testId) => {
    const result = getTestResult(suiteId, testId);
    const running = isTestRunning(suiteId, testId);
    
    if (running) return 'Loader';
    if (result?.success) return 'CheckCircle';
    if (result?.success === false) return 'XCircle';
    return 'Circle';
  };

  const getTestColor = (suiteId, testId) => {
    const result = getTestResult(suiteId, testId);
    const running = isTestRunning(suiteId, testId);
    
    if (running) return 'var(--color-primary)';
    if (result?.success) return 'var(--color-success)';
    if (result?.success === false) return 'var(--color-error)';
    return 'var(--color-text-muted)';
  };

  return (
    <div className="space-y-6">
      {/* Test Controls */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary">Gateway Testing</h3>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              iconName="Play"
              iconSize={14}
              onClick={runAllTests}
              disabled={runningTests.length > 0}
            >
              Run All Tests
            </Button>
            <Button
              variant="primary"
              size="sm"
              iconName="RefreshCw"
              iconSize={14}
              onClick={() => window.location.reload()}
            >
              Clear Results
            </Button>
          </div>
        </div>

        {/* Test Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Test Amount
            </label>
            <Input
              type="number"
              value={testAmount}
              onChange={(e) => setTestAmount(e.target.value)}
              placeholder="10.00"
              min="0.01"
              step="0.01"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Test Currency
            </label>
            <select
              value={testCurrency}
              onChange={(e) => setTestCurrency(e.target.value)}
              className="form-input w-full"
            >
              <option value="OMR">OMR</option>
              <option value="AED">AED</option>
              <option value="SAR">SAR</option>
            </select>
          </div>
        </div>

        {/* Gateway Status */}
        <div className="flex items-center space-x-3 p-3 bg-surface rounded-lg">
          <Icon 
            name={gatewayStatus === 'connected' ? 'CheckCircle' : 'XCircle'} 
            size={20} 
            color={gatewayStatus === 'connected' ? 'var(--color-success)' : 'var(--color-error)'} 
          />
          <div>
            <h4 className="text-sm font-medium text-text-primary">
              Gateway Status: {gatewayStatus}
            </h4>
            <p className="text-xs text-text-secondary">
              {gatewayStatus === 'connected' ?'Gateway is online and ready for testing' :'Gateway connection issues detected'}
            </p>
          </div>
        </div>
      </div>

      {/* Test Suites */}
      <div className="space-y-4">
        {testSuites.map((suite) => (
          <div key={suite.id} className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Icon name={suite.icon} size={20} color="var(--color-primary)" />
                <div>
                  <h4 className="text-sm font-medium text-text-primary">{suite.name}</h4>
                  <p className="text-xs text-text-secondary">{suite.description}</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                iconName="Play"
                iconSize={14}
                onClick={() => runTestSuite(suite.id)}
                disabled={runningTests.some(test => test.startsWith(suite.id))}
              >
                Run Suite
              </Button>
            </div>

            <div className="space-y-3">
              {suite.tests.map((test) => (
                <div key={test.id} className="flex items-center justify-between p-3 bg-surface rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Icon 
                      name={getTestIcon(suite.id, test.id)} 
                      size={16} 
                      color={getTestColor(suite.id, test.id)}
                      className={isTestRunning(suite.id, test.id) ? 'animate-spin' : ''}
                    />
                    <div>
                      <h5 className="text-sm font-medium text-text-primary">{test.name}</h5>
                      <p className="text-xs text-text-secondary">{test.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {(() => {
                      const result = getTestResult(suite.id, test.id);
                      if (result) {
                        return (
                          <div className="text-right">
                            <p className={`text-xs font-medium ${
                              result.success ? 'text-success' : 'text-error'
                            }`}>
                              {result.success ? 'Passed' : 'Failed'}
                            </p>
                            <p className="text-xs text-text-muted">
                              {result.duration}ms
                            </p>
                          </div>
                        );
                      }
                      return null;
                    })()}
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Play"
                      iconSize={12}
                      onClick={() => runTest(suite.id, test.id)}
                      disabled={isTestRunning(suite.id, test.id)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Test Results Summary */}
      {testResults.length > 0 && (
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Test Results Summary</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-surface p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="CheckCircle" size={16} color="var(--color-success)" />
                <span className="text-sm font-medium text-success">Passed</span>
              </div>
              <p className="text-xl font-bold text-text-primary">
                {testResults.filter(r => r.success).length}
              </p>
            </div>
            
            <div className="bg-surface p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="XCircle" size={16} color="var(--color-error)" />
                <span className="text-sm font-medium text-error">Failed</span>
              </div>
              <p className="text-xl font-bold text-text-primary">
                {testResults.filter(r => !r.success).length}
              </p>
            </div>
            
            <div className="bg-surface p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="Clock" size={16} color="var(--color-text-muted)" />
                <span className="text-sm font-medium text-text-secondary">Avg Duration</span>
              </div>
              <p className="text-xl font-bold text-text-primary">
                {testResults.length > 0 
                  ? Math.round(testResults.reduce((sum, r) => sum + r.duration, 0) / testResults.length)
                  : 0}ms
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestingPanel;