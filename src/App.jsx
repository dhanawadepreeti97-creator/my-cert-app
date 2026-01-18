import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, collection, addDoc, query, where, getDocs, serverTimestamp } from "firebase/firestore";
import { ShieldCheck, Layout, History, LogOut, Download, Mail, Lock, Eye, EyeOff, Award, CheckCircle2 } from 'lucide-react';
import { toPng } from 'html-to-image';

// --- STEP 1: FILL THIS CONFIG ---
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
  const [certData, setCertData] = useState({
    name: 'DHAMARAJ DHANAWADE',
    course: 'NATIONAL TECH SYMPOSIUM 2024',
    date: 'JANUARY 19, 2026',
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
    } catch (err) { alert("Auth Error: " + err.message); }
  };

  const handleDownload = async () => {
    if (!captureRef.current) return;
    try {
      const dataUrl = await toPng(captureRef.current, { 
        pixelRatio: 2,
        cacheBust: true,
      });
      const link = document.createElement('a');
      link.download = `Cert_${certData.name}.png`;
      link.href = dataUrl;
      link.click();
      
      await addDoc(collection(db, "certificates"), { 
        ...certData, 
        userId: user.uid, 
        createdAt: serverTimestamp() 
      });
      fetchHistory(user.uid);
    } catch (err) {
      console.error("Capture failed", err);
    }
  };

  if (loading) return <div className="h-screen bg-[#020617] flex items-center justify-center text-blue-500 font-bold">STARTING NEXCERT...</div>;

  if (!user) return (
    <div className="h-screen bg-[#020617] flex items-center justify-center p-6">
      <div className="bg-[#0f172a] p-10 rounded-3xl border border-white/10 w-full max-w-md shadow-2xl">
        <div className="flex justify-center mb-6"><ShieldCheck size={48} className="text-blue-500" /></div>
        <h2 className="text-2xl font-bold text-white mb-8 text-center">{isSignup ? "Create Account" : "Admin Login"}</h2>
        <div className="space-y-4">
          <input type="email" placeholder="Email" className="w-full bg-slate-900 p-3.5 rounded-xl border border-white/5 text-white outline-none focus:border-blue-500" onChange={(e) => setEmail(e.target.value)} />
          <div className="relative">
            <input type={showPassword ? "text" : "password"} placeholder="Password" className="w-full bg-slate-900 p-3.5 rounded-xl border border-white/5 text-white outline-none focus:border-blue-500" onChange={(e) => setPassword(e.target.value)} />
            <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-slate-500">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
          </div>
        </div>
        <button onClick={handleAuth} className="w-full bg-blue-600 p-4 rounded-xl font-bold text-white mt-8 hover:bg-blue-500">Continue</button>
        <p onClick={() => setIsSignup(!isSignup)} className="text-center text-slate-400 mt-6 cursor-pointer text-sm underline decoration-blue-500/50">
          {isSignup ? "Have an account? Login" : "New? Create Account"}
        </p>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-300">
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#0f172a] border-r border-white/5 p-6 flex flex-col fixed h-full">
        <div className="flex items-center gap-3 mb-10 text-white font-black text-2xl tracking-tighter italic">
          <ShieldCheck className="text-blue-500" /> NEXCERT
        </div>
        <nav className="flex-1 space-y-2 font-bold">
          <button onClick={() => setActiveTab('templates')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'templates' || activeTab === 'editor' ? 'bg-blue-600 text-white' : 'hover:bg-white/5'}`}><Layout size={20}/> Designs</button>
          <button onClick={() => setActiveTab('history')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'history' ? 'bg-blue-600 text-white' : 'hover:bg-white/5'}`}><History size={20}/> Archive</button>
        </nav>
        <button onClick={() => signOut(auth)} className="flex items-center gap-3 text-slate-500 hover:text-red-400 font-bold px-4 py-3 mt-auto"><LogOut size={20}/> Logout</button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 ml-64 p-8">
        
        {activeTab === 'templates' && (
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-8 italic">Library</h1>
            <div className="grid grid-cols-2 gap-8">
              <div onClick={() => setActiveTab('editor')} className="bg-[#0f172a] p-4 rounded-3xl border border-white/5 hover:border-blue-500 cursor-pointer transition-all">
                <div className="aspect-[1.414/1] bg-slate-800 rounded-xl mb-4 flex items-center justify-center border border-white/5 text-xs font-bold text-blue-400 uppercase tracking-tighter">
                   Royal Blue Template #1
                </div>
                <div className="flex justify-between items-center px-2">
                  <span className="text-white font-bold text-sm">Symposium Pro</span>
                  <span className="bg-blue-600/20 text-blue-400 text-[10px] px-2 py-1 rounded-full font-black">ACTIVE</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'editor' && (
          <div className="max-w-5xl mx-auto animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-xl font-bold text-blue-400 uppercase tracking-widest">Live Editor (Click Text to Change)</h1>
              <button onClick={handleDownload} className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-transform active:scale-95">
                <Download size={20} /> SAVE & DOWNLOAD
              </button>
            </div>

            {/* PREVIEW CONTAINER - Keeps size proper on screen */}
            <div className="bg-[#0f172a] rounded-[40px] p-8 border border-white/5 flex justify-center items-center h-[500px] overflow-hidden">
               <div className="scale-[0.4] md:scale-[0.45] lg:scale-[0.5] origin-center">
                  
                  {/* FULL SIZE HIDDEN REF START */}
                  <div 
                    ref={captureRef}
                    className="w-[1123px] h-[794px] bg-white text-[#1e293b] flex flex-col items-center justify-between p-16 border-[12px] border-[#f8fafc] relative shadow-2xl"
                    style={{ fontFamily: "serif" }}
                  >
                    <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                       <div className="absolute top-0 left-0 w-[30%] h-full bg-[#1e3a8a]"></div>
                       <div className="absolute top-0 left-[29%] w-2.5 h-full bg-[#eab308]"></div>
                    </div>

                    <div className="relative z-10 w-full h-full flex flex-col items-center justify-between pl-[28%] text-center">
                      <div>
                        <h1 className="text-5xl font-bold tracking-[0.2em] uppercase text-[#1e3a8a] mb-2">Certificate</h1>
                        <p className="text-[#eab308] font-black tracking-[0.5em] text-sm uppercase">of achievement</p>
                        <div className="w-48 h-1 bg-slate-100 mx-auto mt-6"></div>
                        <p className="text-xl italic text-slate-400 mt-6">This acknowledges that</p>
                      </div>

                      <input value={certData.name} onChange={(e) => setCertData({...certData, name: e.target.value.toUpperCase()})} className="w-full bg-transparent text-center text-6xl font-black text-[#0f172a] border-b-2 border-transparent hover:border-blue-100 focus:border-blue-400 outline-none uppercase transition-all" />

                      <div className="space-y-4">
                        <p className="text-lg text-slate-500 italic">has demonstrated exceptional skill during the completion of</p>
                        <input value={certData.course} onChange={(e) => setCertData({...certData, course: e.target.value.toUpperCase()})} className="w-full bg-transparent text-center text-3xl font-bold text-[#1e3a8a] border-b border-transparent hover:border-blue-100 outline-none uppercase tracking-tight" />
                      </div>

                      <div className="w-full flex justify-between items-end px-12 pt-8 border-t border-slate-100 mt-4">
                        <div className="text-center w-56">
                          <input value={certData.director} onChange={(e) => setCertData({...certData, director: e.target.value})} className="w-full bg-transparent text-center font-bold text-sm text-[#0f172a] outline-none" />
                          <p className="text-[10px] text-slate-400 font-bold uppercase border-t border-slate-200 mt-1">Program Director</p>
                        </div>
                        <Award size={64} className="text-[#eab308]" />
                        <div className="text-center w-56">
                          <input value={certData.coordinator} onChange={(e) => setCertData({...certData, coordinator: e.target.value})} className="w-full bg-transparent text-center font-bold text-sm text-[#0f172a] outline-none" />
                          <p className="text-[10px] text-slate-400 font-bold uppercase border-t border-slate-200 mt-1">Event Coordinator</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* FULL SIZE HIDDEN REF END */}

               </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="max-w-4xl mx-auto animate-in slide-in-from-right-4">
            <h1 className="text-2xl font-bold text-white mb-8">Issued History</h1>
            <div className="grid gap-3">
              {history.map((h, i) => (
                <div key={i} className="bg-[#0f172a] p-6 rounded-2xl border border-white/5 flex justify-between items-center hover:bg-white/5 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500"><CheckCircle2 size={20} /></div>
                    <div><p className="text-white font-bold">{h.name}</p><p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{h.course}</p></div>
                  </div>
                  <p className="text-slate-600 text-xs font-bold">{h.date}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;