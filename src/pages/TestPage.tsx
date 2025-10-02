import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

const TestPage: React.FC = () => {
  const handleAdminLogin = () => {
    // Simulate admin login
    localStorage.setItem('user_role', 'admin');
    localStorage.setItem('user_name', 'Test Admin');
    localStorage.setItem('is_authenticated', 'true');
    window.location.href = '/admin';
  };

  const clearAuth = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-background-light flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Test Authentication</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Current Status:</h3>
            <p className="text-sm text-text-secondary">
              Auth: {localStorage.getItem('is_authenticated') || 'false'}
            </p>
            <p className="text-sm text-text-secondary">
              Role: {localStorage.getItem('user_role') || 'none'}
            </p>
            <p className="text-sm text-text-secondary">
              User: {localStorage.getItem('user_name') || 'none'}
            </p>
          </div>

          <div className="space-y-2">
            <Button onClick={handleAdminLogin} className="w-full">
              Login as Admin
            </Button>
            <Button onClick={clearAuth} variant="outline" className="w-full">
              Clear Auth & Return Home
            </Button>
          </div>

          <div className="pt-4 border-t border-border">
            <h3 className="font-medium mb-2">Quick Links:</h3>
            <div className="space-y-1">
              <a href="/" className="block text-sm text-primary hover:underline">Home</a>
              <a href="/projects" className="block text-sm text-primary hover:underline">Projects</a>
              <a href="/login" className="block text-sm text-primary hover:underline">Login</a>
              <a href="/admin" className="block text-sm text-primary hover:underline">Admin Dashboard</a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestPage;
