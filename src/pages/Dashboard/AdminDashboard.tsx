import React from 'react';
import { useStore } from '../../store';
import { getTranslations } from '../../i18n';
import { Button } from '../../components/ui/Button';
import { ShieldCheck, Users, Activity, FileCheck } from 'lucide-react';

export default function AdminDashboard() {
  const { currentUser, users, language } = useStore();
  const t = getTranslations(language);

  if (!currentUser || currentUser.role !== 'Admin') return null;

  const pendingUsers = users.filter(u => u.status === 'Pending');

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-navy uppercase tracking-wide">{t['admin.title']}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-4 flex flex-col justify-between shadow-sm shadow-black/5 rounded-sm border-l-4 border-gold">
          <span className="text-[10px] font-bold text-slate-500 uppercase">{t['admin.totalUsers']}</span>
          <div className="flex items-end justify-between mt-2">
            <span className="text-3xl font-bold text-navy">{users.length}</span>
            <Users className="h-5 w-5 text-slate-400 mb-1" />
          </div>
        </div>
        <div className="bg-white p-4 flex flex-col justify-between shadow-sm shadow-black/5 rounded-sm border-l-4 border-slate-300">
          <span className="text-[10px] font-bold text-slate-500 uppercase">{t['admin.pendingKyb']}</span>
          <div className="flex items-end justify-between mt-2">
            <span className="text-3xl font-bold text-navy">{pendingUsers.length}</span>
            <ShieldCheck className="h-5 w-5 text-slate-400 mb-1" />
          </div>
        </div>
        <div className="bg-white p-4 flex flex-col justify-between shadow-sm shadow-black/5 rounded-sm border-l-4 border-slate-300">
          <span className="text-[10px] font-bold text-slate-500 uppercase">{t['admin.platformHealth']}</span>
          <div className="flex items-end justify-between mt-2">
            <span className="text-3xl font-bold text-navy">99.9%</span>
            <Activity className="h-5 w-5 text-slate-400 mb-1" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-sm shadow-sm shadow-black/5 border border-slate-100 flex flex-col">
        <h2 className="font-bold text-navy uppercase tracking-wide mb-4 border-b border-slate-100 pb-4">{t['admin.kybQueue']}</h2>
        <div className="space-y-3 flex-1">
          {pendingUsers.length === 0 && <p className="text-slate-500 text-sm">{t['admin.noPending']}</p>}
          {pendingUsers.map(user => (
            <div key={user.id} className="bg-slate-50 p-3 border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase mb-0.5 text-navy">{user.companyName}</p>
                <p className="text-[9px] text-slate-500">{user.name} • {user.role} • {user.email}</p>
                <div className="text-[9px] text-slate-400 mt-1 flex items-center gap-1 font-bold">
                  <FileCheck className="h-3 w-3" /> {t['admin.documents']}: {user.kybDocuments.join(', ')}
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white">{t['admin.reject']}</Button>
                <Button size="sm" variant="default">{t['admin.approveKyb']}</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
