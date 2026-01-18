import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, collection, addDoc, query, where, getDocs, serverTimestamp } from "firebase/firestore";
import { ShieldCheck, Layout, History, LogOut, Download, Mail, Lock, Eye, EyeOff, Award, CheckCircle2 } from 'lucide-react';
import { toPng } from 'html-to-image';

// --- STEP 1: PASTE YOUR FIREBASE KEYS HERE ---
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
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('templates');
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [history, setHistory] = useState([]);
  
  // Professional Placeholders - No Personal Info
  const [certData, setCertData] = useState({
    name: 'RECIPIENT NAME',
    course: 'NAME OF THE SYMPOSIUM OR COURSE 2024',
    date: 'JANUARY 20, 2026',
    director: 'PROGRAM DIRECTOR',
    coordinator: 'EVENT COORDINATOR'
  });

  const captureRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) fetchHistory(u.uid);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const fetchHistory = async (uid) => {
    const q = query(collection(db, "certificates"), where("userId", "==", uid));
    const snap = await getDocs(q);
    setHistory(snap.docs.map(doc => doc.data()));
  };

  const handleAuth = async () => {
    try {
      if (isSignup) await createUserWithEmailAndPassword(auth, email, password);
      else await signInWithEmailAndPassword(auth, email, password);
    } catch (err) { alert(err.message); }
  };

  const handleDownload = async () => {
    if (!captureRef.current) return;
    try {
      const dataUrl = await toPng(captureRef.current, { 
        pixelRatio: 3, // Ultra-high resolution for printing
        cacheBust: true 
      });
      const link = document.createElement('a');
      link.download = `Certificate_${certData.name.replace(/\s+/g, '_')}.png`;
      link.href = dataUrl;
      link.click();
      
      await addDoc(collection(db, "certificates"), { 
        ...certData, 
        userId: user.uid, 
        createdAt: serverTimestamp() 
      });
      fetchHistory(user.uid);
    } catch (e) { console.error("Download failed", e); }
  };

  if (loading) return <div className="h-screen bg-[#020617] flex items-center justify-center text-blue-500 font-bold italic tracking-widest animate-pulse">NEXCERT SECURE BOOT...</div>;

  if (!user) return (
    <div className="h-screen bg-[#020617] flex items-center justify-center p-6 font-sans">
      <div className="bg-[#0f172a] p-10 rounded-3xl border border-white/10 w-full max-w-md shadow-2xl">
        <div className="flex justify-center mb-6"><ShieldCheck size={50} className="text-blue-500" /></div>
        <h2 className="text-2xl font-bold text-white mb-8 text-center">{isSignup ? "Create Admin Account" : "Issuer Login"}</h2>
        <div className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 text-slate-500" size={18} />
            <input type="email" placeholder="Email" className="w-full bg-slate-900 p-3.5 pl-10 rounded-xl border border-white/5 text-white outline-none focus:border-blue-500" onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-slate-500" size={18} />
            <input type={showPassword ? "text" : "password"} placeholder="Password" className="w-full bg-slate-900 p-3.5 pl-10 rounded-xl border border-white/5 text-white outline-none focus:border-blue-500" onChange={(e) => setPassword(e.target.value)} />
            <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-slate-500">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
          </div>
        </div>
        <button onClick={handleAuth} className="w-full bg-blue-600 p-4 rounded-xl font-bold text-white mt-8 hover:bg-blue-500 transition-all">Enter Dashboard</button>
        <p onClick={() => setIsSignup(!isSignup)} className="text-center text-slate-400 mt-6 cursor-pointer text-sm hover:text-white underline decoration-blue-500/30">
          {isSignup ? "Already have an account? Login" : "New? Register Organization"}
        </p>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-300 font-sans">
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#0f172a] border-r border-white/5 p-6 flex flex-col fixed h-full z-20">
        <div className="flex items-center gap-3 mb-12 text-white font-black text-2xl italic tracking-tighter">
          <ShieldCheck className="text-blue-500" size={30} /> NEXCERT
        </div>
        <nav className="flex-1 space-y-3">
          <button onClick={() => setActiveTab('templates')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'templates' || activeTab === 'editor' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-500 hover:bg-white/5'}`}><Layout size={20}/> Design Library</button>
          <button onClick={() => setActiveTab('history')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'history' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-white/5'}`}><History size={20}/> Issue History</button>
        </nav>
        <button onClick={() => signOut(auth)} className="flex items-center gap-3 text-slate-600 hover:text-red-400 font-bold px-4 py-3 mt-auto transition-colors"><LogOut size={20}/> Sign Out</button>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 ml-64 p-10">
        
        {activeTab === 'templates' && (
          <div className="max-w-5xl mx-auto animate-in fade-in duration-700">
            <h1 className="text-3xl font-bold text-white mb-2 italic">Certificate Templates</h1>
            <p className="text-slate-500 mb-10 font-medium tracking-wide">Select a professional design to begin customizing.</p>
            <div className="grid grid-cols-2 gap-10">
              <div onClick={() => setActiveTab('editor')} className="bg-[#0f172a] p-5 rounded-[2rem] border-2 border-transparent hover:border-blue-500 transition-all cursor-pointer group shadow-2xl">
                <div className="aspect-[1.414/1] bg-slate-900 rounded-2xl mb-6 flex items-center justify-center border border-white/5">
                   <Award size={60} className="text-blue-900 animate-pulse" />
                </div>
                <div className="flex justify-between items-center px-2">
                  <div>
                    <span className="text-white font-black block text-sm uppercase tracking-widest">Royal Blue Pro</span>
                    <span className="text-[10px] text-blue-500 font-black uppercase tracking-[0.2em]">High Definition A4</span>
                  </div>
                  <button className="bg-white text-blue-900 px-5 py-2 rounded-full text-[10px] font-black hover:bg-blue-500 hover:text-white transition-colors">USE DESIGN</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'editor' && (
          <div className="max-w-6xl mx-auto space-y-8 animate-in slide-in-from-bottom-5 duration-500">
            <div className="flex justify-between items-end">
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">Interactive Design Page</h1>
                <p className="text-blue-400 text-[10px] font-black uppercase tracking-[0.3em]">Click directly on the text boxes to edit the certificate</p>
              </div>
              <button onClick={handleDownload} className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-2xl font-black flex items-center gap-3 shadow-2xl shadow-blue-900/40 transition-transform active:scale-95">
                <Download size={22} /> DOWNLOAD CERTIFICATE (PNG)
              </button>
            </div>

            {/* PREVIEW CONTAINER - Standard Viewport Sizing */}
            <div className="bg-[#0b1120] rounded-[3rem] p-12 border border-white/5 flex justify-center items-center h-[650px] overflow-hidden shadow-inner">
               <div className="w-[1123px] h-[794px] origin-center scale-[0.45] lg:scale-[0.55] xl:scale-[0.65] transition-transform duration-500">
                  
                  {/* THE ACTUAL CERTIFICATE (High-Res Node) */}
                  <div 
                    ref={captureRef}
                    className="w-[1123px] h-[794px] bg-white text-[#1e293b] flex flex-col items-center justify-between p-20 border-[20px] border-slate-50 relative"
                    style={{ fontFamily: "serif" }}
                  >
                    {/* Professional Geometric Blue & Gold Background */}
                    <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                       <div className="absolute top-0 left-0 w-[30%] h-full bg-[#1e3a8a] -skew-x-2 origin-top"></div>
                       <div className="absolute top-0 left-[28%] w-2 h-full bg-[#fbbf24]"></div>
                       <div className="absolute top-0 left-0 w-[27%] h-full bg-[#1e40af] -skew-x-2 opacity-50"></div>
                       {/* Corner Accents */}
                       <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[40%] bg-[#1e3a8a] rotate-45 shadow-2xl"></div>
                       <div className="absolute bottom-[-5%] right-[-2%] w-[10%] h-[20%] bg-[#fbbf24] rotate-45 opacity-60"></div>
                    </div>

                    <div className="relative z-10 w-full h-full flex flex-col items-center justify-between pl-[30%] text-center">
                      <div className="space-y-4">
                        <h1 className="text-5xl font-black tracking-[0.2em] uppercase text-[#1e3a8a]">Certificate</h1>
                        <p className="text-[#fbbf24] font-black tracking-[0.5em] text-sm uppercase">of achievement</p>
                        <div className="w-56 h-[2px] bg-slate-100 mx-auto mt-6"></div>
                        <p className="text-xl italic text-slate-400 mt-6">This certificate is proudly presented to</p>
                      </div>

                      {/* INLINE EDITABLE NAME - No hardcoded personal info */}
                      <input 
                        value={certData.name} 
                        onChange={(e) => setCertData({...certData, name: e.target.value.toUpperCase()})}
                        className="w-full bg-transparent text-center text-6xl font-black text-[#0f172a] border-b-2 border-transparent hover:border-slate-100 focus:border-blue-400 outline-none py-2 transition-all uppercase placeholder:text-slate-100 cursor-text"
                        placeholder="ENTER FULL NAME"
                      />

                      <div className="space-y-4">
                        <p className="text-lg text-slate-500 italic leading-relaxed max-w-lg mx-auto">for having successfully completed the professional requirements and demonstrated excellence in the program of:</p>
                        {/* INLINE EDITABLE COURSE */}
                        <input 
                          value={certData.course} 
                          onChange={(e) => setCertData({...certData, course: e.target.value.toUpperCase()})}
                          className="w-full bg-transparent text-center text-3xl font-bold text-[#1e3a8a] border-b-2 border-transparent hover:border-slate-100 focus:border-blue-400 outline-none py-1 uppercase tracking-tight placeholder:text-slate-100"
                          placeholder="EVENT OR PROGRAM TITLE"
                        />
                      </div>

                      {/* Signatures & Seal */}
                      <div className="w-full flex justify-between items-end px-10 pt-10 border-t border-slate-100 mt-6">
                        <div className="text-center w-56">
                          <input value={certData.director} onChange={(e) => setCertData({...certData, director: e.target.value.toUpperCase()})} className="w-full bg-transparent text-center font-black text-xs text-[#0f172a] outline-none tracking-widest" />
                          <p className="text-[9px] text-slate-400 font-bold uppercase border-t border-slate-300 mt-1 pt-1">Authorized Authority</p>
                        </div>
                        
                        <div className="flex flex-col items-center">
                          <div className="w-20 h-20 border-8 border-double border-blue-50/50 rounded-full flex items-center justify-center bg-blue-50/20 shadow-lg">
                             <Award size={36} className="text-[#fbbf24]" />
                          </div>
                          <p className="text-[8px] font-black text-slate-300 mt-2 uppercase tracking-[0.4em]">Official NexCert</p>
                        </div>

                        <div className="text-center w-56">
                          <input value={certData.coordinator} onChange={(e) => setCertData({...certData, coordinator: e.target.value.toUpperCase()})} className="w-full bg-transparent text-center font-black text-xs text-[#0f172a] outline-none tracking-widest" />
                          <p className="text-[9px] text-slate-400 font-bold uppercase border-t border-slate-300 mt-1 pt-1">Event Coordinator</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* ACTUAL CERTIFICATE END */}

               </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="max-w-4xl mx-auto space-y-6 animate-in slide-in-from-right-10 duration-500">
            <h1 className="text-3xl font-bold text-white mb-2 italic">Verified Ledger</h1>
            <p className="text-slate-500 mb-8">All issued certificates are permanently recorded for verification.</p>
            <div className="grid gap-4">
              {history.map((h, i) => (
                <div key={i} className="bg-[#0f172a] p-6 rounded-3xl border border-white/5 flex justify-between items-center hover:bg-white/5 transition-all group">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform shadow-lg"><CheckCircle2 size={24} /></div>
                    <div>
                      <p className="text-white font-bold text-lg tracking-tight uppercase">{h.name}</p>
                      <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest mt-0.5">{h.course}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Authenticated</p>
                    <p className="text-blue-500 text-xs font-black italic">{h.date}</p>
                  </div>
                </div>
              ))}
              {history.length === 0 && <div className="text-center py-20 text-slate-600 font-bold text-xl italic opacity-30">No transaction history found.</div>}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;