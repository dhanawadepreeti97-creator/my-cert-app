import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, collection, addDoc, query, where, getDocs, serverTimestamp } from "firebase/firestore";
import { ShieldCheck, Layout, History, LogOut, Download, Award, CheckCircle2 } from 'lucide-react';
import { toPng } from 'html-to-image';

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

const App = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('templates');
  const [history, setHistory] = useState([]);
  
  // Neutral Placeholders - NO PERSONAL INFO
  const [certData, setCertData] = useState({
    name: 'FULL NAME HERE',
    course: 'COURSE OR EVENT NAME 2024',
    date: 'JANUARY 20, 2026',
    director: 'PROGRAM DIRECTOR',
    coordinator: 'EVENT COORDINATOR'
  });

  const captureRef = useRef(null);

  useEffect(() => {
    onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) fetchHistory(u.uid);
    });
  }, []);

  const fetchHistory = async (uid) => {
    const q = query(collection(db, "certificates"), where("userId", "==", uid));
    const snap = await getDocs(q);
    setHistory(snap.docs.map(doc => doc.data()));
  };

  const handleDownload = async () => {
    if (!captureRef.current) return;
    const dataUrl = await toPng(captureRef.current, { pixelRatio: 2 });
    const link = document.createElement('a');
    link.download = `Certificate.png`;
    link.href = dataUrl;
    link.click();
    
    await addDoc(collection(db, "certificates"), { ...certData, userId: user.uid, createdAt: serverTimestamp() });
    fetchHistory(user.uid);
  };

  if (!user) return <div className="h-screen bg-[#020617] flex items-center justify-center text-white font-bold">Please Login to Your Firebase Console</div>;

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-300 font-sans">
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#0f172a] border-r border-white/5 p-6 flex flex-col fixed h-full z-20">
        <div className="flex items-center gap-2 mb-10 text-white font-bold text-xl uppercase tracking-tighter">
          <ShieldCheck className="text-blue-500" /> NEXCERT
        </div>
        <nav className="flex-1 space-y-2">
          <button onClick={() => setActiveTab('templates')} className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 ${activeTab === 'templates' || activeTab === 'editor' ? 'bg-blue-600 text-white' : 'hover:bg-white/5'}`}><Layout size={18}/> Templates</button>
          <button onClick={() => setActiveTab('history')} className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 ${activeTab === 'history' ? 'bg-blue-600 text-white' : 'hover:bg-white/5'}`}><History size={18}/> History</button>
        </nav>
        <button onClick={() => signOut(auth)} className="flex items-center gap-3 text-slate-500 hover:text-red-400 p-4 font-bold mt-auto"><LogOut size={18}/> Logout</button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 ml-64 p-10">
        {activeTab === 'templates' && (
          <div>
            <h1 className="text-2xl font-bold text-white mb-6">Select a Design</h1>
            <div className="bg-[#0f172a] p-4 rounded-xl border border-white/5 w-72 cursor-pointer hover:border-blue-500 transition-all" onClick={() => setActiveTab('editor')}>
              <div className="aspect-video bg-blue-900/20 rounded-lg mb-4 flex items-center justify-center"><Award className="text-blue-500" /></div>
              <p className="text-white font-bold">Royal Blue Classic</p>
              <p className="text-xs text-slate-500">Standard A4 Layout</p>
            </div>
          </div>
        )}

        {activeTab === 'editor' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
              <p className="text-blue-400 text-sm font-bold">Click on the text inside the certificate to edit it.</p>
              <button onClick={handleDownload} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2">
                <Download size={18} /> Download PNG
              </button>
            </div>

            {/* CONTAINER THAT FIXES THE LARGE SIZE ISSUE */}
            <div className="bg-slate-900 p-10 rounded-2xl border border-white/5 flex justify-center items-center overflow-hidden h-[550px]">
              <div className="scale-[0.5] origin-center">
                
                {/* THE ACTUAL CERTIFICATE */}
                <div 
                  ref={captureRef}
                  className="w-[1123px] h-[794px] bg-white text-slate-900 p-16 flex flex-col justify-between items-center text-center relative border-[12px] border-slate-100"
                  style={{ fontFamily: 'serif' }}
                >
                  {/* DESIGN ELEMENTS */}
                  <div className="absolute top-0 left-0 w-[25%] h-full bg-[#1e3a8a]"></div>
                  <div className="absolute top-0 left-[24%] w-2 h-full bg-[#fbbf24]"></div>

                  <div className="relative z-10 ml-[25%] h-full flex flex-col justify-between items-center w-full py-10 px-10">
                    <div>
                      <h1 className="text-5xl font-bold uppercase text-[#1e3a8a] tracking-widest">Certificate</h1>
                      <p className="text-slate-400 italic text-xl mt-4">This acknowledges that</p>
                    </div>

                    {/* CLICKABLE TEXT BOXES */}
                    <input 
                      value={certData.name} 
                      onChange={(e) => setCertData({...certData, name: e.target.value})}
                      className="w-full bg-transparent text-center text-6xl font-bold text-black border-none outline-none focus:ring-2 focus:ring-blue-100 rounded-lg"
                    />

                    <div>
                      <p className="text-lg text-slate-500">for successful participation in</p>
                      <input 
                        value={certData.course} 
                        onChange={(e) => setCertData({...certData, course: e.target.value})}
                        className="w-full bg-transparent text-center text-2xl font-bold text-[#1e3a8a] border-none outline-none focus:ring-2 focus:ring-blue-100 rounded-lg mt-2"
                      />
                    </div>

                    <div className="w-full flex justify-between items-end border-t border-slate-200 pt-8 mt-10">
                      <div className="w-48 text-center">
                        <input value={certData.director} onChange={(e) => setCertData({...certData, director: e.target.value})} className="w-full bg-transparent text-center font-bold text-sm outline-none" />
                        <p className="text-[10px] uppercase text-slate-400 border-t border-slate-200 mt-1">Director</p>
                      </div>
                      <Award size={40} className="text-[#fbbf24]" />
                      <div className="w-48 text-center">
                        <input value={certData.coordinator} onChange={(e) => setCertData({...certData, coordinator: e.target.value})} className="w-full bg-transparent text-center font-bold text-sm outline-none" />
                        <p className="text-[10px] uppercase text-slate-400 border-t border-slate-200 mt-1">Coordinator</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="max-w-2xl mx-auto space-y-4">
            <h1 className="text-xl font-bold text-white">Issue History</h1>
            {history.map((h, i) => (
              <div key={i} className="bg-[#0f172a] p-4 rounded-xl border border-white/5 flex justify-between items-center">
                <div>
                  <p className="text-white font-bold">{h.name}</p>
                  <p className="text-xs text-slate-500">{h.course}</p>
                </div>
                <CheckCircle2 className="text-blue-500" size={16} />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;