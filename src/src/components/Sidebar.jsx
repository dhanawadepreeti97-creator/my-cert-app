import React from 'react';
import { Layout, Palette, Upload, User, LogOut, History } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'templates', label: 'Templates', icon: <Layout size={20}/> },
    { id: 'design', label: 'Custom Design', icon: <Palette size={20}/> },
    { id: 'upload', label: 'Upload Data', icon: <Upload size={20}/> },
    { id: 'history', label: 'Org History', icon: <History size={20}/> },
    { id: 'profile', label: 'Profile', icon: <User size={20}/> },
  ];

  return (
    <aside className="w-64 bg-[#0F172A] border-r border-white/10 flex flex-col h-screen sticky top-0">
      <div className="p-8 text-2xl font-black italic text-indigo-500 tracking-tighter">
        NEXCERT.
      </div>
      
      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-all ${
              activeTab === item.id 
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
              : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button className="flex items-center gap-4 text-slate-400 hover:text-red-400 p-4 w-full">
          <LogOut size={20}/> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;