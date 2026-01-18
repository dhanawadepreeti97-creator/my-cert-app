import React, { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, collection, addDoc, query, where, getDocs, serverTimestamp } from "firebase/firestore";
import { Layout, ShieldCheck, History, PlusCircle, LogOut, Mail, Lock, Eye, EyeOff, Upload, Download, Search, Award, CheckCircle2 } from 'lucide-react';
import { toPng } from 'html-to-image';

// 1. FIREBASE CONFIG 
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

// --- PROFESSIONAL CERTIFICATE TEMPLATE ---
const ProfessionalTemplate = ({ data, id, isPreview = false }) => (
  <div 
    id={id} 
    className={`relative bg-white text-[#1e293b] flex flex-col items-center justify-between shadow-2xl overflow-hidden border-[20px] border-[#f8fafc] ${isPreview ? 'w-full aspect-[1.414/1]' : 'w-[2000px] h-[1414px]'}`}
    style={{ fontFamily: "'Times New Roman', Times, serif" }}
  >
    {/* Decorative Outer Border */}
    <div className="absolute inset-4 border-4 border-[#1e293b]"></div>
    <div className="absolute inset-6 border border-[#94a3b8]"></div>

    {/* Content Container */}
    <div className="z-10 w-full h-full p-24 flex flex-col items-center justify-between text-center">
      
      {/* Header Section */}
      <div className="space-y-4">
        <h1 className="text-6xl font-bold tracking-[0.2em] uppercase text-[#0f172a] mb-2">Certificate of Achievement</h1>
        <div className="w-64 h-1 bg-[#1e293b] mx-auto"></div>
        <p className="text-2xl italic text-[#64748b] mt-4 font-sans">This acknowledges that</p>
      </div>

      {/* Recipient Name Section */}
      <div className="w-full">
        <h2 className="text-8xl font-bold text-[#0f172a] mb-4 underline decoration-[#cbd5e1] decoration-1 underline-offset-[16px]">
          {data.name || "Dharmaraj Dhanawade"}
        </h2>
        <p className="text-xl max-w-4xl mx-auto leading-relaxed text-[#475569] font-sans mt-8">
          has demonstrated exceptional skill and dedication through active participation and successful completion of the
        </p>
        <h3 className="text-4xl font-bold text-[#1e293b] mt-6 tracking-wide uppercase font-sans">
          {data.course || "National Tech Symposium 2024"}
        </h3>
      </div>

      {/* Footer / Signature Section */}
      <div className="w-full flex justify-between items-end px-12 pb-10">
        {/* Signatory 1 */}
        <div className="flex flex-col items-center w-64">
          <div className="w-full border-t-2 border-[#1e293b] pt-2">
            <p className="text-xl font-bold uppercase tracking-tighter">{data.director || "Program Director"}</p>
            <p className="text-sm text-[#94a3b8] font-sans font-bold">OFFICIAL AUTHORITY</p>
          </div>
        </div>

        {/* Seal / Logo */}
        <div className="relative flex flex-col items-center">
           <div className="w-40 h-40 border-8 border-double border-indigo-200 rounded-full flex flex-col items-center justify-center bg-indigo-50/30">
              <Award size={60} className="text-indigo-600 mb-1" />
              <span className="text-[10px] font-black uppercase text-indigo-400">Certified {data.year || "2024"}</span>
           </div>
           <p className="mt-4 text-xs font-bold text-[#94a3b8] font-sans tracking-[0.3em]">NEXCERT PROTOCOL</p>
        </div>

        {/* Signatory 2 */}
        <div className="flex flex-col items-center w-64">
          <div className="w-full border-t-2 border-[#1e293b] pt-2">
            <p className="text-xl font-bold uppercase tracking-tighter">{data.coordinator || "Event Coordinator"}</p>
            <p className="text-sm text-[#94a3b8] font-sans font-bold">VERIFIED ISSUER</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const App = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState('templates');
  const [certData, setCertData] = useState({ 
    name: '', 
    course: '', 
    director: 'Program Director', 
    coordinator: 'Event Coordinator', 
    year: '2024' 
  });
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) fetchHistory(currentUser.uid);
      setTimeout(() => setLoading(false), 1000);
    });
    return () => unsubscribe();
  }, []);

  const fetchHistory = async (uid) => {
    const q = query(collection(db, "certificates"), where("userId", "==", uid));
    const querySnapshot = await getDocs(q);
    setHistory(querySnapshot.docs.map(doc => doc.data()));
  };

  const handleAuth = async () => {
    try {
      if (isSignup) await createUserWithEmailAndPassword(auth, email, password);
      else await signInWithEmailAndPassword(auth, email, password);
    } catch (err) { alert(err.message); }
  };

  const handleIssue = async () => {
    const node = document.getElementById('cert-capture');
    const dataUrl = await toPng(node, { pixelRatio: 1 });
    const link = document.createElement('a');
    link.download = `Certificate-${certData.name}.png`;
    link.href = dataUrl;
    link.click();

    await addDoc(collection(db, "certificates"), { ...certData, userId: user.uid, createdAt: serverTimestamp() });
    fetchHistory(user.uid);
  };

  if (loading) return <div className="h-screen bg-[#020617] flex items-center justify-center text-white text-2xl font-black">NEXCERT AUTHENTICATING...</div>;

  if (!user) return (
    <div className="h-screen bg-[#020617] flex items-center justify-center p-6">
      <div className="bg-[#0f172a] p-10 rounded-3xl border border-white/10 w-full max-w-md">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">{isSignup ? "Create Admin" : "Login"}</h2>
        <div className="space-y-4">
          <input type="email" placeholder="Email" className="w-full bg-slate-900 p-4 rounded-xl border border-white/5 text-white outline-none focus:border-indigo-500" onChange={(e) => setEmail(e.target.value)} />
          <div className="relative">
            <input type={showPassword ? "text" : "password"} placeholder="Password" title="Show/Hide" className="w-full bg-slate-900 p-4 rounded-xl border border-white/5 text-white outline-none focus:border-indigo-500" onChange={(e) => setPassword(e.target.value)} />
            <button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-4 text-slate-500">{showPassword ? <EyeOff /> : <Eye />}</button>
          </div>
        </div>
        <button onClick={handleAuth} className="w-full bg-indigo-600 p-4 rounded-xl font-bold text-white mt-8 hover:bg-indigo-500 transition-all">Enter Dashboard</button>
        <p onClick={() => setIsSignup(!isSignup)} className="text-center text-slate-400 mt-6 cursor-pointer text-sm">{isSignup ? "Have account? Login" : "Create new account"}</p>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-200">
      <aside className="w-64 bg-[#0f172a] border-r border-white/10 p-6 flex flex-col fixed h-full">
        <div className="flex items-center gap-3 mb-10"><ShieldCheck className="text-indigo-500" size={32} /><span className="text-2xl font-black text-white italic">NEXCERT</span></div>
        <nav className="flex-1 space-y-2">
          {[{ id: 'templates', icon: <Layout />, label: 'Designs' }, { id: 'issue', icon: <PlusCircle />, label: 'Editor' }, { id: 'history', icon: <History />, label: 'Archive' }].map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === item.id ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-white/5'}`}>{item.icon} <span className="font-bold">{item.label}</span></button>
          ))}
        </nav>
        <button onClick={() => signOut(auth)} className="flex items-center gap-3 text-slate-500 hover:text-red-400 mt-auto"><LogOut /> Logout</button>
      </aside>

      <main className="flex-1 ml-64 p-8">
        <div className="bg-[#0f172a]/50 border border-white/5 rounded-[40px] p-10 min-h-[85vh]">
          
          {activeTab === 'templates' && (
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-white">Professional Library</h2>
              <div className="grid grid-cols-2 gap-8">
                <div className="bg-slate-900/50 p-6 rounded-3xl border-2 border-indigo-500/30 hover:border-indigo-500 transition-all group">
                   <div className="rounded-xl overflow-hidden mb-4 shadow-2xl opacity-80 group-hover:opacity-100 transition-opacity">
                      <ProfessionalTemplate data={{name: "Preview Name", course: "Sample Course"}} isPreview={true} />
                   </div>
                   <div className="flex justify-between items-center">
                     <span className="font-bold text-white uppercase text-sm tracking-widest">Symposium Classic</span>
                     <button onClick={() => setActiveTab('issue')} className="bg-white text-indigo-900 px-4 py-1.5 rounded-full font-bold text-xs">USE DESIGN</button>
                   </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'issue' && (
            <div className="grid lg:grid-cols-2 gap-16">
              <div className="space-y-6">
                <div className="bg-slate-900/80 p-8 rounded-[32px] border border-white/5 space-y-4 shadow-xl">
                  <h3 className="text-xl font-bold text-indigo-400 mb-2">Customize Content</h3>
                  <div className="space-y-4">
                    <input type="text" placeholder="Recipient Name" className="w-full bg-slate-800 p-4 rounded-xl border border-white/10 text-white outline-none" onChange={(e) => setCertData({...certData, name: e.target.value})} />
                    <input type="text" placeholder="Course / Symposium Title" className="w-full bg-slate-800 p-4 rounded-xl border border-white/10 text-white outline-none" onChange={(e) => setCertData({...certData, course: e.target.value})} />
                    <div className="grid grid-cols-2 gap-4">
                      <input type="text" placeholder="Director Title" className="w-full bg-slate-800 p-4 rounded-xl border border-white/10 text-white outline-none" onChange={(e) => setCertData({...certData, director: e.target.value})} />
                      <input type="text" placeholder="Coordinator Title" className="w-full bg-slate-800 p-4 rounded-xl border border-white/10 text-white outline-none" onChange={(e) => setCertData({...certData, coordinator: e.target.value})} />
                    </div>
                  </div>
                </div>
                <button onClick={handleIssue} className="w-full bg-indigo-600 p-5 rounded-2xl font-black text-white flex items-center justify-center gap-3 hover:bg-indigo-500 shadow-2xl transition-all tracking-[0.2em] uppercase">
                  <Download /> Issue Certificate
                </button>
              </div>

              <div className="sticky top-8 flex flex-col items-center">
                <p className="text-xs font-bold text-slate-500 uppercase mb-4 tracking-widest">Master Preview</p>
                <div className="w-full max-w-lg shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                   <ProfessionalTemplate data={certData} isPreview={true} />
                </div>
                {/* Fixed Resolution Hidden Capture Area */}
                <div className="fixed left-[-9999px]">
                   <ProfessionalTemplate id="cert-capture" data={certData} isPreview={false} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-white">Issue History Ledger</h2>
              <div className="grid gap-3">
                {history.map((c, i) => (
                  <div key={i} className="bg-white/5 p-5 rounded-2xl border border-white/5 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-white text-xl uppercase tracking-tighter">{c.name}</p>
                      <p className="text-sm text-slate-400 italic">{c.course}</p>
                    </div>
                    <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs bg-indigo-500/10 px-4 py-2 rounded-full border border-indigo-500/20">
                      <CheckCircle2 size={16} /> VERIFIED {c.year}
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