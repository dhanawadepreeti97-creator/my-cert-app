import React, { useState, useEffect } from 'react';
import { Layout, ShieldCheck, History, Settings, PlusCircle, LogOut, Loader2 } from 'lucide-react';

// --- IMPROVED TEMPLATE 1 (Cleaner Structure) ---
const Template1 = ({ studentName = "Recipient Name", course = "Course Name", date = "Date" }) => (
  <div className="w-full aspect-[1.414/1] bg-white text-slate-900 p-10 border-[12px] border-double border-slate-800 relative shadow-2xl">
    <div className="h-full border border-slate-200 flex flex-col items-center justify-between py-10">
      <div className="text-center">
        <h1 className="text-3xl font-serif font-bold tracking-[0.2em] text-slate-800 uppercase">Certificate of Achievement</h1>
        <div className="w-40 h-0.5 bg-slate-800 mx-auto mt-2"></div>
      </div>
      <div className="text-center">
        <p className="text-slate-500 italic mb-4 text-lg">This certificate is proudly presented to</p>
        <h2 className="text-5xl font-bold text-slate-900 mb-6 border-b-2 border-slate-100 inline-block px-8">{studentName}</h2>
        <p className="text-slate-600 max-w-lg mx-auto leading-relaxed">
          For the successful completion of the <span className="font-bold">{course}</span> program, demonstrating exceptional dedication and mastery of the subject.
        </p>
      </div>
      <div className="w-full flex justify-around items-center px-12">
        <div className="text-center">
          <p className="font-bold border-b border-slate-300 px-4 mb-1">{date}</p>
          <p className="text-[10px] uppercase text-slate-400 font-bold">Issue Date</p>
        </div>
        <div className="w-16 h-16 bg-slate-100 flex items-center justify-center border border-slate-200">
          <div className="w-10 h-10 border-2 border-slate-300"></div>
        </div>
        <div className="text-center">
          <p className="font-serif italic text-xl border-b border-slate-300 px-4 mb-1">NEXCERT AUTH</p>
          <p className="text-[10px] uppercase text-slate-400 font-bold">Authorized Signatory</p>
        </div>
      </div>
    </div>
  </div>
);

const App = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('templates');
  const [certData, setCertData] = useState({ name: '', course: '', date: new Date().toLocaleDateString() });

  // Splash Screen Timer
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="h-screen bg-[#020617] flex flex-col items-center justify-center text-white">
        <ShieldCheck className="text-indigo-500 mb-4 animate-bounce" size={60} />
        <h1 className="text-4xl font-bold tracking-tighter animate-pulse">WELCOME TO NEXCERT</h1>
        <div className="mt-8 flex items-center gap-2 text-slate-500">
          <Loader2 className="animate-spin" size={18} />
          <span>Initialising System...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-200 font-sans">
      <aside className="w-64 bg-[#0f172a] border-r border-white/10 p-6 flex flex-col fixed h-full">
        <div className="flex items-center gap-3 mb-10 px-2">
          <ShieldCheck className="text-indigo-500" size={28} />
          <span className="text-2xl font-black tracking-tighter text-white">NEXCERT</span>
        </div>
        <nav className="flex-1 space-y-2">
          {[
            { id: 'templates', icon: <Layout size={20} />, label: 'Designs' },
            { id: 'issue', icon: <PlusCircle size={20} />, label: 'Editor' },
            { id: 'history', icon: <History size={20} />, label: 'Archive' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === item.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:bg-white/5'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 ml-64 p-8">
        <header className="mb-10 flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight capitalize">{activeTab}</h2>
            <p className="text-slate-500 mt-1 font-medium italic">Powered by NexCert Protocol</p>
          </div>
        </header>

        <div className="bg-[#0f172a]/50 border border-white/5 rounded-3xl p-8 min-h-[75vh] backdrop-blur-xl shadow-inner relative overflow-hidden">
          {activeTab === 'templates' && (
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                <div>
                  <h3 className="text-xl font-bold text-white">Template 01: Minimalist Corporate</h3>
                  <p className="text-slate-400 text-sm">Professional double-border layout</p>
                </div>
                <button 
                  onClick={() => setActiveTab('issue')}
                  className="bg-white text-black hover:bg-slate-200 px-6 py-3 rounded-xl font-bold transition-all transform active:scale-95"
                >
                  Use This Template
                </button>
              </div>
              <div className="scale-[0.9] origin-top">
                <Template1 studentName="Preview Name" course="Subject Field" date="MM/DD/YYYY" />
              </div>
            </div>
          )}

          {activeTab === 'issue' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white">Certificate Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Student Full Name</label>
                    <input 
                      type="text" 
                      placeholder="Enter name..."
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 focus:border-indigo-500 outline-none transition-all"
                      onChange={(e) => setCertData({...certData, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Course/Achievement</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Master of Science"
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 focus:border-indigo-500 outline-none transition-all"
                      onChange={(e) => setCertData({...certData, course: e.target.value})}
                    />
                  </div>
                </div>
                <button className="w-full bg-indigo-600 p-4 rounded-xl font-bold hover:bg-indigo-500 transition-all mt-4">Generate & Issue Certificate</button>
              </div>
              <div className="scale-[0.7] origin-top-left lg:sticky lg:top-0">
                 <Template1 studentName={certData.name || "Recipient Name"} course={certData.course || "Course Name"} date={certData.date} />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;