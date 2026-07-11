import React, { useState } from 'react';
import { useStore } from '../store';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { UserPlus, Coffee, Building2, ClipboardCheck, Mail, Lock, User, Briefcase } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    email: '',
    role: 'Supplier'
  });
  const [error, setError] = useState('');
  const { registerUser, login, users } = useStore();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerUser({
        name: formData.name || formData.email.split('@')[0],
        companyName: formData.companyName || 'Unknown Company',
        email: formData.email,
        role: formData.role as any,
        kybDocuments: ['pending.pdf']
      });
      alert('Registration successful. KYB documents pending admin review.');
      navigate('/login');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md text-center mb-8">
        <div className="mx-auto w-12 h-12 bg-navy text-white flex items-center justify-center rounded-xl mb-6">
          <UserPlus className="h-6 w-6" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Create your account</h2>
        <p className="text-slate-500">Sign up to get started</p>
      </div>

      <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="mt-2 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-3">I am a...</label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'Supplier' })}
                className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-colors ${formData.role === 'Supplier' ? 'border-navy bg-slate-50 text-navy' : 'border-slate-100 bg-white text-slate-600 hover:border-slate-200'}`}
              >
                <Coffee className="h-6 w-6 mb-2" />
                <span className="text-xs font-medium">Supplier</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'Exporter' })}
                className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-colors ${formData.role === 'Exporter' ? 'border-navy bg-slate-50 text-navy' : 'border-slate-100 bg-white text-slate-600 hover:border-slate-200'}`}
              >
                <Building2 className="h-6 w-6 mb-2" />
                <span className="text-xs font-medium">Exporter</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'Inspector' })}
                className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-colors ${formData.role === 'Inspector' ? 'border-navy bg-slate-50 text-navy' : 'border-slate-100 bg-white text-slate-600 hover:border-slate-200'}`}
              >
                <ClipboardCheck className="h-6 w-6 mb-2" />
                <span className="text-xs font-medium">Inspector</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-1">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <User className="h-5 w-5" />
              </div>
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent text-sm transition-all"
                placeholder="John Doe"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-1">Company Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Briefcase className="h-5 w-5" />
              </div>
              <input 
                type="text" 
                value={formData.companyName}
                onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent text-sm transition-all"
                placeholder="Company LLC"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-1">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail className="h-5 w-5" />
              </div>
              <input 
                type="email" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent text-sm transition-all"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="h-5 w-5" />
              </div>
              <input 
                type="password" 
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent text-sm transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full py-2.5 bg-navy hover:bg-navy/90 text-white rounded-lg font-medium text-sm transition-colors mt-2">
            Create account
          </Button>
        </form>
      </div>

      <div className="mt-8 text-center text-sm text-slate-500">
        Already have an account? <Link to="/login" className="text-navy font-bold hover:underline">Log in</Link>
      </div>
    </div>
  );
}
