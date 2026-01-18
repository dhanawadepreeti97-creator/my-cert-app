import React, { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, collection, addDoc, query, where, getDocs, serverTimestamp } from "firebase/firestore";
import { Layout, ShieldCheck, History, PlusCircle, LogOut, Loader2, Mail, Lock, UserPlus, Eye, EyeOff, Upload, Download, Search } from 'lucide-react';
import { toPng } from 'html-to-image';

// 1. FIREBASE CONFIG (Paste your keys from the Firebase console here)
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

// --- IMPROVED CERTIFICATE COMPONENT ---
const Certificate = ({ studentName, course, date, bgImage, id, isPreview = false }) => (
  <div 
    id={id} 
    className={`relative bg-white text-slate-900 shadow-2xl overflow-hidden flex flex-col items-center justify-between border-[12px] border-double border-slate-800 ${isPreview ? 'w-full aspect-[1.414/1]' : 'w-[800px] h-[565px]'}`}
    style={{ background: bgImage ? `url(${bgImage}) center/cover no-repeat` : 'white' }}
  >
    {/* Decorative Corners (Only shows if no custom background) */}
    {!bgImage && (
      <>
        <div className="absolute top-0 left-0 w-24 h-24 border-t-8 border-l-8 border-indigo-600 m-4"></div>
        <div className="absolute bottom-0 right-0 w-24 h-24 border-b-8 border-r-8 border-indigo-600 m-4"></div>
      </>
    )}

    <div className="z-10 w-full h-full p-12 flex flex-col items-center justify-between text-center">
      <div className="space-y-2">
        <ShieldCheck size={isPreview ? 30 : 50} className="text-indigo-600 mx-auto mb-2" />
        <h1 className="text-2xl md:text-3xl font-serif font-bold tracking-[0.3em] uppercase text-slate-800">Certificate</h1>
        <p className="text-sm italic text-slate-500 uppercase tracking-widest">Of Achievement</p>
      </div>

      <div className="w-full">
        <p className="text-lg italic text-slate-400 mb-1">This is to certify that</p>
        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 border-b-2 border-slate-100 pb-2 mb-4 px-10 inline-block max-w-full truncate">
          {studentName || "Recipient Name"}
        </h2>
        <p className="text-base text-slate-500">has successfully completed all requirements for</p>
        <p className="text-xl md:text-2xl font-bold text-indigo-700 mt-1 uppercase tracking-tight">
          {course || "Course Title"}
        </p>
      </div>

      <div className="w-full flex justify-between items-end px-4 border-t border-slate-100 pt-6">
        <div className="text-left">
          <p className="font-bold text-sm text-slate-800">{date}</p>
          <p className="text-[10px] uppercase text-slate-400 font-bold">Issue Date</p>
        </div>
        <div className="flex flex-col items-center">
           <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center mb-1">
              <ShieldCheck size={20} className="text-white" />
           </div>
           <p className="text-[8px] text-slate-400 font-bold uppercase">NexCert Verified</p>
        </div>
        <div className="text-right">
          <p className="font-serif italic text-lg text-slate-800">Authorized Official</p>
          <p className="text-[10px] uppercase text-slate-400 font-bold">NexCert Protocol</p>
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
  const [certData, setCertData] = useState({ name: '', course: '', date: new Date().toLocaleDateString(), customBg: null });
  const [history, setHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) fetchHistory(currentUser.uid);
      setTimeout(() => setLoading(false), 1500);
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

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setCertData({ ...certData, customBg: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const handleIssue = async () => {
    if (!certData.name || !certData.course) return alert("Fill all fields!");
    const node = document.getElementById('cert-capture');
    
    // THE FIX: Wait for rendering + Force 1:1 scale for capture
    setTimeout(async () => {
      try {
        const dataUrl = await toPng(node, { 
          cacheBust: true, 
          pixelRatio: 2,
          style: { transform: 'scale(1)', left: '0', top: '0' } // Ensures no cut-off
        });
        const link = document.createElement('a');
        link.download = `Cert-${certData.name}.png`;
        link.href = dataUrl;
        link.click();

        await addDoc(collection(db, "certificates"), { 
          ...certData, 
          userId: user.uid, 
          createdAt: serverTimestamp() 
        });
        fetchHistory(user.uid);
        alert("Certificate Issued Successfully!");
      } catch (e) {
        console.error(e);
      }
    }, 500);
  };

  if (loading) return (
    <div className="h-screen bg-[#020617] flex flex-col items-center justify-center text-white font-sans">
      <ShieldCheck className="text-indigo-500 mb-4 animate-bounce" size={60} />
      <h1 className="text-4xl font-black tracking-tighter uppercase italic">Welcome to NexCert</h1>
    </div>
  );

  if (!user) return (
    <div className="h-screen bg-[#020617] flex items-center justify-center p-6 font-sans">
      <div className="bg-[#0f172a] p-10 rounded-3xl border border-white/10 w-full max-w-md shadow-2xl">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">{isSignup ? "Create Account" : "Login"}</h2>
        <div className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 text-slate-500" size={18} />
            <input 
              type="email" 
              placeholder="Email Address" 
              className="w-full bg-slate-900 p-3.5 pl-10 rounded-xl border border-white/5 text-white outline-none focus:border-indigo-500" 
              onChange={(e) => setEmail(e.target.value)} 
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-slate-500" size={18} />
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Password" 
              className="w-full bg-slate-900 p-3.5 pl-10 rounded-xl border border-white/5 text-white outline-none focus:border-indigo-500" 
              onChange={(e) => setPassword(e.target.value)} 
            />
            <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-slate-500 hover:text-white transition-colors">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        <button onClick={handleAuth} className="w-full bg-indigo-600 p-4 rounded-xl font-bold text-white hover:bg-indigo-500 transition-all mt-8 shadow-lg shadow-indigo-600/20">
          Continue
        </button>
        <p onClick={() => setIsSignup(!isSignup)} className="text-center text-slate-400 mt-6 cursor-pointer hover:text-white text-sm transition-colors">
          {isSignup ? "Already have an account? Login" : "Don't have an account? Sign up"}
        </p>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-200 font-sans">
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#0f172a] border-r border-white/10 p-6 flex flex-col fixed h-full z-20">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
            <ShieldCheck className="text-white" size={24} />
          </div>
          <span className="text-2xl font-black text-white tracking-tighter">NEXCERT</span>
        </div>
        <nav className="flex-1 space-y-2">
          {[{ id: 'templates', icon: <Layout />, label: 'Designs' }, { id: 'issue', icon: <PlusCircle />, label: 'Editor' }, { id: 'history', icon: <History />, label: 'Archive' }].map(item => (
            <button 
              key={item.id} 
              onClick={() => setActiveTab(item.id)} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold ${activeTab === item.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-white/5'}`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>
        <button onClick={() => signOut(auth)} className="flex items-center gap-3 text-slate-500 hover:text-red-400 mt-auto px-4 py-3 transition-colors font-medium">
          <LogOut size={20} /> Logout
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 ml-64 p-8">
        <div className="bg-[#0f172a]/50 border border-white/5 rounded-3xl p-8 min-h-[85vh] shadow-2xl backdrop-blur-sm">
          
          {/* DESIGNS TAB */}
          {activeTab === 'templates' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Select a Base Design</h2>
                <button onClick={() => setActiveTab('issue')} className="bg-indigo-600 px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-500 transition-all">Start Custom Build</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="group space-y-4">
                  <div className="rounded-2xl overflow-hidden border-2 border-white/10 group-hover:border-indigo-500 transition-all shadow-xl scale-90 origin-top-left">
                     <Certificate isPreview={true} studentName="John Doe" course="Blockchain Masterclass" date="01/19/2026" />
                  </div>
                  <div className="flex justify-between items-center px-2">
                    <span className="font-bold text-white">Classic Professional</span>
                    <button onClick={() => setActiveTab('issue')} className="text-xs bg-white text-black px-3 py-1 rounded-full font-bold">Select</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* EDITOR TAB */}
          {activeTab === 'issue' && (
            <div className="grid lg:grid-cols-2 gap-12 animate-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-6">
                <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 space-y-6">
                  <h3 className="text-lg font-bold text-white">Certificate Information</h3>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block tracking-widest">Recipient Name</label>
                    <input type="text" placeholder="e.g. Ram Joshi" className="w-full bg-slate-900 p-3.5 rounded-xl border border-white/10 text-white outline-none focus:border-indigo-500 transition-all" onChange={(e) => setCertData({...certData, name: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block tracking-widest">Course Title</label>
                    <input type="text" placeholder="e.g. AI for all" className="w-full bg-slate-900 p-3.5 rounded-xl border border-white/10 text-white outline-none focus:border-indigo-500 transition-all" onChange={(e) => setCertData({...certData, course: e.target.value})} />
                  </div>
                  <div className="pt-4 border-t border-white/5">
                    <label className="flex items-center gap-3 bg-white/5 p-4 rounded-xl border border-dashed border-white/20 hover:bg-white/10 cursor-pointer transition-all">
                      <Upload size={20} className="text-indigo-400" />
                      <span className="text-sm font-medium text-slate-300">Upload Custom Template</span>
                      <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                    </label>
                  </div>
                </div>
                <button onClick={handleIssue} className="w-full bg-indigo-600 p-4 rounded-xl font-black text-white flex items-center justify-center gap-3 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition-all uppercase tracking-widest">
                  <Download size={22} /> Issue & Download PNG
                </button>
              </div>

              <div className="flex flex-col items-center">
                <p className="text-xs font-bold text-slate-500 uppercase mb-4 tracking-tighter">Live Preview</p>
                {/* Hidden Capture Node (Always full size) */}
                <div className="fixed left-[-9999px]">
                  <Certificate id="cert-capture" studentName={certData.name} course={certData.course} date={certData.date} bgImage={certData.customBg} />
                </div>
                {/* Visible Preview (Scaled) */}
                <div className="w-full max-w-md shadow-2xl rounded-lg overflow-hidden border border-white/10">
                   <Certificate isPreview={true} studentName={certData.name} course={certData.course} date={certData.date} bgImage={certData.customBg} />
                </div>
              </div>
            </div>
          )}

          {/* ARCHIVE TAB */}
          {activeTab === 'history' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Issue History</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 text-slate-500" size={18} />
                  <input type="text" placeholder="Search recipients..." className="bg-slate-900 pl-10 pr-4 py-2 rounded-lg border border-white/10 text-sm w-64 text-white" onChange={(e) => setSearchTerm(e.target.value.toLowerCase())} />
                </div>
              </div>
              <div className="grid gap-3">
                {history.filter(c => c.name.toLowerCase().includes(searchTerm)).map((c, i) => (
                  <div key={i} className="bg-white/5 p-4 rounded-xl border border-white/5 flex justify-between items-center hover:bg-white/10 transition-all">
                    <div>
                      <p className="font-bold text-white text-lg">{c.name}</p>
                      <p className="text-sm text-slate-400 font-medium">{c.course}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-indigo-400 font-black uppercase tracking-tighter">Secured</p>
                      <p className="text-xs text-slate-600 mt-1">{c.date}</p>
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