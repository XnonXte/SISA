import React, { useState } from 'react';

export default function HasilScan({ go, userData, setUserData }) {
  const estimatedPoints = userData.estimatedPoints ?? 150;
  const [showToast, setShowToast] = useState(false);

  const wasteItem = {
    id: `item_${Date.now()}`,
    category: userData.scannedCategory || 'Plastik PET (Bening)',
    icon: userData.scannedCategory?.includes('Kardus') ? 'bi-box-seam' : 'bi-recycle',
    estimatedPoints,
    daysInCart: 0,
  };

  const handleAddToCart = () => {
    setUserData(u => ({
      ...u,
      cartItems: [...(u.cartItems || []), wasteItem],
    }));
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      go('kamera');
    }, 1400);
  };

  const handleDirectPickup = () => {
    setUserData(u => ({
      ...u,
      pickupDraft: { source: 'direct', items: [wasteItem] },
    }));
    go('formPickup');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#FAFAFA', position: 'relative' }}>
      <div className="top-app-bar">
        <button className="back-btn" onClick={() => go('kamera')}><i className="bi bi-arrow-left" /></button>
        <h2>Validasi AI</h2>
      </div>

      <div style={{ flex: 1, padding: '0 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 16, overflowY: 'auto' }}>
        <div style={{
          width: '100%', height: 220,
          borderRadius: '0px 24px 0px 24px',
          background: 'linear-gradient(rgba(10,10,10,0.2), rgba(10,10,10,0.6)), url("https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=600") center/cover',
          position: 'relative', overflow: 'hidden', border: '1px solid #E0E0E0', flexShrink: 0,
        }}>
          <div style={{ position: 'absolute', top: 16, right: 16, background: '#1A1A1A', color: '#F5A623', fontSize: 11, fontWeight: 800, letterSpacing: 0.5, padding: '6px 12px', borderRadius: '0px 8px 0px 8px' }}>
            AKURASI 94%
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 20, background: '#E8F5E9', padding: '8px 16px', borderRadius: 20 }}>
          <i className="bi bi-check-circle-fill" style={{ color: '#1DB954', fontSize: 16 }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: '#2E7D32' }}>VALIDASI BERHASIL</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 20 }}>
          <i className="bi bi-hourglass-split" style={{ fontSize: 13, color: '#F5A623' }} />
          <span style={{ fontSize: 12, fontWeight: 800, color: '#F5A623', letterSpacing: 0.5, textTransform: 'uppercase' }}>
            Estimasi Poin
          </span>
        </div>

        <div style={{ fontSize: 40, fontWeight: 800, color: '#1A1A1A', marginTop: 8, letterSpacing: -1 }}>
          ~{estimatedPoints} <span style={{ fontSize: 18, fontWeight: 700, color: '#9E9E9E' }}>Poin</span>
        </div>

        <div style={{ fontSize: 12, color: '#9E9E9E', marginTop: 6, textAlign: 'center', maxWidth: 300, lineHeight: 1.5 }}>
          ≈ Rp {(estimatedPoints * 10).toLocaleString('id-ID')} — menunggu verifikasi final saat Mitra melakukan pickup fisik
        </div>

        <div style={{ width: '100%', borderTop: '1px solid #E0E0E0', borderBottom: '1px solid #E0E0E0', padding: '16px 0', marginTop: 28 }}>
          {[
            ['Material Dasar', wasteItem.category],
            ['Grade Mutu', 'Grade A — Bebas Kontaminasi'],
            ['Instruksi', 'Siapkan botol di depan pintu saat pickup.'],
          ].map(([label, val]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '8px 0' }}>
              <span style={{ fontSize: 13, color: '#707070', fontWeight: 600 }}>{label}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#1A1A1A', textAlign: 'right', maxWidth: '60%' }}>{val}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '16px 24px 24px', background: '#fff', borderTop: '1px solid #E0E0E0', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button className="btn-primary" onClick={handleDirectPickup}>Request Pickup Langsung</button>
        <button className="btn-secondary" onClick={handleAddToCart}>
          <i className="bi bi-basket2" style={{ marginRight: 8 }} />Tambah ke Keranjang
        </button>
      </div>

      {showToast && (
        <div style={{
          position: 'absolute', bottom: 110, left: '50%', transform: 'translateX(-50%)',
          background: '#1A1A2E', color: '#fff', fontSize: 13, fontWeight: 600,
          padding: '12px 20px', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 8,
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)', whiteSpace: 'nowrap', zIndex: 100,
        }}>
          <i className="bi bi-check-circle-fill" style={{ color: '#1DB954' }} />
          Item ditambahkan ke Keranjang
        </div>
      )}
    </div>
  );
}