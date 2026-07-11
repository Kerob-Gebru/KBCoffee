import React from 'react';
import { useStore } from '../../store';
import { translations } from '../../i18n';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Coffee, FileSignature, DollarSign, TrendingUp, Inbox, FileText } from 'lucide-react';

export default function ExporterDashboard() {
  const { currentUser, bids, contracts, language } = useStore();
  const t = translations[language];

  if (!currentUser) return null;

  const myBids = bids.filter(b => b.exporterId === currentUser.id);
  const myContracts = contracts.filter(c => c.exporterId === currentUser.id);

  const stats = [
    { label: 'Active Bids', value: myBids.filter(b => b.status === 'Pending').length, icon: TrendingUp, bg: 'bg-yellow-50', text: 'text-yellow-600' },
    { label: 'Pending Signatures', value: myContracts.filter(c => c.status === 'Pending Signature').length, icon: FileSignature, bg: 'bg-orange-50', text: 'text-orange-600' },
    { label: 'Completed Contracts', value: myContracts.filter(c => c.status === 'Active' || c.status === 'Completed').length, icon: Coffee, bg: 'bg-slate-100', text: 'text-slate-600' },
    { label: 'Total Volume (Qtl)', value: myContracts.reduce((acc, c) => acc + c.agreedQuantity, 0), icon: DollarSign, bg: 'bg-green-50', text: 'text-green-600' },
  ];

  const chartData = [
    { name: 'Yirgacheffe', price: 45000 },
    { name: 'Sidamo', price: 38000 },
    { name: 'Guji', price: 48000 },
    { name: 'Limu', price: 32000 },
    { name: 'Jimma', price: 25000 },
    { name: 'Harrar', price: 34000 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-1">Welcome back, {currentUser.name}</h1>
        <div className="flex items-center text-slate-500 text-sm">
          <span>{currentUser.role}</span>
          <span className="mx-2">&middot;</span>
          <span>&mdash;</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
            <div>
              <div className="text-slate-500 text-sm font-medium mb-1">{stat.label}</div>
              <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
            </div>
            <div className={`w-10 h-10 ${stat.bg} rounded-lg flex items-center justify-center ${stat.text}`}>
              <stat.icon className="h-5 w-5" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col h-80">
          <h2 className="font-bold text-slate-900 mb-6">Price Transparency (Avg ETB/Qtl)</h2>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} />
                <Tooltip cursor={{fill: 'rgba(0,0,0,0.05)'}} contentStyle={{borderRadius: '0.5rem', border: '1px solid #e2e8f0', backgroundColor: 'white', color: '#0f172a'}} />
                <Bar dataKey="price" fill="#d4af37" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-80">
          <div className="p-4 border-b border-slate-100 flex items-center gap-2">
            <FileText className="h-4 w-4 text-slate-600" />
            <h2 className="font-bold text-slate-900">Recent Activity</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {myBids.length === 0 && myContracts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <Inbox className="h-8 w-8 text-slate-400" />
                </div>
                <p className="text-slate-900 font-medium">No recent activity</p>
              </div>
            ) : (
              [...myBids, ...myContracts].sort((a: any, b: any) => {
                const dateA = a.timestamp || a.createdAt;
                const dateB = b.timestamp || b.createdAt;
                return new Date(dateB).getTime() - new Date(dateA).getTime();
              }).slice(0, 5).map((item: any) => {
                const isBid = 'exporterId' in item && 'timestamp' in item;
                const statusColor = item.status === 'Pending' || item.status === 'Pending Signature' ? 'bg-amber-100 text-amber-800' :
                                    item.status === 'Active' || item.status === 'Accepted' || item.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                    'bg-red-100 text-red-800';

                return (
                  <div key={item.id} className="bg-slate-50 p-4 rounded-lg border border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900 mb-0.5">{isBid ? `Bid: ${item.quantity} Qtl` : `Contract: ${item.agreedQuantity} Qtl`}</p>
                      <p className="text-xs text-slate-500">{new Date(isBid ? item.timestamp : item.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColor}`}>
                      {item.status}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
