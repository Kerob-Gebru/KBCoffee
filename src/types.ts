export type Role = 'Supplier' | 'Exporter' | 'Inspector' | 'Admin';
export type Language = 'en' | 'am' | 'om';

export interface User {
  id: string;
  name: string;
  companyName: string;
  role: Role;
  email: string;
  status: 'Pending' | 'Active' | 'Suspended';
  kybDocuments: string[];
}

export type ProcessingMethod = 'Washed' | 'Natural' | 'Honey';
export type LotStatus = 'Draft' | 'Active' | 'Under Negotiation' | 'Contracted' | 'Sold' | 'Expired';

export interface Lot {
  id: string;
  supplierId: string;
  name: string;
  region: string;
  subRegion?: string;
  processingMethod: ProcessingMethod;
  grade: number;
  quantity: number; // in quintals (100kg)
  price: number; // ETB per quintal
  harvestSeason: string;
  availableFrom: string;
  photos: string[];
  qualityDocuments: string[];
  status: LotStatus;
  createdAt: string;
  expiryDate: string;
  qualityBadge?: boolean;
}

export type BidStatus = 'Pending' | 'Accepted' | 'Declined' | 'Countered' | 'Expired';

export interface Bid {
  id: string;
  lotId: string;
  exporterId: string;
  supplierId: string;
  price: number;
  quantity: number;
  deliveryDate: string;
  comments: string;
  status: BidStatus;
  timestamp: string;
}

export type ContractStatus = 'Draft' | 'Pending Signature' | 'Active' | 'Completed' | 'Cancelled';

export interface Contract {
  id: string;
  bidId: string;
  lotId: string;
  supplierId: string;
  exporterId: string;
  agreedPrice: number;
  agreedQuantity: number;
  deliveryLocation: string;
  deliveryDeadline: string;
  paymentTerms: string;
  status: ContractStatus;
  supplierSigned: boolean;
  exporterSigned: boolean;
  createdAt: string;
}

export interface Message {
  id: string;
  threadId: string; // usually lotId or contractId
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
}

export interface QualityReport {
  id: string;
  lotId: string;
  inspectorId: string;
  moisture: number;
  defectCount: number;
  cupScore: number;
  gradeClassification: number;
  certificationNumber: string;
  sampleDate: string;
  createdAt: string;
}

export type LogisticsStatus = 'Pending' | 'In Transit' | 'Delivered' | 'Disputed';

export interface Logistics {
  id: string;
  contractId: string;
  status: LogisticsStatus;
  pickupDate?: string;
  deliveryDate?: string;
  trackingNumber?: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  message: string;
  read: boolean;
  createdAt: string;
  type: 'dispute' | 'contract' | 'message' | 'general';
}

export interface Toast {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'warning' | 'error';
}

export interface Dispute {
  id: string;
  contractId: string;
  raisedById: string;
  type: string;
  description: string;
  status: 'Open' | 'In Review' | 'Resolved';
  resolution?: string;
  createdAt: string;
}

export interface Rating {
  id: string;
  contractId: string;
  reviewerId: string;
  revieweeId: string;
  score: number;
  comment: string;
  createdAt: string;
}
