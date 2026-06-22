import React from 'react';
import { useAppNavigation } from '../app/useAppNavigation';

export default function Kamera() {
  const { go } = useAppNavigation();

  return (
    <div className="relative h-screen bg-[#0A0A0A] flex flex-col overflow-hidden">
      {/* Simulated camera background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            'linear-gradient(rgba(10,10,10,0.45), rgba(10,10,10,0.45)), url("https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=600")',
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.08) 2px, rgba(255,255,255,0.08) 4px)',
        }}
      />

      {/* Top overlay */}
      <div className="relative z-10 w-full h-20 flex items-center px-6 justify-between"
           style={{ background: 'linear-gradient(to bottom, rgba(10,10,10,0.85) 0%, transparent 100%)' }}>
        <button
          onClick={() => go('dashboard')}
          className="bg-transparent border border-white/25 text-white font-sans text-[11px] font-bold tracking-wide
                     px-4 py-2 rounded-geo-xs cursor-pointer backdrop-blur-sm"
        >
          BATAL
        </button>
        <button className="bg-transparent border border-white/25 text-white font-sans text-[11px] font-bold tracking-wide
                            px-4 py-2 rounded-geo-xs cursor-pointer backdrop-blur-sm">
          <i className="bi bi-lightning" />
        </button>
      </div>

      {/* Instruction */}
      <div className="relative z-10 text-center mt-4">
        <div className="text-sm font-bold text-primary tracking-wide" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>
          Mendeteksi material kardus atau PET bening...
        </div>
        <div className="text-xs text-white/80 mt-1.5" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
          Posisikan objek di tengah area pemindaian
        </div>
      </div>

      {/* Viewport Frame */}
      <div className="flex-1 flex items-center justify-center p-8 relative z-[5]">
        <div className="w-full max-w-[300px] aspect-square relative">
          <div className="absolute top-[-2px] left-[-2px] w-5 h-5 border-t-[3px] border-l-[3px] border-accent" />
          <div className="absolute top-[-2px] right-[-2px] w-5 h-5 border-t-[3px] border-r-[3px] border-accent" />
          <div className="absolute bottom-[-2px] left-[-2px] w-5 h-5 border-b-[3px] border-l-[3px] border-accent" />
          <div className="absolute bottom-[-2px] right-[-2px] w-5 h-5 border-b-[3px] border-r-[3px] border-accent" />

          <div className="w-full h-full border-2 border-primary/60 rounded-geo-2xl relative overflow-hidden">
            <div className="absolute left-0 right-0 h-[3px] bg-primary shadow-[0_0_16px_rgba(29,185,84,0.9)] animate-scan-line" />
          </div>
        </div>
      </div>

      {/* Bottom overlay */}
      <div className="relative z-10 pb-14 pt-10 flex flex-col items-center"
           style={{ background: 'linear-gradient(to top, rgba(10,10,10,0.95) 0%, transparent 100%)' }}>
        <button
          onClick={() => go('hasilScan')}
          className="w-[72px] h-[72px] rounded-full bg-white border-8 border-white/30 cursor-pointer outline-none transition-all duration-200 active:scale-95"
        />
      </div>
    </div>
  );
}
