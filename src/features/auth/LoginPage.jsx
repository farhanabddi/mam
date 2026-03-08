import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await login(email, password);
      // On success, redirect to the dashboard/sales page
      navigate('/sales'); 
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-xl border-t-4 border-t-emerald-600">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">MAM System</h1>
          <p className="text-sm text-slate-500 mt-2">Medical & Accounting Management</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md border border-red-200 text-sm mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <Input 
            id="email"
            type="email" 
            label="Email Address" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          
          <Input 
            id="password"
            type="password" 
            label="Password" 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button 
            type="submit" 
            className="w-full py-2.5 mt-2" 
            isLoading={isSubmitting}
          >
            Secure Login
          </Button>
        </form>
        
        <div className="mt-8 text-center text-xs text-slate-400">
          Authorized personnel only. All access is logged.
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;