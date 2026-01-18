import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, collection, addDoc, query, where, getDocs, serverTimestamp } from "firebase/firestore";
import { Layout, ShieldCheck, History, PlusCircle, LogOut, Loader2, Mail, Lock, UserPlus, Eye, EyeOff, Upload, Download, Search } from 'lucide-react';
import { toPng } from 'html-to-image';

// 1. FIREBASE CONFIG (Paste your keys from the Firebase console here)
const firebaseConfig = {
  // PASTE YOUR KEYS HERE
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- COMPONENT: CERTIFICATE RENDERER ---
const Certificate = ({ studentName, course, date, bgImage, id }) => (
  <div id={id} className="relative w-full aspect-[1.414/1] bg-white text-slate-900 shadow-2xl overflow-hidden">
    {/* Background: Either Uploaded Image or Default Border */}
    {bgImage ? (
      <img src={bgImage} className="absolute inset-0 w-full h-full object-cover" alt="template" />
    ) : (
      <div className="absolute inset-0 border-[16px] border-double border-slate-800 m-4"></div>
    )}

    {/* Content Overlay */}
    <div className="relative z-10 h-full flex flex-col items-center justify-between py-16 px-20 text-center">
      <h1 className="text-4xl font-serif font-bold tracking-[0.2em] uppercase text-slate-800">Certificate</h1>
      <div>
        <p className="text-xl italic text-slate-500 mb-2">This is to certify that</p>
        <h2 className="text-6xl font-bold text-slate-900 mb-6">{studentName || "Recipient Name"}</h2>
        <p className="text-lg text-slate-600">has successfully completed</p>
        <p className="text-2xl font-bold text-slate-800 mt-2">{course || "Course Name"}</p>
      </div>
      <div className="w-full flex justify-around items-end">
        <div className="text-center border-t border-slate-300 pt-2 px-8">
          <p className="font-bold text-sm">{date}</p>
          <p className="text-[10px] uppercase text-slate-400">Date Issued</p>
        </div>
        <div className="w-20 h-20 bg-slate-900/10 rounded flex items-center justify-center border border-slate-200">
           <span className="text-[8px] text-slate-400">NEXCERT SECURE</span>
        </div>
        <div className="text-center border-t border-slate-300 pt-2 px-8">
          <p className="font-serif italic text-lg">Authorized Signatory</p>
          <p className="text-[10px] uppercase text-slate-400">NexCert Protocol</p>
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
    
    // The "White Image" Fix: Wait 500ms for browser to render
    setTimeout(async () => {
      const dataUrl = await toPng(node, { cacheBust: true, pixelRatio: 2 });
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
    }, 500);
  };

  if (loading) return (
    <div className="h-screen bg-[#020617] flex flex-col items-center justify-center text-white">
      <ShieldCheck className="text-indigo-500 mb-4 animate-bounce" size={60} />
      <h1 className="text-4xl font-bold tracking-tighter">WELCOME TO NEXCERT</h1>
    </div>
  );

  if (!user) return (
    <div className="h-screen bg-[#020617] flex items-center justify-center p-6">
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
            <button 
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3.5 text-slate-500 hover:text-white"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button onClick={handleAuth} className="w-full bg-indigo-600 p-4 rounded-xl font-bold text-white hover:bg-indigo-500 transition-all mt-8 shadow-lg shadow-indigo-600/20">
          Continue to Dashboard
        </button>

        <p onClick={() => setIsSignup(!isSignup)} className="text-center text-slate-400 mt-6 cursor-pointer hover:text-white text-sm transition-colors">
          {isSignup ? "Already have an account? Login" : "Don't have an account? Sign up"}
        </p>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-200">
      <aside className="w-64 bg-[#0f172a] border-r border-white/10 p-6 flex flex-col fixed h-full">
        <div className="flex items-center gap-3 mb-10">
          <ShieldCheck className="text-indigo-500" size={28} />
          <span className="text-2xl font-black text-white tracking-tighter">NEXCERT</span>
        </div>
        <nav className="flex-1 space-y-2">
          {[
            { id: 'templates', icon: <Layout />, label: 'Designs' },
            { id: 'issue', icon: <PlusCircle />, label: 'Editor' },
            { id: 'history', icon: <History />, label: 'Archive' }
          ].map(item => (
            <button 
              key={item.id} 
              onClick={() => setActiveTab(item.id)} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === item.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:bg-white/5'}`}
            >
              {item.icon}
              <span className="font-semibold">{item.label}</span>
            </button>
          ))}
        </nav>
        <button onClick={() => signOut(auth)} className="flex items-center gap-3 text-slate-500 hover:text-red-400 mt-auto px-4 py-3 transition-colors font-medium">
          <LogOut size={20} /> Logout
        </button>
      </aside>

      <main className="flex-1 ml-64 p-8">
        <div className="bg-[#0f172a]/50 border border-white/5 rounded-3xl p-8 min-h-[85vh] shadow-2xl backdrop-blur-sm">
          
          {/* DESIGNS TAB (Gallery) */}
          {activeTab === 'templates' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Select a Base Design</h2>
                <button onClick={() => setActiveTab('issue')} className="bg-indigo-600 px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-500 transition-all">Start Custom Build</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="group relative rounded-2xl overflow-hidden border border-white/10 hover:border-indigo-500 transition-all cursor-pointer shadow-xl">
                    <div className="aspect-[1.4/1] bg-slate-900 flex items-center justify-center text-slate-700">Preview Design #{i}</div>
                    <div className="absolute inset-0 bg-indigo-600/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <button onClick={() => setActiveTab('issue')} className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-bold">Use Template</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* EDITOR TAB */}
          {activeTab === 'issue' && (
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 space-y-4">
                  <h3 className="text-lg font-bold text-white mb-2">Certificate Information</h3>
                  <input type="text" placeholder="Recipient Name" className="w-full bg-slate-900 p-3.5 rounded-xl border border-white/10 text-white outline-none focus:border-indigo-500" onChange={(e) => setCertData({...certData, name: e.target.value})} />
                  <input type="text" placeholder="Course / Title" className="w-full bg-slate-900 p-3.5 rounded-xl border border-white/10 text-white outline-none focus:border-indigo-500" onChange={(e) => setCertData({...certData, course: e.target.value})} />
                  
                  <div className="pt-4 border-t border-white/5">
                    <p className="text-xs font-bold text-slate-500 uppercase mb-3">Upload Custom Template</p>
                    <label className="flex items-center gap-3 bg-white/5 p-4 rounded-xl border border-dashed border-white/20 hover:bg-white/10 cursor-pointer transition-all">
                      <Upload size={20} className="text-indigo-400" />
                      <span className="text-sm font-medium text-slate-300">Choose file from space</span>
                      <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                    </label>
                  </div>
                </div>
                
                <button onClick={handleIssue} className="w-full bg-indigo-600 p-4 rounded-xl font-extrabold text-white flex items-center justify-center gap-3 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition-all">
                  <Download size={22} /> Issue & Download PNG
                </button>
              </div>

              <div className="sticky top-8">
                <p className="text-xs font-bold text-slate-500 uppercase mb-4 text-center">Live Preview</p>
                <div className="scale-[0.6] origin-top-left xl:scale-[0.7]">
                   <Certificate 
                      id="cert-capture" 
                      studentName={certData.name} 
                      course={certData.course} 
                      date={certData.date} 
                      bgImage={certData.customBg} 
                    />
                </div>
              </div>
            </div>
          )}

          {/* ARCHIVE TAB (The "What is this?" section) */}
          {activeTab === 'history' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Archive Ledger</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 text-slate-500" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search by name..." 
                    className="bg-slate-900 pl-10 pr-4 py-2 rounded-lg border border-white/10 outline-none text-sm w-64"
                    onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                {history
                  .filter(c => c.name.toLowerCase().includes(searchTerm))
                  .map((c, i) => (
                    <div key={i} className="bg-white/5 p-4 rounded-xl border border-white/5 flex justify-between items-center hover:bg-white/10 transition-all">
                      <div>
                        <p className="font-bold text-white text-lg">{c.name}</p>
                        <p className="text-sm text-slate-400">{c.course}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-indigo-400 font-bold uppercase tracking-widest">Verified</p>
                        <p className="text-xs text-slate-600 mt-1">{c.date}</p>
                      </div>
                    </div>
                ))}
                {history.length === 0 && (
                  <div className="text-center py-20 text-slate-600">No records found in the archive.</div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;