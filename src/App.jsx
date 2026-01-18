import React, { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, collection, addDoc, query, where, getDocs, orderBy } from "firebase/firestore";
import { Layout, ShieldCheck, History, PlusCircle, LogOut, Loader2, Mail, Lock, UserPlus } from 'lucide-react';
import { toPng } from 'html-to-image';

// 1. FIREBASE CONFIG (Replace with yours)
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

// 2. TEMPLATE COMPONENT
const Template1 = ({ studentName = "Recipient Name", course = "Course Name", date = "Date" }) => (
  <div id="certificate-to-download" className="w-full aspect-[1.414/1] bg-white text-slate-900 p-10 border-[12px] border-double border-slate-800 relative shadow-2xl">
    <div className="h-full border border-slate-200 flex flex-col items-center justify-between py-10">
      <h1 className="text-3xl font-serif font-bold tracking-[0.2em] text-slate-800 uppercase">Certificate of Achievement</h1>
      <div className="text-center">
        <p className="text-slate-500 italic mb-4 text-lg">This certificate is proudly presented to</p>
        <h2 className="text-5xl font-bold text-slate-900 mb-6 border-b-2 border-slate-100 inline-block px-8">{studentName}</h2>
        <p className="text-slate-600 max-w-lg mx-auto leading-relaxed">For the successful completion of the <span className="font-bold">{course}</span> program.</p>
      </div>
      <div className="w-full flex justify-around items-center px-12">
        <div className="text-center"><p className="font-bold border-b border-slate-300 mb-1">{date}</p><p className="text-[10px] uppercase text-slate-400 font-bold">Issue Date</p></div>
        <div className="w-16 h-16 bg-slate-800"></div>
        <div className="text-center"><p className="font-serif italic text-xl border-b border-slate-300 mb-1">NEXCERT AUTH</p><p className="text-[10px] uppercase text-slate-400 font-bold">Authorized Signatory</p></div>
      </div>
    </div>
  </div>
);

// 3. MAIN APP
const App = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState('templates');
  const [certData, setCertData] = useState({ name: '', course: '', date: new Date().toLocaleDateString() });
  const [history, setHistory] = useState([]);

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

  const handleIssue = async () => {
    if (!certData.name || !certData.course) return alert("Fill all fields!");
    const node = document.getElementById('certificate-to-download');
    const dataUrl = await toPng(node);
    const link = document.createElement('a');
    link.download = `Cert-${certData.name}.png`;
    link.href = dataUrl;
    link.click();

    await addDoc(collection(db, "certificates"), { ...certData, userId: user.uid, createdAt: new Date() });
    fetchHistory(user.uid);
    alert("Certificate Saved & Downloaded!");
  };

  if (loading) return (
    <div className="h-screen bg-[#020617] flex flex-col items-center justify-center text-white">
      <ShieldCheck className="text-indigo-500 mb-4 animate-bounce" size={60} />
      <h1 className="text-4xl font-bold tracking-tighter">WELCOME TO NEXCERT</h1>
    </div>
  );

  if (!user) return (
    <div className="h-screen bg-[#020617] flex items-center justify-center p-6">
      <div className="bg-[#0f172a] p-8 rounded-3xl border border-white/10 w-full max-w-md shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          {isSignup ? <UserPlus /> : <Mail />} {isSignup ? "Create Account" : "Login"}
        </h2>
        <input type="email" placeholder="Organization Email" className="w-full bg-slate-900 p-3 rounded-xl mb-4 border border-white/5 outline-none focus:border-indigo-500" onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" className="w-full bg-slate-900 p-3 rounded-xl mb-6 border border-white/5 outline-none focus:border-indigo-500" onChange={(e) => setPassword(e.target.value)} />
        <button onClick={handleAuth} className="w-full bg-indigo-600 p-3 rounded-xl font-bold text-white hover:bg-indigo-500 transition-all">Continue</button>
        <p onClick={() => setIsSignup(!isSignup)} className="text-center text-slate-400 mt-4 cursor-pointer hover:text-white text-sm">
          {isSignup ? "Already have an account? Login" : "Need an account? Sign up"}
        </p>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-200">
      <aside className="w-64 bg-[#0f172a] border-r border-white/10 p-6 flex flex-col fixed h-full">
        <div className="flex items-center gap-3 mb-10"><ShieldCheck className="text-indigo-500" size={28} /><span className="text-2xl font-black text-white">NEXCERT</span></div>
        <nav className="flex-1 space-y-2">
          {[{ id: 'templates', icon: <Layout />, label: 'Designs' }, { id: 'issue', icon: <PlusCircle />, label: 'Editor' }, { id: 'history', icon: <History />, label: 'Archive' }].map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === item.id ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-white/5'}`}>{item.icon}<span>{item.label}</span></button>
          ))}
        </nav>
        <button onClick={() => signOut(auth)} className="flex items-center gap-3 text-slate-500 hover:text-red-400 mt-auto"><LogOut /> Logout</button>
      </aside>
      <main className="flex-1 ml-64 p-8">
        <div className="bg-[#0f172a]/50 border border-white/5 rounded-3xl p-8 min-h-[80vh]">
          {activeTab === 'templates' && <button onClick={() => setActiveTab('issue')} className="bg-indigo-600 px-6 py-3 rounded-xl font-bold">Create New from Design #1</button>}
          {activeTab === 'issue' && (
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <input type="text" placeholder="Recipient Name" className="w-full bg-slate-900 p-3 rounded-xl border border-white/10 outline-none" onChange={(e) => setCertData({...certData, name: e.target.value})} />
                <input type="text" placeholder="Course Name" className="w-full bg-slate-900 p-3 rounded-xl border border-white/10 outline-none" onChange={(e) => setCertData({...certData, course: e.target.value})} />
                <button onClick={handleIssue} className="w-full bg-indigo-600 p-4 rounded-xl font-bold">Issue & Download</button>
              </div>
              <div className="scale-75 origin-top-left"><Template1 studentName={certData.name} course={certData.course} date={certData.date} /></div>
            </div>
          )}
          {activeTab === 'history' && (
            <div className="space-y-4">
              {history.map((c, i) => <div key={i} className="bg-white/5 p-4 rounded-xl border border-white/10 flex justify-between"><div><p className="font-bold">{c.name}</p><p className="text-sm text-slate-400">{c.course}</p></div><span>{c.date}</span></div>)}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;