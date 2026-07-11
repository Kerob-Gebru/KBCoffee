import React, { useState } from 'react';
import { useStore } from '../store';
import { getTranslations } from '../i18n';
import { Button } from '../components/ui/Button';

export default function QualityReports() {
  const { currentUser, lots, qualityReports, addQualityReport, language } = useStore();
  const t = getTranslations(language);
  const [selectedLot, setSelectedLot] = useState('');
  const [formData, setFormData] = useState({
    moisture: 10, defectCount: 0, cupScore: 85, gradeClassification: 1, certificationNumber: 'CERT-001'
  });

  if (!currentUser || currentUser.role !== 'Inspector') {
    return <p className="p-8">Access denied. Inspectors only.</p>;
  }

  const pendingLots = lots.filter(l => !qualityReports.some(qr => qr.lotId === l.id));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLot) return alert('Select a lot');
    addQualityReport({
      lotId: selectedLot,
      inspectorId: currentUser.id,
      moisture: Number(formData.moisture),
      defectCount: Number(formData.defectCount),
      cupScore: Number(formData.cupScore),
      gradeClassification: Number(formData.gradeClassification),
      certificationNumber: formData.certificationNumber,
      sampleDate: new Date().toISOString().split('T')[0]
    });
    alert('Quality report submitted and attached to lot.');
    setSelectedLot('');
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-navy uppercase tracking-wide">{t['quality.title']}</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-sm shadow-sm shadow-black/5 border border-slate-100">
          <h2 className="text-lg font-bold uppercase tracking-wide text-navy mb-4 border-b border-slate-100 pb-2">{t['quality.submitReport']}</h2>
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">{t['quality.selectLot']}</label>
              <select value={selectedLot} onChange={e => setSelectedLot(e.target.value)} className="w-full px-3 py-2 border rounded-sm text-sm" required>
                <option value="">{t['quality.selectLotOption']}</option>
                {pendingLots.map(l => <option key={l.id} value={l.id}>{l.name} ({l.region})</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">{t['quality.moisture']}</label>
                <input type="number" step="0.1" value={formData.moisture} onChange={e => setFormData({...formData, moisture: Number(e.target.value)})} className="w-full px-3 py-2 border rounded-sm text-sm" required />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">{t['quality.defectCount']}</label>
                <input type="number" value={formData.defectCount} onChange={e => setFormData({...formData, defectCount: Number(e.target.value)})} className="w-full px-3 py-2 border rounded-sm text-sm" required />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">{t['quality.cupScore']}</label>
                <input type="number" value={formData.cupScore} onChange={e => setFormData({...formData, cupScore: Number(e.target.value)})} className="w-full px-3 py-2 border rounded-sm text-sm" required />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">{t['quality.finalGrade']}</label>
                <select value={formData.gradeClassification} onChange={e => setFormData({...formData, gradeClassification: Number(e.target.value)})} className="w-full px-3 py-2 border rounded-sm text-sm" required>
                  {[1,2,3,4,5].map(g => <option key={g} value={g}>{t['quality.grade']} {g}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">{t['quality.certNumber']}</label>
              <input type="text" value={formData.certificationNumber} onChange={e => setFormData({...formData, certificationNumber: e.target.value})} className="w-full px-3 py-2 border rounded-sm text-sm" required />
            </div>
            <Button type="submit" variant="default" className="w-full">{t['quality.submit']}</Button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-sm shadow-sm shadow-black/5 border border-slate-100">
          <h2 className="text-lg font-bold uppercase tracking-wide text-navy mb-4 border-b border-slate-100 pb-2">{t['quality.myReports']}</h2>
          <div className="space-y-4 pt-2">
            {qualityReports.filter(qr => qr.inspectorId === currentUser.id).map(report => {
              const lot = lots.find(l => l.id === report.lotId);
              return (
                <div key={report.id} className="p-4 border border-slate-100 rounded-sm bg-slate-50">
                  <div className="flex justify-between mb-2">
                    <span className="font-bold text-navy uppercase text-sm">{t['quality.lot']}: {lot?.name || report.lotId}</span>
                    <span className="text-[10px] bg-green-100 text-green-800 px-2 py-1 rounded-sm uppercase font-bold tracking-widest">{t['quality.grade']} {report.gradeClassification}</span>
                  </div>
                  <div className="text-xs text-slate-600 grid grid-cols-2 gap-2 mt-3 border-t border-slate-200 pt-3">
                    <div><span className="text-slate-400 uppercase font-bold text-[9px] block">{t['quality.cupScoreShort']}</span> {report.cupScore}</div>
                    <div><span className="text-slate-400 uppercase font-bold text-[9px] block">{t['quality.moistureShort']}</span> {report.moisture}%</div>
                    <div className="col-span-2 text-[10px] text-slate-500 mt-1 uppercase font-bold"><span className="text-navy">{t['quality.cert']}</span> {report.certificationNumber}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
