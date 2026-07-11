import React, { useState } from 'react';
import { useStore } from '../../store';
import { getTranslations } from '../../i18n';
import { Button } from '../../components/ui/Button';
import { Plus, MapPin, Coffee, ArrowLeft, Upload } from 'lucide-react';

export default function ManageLots() {
  const { currentUser, lots, addLot, language } = useStore();
  const t = getTranslations(language);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '', region: 'Yirgacheffe', processingMethod: 'Washed', grade: 2, quantity: '', price: '', harvestSeason: '2025/2026', description: '', cuppingNotes: ''
  });

  if (!currentUser || currentUser.role !== 'Supplier') return <p className="p-8 text-slate-500">Access denied.</p>;

  const myLots = lots.filter(l => l.supplierId === currentUser.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addLot({
      supplierId: currentUser.id,
      name: formData.name,
      region: formData.region,
      processingMethod: formData.processingMethod as any,
      grade: Number(formData.grade),
      quantity: Number(formData.quantity),
      price: Number(formData.price),
      harvestSeason: formData.harvestSeason,
      availableFrom: new Date().toISOString().split('T')[0],
      photos: [],
      qualityDocuments: [],
      expiryDate: new Date(Date.now() + 90 * 86400000).toISOString()
    });
    setShowForm(false);
    // Reset form
    setFormData({
      name: '', region: 'Yirgacheffe', processingMethod: 'Washed', grade: 2, quantity: '', price: '', harvestSeason: '2025/2026', description: '', cuppingNotes: ''
    });
  };

  if (showForm) {
    return (
      <div className="max-w-3xl">
        <button 
          onClick={() => setShowForm(false)} 
          className="flex items-center gap-2 text-slate-500 hover:text-navy mb-4 transition-colors text-sm font-medium"
        >
          <ArrowLeft className="h-4 w-4" /> {t['lots.back']}
        </button>
        <h1 className="text-3xl font-bold text-slate-900 mb-6">{t['lots.listNew']}</h1>

        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">{t['lots.lotCode']}</label>
              <input 
                type="text" 
                required 
                placeholder="e.g. YG-2026-001"
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent transition-all" 
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">{t['lots.grade']}</label>
                <select 
                  value={formData.grade} 
                  onChange={e => setFormData({...formData, grade: Number(e.target.value)})} 
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent transition-all bg-white"
                >
                  {[1,2,3,4,5].map(g => <option key={g} value={g}>{t['lots.grade']} {g}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">{t['lots.processingMethod']}</label>
                <select 
                  value={formData.processingMethod} 
                  onChange={e => setFormData({...formData, processingMethod: e.target.value})} 
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent transition-all bg-white"
                >
                  <option value="Washed">Washed</option>
                  <option value="Natural">Natural</option>
                  <option value="Honey">Honey</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">{t['lots.region']}</label>
                <select 
                  value={formData.region} 
                  onChange={e => setFormData({...formData, region: e.target.value})} 
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent transition-all bg-white"
                >
                  <option value="Yirgacheffe">Yirgacheffe</option>
                  <option value="Sidamo">Sidamo</option>
                  <option value="Guji">Guji</option>
                  <option value="Jimma">Jimma</option>
                  <option value="Harrar">Harrar</option>
                  <option value="Limu">Limu</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">{t['lots.quantity']}</label>
                <input 
                  type="number" 
                  required 
                  min={1} 
                  value={formData.quantity} 
                  onChange={e => setFormData({...formData, quantity: e.target.value})} 
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent transition-all" 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">{t['lots.askingPrice']}</label>
              <input 
                type="number" 
                required 
                min={1} 
                value={formData.price} 
                onChange={e => setFormData({...formData, price: e.target.value})} 
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent transition-all" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">{t['lots.harvestSeason']}</label>
              <input 
                type="text" 
                required 
                value={formData.harvestSeason} 
                onChange={e => setFormData({...formData, harvestSeason: e.target.value})} 
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent transition-all" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">{t['lots.description']}</label>
              <textarea 
                rows={3}
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})} 
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent transition-all resize-y" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">{t['lots.cuppingNotes']}</label>
              <textarea 
                rows={3}
                value={formData.cuppingNotes} 
                onChange={e => setFormData({...formData, cuppingNotes: e.target.value})} 
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent transition-all resize-y" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">{t['lots.uploadDocs']}</label>
              <button type="button" className="flex items-center gap-2 px-4 py-2 border border-dashed border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors">
                <Upload className="h-4 w-4" />
                {t['lots.uploadDocs']}
              </button>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" className="bg-navy hover:bg-navy/90 text-white rounded-lg px-8 py-2">
                {t['lots.create']}
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="rounded-lg px-8 py-2">
                {t['lots.cancel']}
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-1">{t['lots.title']}</h1>
          <p className="text-slate-500 text-sm">{myLots.length} {t['lots.count']}</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-navy hover:bg-navy/90 text-white gap-2 rounded-lg py-2">
          <Plus className="h-4 w-4" /> {t['lots.listNew']}
        </Button>
      </div>

      {myLots.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
            <Coffee className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">{t['lots.noLots']}</h3>
          <p className="text-slate-500 mb-6 max-w-sm">{t['lots.noLotsHint']}</p>
          <Button onClick={() => setShowForm(true)} className="bg-navy text-white rounded-lg gap-2">
            <Plus className="h-4 w-4" /> {t['lots.listNew']}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {myLots.map(lot => (
            <div key={lot.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="h-48 bg-slate-100 flex items-center justify-center">
                <div className="w-16 h-16 bg-slate-200/50 rounded-full flex items-center justify-center">
                  <Coffee className="h-8 w-8 text-slate-400" />
                </div>
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{lot.id}</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    lot.status === 'Active' ? 'bg-green-100 text-green-800' :
                    lot.status === 'Under Negotiation' ? 'bg-amber-100 text-amber-800' :
                    'bg-slate-100 text-slate-800'
                  }`}>
                    {lot.status}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-slate-900 mb-1">{t['lots.grade']} {lot.grade} &middot; {lot.processingMethod}</h3>
                <div className="flex items-center text-slate-500 text-sm mb-4">
                  <MapPin className="h-4 w-4 mr-1 text-slate-400" />
                  {lot.region}
                </div>
                
                <div className="border-t border-slate-100 pt-4 mt-2">
                  <div className="text-sm text-slate-500 mb-1">{lot.quantity} {t['lots.quintals']}</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-slate-900">{lot.price.toLocaleString()} ETB</span>
                    <span className="text-xs text-slate-500">{t['lots.perQuintal']} {Math.round(lot.price / lot.quantity).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
