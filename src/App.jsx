import React, { useState } from 'react';
import Papa from 'papaparse';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Upload, Download, FileText, Award, Users } from 'lucide-react';

function App() {
  const [data, setData] = useState([]);
  const [eventName, setEventName] = useState("National Tech Symposium 2024");

  // Function to handle the CSV file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        // We filter to ensure only rows with a 'Name' column are added
        const validData = results.data.filter(row => row.Name || row.name);
        setData(validData);
      },
    });
  };

  // Function to convert HTML to PDF and download
  const downloadCertificate = async (name) => {
    const element = document.getElementById('cert-preview');
    const canvas = await html2canvas(element, { 
      scale: 3, // High resolution
      useCORS: true 
    });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('l', 'mm', 'a4');
    pdf.addImage(imgData, 'PNG', 0, 0, 297, 210);
    pdf.save(`${name}_Certificate.pdf`);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Navbar */}
      <nav className="bg-white border-b px-8 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Award className="text-white" size={24} />
          </div>
          <h1 className="text-xl font-bold tracking-tight">CertiGen <span className="text-blue-600">Flash</span></h1>
        </div>
        <div className="text-sm font-medium text-slate-500 italic">Hackathon Submission • Jan 20</div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sidebar Controls */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Step 1: Event Info */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="flex items-center gap-2 font-bold mb-4 text-slate-700">
              <FileText size={18} className="text-blue-600"/> 1. Event Details
            </h2>
            <input 
              type="text" 
              placeholder="Event Name"
              className="w-full p-3 border rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              onChange={(e) => setEventName(e.target.value)}
              value={eventName}
            />
          </div>

          {/* Step 2: CSV Upload */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="flex items-center gap-2 font-bold mb-4 text-slate-700">
              <Upload size={18} className="text-blue-600"/> 2. Participant List
            </h2>
            <input 
              type="file" 
              accept=".csv"
              onChange={handleFileUpload}
              className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
            />
            <p className="text-[10px] text-slate-400 mt-2 uppercase tracking-wider">Required Column: "Name"</p>
          </div>

          {/* Step 3: List View */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="flex items-center gap-2 font-bold mb-4 text-slate-700">
              <Users size={18} className="text-blue-600"/> Participants ({data.length})
            </h2>
            <div className="space-y-2 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
              {data.map((row, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-blue-200 transition-colors">
                  <span className="font-medium text-slate-700 truncate mr-2">{row.Name || row.name}</span>
                  <button 
                    onClick={() => downloadCertificate(row.Name || row.name)}
                    className="p-2 hover:bg-blue-600 hover:text-white text-blue-600 rounded-lg transition-all"
                  >
                    <Download size={16}/>
                  </button>
                </div>
              ))}
              {data.length === 0 && (
                <div className="text-center py-8 text-slate-400 italic text-sm">
                  Upload a CSV to see names
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Live Preview Area */}
        <div className="lg:col-span-8 flex flex-col items-center">
          <div className="sticky top-6 w-full flex flex-col items-center">
            <div className="mb-4 text-sm font-bold text-slate-400 uppercase tracking-[0.2em]">Certificate Live Preview</div>
            
            {/* START OF CERTIFICATE TEMPLATE */}
            <div 
              id="cert-preview"
              className="relative w-[842px] h-[595px] bg-white shadow-2xl overflow-hidden flex flex-col items-center justify-between p-12 border-[16px] border-double border-slate-900"
            >
              {/* Decorative Corner Accents */}
              <div className="absolute top-0 left-0 w-32 h-32 border-t-[12px] border-l-[12px] border-blue-900"></div>
              <div className="absolute bottom-0 right-0 w-32 h-32 border-b-[12px] border-r-[12px] border-blue-900"></div>
              
              {/* Header */}
              <div className="text-center z-10">
                <h3 className="text-blue-900 text-xl font-bold tracking-[0.3em] uppercase mb-2">Certificate of Achievement</h3>
                <div className="h-1 w-48 bg-blue-600 mx-auto"></div>
              </div>

              {/* Body */}
              <div className="text-center z-10 space-y-6">
                <p className="italic text-slate-500 text-lg font-serif">This acknowledges that</p>
                <h2 className="text-6xl font-bold text-slate-900 drop-shadow-sm px-4 border-b-2 border-slate-100 pb-2">
                  {data[0]?.Name || data[0]?.name || "Your Name Here"}
                </h2>
                <p className="max-w-2xl text-slate-600 text-lg leading-relaxed px-10">
                  has demonstrated exceptional skill and dedication through active participation and successful completion of the
                  <br/>
                  <span className="font-bold text-blue-900 text-2xl uppercase mt-4 block">{eventName}</span>
                </p>
              </div>

              {/* Footer / Signatures */}
              <div className="w-full flex justify-between items-end px-12 z-10 pb-4">
                <div className="text-center">
                  <div className="w-40 border-b-2 border-slate-900 mb-2"></div>
                  <p className="text-xs font-bold text-slate-800 uppercase">Program Director</p>
                </div>
                
                {/* Visual Seal */}
                <div className="w-24 h-24 rounded-full border-4 border-double border-blue-900 flex items-center justify-center relative rotate-12">
                  <div className="text-[10px] font-bold text-blue-900 text-center uppercase p-1">Official<br/>Certified<br/>2024</div>
                </div>

                <div className="text-center">
                  <div className="w-40 border-b-2 border-slate-900 mb-2"></div>
                  <p className="text-xs font-bold text-slate-800 uppercase">Event Coordinator</p>
                </div>
              </div>
            </div>
            {/* END OF CERTIFICATE TEMPLATE */}

            <button 
              disabled={data.length === 0}
              onClick={() => downloadCertificate(data[0]?.Name || "Preview")}
              className={`mt-8 flex items-center gap-3 px-10 py-4 rounded-full font-bold text-white transition-all shadow-xl ${
                data.length > 0 ? 'bg-blue-600 hover:bg-blue-700 scale-100' : 'bg-slate-400 scale-95 cursor-not-allowed'
              }`}
            >
              <Download size={20}/> Download Preview as PDF
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;