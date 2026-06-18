import React, { useState } from 'react';

export default function FormPickup({ go, userData }) {
  const [schedule, setSchedule] = useState('sekarang');
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(0);

  const slots = [
    { name: 'Shift Pagi', time: '08:00 – 12:00' },
    { name: 'Shift Sore', time: '13:00 – 17:00' },
    { name: 'H+1 Pagi', time: '08:00 – 12:00' },
  ];

  const handleScheduleChange = (val) => {
    setSchedule(val);
    if (val === 'jadwal') setSheetOpen(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 844, background: '#FAFAFA', position: 'relative' }}>
      <div className="status-bar"><span>9:41</span><span>●●●</span></div>
      <div className="top-app-bar">
        <button className="back-btn" onClick={() => go('hasilScan')}><i className="bi bi-arrow-left" /></button>
        <h2>Penjadwalan Logistik</h2>
      </div>

      <div className="scroll-content" style={{ padding: '24px 24px 120px' }}>
        {/* Summary card */}
        <div style={{ background: '#FFFCF7', borderRadius: '0px 20px 0px 20px', padding: 16, display: 'flex', alignItems: 'center', gap: 16, border: '1px solid #E0E0E0', borderLeft: '4px solid #F5A623' }}>
          <div style={{ width: 48, height: 48, background: '#fff', border: '1px solid #E0E0E0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#1A1A1A', flexShrink: 0 }}>PET</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#1A1A1A', textTransform: 'uppercase' }}>Botol PET Bening</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#F5A623', marginTop: 4 }}>VALUASI: +{userData.pickupPoints} PT</div>
          </div>
        </div>

        {/* Address */}
        <div style={{ fontSize: 11, color: '#707070', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 32, marginBottom: 8 }}>Titik Koordinat</div>
        <div style={{ borderRadius: '0px 16px 0px 16px', border: '1px solid #E0E0E0', background: '#F0F0F0', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#1A1A1A' }}>Jl. Veteran, Ketawanggede</div>
            <div style={{ fontSize: 11, color: '#9E9E9E', marginTop: 2, fontFamily: 'monospace' }}>Lat: -7.9553, Long: 112.6135</div>
          </div>
          <i className="bi bi-geo-alt-fill" style={{ fontSize: 20, color: '#1DB954' }} />
        </div>

        {/* Schedule chips */}
        <div style={{ fontSize: 11, color: '#707070', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 32, marginBottom: 8 }}>Waktu Penjemputan</div>
        <div style={{ display: 'flex', gap: 12 }}>
          {[['sekarang', 'RUTE REGULER'], ['jadwal', 'JADWALKAN']].map(([val, label]) => (
            <div key={val} style={{
              flex: 1, height: 48, borderRadius: '0px 12px 0px 12px',
              background: schedule === val ? '#1DB954' : '#fff',
              border: schedule === val ? 'none' : '1px solid #E0E0E0',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 700,
              color: schedule === val ? '#fff' : '#707070',
              cursor: 'pointer', textTransform: 'uppercase', transition: 'all 0.2s',
            }} onClick={() => handleScheduleChange(val)}>
              {label}
            </div>
          ))}
        </div>

        {schedule === 'jadwal' && (
          <div style={{ marginTop: 12, padding: '12px 16px', background: '#E8F5E9', borderRadius: '0px 12px 0px 12px', fontSize: 13, color: '#1DB954', fontWeight: 600 }}>
            <i className="bi bi-clock" style={{ marginRight: 8 }} />
            {slots[selectedSlot].name} — {slots[selectedSlot].time}
          </div>
        )}
      </div>

      {/* CTA */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px 24px 32px', background: '#FAFAFA', borderTop: '1px solid #E0E0E0' }}>
        <button className="btn-primary" onClick={() => go('tracking')}>Inisiasi Rute Pickup</button>
      </div>

      {/* Bottom sheet overlay */}
      {sheetOpen && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,10,10,0.6)', zIndex: 90, backdropFilter: 'blur(2px)' }} onClick={() => setSheetOpen(false)} />
      )}
      <div style={{
        position: 'absolute', bottom: sheetOpen ? 0 : -400, left: 0, width: '100%',
        background: '#fff', borderRadius: '0px 32px 0px 0px',
        padding: 24, borderTop: '1px solid #E0E0E0',
        transition: 'bottom 0.3s cubic-bezier(0.4, 0, 0.2, 1)', zIndex: 100,
      }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: '#1A1A1A', marginBottom: 20, textTransform: 'uppercase' }}>Pilih Shift Operasional</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {slots.map((s, i) => (
            <div key={i} onClick={() => setSelectedSlot(i)} style={{
              height: 52, borderRadius: '0px 12px 0px 12px',
              background: selectedSlot === i ? '#FFFCF7' : '#FAFAFA',
              border: selectedSlot === i ? '1px solid #F5A623' : '1px solid #E0E0E0',
              display: 'flex', alignItems: 'center', padding: '0 16px', justifyContent: 'space-between', cursor: 'pointer',
            }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: selectedSlot === i ? '#F5A623' : '#1A1A1A' }}>{s.name}</span>
              <span style={{ fontSize: 11, color: '#707070', fontFamily: 'monospace' }}>{s.time}</span>
            </div>
          ))}
        </div>
        <button className="btn-primary" style={{ marginTop: 24 }} onClick={() => setSheetOpen(false)}>Tetapkan Jadwal</button>
      </div>
    </div>
  );
}
