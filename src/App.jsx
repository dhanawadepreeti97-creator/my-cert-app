import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, collection, addDoc, query, where, getDocs, serverTimestamp } from "firebase/firestore";
import { ShieldCheck, History, Layout, LogOut, Download, CheckCircle, Award } from 'lucide-react';
import { toPng } from 'html-to-image';

// 1. FIREBASE CONFIG (Paste your keys here)
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAfnWSsQ8gs-Zm2rxq9bf-bYMXsg2zFlJ8",
  authDomain: "nexcert-a718b.firebaseapp.com",
  projectId: "nexcert-a718b",
  storageBucket: "nexcert-a718b.firebasestorage.app",
  messagingSenderId: "930636216606",
  appId: "1:930636216606:web:128bf3d89482b866b0710f",
  measurementId: "G-PFPL5CLWRM"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- PREMIUM GREEN & GOLD TEMPLATE COMPONENT ---
const PremiumTemplate = ({ data, setData, isPreview = false, captureRef }) => {
  const handleUpdate = (key, value) => {
    if (!isPreview) setData({ ...data, [key]: value });
  };

  return (
    <div 
      ref={captureRef}
      className={`relative bg-white shadow-2xl overflow-hidden border-8 border-white ${isPreview ? 'w-full aspect-[1.414/1]' : 'w-[2000px] h-[1414px]'}`}
      style={{ fontFamily: "'Playfair Display', serif" }}
    >
      {/* Designer Background Elements (Green & Gold Accents) */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[120%] bg-[#064e3b] -rotate-12 shadow-2xl"></div>
        <div className="absolute top-0 left-0 w-[35%] h-full bg-[#065f46] -rotate-12"></div>
        <div className="absolute top-0 left-[34%] w-2 h-full bg-[#fbbf24]"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[20%] h-[60%] bg-[#064e3b] rotate-45"></div>
        <div className="absolute bottom-0 right-0 w-[15%] h-[40%] bg-[#fbbf24] rotate-45 opacity-50"></div>
      </div>

      {/* Certificate Content */}
      <div className="relative z-10 w-full h-full p-20 flex flex-col items-center justify-between text-center ml-[10%] w-[85%]">
        <div className="space-y-4">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-[#fbbf24] rounded-full flex items-center justify-center shadow-lg">
               <Award size={isPreview ? 30 : 80} className="text-[#064e3b]" />
            </div>
          </div>
          <h1 className="text-[#064e3b] font-black tracking-[0.2em] uppercase text-6xl">Certificate</h1>
          <p className="text-[#fbbf24] text-xl font-bold tracking-[0.4em] uppercase">Of Appreciation</p>
        </div>

        <div className="w-full space-y-8">
          <p className="text-gray-500 italic text-2xl">This is proudly presented to</p>
          
          {/* INTERACTIVE NAME BOX */}
          <input 
            value={data.name} 
            onChange={(e) => handleUpdate('name', e.target.value)}
            disabled={isPreview}
            className="w-full bg-transparent text-center text-7xl font-serif text-[#064e3b] border-b-2 border-transparent hover:border-gray-200 focus:border-[#fbbf24] outline-none py-2 transition-all cursor-text placeholder:text-gray-200"
            placeholder="Recipient Name"
          />

          <p className="text-gray-600 text-xl max-w-2xl mx-auto leading-relaxed">
            For the successful completion of the specialized program and demonstrating excellence in the field of:
          </p>

          {/* INTERACTIVE COURSE BOX */}
          <input 
            value={data.course} 
            onChange={(e) => handleUpdate('course', e.target.value)}
            disabled={isPreview}
            className="w-full bg-transparent text-center text-3xl font-bold text-[#064e3b] border-b border-transparent hover:border-gray-200 focus:border-[#fbbf24] outline-none py-1 transition-all uppercase tracking-wider"
            placeholder="Course or Symposium Title"
          />
        </div>

        {/* Footer: Date and Signature */}
        <div className="w-full flex justify-between items-end px-10 pb-10">
          <div className="text-left w-64 border-t-2 border-[#064e3b] pt-4">
            <input 
              value={data.date} 
              onChange={(e) => handleUpdate('date', e.target.value)}
              disabled={isPreview}
              className="w-full bg-transparent text-xl font-bold text-[#064e3b] outline-none"
            />
            <p className="text-xs uppercase text-gray-400 font-bold tracking-widest mt-1">Date of Issue</p>
          </div>

          <div className="text-right w-64 border-t-2 border-[#064e3b] pt-4">
            <input 
              value={data.signatory} 
              onChange={(e) => handleUpdate('signatory', e.target.value)}
              disabled={isPreview}
              className="w-full bg-transparent text-xl font-bold text-[#064e3b] outline-none text-right font-serif italic"
            />
            <p className="text-xs uppercase text-gray-400 font-bold tracking-widest mt-1">Authorized Official</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('templates');
  const [history, setHistory] = useState([]);
  const [certData, setCertData] = useState({
    name: '',
    course: '',
    date: new Date().toLocaleDateString(),
    signatory: 'Program Director'
  });

  const captureRef = useRef(null);

  useEffect(() => {
    onAuthStateChanged(auth, (u) => { setUser(u); if (u) fetchHistory(u.uid); });
  }, []);

  const fetchHistory = async (uid) => {
    const q = query(collection(db, "certificates"), where("userId", "==", uid));
    const snap = await getDocs(q);
    setHistory(snap.docs.map(doc => doc.data()));
  };

  const handleDownload = async () => {
    if (!certData.name) return alert("Please click and enter a name on the certificate first!");
    const dataUrl = await toPng(captureRef.current, { pixelRatio: 1 });
    const link = document.createElement('a');
    link.download = `Cert_${certData.name}.png`;
    link.href = dataUrl;
    link.click();
    await addDoc(collection(db, "certificates"), { ...certData, userId: user.uid, createdAt: serverTimestamp() });
    fetchHistory(user.uid);
  };

  if (!user) return <div className="h-screen bg-[#020617] flex items-center justify-center text-white font-bold">Please Login to Access NexCert Dashboard</div>;

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-300 font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-[#0f172a] border-r border-white/5 p-8 flex flex-col fixed h-full z-30">
        <div className="flex items-center gap-3 mb-12">
          <ShieldCheck className="text-emerald-500" size={36} />
          <span className="text-2xl font-black text-white tracking-tighter">NEXCERT</span>
        </div>
        <nav className="flex-1 space-y-3">
          <button onClick={() => setActiveTab('templates')} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all font-bold ${activeTab === 'templates' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' : 'hover:bg-white/5'}`}><Layout /> Designs</button>
          <button onClick={() => setActiveTab('history')} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all font-bold ${activeTab === 'history' ? 'bg-emerald-600 text-white shadow-lg' : 'hover:bg-white/5'}`}><History /> Archive</button>
        </nav>
        <button onClick={() => signOut(auth)} className="flex items-center gap-4 text-slate-500 hover:text-red-400 font-bold px-5 py-4"><LogOut /> Logout</button>
      </aside>

      {/* Main Area */}
      <main className="flex-1 ml-72 p-10">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'templates' && (
            <div className="space-y-10">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">Professional Library</h1>
                <p className="text-slate-500">Select a template to begin interactive editing.</p>
              </div>
              
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                <div className="group relative">
                  <div className="bg-slate-900/80 p-6 rounded-[32px] border-2 border-transparent hover:border-emerald-500 transition-all cursor-pointer overflow-hidden shadow-2xl">
                    <PremiumTemplate data={{name: 'Jane Doe', course: 'Masterclass', date: '01/19/2026', signatory: 'Director'}} isPreview={true} />
                    <div className="mt-6 flex justify-between items-center">
                      <div>
                        <h3 className="text-white font-bold text-xl">Emerald Excellence</h3>
                        <p className="text-slate-500 text-sm font-medium">Industry Standard A4 Layout</p>
                      </div>
                      <button onClick={() => setActiveTab('editor')} className="bg-white text-black px-6 py-2 rounded-full font-black text-xs hover:bg-emerald-500 hover:text-white transition-colors">USE TEMPLATE</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'editor' && (
            <div className="animate-in fade-in slide-in-from-bottom-5 duration-700">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-white">Live Interactive Editor</h1>
                  <p className="text-emerald-500 font-bold text-sm">Click any text on the certificate to edit it directly.</p>
                </div>
                <button onClick={handleDownload} className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 shadow-xl shadow-emerald-900/40 transition-all active:scale-95">
                  <Download size={20} /> FINAL ISSUE & DOWNLOAD
                </button>
              </div>
              
              <div className="bg-[#0f172a] p-2 rounded-[40px] shadow-3xl border border-white/5">
                 <PremiumTemplate data={certData} setData={setCertData} isPreview={false} captureRef={captureRef} />
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-white">Issued Certificates</h1>
              <div className="grid gap-4">
                {history.map((h, i) => (
                  <div key={i} className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 flex justify-between items-center hover:bg-white/5 transition-all">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500"><CheckCircle /></div>
                      <div>
                        <p className="text-white font-bold text-lg">{h.name}</p>
                        <p className="text-slate-500 text-sm">{h.course}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-black text-emerald-500 uppercase tracking-widest">Verified</p>
                      <p className="text-slate-600 text-xs mt-1">{h.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;