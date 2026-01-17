const DashboardLayout = () => {
  const [activeTab, setActiveTab] = useState('templates');
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#020617] text-white">
      
      {/* Mobile Top Header */}
      <div className="md:hidden flex justify-between items-center p-4 border-b border-white/10 bg-[#0F172A]">
        <span className="font-black text-indigo-500">NEXCERT</span>
        <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} className="p-2 bg-white/5 rounded-lg">
          {isMobileMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Sidebar - Hidden on mobile unless toggled */}
      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:block`}>
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} closeMenu={() => setMobileMenuOpen(false)} />
      </div>
      
      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-10 overflow-y-auto">
        <header className="hidden md:flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold capitalize">{activeTab}</h1>
          <div className="text-sm text-slate-400">Organization: <span className="text-white">Hackathon India</span></div>
        </header>

        {/* This container will now be 100% width on phone and centered on desktop */}
        <div className="glass-card w-full p-4 md:p-8 min-h-[500px]">
          {/* Your content logic goes here */}
          {activeTab === 'templates' && <TemplateGallery />}
        </div>
      </main>
    </div>
  );
};