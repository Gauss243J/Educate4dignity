import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent } from '../../components/ui/Card';
import { LanguageSelector } from '../../components/ui/LanguageSelector';
import { useAuth } from '../../hooks/authContext';
import Logo from '../../components/ui/Logo';

const Login: React.FC = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
    } finally {
      setLoading(false);
    }

    // Role-based redirect simple
    if (email.startsWith('admin')) navigate('/admin');
    else if (email.includes('supplier')) navigate('/partner/suppliers');
    else if (email.includes('distrib')) navigate('/partner/distributors');
    else if (email.includes('trainer')) navigate('/partner/trainers');
    else if (email.includes('team')) navigate('/team');
    else if (email.includes('donor')) navigate('/donor');
    else navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Logo size="lg" className="flex items-center" withText={false} />
          </div>
          <p className="mt-2 text-text-secondary">{t('auth.signin')} to your account</p>
          <div className="mt-4 flex justify-center">
            <LanguageSelector />
          </div>
        </div>
        
        <Card>
          <CardContent>
            <h2 className="text-xl font-semibold mb-4">{t('auth.login')}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label={t('auth.email')}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('auth.enterEmail')}
                required
              />
              
              <Input
                label={t('auth.password')}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('auth.enterPassword')}
                required
              />
              
              <div className="flex items-center justify-between">
                <label className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-primary border-border rounded"
                  />
                  <span className="ml-2 text-text-secondary">{t('auth.rememberMe')}</span>
                </label>
                
                <Link 
                  to="/forgot-password" 
                  className="text-sm text-primary hover:text-primary-dark"
                >
                  {t('auth.forgotPassword')}
                </Link>
              </div>
              
              <Button 
                type="submit" 
                loading={loading}
                className="w-full"
              >
                {t('auth.signin')}
              </Button>
            </form>
            
            <div className="mt-6 text-center text-sm text-text-secondary">
              {t('auth.noAccount')}{' '}
              <Link 
                to="/register" 
                className="text-primary hover:text-primary-dark font-medium"
              >
                {t('auth.signup')}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
