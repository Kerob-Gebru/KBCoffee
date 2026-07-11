import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

let ai: GoogleGenAI | null = null;
function getAI() {
  if (!ai) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not set");
    }
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: { 'User-Agent': 'aistudio-build' }
      }
    });
  }
  return ai;
}

const INITIAL_USERS = [
  { id: 'u1', name: 'Abebe Tadesse', companyName: 'Abebe Washing Station', role: 'Supplier', email: 'abebe@example.com', status: 'Active', kybDocuments: ['doc1.pdf'] },
  { id: 'u2', name: 'Hiwot Aklilu', companyName: 'Hiwot Exports', role: 'Exporter', email: 'hiwot@example.com', status: 'Active', kybDocuments: ['doc2.pdf'] },
  { id: 'u3', name: 'Dawit Kebede', companyName: 'Ethio Quality Inspect', role: 'Inspector', email: 'dawit@example.com', status: 'Active', kybDocuments: ['doc3.pdf'] },
  { id: 'u4', name: 'Tigist Mulat', companyName: 'KBCoffeeLink', role: 'Admin', email: 'admin@kbcoffeelink.com', status: 'Active', kybDocuments: [] },
  { id: 'u5', name: 'Kerob', companyName: 'Kerob Coffee', role: 'Supplier', email: 'kerobgebru32@gmail.com', status: 'Active', kybDocuments: [] }
];

const INITIAL_LOTS = [
  { id: 'l1', supplierId: 'u5', name: 'Yirgacheffe Grade 1 Washed', region: 'Yirgacheffe', processingMethod: 'Washed', grade: 1, quantity: 150, price: 45000, harvestSeason: '2025/2026', availableFrom: '2026-07-01', photos: ['https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&q=80&w=400'], qualityDocuments: [], status: 'Active', createdAt: '2026-06-20', expiryDate: '2026-09-20', qualityBadge: true },
  { id: 'l2', supplierId: 'u5', name: 'Sidamo Grade 2 Natural', region: 'Sidamo', processingMethod: 'Natural', grade: 2, quantity: 200, price: 38000, harvestSeason: '2025/2026', availableFrom: '2026-06-25', photos: ['https://images.unsplash.com/photo-1611162458324-aae1eb4129a4?auto=format&fit=crop&q=80&w=400'], qualityDocuments: [], status: 'Active', createdAt: '2026-06-22', expiryDate: '2026-09-22' },
  { id: 'l3', supplierId: 'u1', name: 'Guji Grade 1 Honey', region: 'Guji', processingMethod: 'Honey', grade: 1, quantity: 100, price: 48000, harvestSeason: '2025/2026', availableFrom: '2026-07-05', photos: ['https://images.unsplash.com/photo-1587734195503-904fca47e0e9?auto=format&fit=crop&q=80&w=400'], qualityDocuments: [], status: 'Active', createdAt: '2026-06-24', expiryDate: '2026-09-24', qualityBadge: true },
  { id: 'l4', supplierId: 'u1', name: 'Limu Grade 3 Washed', region: 'Limu', processingMethod: 'Washed', grade: 3, quantity: 300, price: 32000, harvestSeason: '2025/2026', availableFrom: '2026-06-28', photos: ['https://images.unsplash.com/photo-1524350876685-274059332603?auto=format&fit=crop&q=80&w=400'], qualityDocuments: [], status: 'Active', createdAt: '2026-06-25', expiryDate: '2026-09-25' },
  { id: 'l5', supplierId: 'u1', name: 'Jimma Grade 5 Natural', region: 'Jimma', processingMethod: 'Natural', grade: 5, quantity: 500, price: 25000, harvestSeason: '2025/2026', availableFrom: '2026-06-20', photos: ['https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=400'], qualityDocuments: [], status: 'Active', createdAt: '2026-06-21', expiryDate: '2026-09-21' },
  { id: 'l6', supplierId: 'u1', name: 'Harrar Grade 4 Natural', region: 'Harrar', processingMethod: 'Natural', grade: 4, quantity: 120, price: 34000, harvestSeason: '2025/2026', availableFrom: '2026-07-10', photos: ['https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&q=80&w=400'], qualityDocuments: [], status: 'Active', createdAt: '2026-06-26', expiryDate: '2026-09-26' },
];

let users = [...INITIAL_USERS];
let lots = [...INITIAL_LOTS];
let bids: any[] = [];
let contracts: any[] = [];
let qualityReports: any[] = [];
let messages: any[] = [];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Users API
  app.get("/api/users", (req, res) => {
    res.json(users);
  });
  app.post("/api/users", (req, res) => {
    const newUser = { ...req.body, id: `u${users.length + 1}`, status: 'Pending' };
    users.push(newUser);
    res.json(newUser);
  });

  // Lots API
  app.get("/api/lots", (req, res) => {
    res.json(lots);
  });
  app.post("/api/lots", (req, res) => {
    const newLot = { ...req.body, id: `l${lots.length + 1}`, createdAt: new Date().toISOString(), status: 'Active' };
    lots.push(newLot);
    res.json(newLot);
  });
  app.put("/api/lots/:id/status", (req, res) => {
    const lot = lots.find(l => l.id === req.params.id);
    if (lot) {
      lot.status = req.body.status;
      res.json(lot);
    } else {
      res.status(404).json({ error: "Lot not found" });
    }
  });

  // Bids API
  app.get("/api/bids", (req, res) => {
    res.json(bids);
  });
  app.post("/api/bids", (req, res) => {
    const newBid = { ...req.body, id: `b${bids.length + 1}`, timestamp: new Date().toISOString(), status: 'Pending' };
    bids.push(newBid);
    res.json(newBid);
  });
  app.put("/api/bids/:id/status", (req, res) => {
    const bid = bids.find(b => b.id === req.params.id);
    if (bid) {
      bid.status = req.body.status;
      res.json(bid);
    } else {
      res.status(404).json({ error: "Bid not found" });
    }
  });

  // Contracts API
  app.get("/api/contracts", (req, res) => {
    res.json(contracts);
  });
  app.post("/api/contracts", (req, res) => {
    const newContract = { ...req.body, id: `c${contracts.length + 1}`, createdAt: new Date().toISOString(), status: 'Pending Signature', supplierSigned: false, exporterSigned: false };
    contracts.push(newContract);
    res.json(newContract);
  });
  app.put("/api/contracts/:id/sign", (req, res) => {
    const contract = contracts.find(c => c.id === req.params.id);
    if (contract) {
      if (req.body.role === 'Supplier') contract.supplierSigned = true;
      if (req.body.role === 'Exporter') contract.exporterSigned = true;
      if (contract.supplierSigned && contract.exporterSigned) {
        contract.status = 'Active';
      }
      res.json(contract);
    } else {
      res.status(404).json({ error: "Contract not found" });
    }
  });

  // Messages API
  app.get("/api/messages", (req, res) => {
    res.json(messages);
  });
  app.post("/api/messages", (req, res) => {
    const newMessage = { ...req.body, id: `m${messages.length + 1}`, timestamp: new Date().toISOString() };
    messages.push(newMessage);
    res.json(newMessage);
  });

  // Gemini Chat API
  app.post("/api/gemini/chat", async (req, res) => {
    try {
      const { message } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }
      const genAI = getAI();
      const response = await genAI.models.generateContent({
        model: "gemini-3.5-flash",
        contents: message,
        config: {
          systemInstruction: "You are a helpful assistant for the KBCoffeeLink marketplace. You answer questions regarding marketplace policies, contracts, logistics, disputes, quality reports, and negotiations. Keep your answers concise and professional."
        }
      });
      res.json({ text: response.text });
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: e.message || "Failed to generate content" });
    }
  });

  // Quality Reports API
  app.get("/api/quality", (req, res) => {
    res.json(qualityReports);
  });
  app.post("/api/quality", (req, res) => {
    const newReport = { ...req.body, id: `qr${qualityReports.length + 1}`, createdAt: new Date().toISOString() };
    qualityReports.push(newReport);
    res.json(newReport);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
