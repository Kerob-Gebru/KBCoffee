import { create } from 'zustand';
import { User, Lot, Bid, Contract, Message, QualityReport, Logistics, Language, Role } from '../types';

export const pushNotification = async (userId: string, message: string, type: 'general' | 'dispute' | 'contract' | 'message') => {
  console.log(`Notification for ${userId}: [${type}] ${message}`);
  // Mock implementation since Firebase is removed
};

interface AppState {
  language: Language;
  setLanguage: (lang: Language) => void;
  currentUser: User | null;
  login: (email: string) => { ok: boolean; error?: string };
  logout: () => void;
  users: User[];
  registerUser: (user: Omit<User, 'id' | 'status'>) => Promise<void>;
  lots: Lot[];
  addLot: (lot: Omit<Lot, 'id' | 'createdAt' | 'status'>) => Promise<void>;
  updateLotStatus: (id: string, status: Lot['status']) => Promise<void>;
  bids: Bid[];
  addBid: (bid: Omit<Bid, 'id' | 'timestamp' | 'status'>) => Promise<void>;
  updateBidStatus: (id: string, status: Bid['status']) => Promise<void>;
  contracts: Contract[];
  createContract: (contract: Omit<Contract, 'id' | 'createdAt' | 'status' | 'supplierSigned' | 'exporterSigned'>) => Promise<void>;
  signContract: (id: string, role: 'Supplier' | 'Exporter') => Promise<void>;
  messages: Message[];
  addMessage: (msg: Omit<Message, 'id' | 'timestamp'>) => Promise<void>;
  qualityReports: QualityReport[];
  addQualityReport: (report: Omit<QualityReport, 'id' | 'createdAt'>) => Promise<void>;
  notifications: import('../types').AppNotification[];
  setNotifications: (notifications: import('../types').AppNotification[]) => void;
  toasts: import('../types').Toast[];
  addToast: (message: string, type?: import('../types').Toast['type']) => void;
  removeToast: (id: string) => void;
  initBackend: () => Promise<void>;
}

export const useStore = create<AppState>((set, get) => ({
  language: 'en',
  setLanguage: (lang) => set({ language: lang }),
  currentUser: null,
  login: (email) => {
    const user = get().users.find(u => u.email === email);
    if (!user) {
      return { ok: false, error: 'User not found.' };
    }
    if (user.status === 'Suspended') {
      return { ok: false, error: 'This account has been suspended.' };
    }
    if (user.status === 'Pending') {
      return { ok: false, error: 'This account is pending admin review.' };
    }
    set({ currentUser: user });
    return { ok: true };
  },
  logout: () => set({ currentUser: null }),
  users: [],
  registerUser: async (user) => {
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      });
      if (!res.ok) {
        throw new Error(`Registration failed (${res.status})`);
      }
      const newUser = await res.json();
      set(state => ({
        users: [...state.users, newUser]
      }));
    } catch (e) {
      console.error("Failed to register user", e);
      throw e;
    }
  },
  lots: [],
  addLot: async (lot) => {
    try {
      const res = await fetch('/api/lots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lot)
      });
      if (res.ok) {
        const newLot = await res.json();
        set(state => ({
          lots: [...state.lots, newLot]
        }));
      }
    } catch (e) {
      console.error("Failed to add lot to backend", e);
    }
  },
  updateLotStatus: async (id, status) => {
    try {
      const res = await fetch(`/api/lots/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        set(state => ({
          lots: state.lots.map(l => l.id === id ? { ...l, status } : l)
        }));
      }
    } catch (e) {
      console.error("Failed to update lot status", e);
    }
  },
  bids: [],
  addBid: async (bid) => {
    try {
      const res = await fetch('/api/bids', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bid)
      });
      if (res.ok) {
        const newBid = await res.json();
        set(state => ({
          bids: [...state.bids, newBid]
        }));
        get().addToast(`New bid placed on lot ${bid.lotId} for ${bid.price} ETB`);
        
        // Notify supplier
        const lot = get().lots.find(l => l.id === bid.lotId);
        if (lot) {
          pushNotification(lot.supplierId, `You received a new bid of ${bid.price} ETB on lot ${lot.name}.`, 'general');
        }
      }
    } catch (e) {
      console.error("Failed to add bid", e);
    }
  },
  updateBidStatus: async (id, status) => {
    try {
      const res = await fetch(`/api/bids/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        set(state => ({
          bids: state.bids.map(b => b.id === id ? { ...b, status } : b)
        }));
        
        const bid = get().bids.find(b => b.id === id);
        if (bid) {
          pushNotification(bid.exporterId, `Your bid on lot ${bid.lotId} was ${status.toLowerCase()}.`, 'general');
          get().addToast(`Bid ${status}`);
          
          if (status === 'Accepted') {
            get().updateLotStatus(bid.lotId, 'Under Negotiation');
          }
        }
      }
    } catch (e) {
      console.error("Failed to update bid status", e);
    }
  },
  contracts: [],
  createContract: async (contract) => {
    try {
      const res = await fetch('/api/contracts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contract)
      });
      if (res.ok) {
        const newContract = await res.json();
        set(state => ({
          contracts: [...state.contracts, newContract]
        }));
        get().addToast('Contract created successfully');
        pushNotification(newContract.exporterId, `A new contract requires your signature.`, 'contract');
      }
    } catch (e) {
      console.error("Failed to create contract", e);
    }
  },
  signContract: async (id, role) => {
    try {
      const res = await fetch(`/api/contracts/${id}/sign`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role })
      });
      if (res.ok) {
        const updatedContract = await res.json();
        set(state => ({
          contracts: state.contracts.map(c => c.id === id ? updatedContract : c)
        }));
        
        get().addToast(`Contract signed as ${role}`);
        
        const otherRole = role === 'Supplier' ? updatedContract.exporterId : updatedContract.supplierId;
        pushNotification(otherRole, `The contract for lot ${updatedContract.lotId} was signed by the ${role}.`, 'contract');

        if (updatedContract.status === 'Active') {
          setTimeout(() => get().updateLotStatus(updatedContract.lotId, 'Contracted'), 0);
        }
      }
    } catch (e) {
      console.error("Failed to sign contract", e);
    }
  },
  messages: [],
  addMessage: async (msg) => {
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(msg)
      });
      if (res.ok) {
        const newMessage = await res.json();
        set(state => ({
          messages: [...state.messages, newMessage]
        }));
        pushNotification(msg.receiverId, `You received a new message regarding thread ${msg.threadId}.`, 'message');
      }
    } catch (e) {
      console.error("Failed to add message", e);
    }
  },
  qualityReports: [],
  addQualityReport: async (report) => {
    try {
      const res = await fetch('/api/quality', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(report)
      });
      if (res.ok) {
        const newReport = await res.json();
        set(state => ({
          qualityReports: [...state.qualityReports, newReport]
        }));
        // automatically add quality badge to lot if grade is 1 or 2
        if (report.gradeClassification <= 2) {
          setTimeout(() => {
            set(state => ({
               lots: state.lots.map(l => l.id === report.lotId ? { ...l, qualityBadge: true } : l)
            }));
          }, 0);
        }
      }
    } catch (e) {
      console.error("Failed to add quality report", e);
    }
  },
  notifications: [],
  setNotifications: (notifications) => set({ notifications }),
  toasts: [],
  addToast: (message, type = 'success') => {
    const id = Math.random().toString(36).substring(7);
    set(state => ({ toasts: [...state.toasts, { id, message, type }] }));
    setTimeout(() => get().removeToast(id), 5000);
  },
  removeToast: (id) => set(state => ({ toasts: state.toasts.filter(t => t.id !== id) })),
  initBackend: async () => {
    try {
      const [usersRes, lotsRes, bidsRes, contractsRes, msgsRes, qualityRes] = await Promise.all([
        fetch('/api/users'),
        fetch('/api/lots'),
        fetch('/api/bids'),
        fetch('/api/contracts'),
        fetch('/api/messages'),
        fetch('/api/quality')
      ]);
      
      if (usersRes.ok && lotsRes.ok) {
        set({ 
          users: await usersRes.json(), 
          lots: await lotsRes.json(),
          bids: await bidsRes.json(),
          contracts: await contractsRes.json(),
          messages: await msgsRes.json(),
          qualityReports: await qualityRes.json()
        });
        
        // After loading, log in the user based on their previous state or email
        const currentUserEmail = get().currentUser?.email || 'kerobgebru32@gmail.com';
        get().login(currentUserEmail);
      }
    } catch (e) {
      console.error("Failed to fetch from backend", e);
    }
  }
}));
