import React from 'react';
import { useStore } from '../store';
import { Button } from '../components/ui/Button';

export default function Negotiations() {
  const { currentUser, bids, lots, users, updateBidStatus, createContract } = useStore();

  if (!currentUser) return null;

  const relevantBids = bids.filter(b => b.supplierId === currentUser.id || b.exporterId === currentUser.id);

  const handleAccept = (bidId: string) => {
    updateBidStatus(bidId, 'Accepted');
    const bid = bids.find(b => b.id === bidId);
    if (bid) {
      createContract({
        bidId: bid.id,
        lotId: bid.lotId,
        supplierId: bid.supplierId,
        exporterId: bid.exporterId,
        agreedPrice: bid.price,
        agreedQuantity: bid.quantity,
        deliveryLocation: 'Addis Ababa Warehouse',
        deliveryDeadline: bid.deliveryDate,
        paymentTerms: '30 Days Net'
      });
      alert('Bid accepted! Contract draft generated automatically.');
    }
  };

  const handleDecline = (bidId: string) => {
    updateBidStatus(bidId, 'Declined');
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-navy uppercase tracking-wide">Negotiations & Bids</h1>

      <div className="space-y-4">
        {relevantBids.length === 0 && <p className="text-slate-500">No active negotiations.</p>}
        {relevantBids.map(bid => {
          const lot = lots.find(l => l.id === bid.lotId);
          const counterpartyId = currentUser.role === 'Supplier' ? bid.exporterId : bid.supplierId;
          const counterparty = users.find(u => u.id === counterpartyId);
          
          return (
            <div key={bid.id} className="bg-white p-6 shadow-sm shadow-black/5 rounded-sm border-l-4 border-slate-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className={`inline-flex items-center px-2 py-1 uppercase tracking-widest text-[9px] font-bold ${
                    bid.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                    bid.status === 'Accepted' ? 'bg-emerald-100 text-emerald-800' :
                    'bg-rose-100 text-rose-800'
                  }`}>
                    {bid.status}
                  </span>
                  <span className="text-xs text-slate-500">{new Date(bid.timestamp).toLocaleDateString()}</span>
                </div>
                <h3 className="font-bold text-sm uppercase text-navy line-clamp-1">Lot: {lot?.name || bid.lotId}</h3>
                <p className="text-xs text-slate-600 mt-1">Offered by <span className="font-bold">{counterparty?.name}</span> ({counterparty?.companyName})</p>
                <div className="mt-2 text-sm bg-slate-50 border border-slate-100 inline-block p-2">
                  <span className="font-bold text-navy text-[10px] uppercase">Bid Details:</span> <br/>
                  <span className="font-bold">{bid.quantity} Qtl</span> @ <span className="font-bold text-navy">{bid.price.toLocaleString()} ETB/Qtl</span>
                </div>
              </div>

              {currentUser.role === 'Supplier' && bid.status === 'Pending' && (
                <div className="flex gap-2 w-full md:w-auto">
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => handleDecline(bid.id)}>Decline</Button>
                  <Button size="sm" variant="default" className="flex-1" onClick={() => handleAccept(bid.id)}>Accept & Contract</Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
