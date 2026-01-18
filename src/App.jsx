import React, { useState } from 'react';
import { Layout, ShieldCheck, History, Settings, PlusCircle, LogOut } from 'lucide-react';

const App = () => {
  const [activeTab, setActiveTab] = useState('templates');

  const menuItems = [
    { id: 'templates', icon: <Layout size={20} />, label: 'Templates' },
    { id: 'issue', icon: <PlusCircle size={20} />, label: 'Issue New' },
    { id: 'history', icon: <History size={20} />, label: 'History' },
    { id: 'verify', icon: <ShieldCheck size={20} />, label: 'Verification' },
    { id: 'settings', icon: <Settings size={20} />, label: 'Settings' },
  ];

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-200 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0f172a] border-r border-white/10 p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <ShieldCheck className="text-white" size={20} />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">NEXCERT</span>
        </div>

        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === item.id 
                ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-600/20' 
                : 'hover:bg-white/5 text-slate-400'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <button className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-400 transition-colors mt-auto">
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white capitalize">{activeTab}</h2>
            <p className="text-slate-500 text-sm">Manage your certificate ecosystem</p>
          </div>
          <div className="flex items-center gap-4 bg-[#0f172a] p-2 rounded-full px-4 border border-white/5">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium">Organization: Hackathon India</span>
          </div>
        </header>

        {/* Content Card */}
        <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-8 min-h-[70vh] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-600 to-transparent opacity-50"></div>
          
          {activeTab === 'templates' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Template Placeholder */}
              {[1,2,3].map((i) => (
                <div key={i} className="aspect-[1.4/1] bg-slate-900/50 rounded-xl border border-dashed border-white/10 flex items-center justify-center group hover:border-indigo-500/50 transition-all cursor-pointer">
                  <span className="text-slate-600 group-hover:text-indigo-400 font-medium">Template Design {i}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;