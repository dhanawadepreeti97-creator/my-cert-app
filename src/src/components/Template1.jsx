import React from 'react';
import { ShieldCheck } from 'lucide-react';

const Template1 = ({ studentName = "John Doe", course = "Blockchain Architecture", date = "Jan 20, 2026" }) => {
  return (
    <div className="w-full aspect-[1.414/1] bg-white text-slate-900 p-12 border-[16px] border-indigo-600 relative overflow-hidden shadow-2xl">
      {/* Background Decoration */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-50 rounded-full opacity-50"></div>
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-50 rounded-full opacity-50"></div>
      
      <div className="relative z-10 h-full border border-indigo-100 flex flex-col items-center justify-between py-8">
        <div className="flex flex-col items-center">
          <ShieldCheck size={48} className="text-indigo-600 mb-4" />
          <h1 className="text-4xl font-serif font-bold tracking-widest text-slate-800 uppercase">Certificate of Excellence</h1>
          <div className="w-24 h-1 bg-indigo-600 mt-2"></div>
        </div>

        <div className="text-center">
          <p className="text-lg italic text-slate-500 mb-2">This is to certify that</p>
          <h2 className="text-5xl font-bold text-indigo-900 mb-4">{studentName}</h2>
          <p className="max-w-md mx-auto text-slate-600">
            has successfully completed all requirements for the professional certification in 
            <span className="font-bold text-slate-800 block mt-2 text-xl">{course}</span>
          </p>
        </div>

        <div className="w-full flex justify-around items-end px-10">
          <div className="text-center">
            <div className="w-40 border-b border-slate-300 mb-2"></div>
            <p className="text-xs uppercase tracking-tighter text-slate-400">Date Issued</p>
            <p className="font-bold text-sm">{date}</p>
          </div>
          
          {/* Mock QR Code for Verification */}
          <div className="w-20 h-20 bg-slate-100 border border-slate-200 flex items-center justify-center p-1">
             <div className="w-full h-full bg-slate-800 rounded-sm"></div>
          </div>

          <div className="text-center">
            <div className="w-40 border-b border-slate-300 mb-2 font-serif italic text-lg text-indigo-800">NexCert Team</div>
            <p className="text-xs uppercase tracking-tighter text-slate-400">Authorized Signatory</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Template1;