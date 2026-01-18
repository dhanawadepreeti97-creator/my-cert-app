import React, { useState } from 'react';
import { Layout, ShieldCheck, History, Settings, PlusCircle, LogOut } from 'lucide-react';

// MAKE SURE THIS PATH IS EXACT:
import Template1 from './components/Template1';

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
      <aside className="w-64 bg-[#0f172a] border-r border-white/10 p-6 flex flex-col fixed h-full">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <ShieldCheck className="text-white" size={20} />
          </div>
          <span className="text-xl font-bold tracking-tight text-white uppercase">NexCert</span>
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

      {/* Main Content - Added margin-left to account for fixed sidebar */}
      <main className="flex-1 ml-64 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white capitalize">{activeTab}</h2>
            <p className="text-slate-500 text-sm">Manage your certificate ecosystem</p>
          </div>
          <div className="flex items-center gap-4 bg-[#0f172a] p-2 rounded-full px-4 border border-white/5">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium text-slate-300">Organization: Hackathon India</span>
          </div>
        </header>

        {/* Content Card */}
        <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-8 min-h-[70vh] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-600 to-transparent opacity-50"></div>
          
          {activeTab === 'templates' && (
            <div className="max-w-4xl mx-auto space-y-12">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-white">Premium Design: Modern Tech</h3>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-indigo-600/20">
                  Use This Template
                </button>
              </div>
              
              {/* Wrapping Template in a div to ensure it scales correctly */}
              <div className="bg-white rounded-lg overflow-hidden shadow-2xl">
                <Template1 
                  studentName="Dharmaraj Dhanawade" 
                  course="Full Stack Development" 
                  date="Jan 19, 2026" 
                />
              </div>
            </div>
          )}

          {activeTab !== 'templates' && (
            <div className="flex flex-col items-center justify-center h-[50vh] text-slate-500">
              <p>Section "{activeTab}" is under development for Jan 20th.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;