import React from 'react';
import { useStore } from '../store';
import { getTranslations } from '../i18n';
import { Button } from '../components/ui/Button';
import { FileText, CheckCircle } from 'lucide-react';

export default function Contracts() {
  const { currentUser, contracts, lots, users, signContract, language } = useStore();
  const t = getTranslations(language);

  if (!currentUser) return null;

  const myContracts = contracts.filter(c => c.supplierId === currentUser.id || c.exporterId === currentUser.id);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-navy uppercase tracking-wide">{t['contracts.title']}</h1>

      <div className="space-y-4">
        {myContracts.length === 0 && <p className="text-slate-500">{t['contracts.none']}</p>}
        {myContracts.map(contract => {
          const lot = lots.find(l => l.id === contract.lotId);
          const counterpartyId = currentUser.role === 'Supplier' ? contract.exporterId : contract.supplierId;
          const counterparty = users.find(u => u.id === counterpartyId);
          const hasSigned = currentUser.role === 'Supplier' ? contract.supplierSigned : contract.exporterSigned;
          
          return (
            <div key={contract.id} className="bg-white p-6 shadow-sm shadow-black/5 rounded-sm border-l-4 border-gold flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="bg-slate-50 border border-slate-100 p-2 rounded-sm">
                    <FileText className="h-6 w-6 text-navy" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-navy uppercase tracking-wide">{t['contracts.contract']} #{contract.id.toUpperCase()}</h3>
                    <p className="text-xs text-slate-500">{t['contracts.lot']}: {lot?.name}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2 py-1 uppercase tracking-widest text-[9px] font-bold ${
                    contract.status === 'Pending Signature' ? 'bg-amber-100 text-amber-800' :
                    contract.status === 'Active' ? 'bg-emerald-100 text-emerald-800' :
                    'bg-slate-100 text-slate-800'
                  }`}>
                    {contract.status}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs bg-slate-50 p-4 border border-slate-100 rounded-sm">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">{t['contracts.counterparty']}</div>
                  <div className="font-bold text-navy">{counterparty?.companyName}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">{t['contracts.totalVolume']}</div>
                  <div className="font-bold text-navy">{contract.agreedQuantity} Qtl</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">{t['contracts.agreedPrice']}</div>
                  <div className="font-bold text-navy">{contract.agreedPrice.toLocaleString()} ETB/Qtl</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">{t['contracts.totalValue']}</div>
                  <div className="font-bold text-navy">{(contract.agreedQuantity * contract.agreedPrice).toLocaleString()} ETB</div>
                </div>
              </div>

              <div className="flex justify-between items-center border-t border-slate-100 pt-4">
                <div className="flex gap-4 text-xs font-bold text-slate-500">
                  <div className="flex items-center gap-1 uppercase">
                    {t['contracts.supplier']}: {contract.supplierSigned ? <CheckCircle className="h-4 w-4 text-emerald-500"/> : t['contracts.pending']}
                  </div>
                  <div className="flex items-center gap-1 uppercase">
                    {t['contracts.exporter']}: {contract.exporterSigned ? <CheckCircle className="h-4 w-4 text-emerald-500"/> : t['contracts.pending']}
                  </div>
                </div>
                {!hasSigned && contract.status === 'Pending Signature' && (
                  <Button variant="gold" onClick={() => signContract(contract.id, currentUser.role as any)}>
                    {t['contracts.sign']}
                  </Button>
                )}
                {hasSigned && (
                  <Button variant="outline" disabled>{t['contracts.signed']}</Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
