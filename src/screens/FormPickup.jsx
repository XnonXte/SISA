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
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#FAFAFA', position: 'relative' }}>
      {/* Fake Status bar completely removed */}
      <div className="top-app-bar">
        <button className="back-btn" onClick={() => go('hasilScan')}><i className="bi bi-arrow-left" /></button>
        <h2>Penjadwalan Logistik</h2>
      </div>

      <div className="scroll-content" style={{ flex: 1, padding: '24px 24px 120px', overflowY: 'auto' }}>
        {/* Input Methods */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div onClick={() => handleScheduleChange('sekarang')} style={{ padding: 16, background: '#fff', border: schedule === 'sekarang' ? '2px solid #1DB954' : '1px solid #E0E0E0', borderRadius: 12, cursor: 'pointer' }}>
            <div style={{ fontWeight: 700, fontSize: 15 }}><i className="bi bi-lightning-charge-fill" style={{ color: '#1DB954', marginRight: 8 }} />Penjemputan Instan</div>
            <div style={{ fontSize: 12, color: '#707070', marginTop: 4 }}>Mitra terdekat langsung datang ke lokasimu.</div>
          </div>
          <div onClick={() => handleScheduleChange('jadwal')} style={{ padding: 16, background: '#fff', border: schedule === 'jadwal' ? '2px solid #1DB954' : '1px solid #E0E0E0', borderRadius: 12, cursor: 'pointer' }}>
            <div style={{ fontWeight: 700, fontSize: 15 }}><i className="bi bi-calendar-event" style={{ color: '#F5A623', marginRight: 8 }} />Atur Shift Jadwal {schedule === 'jadwal' && `(${slots[selectedSlot].name})`}</div>
            <div style={{ fontSize: 12, color: '#707070', marginTop: 4 }}>Pilih slot operasional logistik mingguan.</div>
          </div>
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', padding: 24, background: '#fff', borderTop: '1px solid #E0E0E0' }}>
        <button className="btn-primary" onClick={() => go('tracking')}>Konfirmasi Order</button>
      </div>

      {/* Sheet Modal */}
      {sheetOpen && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 90 }} onClick={() => setSheetOpen(false)} />
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
            <div key={i} onClick={() => { setSelectedSlot(i); setSheetOpen(false); }} style={{
              height: 52, borderRadius: '0px 12px 0px 12px',
              background: selectedSlot === i ? '#FFFCF7' : '#FAFAFA',
              border: selectedSlot === i ? '1px solid #F5A623' : '1px solid #E0E0E0',
              display: 'flex', alignItems: 'center', padding: '0 16px', justifyContent: 'space-between', cursor: 'pointer',
            }}>
              <span style={{ fontSize: 14, fontWeight: 700 }}>{s.name}</span>
              <span style={{ fontSize: 12, color: '#707070' }}>{s.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}