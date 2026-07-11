import React from 'react';
import { useStore } from '../../store';
import { getTranslations } from '../../i18n';
import { Package, Gavel, FileText, TrendingUp, Inbox } from 'lucide-react';

export default function SupplierDashboard() {
  const { currentUser, lots, bids, contracts, language } = useStore();
  const t = getTranslations(language);
  
  if (!currentUser) return null;

  const myLots = lots.filter(l => l.supplierId === currentUser.id);
  const myBids = bids.filter(b => b.supplierId === currentUser.id);
  const myContracts = contracts.filter(c => c.supplierId === currentUser.id);

  const activeLots = myLots.filter(l => l.status === 'Active').length;
  const incomingBids = myBids.filter(b => b.status === 'Pending').length;
  const pendingSignatures = myContracts.filter(c => c.status === 'Pending Signature').length;
  const totalRevenue = myContracts
    .filter(c => c.status === 'Completed')
    .reduce((acc, curr) => acc + (curr.agreedPrice * curr.agreedQuantity), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-1">{t['header.welcomeBack']} {currentUser.name}</h1>
        <div className="flex items-center text-slate-500 text-sm">
          <span>{t[`role.${currentUser.role}`]}</span>
          <span className="mx-2">&middot;</span>
          <span>&mdash;</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
          <div>
            <div className="text-slate-500 text-sm font-medium mb-1">{t['dash.activeLots']}</div>
            <div className="text-2xl font-bold text-slate-900">{activeLots}</div>
          </div>
          <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600">
            <Package className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
          <div>
            <div className="text-slate-500 text-sm font-medium mb-1">{t['dash.incomingBids']}</div>
            <div className="text-2xl font-bold text-slate-900">{incomingBids}</div>
          </div>
          <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center text-yellow-600">
            <Gavel className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
          <div>
            <div className="text-slate-500 text-sm font-medium mb-1">{t['dash.pendingSignatures']}</div>
            <div className="text-2xl font-bold text-slate-900">{pendingSignatures}</div>
          </div>
          <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600">
            <FileText className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
          <div>
            <div className="text-slate-500 text-sm font-medium mb-1">{t['dash.totalRevenueShort']}</div>
            <div className="text-2xl font-bold text-slate-900">{totalRevenue} ETB</div>
          </div>
          <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-green-600">
            <TrendingUp className="h-5 w-5" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-80">
          <div className="p-4 border-b border-slate-100 flex items-center gap-2">
            <FileText className="h-4 w-4 text-slate-600" />
            <h2 className="font-bold text-slate-900">{t['dash.recentActivity']}</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {myBids.length === 0 && myContracts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <Inbox className="h-8 w-8 text-slate-400" />
                </div>
                <p className="text-slate-900 font-medium">{t['dash.noRecentActivity']}</p>
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
                      <p className="font-medium text-slate-900 mb-0.5">{isBid ? `${t['dash.bid']}: ${item.quantity} Qtl` : `${t['dash.contract']}: ${item.agreedQuantity} Qtl`}</p>
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

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-80">
          <div className="p-4 border-b border-slate-100 flex items-center gap-2">
            <Gavel className="h-4 w-4 text-slate-600" />
            <h2 className="font-bold text-slate-900">{t['dash.incomingBids']}</h2>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            {myBids.filter(b => b.status === 'Pending').length === 0 ? (
              <>
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <Inbox className="h-8 w-8 text-slate-400" />
                </div>
                <p className="text-slate-900 font-medium">{t['dash.noPendingBids']}</p>
              </>
            ) : (
              <p className="text-slate-900 font-medium">{t['dash.pendingBidsCount'].replace('{count}', String(myBids.filter(b => b.status === 'Pending').length))}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
