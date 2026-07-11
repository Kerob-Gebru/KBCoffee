import React, { useState } from 'react';
import { MessageSquare, Truck, AlertTriangle, TrendingUp, Settings, Phone, MapPin, Building, Inbox, Download } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useStore, pushNotification } from '../store';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function Messages() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center py-20">
      <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
        <MessageSquare className="h-8 w-8 text-blue-500" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Messages</h2>
      <p className="text-slate-500 max-w-md">Your inbox is empty. Messages from other buyers and sellers will appear here.</p>
    </div>
  );
}

export function Logistics() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center py-20">
      <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
        <Truck className="h-8 w-8 text-indigo-500" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Logistics Tracking</h2>
      <p className="text-slate-500 max-w-md">No active shipments. Once a contract is finalized, track your coffee delivery here.</p>
    </div>
  );
}

export function Disputes() {
  const [showForm, setShowForm] = useState(false);

  // Mock data for disputes distribution
  const disputeData = [
    { name: 'Pending', value: 4, color: '#f59e0b' },
    { name: 'Under Review', value: 2, color: '#3b82f6' },
    { name: 'Resolved', value: 6, color: '#10b981' }
  ];

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('Dispute History & Status Report', 14, 22);

    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 32);

    // Add a summary section
    doc.text('Summary:', 14, 45);
    doc.setFontSize(10);
    doc.text(`Total Disputes: 12`, 14, 52);
    doc.text(`Average Resolution Time: 4.2 Days`, 14, 58);
    doc.text(`Favorable Outcomes: 85%`, 14, 64);

    // Auto-table for dispute list
    autoTable(doc, {
      startY: 75,
      head: [['Contract Code', 'Reason', 'Status', 'Date']],
      body: [
        ['CTR-2026-001', 'Quality Mismatch', 'Resolved', '2026-05-12'],
        ['CTR-2026-008', 'Delayed Shipment', 'Pending', '2026-06-25'],
        ['CTR-2026-012', 'Payment Delay', 'Under Review', '2026-06-18'],
      ],
      theme: 'grid',
      headStyles: { fillColor: [15, 23, 42] } // navy
    });

    doc.save('dispute-report.pdf');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Disputes</h1>
        <div className="flex gap-3">
          <Button onClick={downloadPDF} variant="outline" className="rounded-lg gap-2">
            <Download className="h-4 w-4" /> Download PDF
          </Button>
          {!showForm && (
            <Button onClick={() => setShowForm(true)} className="bg-navy hover:bg-navy/90 text-white rounded-lg gap-2">
              <AlertTriangle className="h-4 w-4" /> Raise Dispute
            </Button>
          )}
        </div>
      </div>

      {!showForm && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Dispute Status Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={disputeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {disputeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
             <div className="text-center">
               <div className="text-4xl font-bold text-slate-900 mb-2">12</div>
               <div className="text-slate-500 font-medium">Total Disputes This Year</div>
             </div>
             <div className="mt-8 space-y-3">
               <div className="flex justify-between text-sm">
                 <span className="text-slate-600">Average Resolution Time</span>
                 <span className="font-semibold text-slate-900">4.2 Days</span>
               </div>
               <div className="flex justify-between text-sm">
                 <span className="text-slate-600">Favorable Outcomes</span>
                 <span className="font-semibold text-emerald-600">85%</span>
               </div>
             </div>
          </div>
        </div>
      )}

      {showForm ? (
        <div className="bg-white p-6 md:p-8 rounded-xl border border-slate-200 shadow-sm max-w-3xl">
          <form className="space-y-6" onSubmit={(e) => { 
            e.preventDefault(); 
            setShowForm(false); 
            useStore.getState().addToast('Dispute submitted successfully', 'success');
            const currentUser = useStore.getState().currentUser;
            if (currentUser) {
              pushNotification(currentUser.id, `Your dispute for the selected contract is now under review.`, 'dispute');
            }
          }}>
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">Contract Code</label>
              <input 
                type="text" 
                placeholder="Contract ID"
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent transition-all" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">Reason for Dispute</label>
              <input 
                type="text" 
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent transition-all" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">Description</label>
              <textarea 
                rows={4}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent transition-all resize-y" 
              />
            </div>

            <div className="flex gap-4 pt-2">
              <Button type="submit" className="bg-navy hover:bg-navy/90 text-white rounded-lg px-8">
                Submit
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="rounded-lg px-8">
                Cancel
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <Inbox className="h-8 w-8 text-slate-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">No disputes</h2>
        </div>
      )}
    </div>
  );
}

export function Transactions() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center py-20">
      <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
        <TrendingUp className="h-8 w-8 text-emerald-500" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Transaction History</h2>
      <p className="text-slate-500 max-w-md">No transactions yet. Completed contract payments will be logged here.</p>
    </div>
  );
}

export function Profile() {
  const { currentUser } = useStore();

  if (!currentUser) return null;

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Profile</h1>

      <div className="bg-white p-6 md:p-8 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-start gap-6 mb-8">
          <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center text-2xl font-bold text-slate-600 flex-shrink-0">
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{currentUser.name}</h2>
            <p className="text-slate-500 mb-3">{currentUser.email}</p>
            <div className="flex gap-2">
              <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full lowercase">
                {currentUser.role}
              </span>
              <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full">
                not_submitted
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-center text-slate-600 text-sm">
            <Phone className="h-4 w-4 mr-3 text-slate-400" />
            <span className="w-32">Phone Number:</span>
            <span className="font-medium text-slate-900">&mdash;</span>
          </div>
          <div className="flex items-center text-slate-600 text-sm">
            <MapPin className="h-4 w-4 mr-3 text-slate-400" />
            <span className="w-32">Region:</span>
            <span className="font-medium text-slate-900">&mdash;</span>
          </div>
          <div className="flex items-center text-slate-600 text-sm">
            <Building className="h-4 w-4 mr-3 text-slate-400" />
            <span className="w-32">Business Name:</span>
            <span className="font-medium text-slate-900">{currentUser.companyName || '\u2014'}</span>
          </div>
        </div>

        <Button variant="outline" className="rounded-lg px-6">
          Edit
        </Button>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-slate-900">KYB Verification</h3>
          <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full">
            not_submitted
          </span>
        </div>
        <p className="text-slate-600 text-sm mb-6">
          Please complete KYB verification to access marketplace features.
        </p>
        <Button className="bg-navy hover:bg-navy/90 text-white rounded-lg">
          Submit for Verification
        </Button>
      </div>
    </div>
  );
}
