import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import { useAuth } from '../hooks/useAuth';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    // Basic validation for demo
    if (!email.includes('@')) {
      setError('Please enter a valid email.');
      return;
    }
    // Mock login
    try {
      login(email);
      navigate('/');
    } catch (err) {
      setError('Failed to log in.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-full">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                Sign in to your account
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Or <Link to="/signup" className="font-medium text-brand-primary hover:text-indigo-500">
                    create a new account
                </Link>
            </p>
            <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
                <Link to="/" className="hover:underline">
                    &larr; Back to Home
                </Link>
            </p>
        </div>
        <Card className="p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input
              id="email"
              label="Email address"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              id="password"
              label="Password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
            <div>
              <Button type="submit" className="w-full">
                Sign in
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;