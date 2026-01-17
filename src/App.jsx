import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Award, Zap, Shield, CheckCircle, Menu, X, Github, Twitter, Mail } from 'lucide-react';

// --- COMPONENTS ---

const Typewriter = ({ text }) => {
  const [displayedText, setDisplayedText] = useState("");
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setDisplayedText(text.slice(0, i));
      i++;
      if (i > text.length) clearInterval(timer);
    }, 100);
    return () => clearInterval(timer);
  }, [text]);
  return <span>{displayedText}</span>;
};

const Header = () => (
  <header className="fixed top-0 w-full z-50 bg-[#0F172A]/80 backdrop-blur-md border-b border-white/10 px-6 py-4 flex justify-between items-center">
    <div className="flex items-center gap-2">
      <div className="bg-indigo-600 p-2 rounded-lg"><Award className="text-white" size={20}/></div>
      <span className="text-xl font-bold tracking-tighter text-white">NexCert</span>
    </div>
    <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-300">
      <Link to="/" className="hover:text-indigo-400">Home</Link>
      <a href="#features" className="hover:text-indigo-400">Features</a>
      <a href="#about" className="hover:text-indigo-400">About</a>
    </nav>
    <Link to="/dashboard" className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-full text-sm font-bold transition-all shadow-lg shadow-indigo-500/20">
      Launch App
    </Link>
  </header>
);

const Footer = () => (
  <footer className="bg-[#020617] border-t border-white/5 pt-16 pb-8 px-6">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
      <div className="col-span-2">
        <h3 className="text-2xl font-bold text-white mb-4">NexCert</h3>
        <p className="text-slate-400 max-w-sm">The world's most advanced automated certification engine. Empowering organizations to recognize talent instantly.</p>
      </div>
      <div>
        <h4 className="font-bold text-white mb-4">Legal</h4>
        <ul className="text-slate-400 space-y-2 text-sm">
          <li>Privacy Policy</li>
          <li>Terms of Service</li>
          <li>Cookie Policy</li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold text-white mb-4">Support</h4>
        <ul className="text-slate-400 space-y-2 text-sm">
          <li>Help Center</li>
          <li>API Docs</li>
          <li>Contact Us</li>
        </ul>
      </div>
    </div>
    <div className="text-center text-slate-600 text-xs border-t border-white/5 pt-8">
      © 2026 NexCert Systems. All Rights Reserved.
    </div>
  </footer>
);

// --- PAGES ---

const LandingPage = () => {
  return (
    <div className="bg-[#0F172A] text-white">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 text-center">
        <motion.h1 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="text-5xl md:text-7xl font-black mb-6"
        >
          <Typewriter text="Certify Talent with NexCert" />
        </motion.h1>
        <p className="text-slate-400 text-xl max-w-2xl mx-auto mb-10">
          Automate your event's certification process. Upload, generate, and dispatch certificates in under 60 seconds.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/dashboard" className="px-8 py-4 bg-indigo-600 rounded-full font-bold text-lg hover:bg-indigo-500 transition-all">Start Creating</Link>
          <button className="px-8 py-4 bg-white/5 border border-white/10 rounded-full font-bold text-lg hover:bg-white/10 transition-all">Watch Demo</button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-16">Why NexCert?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: <Zap className="text-yellow-400"/>, title: "Instant Dispatch", desc: "Send hundreds of emails simultaneously via our cloud engine." },
            { icon: <Shield className="text-blue-400"/>, title: "Verified QR", desc: "Every certificate includes a secure QR code for authenticity." },
            { icon: <CheckCircle className="text-green-400"/>, title: "Bulk Upload", desc: "Seamlessly parse thousands of rows from CSV or Excel files." }
          ].map((feat, i) => (
            <div key={i} className="bg-white/5 p-8 rounded-3xl border border-white/10 hover:border-indigo-500/50 transition-all">
              <div className="mb-4">{feat.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feat.title}</h3>
              <p className="text-slate-400">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-6 bg-indigo-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">About NexCert</h2>
          <p className="text-indigo-100 text-lg leading-relaxed">
            Born out of the need for speed in the Indian Hackathon ecosystem, NexCert is designed to help student organizations and professional bodies eliminate the manual labor of certificate distribution.
          </p>
        </div>
      </section>

      {/* CTA Section (HackMates Style) */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-indigo-600 to-purple-600 p-12 rounded-[3rem] shadow-2xl">
          <h2 className="text-4xl font-bold mb-4">Ready to build something amazing?</h2>
          <p className="text-indigo-100 mb-8 text-lg">Join NexCert today and connect with India's most talented developers and innovators.</p>
          <div className="flex justify-center gap-4">
            <Link to="/dashboard" className="px-10 py-4 bg-white text-indigo-600 rounded-full font-bold hover:bg-slate-100 transition-all">Join NexCert</Link>
            <button className="px-10 py-4 bg-transparent border-2 border-white rounded-full font-bold hover:bg-white hover:text-indigo-600 transition-all">Explore Documentation</button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

// --- MAIN APP COMPONENT ---

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<DashboardLayout />} />
      </Routes>
    </Router>
  );
}

// Sidebar component and DashboardLayout logic would go here...