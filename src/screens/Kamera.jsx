import React from 'react';

export default function Kamera({ go }) {
  return (
    <div style={{ position: 'relative', height: 844, background: '#0A0A0A', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Simulated camera background */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(rgba(10,10,10,0.45), rgba(10,10,10,0.45)), url("https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=600") center/cover no-repeat',
      }} />
      <div style={{ position: 'absolute', inset: 0, opacity: 0.04, background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.08) 2px, rgba(255,255,255,0.08) 4px)' }} />

      {/* Top overlay */}
      <div style={{ position: 'relative', zIndex: 10, width: '100%', height: 80, background: 'linear-gradient(to bottom, rgba(10,10,10,0.85) 0%, transparent 100%)', display: 'flex', alignItems: 'center', padding: '0 24px', justifyContent: 'space-between' }}>
        <button onClick={() => go('dashboard')} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.25)', color: '#fff', fontFamily: 'inherit', fontSize: 11, fontWeight: 700, letterSpacing: 1, padding: '8px 16px', borderRadius: '0px 8px 0px 8px', cursor: 'pointer', backdropFilter: 'blur(4px)' }}>
          BATAL
        </button>
        <button style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.25)', color: '#fff', fontFamily: 'inherit', fontSize: 11, fontWeight: 700, letterSpacing: 1, padding: '8px 16px', borderRadius: '0px 8px 0px 8px', cursor: 'pointer', backdropFilter: 'blur(4px)' }}>
          <i className="bi bi-lightning" />
        </button>
      </div>

      {/* Instruction */}
      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', marginTop: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#1DB954', letterSpacing: 0.5, textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>
          Mendeteksi material kardus atau PET bening...
        </div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 6, textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
          Posisikan objek di dalam area target
        </div>
      </div>

      {/* Scan frame */}
      <div style={{ flex: 1, position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 260, height: 260, position: 'relative' }}>
          {/* Corner accents */}
          {[['top-0 left-0', 'borderTop', 'borderLeft'], ['top-0 right-0', 'borderTop', 'borderRight'], ['bottom-0 left-0', 'borderBottom', 'borderLeft'], ['bottom-0 right-0', 'borderBottom', 'borderRight']].map(([, ,], i) => (
            <div key={i} style={{
              position: 'absolute',
              ...[
                { top: -2, left: -2, borderTop: '3px solid #F5A623', borderLeft: '3px solid #F5A623', width: 20, height: 20 },
                { top: -2, right: -2, borderTop: '3px solid #F5A623', borderRight: '3px solid #F5A623', width: 20, height: 20 },
                { bottom: -2, left: -2, borderBottom: '3px solid #F5A623', borderLeft: '3px solid #F5A623', width: 20, height: 20 },
                { bottom: -2, right: -2, borderBottom: '3px solid #F5A623', borderRight: '3px solid #F5A623', width: 20, height: 20 },
              ][i],
            }} />
          ))}
          <div style={{ width: '100%', height: '100%', border: '2px solid rgba(29,185,84,0.6)', borderRadius: '0px 32px 0px 32px', position: 'relative', overflow: 'hidden' }}>
            <div className="scan-line" />
          </div>
        </div>
      </div>

      {/* Bottom overlay */}
      <div style={{ position: 'relative', zIndex: 10, paddingBottom: 56, background: 'linear-gradient(to top, rgba(10,10,10,0.95) 0%, transparent 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 40 }}>
        <button
          onClick={() => go('hasilScan')}
          style={{ width: 72, height: 72, borderRadius: '50%', background: 'transparent', border: '3px solid #fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.15s' }}
        >
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#1DB954' }} />
        </button>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 12 }}>Pilih dari galeri</div>
      </div>
    </div>
  );
}
