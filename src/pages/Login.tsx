import React, { useState } from 'react';
import { useStore } from '../store';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { LogIn, Mail, Lock } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const { login, users } = useStore();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const existingUser = users.find(u => u.email === email);
    if (!existingUser) {
      setError('User not found. Try one of the demo accounts.');
      return;
    }
    login(email);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md text-center mb-8">
        <div className="mx-auto w-12 h-12 bg-navy text-white flex items-center justify-center rounded-xl mb-6">
          <LogIn className="h-6 w-6" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome back</h2>
        <p className="text-slate-500">Log in to your account</p>
      </div>
      
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <div className="mb-6 space-y-2">
          <p className="text-xs font-bold uppercase text-slate-500 mb-2">Demo Accounts (Click to auto-fill):</p>
          <div className="grid grid-cols-1 gap-2">
            {users.slice(0, 4).map(u => (
              <button 
                key={u.id} 
                onClick={() => setEmail(u.email)} 
                type="button"
                className="text-left px-3 py-2 text-xs bg-slate-50 hover:bg-slate-100 rounded border border-slate-200 text-slate-700 transition-colors"
              >
                <span className="font-bold text-navy mr-1">{u.role}</span>
                {u.email}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="mt-2 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-1">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail className="h-5 w-5" />
              </div>
              <input 
                type="text" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent text-sm transition-all"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-slate-900">Password</label>
              <a href="#" className="text-xs text-navy hover:underline">Forgot password?</a>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="h-5 w-5" />
              </div>
              <input 
                type="password" 
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent text-sm transition-all"
                placeholder="••••••••"
                required={!email.includes('u1')}
              />
            </div>
          </div>

          <Button type="submit" className="w-full py-2.5 bg-navy hover:bg-navy/90 text-white rounded-lg font-medium text-sm transition-colors mt-2">
            Log in
          </Button>
        </form>
      </div>

      <div className="mt-8 text-center text-sm text-slate-500">
        Don't have an account? <Link to="/register" className="text-navy font-bold hover:underline">Sign up</Link>
      </div>
    </div>
  );
}
