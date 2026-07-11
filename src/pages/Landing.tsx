import React from 'react';
import { useStore } from '../store';
import { translations } from '../i18n';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { 
  ArrowRight, ShieldCheck, TrendingUp, Handshake, 
  Store, Gavel, FileSignature, ClipboardCheck, Truck, BarChart3, Coffee
} from 'lucide-react';

export default function Landing() {
  const { language } = useStore();
  const t = translations[language];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="text-center py-24 bg-navy text-white px-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 mb-8 text-sm">
          <Coffee className="h-4 w-4" />
          <span>Ethiopian Coffee B2B Trade Platform</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
          Modernizing Ethiopia's Coffee<br/>Supply Chain
        </h1>
        <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-3xl mx-auto font-light">
          Connecting washing stations and suppliers directly with licensed export companies<br/>through a centralized digital marketplace.
        </p>
        <div className="flex items-center justify-center gap-4 mb-16">
          <Link to="/register">
            <Button size="lg" className="bg-[#cca300] hover:bg-[#b38f00] text-white border-none shadow-md text-base px-8 h-12 rounded font-medium normal-case tracking-normal">
              Get Started <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
          <Link to="/login">
            <Button size="lg" variant="ghost" className="text-base px-8 h-12 text-white hover:bg-white/10 bg-white/5 border border-white/10 rounded font-medium normal-case tracking-normal">
              Login
            </Button>
          </Link>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-8 text-slate-300 text-sm">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5" /> KYB Verified
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" /> Price Transparency
          </div>
          <div className="flex items-center gap-2">
            <FileSignature className="h-5 w-5" /> Digital Contracts
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 max-w-7xl mx-auto bg-white">
        <h2 className="text-3xl font-bold text-center mb-16 text-navy">A Complete B2B Trade Platform</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Digital Lot Marketplace",
              desc: "List and discover coffee lots by region, grade, and processing method with full transparency.",
              icon: Store
            },
            {
              title: "Structured Negotiation",
              desc: "Counter-offers, terms, and delivery conditions — all tracked within a structured negotiation module.",
              icon: Gavel
            },
            {
              title: "Digital Contracts & E-Signature",
              desc: "Generate binding digital contracts from agreed terms with legally compliant e-signature capture.",
              icon: FileSignature
            },
            {
              title: "Quality Traceability",
              desc: "Certified inspectors upload structured quality reports attached to specific lots and contracts.",
              icon: ClipboardCheck
            },
            {
              title: "Logistics Coordination",
              desc: "Track shipments from washing station to export warehouse with real-time status updates.",
              icon: Truck
            },
            {
              title: "Analytics & Insights",
              desc: "Role-based dashboards with price trends, spend analysis, and trade data for informed decisions.",
              icon: BarChart3
            }
          ].map((feature, idx) => (
            <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
              <div className="bg-slate-100 w-12 h-12 rounded-xl flex items-center justify-center mb-6 text-navy">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-navy mb-3">{feature.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-16 text-navy">How It Works</h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { num: "01", title: "Register & Verify", desc: "Complete KYB verification to gain full marketplace access." },
              { num: "02", title: "List or Discover Lots", desc: "Suppliers list coffee lots; exporters browse and shortlist." },
              { num: "03", title: "Negotiate & Contract", desc: "Agree on terms and sign digital contracts with e-signature." },
              { num: "04", title: "Deliver & Settle", desc: "Coordinate logistics, confirm delivery, and complete the trade." }
            ].map((step, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="w-16 h-16 bg-navy text-white rounded-full flex items-center justify-center text-xl font-bold mb-6">
                  {step.num}
                </div>
                <h3 className="text-lg font-bold text-navy mb-3">{step.title}</h3>
                <p className="text-slate-500 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Basic Footer */}
      <footer className="bg-navy py-12 text-center text-slate-400 text-sm px-6 w-full">
        <p>© 2026 KBCoffeeLink — BirrBeans B2B. Ethiopian Coffee B2B Trade Platform.</p>
      </footer>
    </div>
  );
}
