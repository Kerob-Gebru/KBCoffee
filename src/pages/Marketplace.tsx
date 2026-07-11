import React, { useState } from 'react';
import { useStore } from '../store';
import { getTranslations } from '../i18n';
import { Search, MapPin, Award, Scale, Coffee, Filter } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function Marketplace() {
  const { lots, language, currentUser, addBid } = useStore();
  const t = getTranslations(language);

  const [searchTerm, setSearchTerm] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');
  const [processingFilter, setProcessingFilter] = useState('');
  const [certifiedOnly, setCertifiedOnly] = useState(false);
  const [priceRange, setPriceRange] = useState<number>(100000); // Max price
  
  const activeLots = lots.filter(l => l.status === 'Active');

  const filteredLots = activeLots.filter(lot => {
    const matchesSearch = lot.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = regionFilter ? lot.region === regionFilter : true;
    const matchesGrade = gradeFilter ? lot.grade.toString() === gradeFilter : true;
    const matchesProcessing = processingFilter ? lot.processingMethod === processingFilter : true;
    const matchesCertified = certifiedOnly ? lot.qualityBadge : true;
    const matchesPrice = lot.price <= priceRange;
    return matchesSearch && matchesRegion && matchesGrade && matchesProcessing && matchesCertified && matchesPrice;
  });

  const handleBid = (lotId: string, supplierId: string, price: number, quantity: number) => {
    if (!currentUser || currentUser.role !== 'Exporter') return alert('Only Exporters can bid');
    const bidPrice = prompt(`Enter your bid price (ETB/Qtl):`, price.toString());
    const bidQuantity = prompt(`Enter quantity (Qtl):`, quantity.toString());
    if (bidPrice && bidQuantity) {
      addBid({
        lotId,
        exporterId: currentUser.id,
        supplierId,
        price: Number(bidPrice),
        quantity: Number(bidQuantity),
        deliveryDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
        comments: 'Standard delivery'
      });
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Sidebar Filters */}
      <div className="w-full md:w-64 flex-shrink-0 space-y-6 bg-white p-5 rounded-lg border border-slate-200 shadow-sm h-fit">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Filter className="h-5 w-5 text-navy" />
          <h2 className="font-bold text-slate-900 uppercase tracking-wide">Filters</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase text-slate-500 mb-1 block">Origin / Region</label>
            <select 
              className="w-full border border-slate-300 rounded-sm px-3 py-2 bg-white text-xs"
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
            >
              <option value="">All Regions</option>
              <option value="Yirgacheffe">Yirgacheffe</option>
              <option value="Sidamo">Sidamo</option>
              <option value="Guji">Guji</option>
              <option value="Jimma">Jimma</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-slate-500 mb-1 block">Processing Method</label>
            <select 
              className="w-full border border-slate-300 rounded-sm px-3 py-2 bg-white text-xs"
              value={processingFilter}
              onChange={(e) => setProcessingFilter(e.target.value)}
            >
              <option value="">All Methods</option>
              <option value="Washed">Washed</option>
              <option value="Natural">Natural</option>
              <option value="Honey">Honey</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-slate-500 mb-1 block">Grade</label>
            <select 
              className="w-full border border-slate-300 rounded-sm px-3 py-2 bg-white text-xs"
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
            >
              <option value="">All Grades</option>
              <option value="1">Grade 1</option>
              <option value="2">Grade 2</option>
              <option value="3">Grade 3</option>
              <option value="4">Grade 4</option>
              <option value="5">Grade 5</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-slate-500 mb-1 block">Max Price (ETB)</label>
            <div className="flex items-center justify-between text-xs text-navy font-bold mb-1">
              <span>0</span>
              <span>{priceRange.toLocaleString()}</span>
            </div>
            <input 
              type="range" 
              min="10000" 
              max="100000" 
              step="1000"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full accent-navy"
            />
          </div>

          <div className="pt-2 border-t border-slate-100">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={certifiedOnly}
                onChange={(e) => setCertifiedOnly(e.target.checked)}
                className="rounded text-navy focus:ring-navy"
              />
              <span className="text-sm font-medium text-slate-700">Farm Certified Only</span>
            </label>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-6">
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl font-bold text-navy uppercase tracking-wide">{t['market.title']}</h1>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder={t['market.search']}
              className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-navy focus:border-navy bg-slate-50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredLots.map(lot => (
            <div key={lot.id} className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm hover:shadow-md hover:border-gold transition-all flex flex-col">
              <div className="h-40 bg-slate-200 relative">
                {lot.photos[0] ? (
                  <img src={lot.photos[0]} alt={lot.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <Coffee className="h-10 w-10" />
                  </div>
                )}
                {lot.qualityBadge && (
                  <div className="absolute top-2 right-2 bg-emerald-500 text-white text-[10px] px-2 py-1 rounded-sm font-bold uppercase shadow-sm">
                    Certified
                  </div>
                )}
              </div>
              
              <div className="p-5 flex flex-col flex-grow">
                <h3 className="font-bold text-base text-slate-900 line-clamp-1 mb-1" title={lot.name}>{lot.name}</h3>
                
                <p className="text-xs text-slate-500 mb-4 flex flex-wrap gap-1 items-center">
                  <span className="bg-slate-100 px-2 py-0.5 rounded-sm">{lot.region}</span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded-sm">{lot.processingMethod}</span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded-sm">Grade {lot.grade}</span>
                </p>
                
                <div className="mt-auto pt-4 border-t border-slate-100 flex items-end justify-between">
                  <div>
                    <div className="text-xs text-slate-500 font-medium">{t['market.price']}</div>
                    <div className="font-bold text-lg text-navy">{lot.price.toLocaleString()} ETB<span className="text-xs font-normal text-slate-500">/Qtl</span></div>
                  </div>
                  {(!currentUser || currentUser.role === 'Exporter') && (
                    <Button size="sm" variant="default" onClick={() => handleBid(lot.id, lot.supplierId, lot.price, lot.quantity)} className="bg-navy hover:bg-navy/90 text-white rounded-md px-4">
                      {t['market.bid']}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {filteredLots.length === 0 && (
            <div className="col-span-full py-12 text-center bg-white rounded-lg border border-slate-200 border-dashed">
              <Coffee className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-slate-900">No lots found</h3>
              <p className="text-slate-500 mt-1">Try adjusting your filters or search term.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
