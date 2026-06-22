/**
 * SISA API — localStorage stub
 * Replace each function with a real fetch() call when the backend is ready.
 * Every function returns { data, error } to match the real API contract.
 */

// ── Helpers ──────────────────────────────────────────────────────────────────

function ok(data) { return { data, error: null }; }
function fail(msg) { return { data: null, error: msg }; }

function getUsers() {
  try { return JSON.parse(localStorage.getItem('sisa_users') ?? '{}'); } catch { return {}; }
}
function saveUsers(users) {
  localStorage.setItem('sisa_users', JSON.stringify(users));
}

// ── Auth ─────────────────────────────────────────────────────────────────────

export function apiRegister({ name, phone }) {
  const users = getUsers();
  if (users[phone]) return Promise.resolve(fail('Nomor sudah terdaftar.'));
  const user = {
    userId: `u_${Date.now()}`,
    token: `tok_${Date.now()}`,
    name,
    phone,
    points: 0,
    milestone: 1000,
    rewardType: null,
    wallet: null,
    ewalletAccount: '',
  };
  users[phone] = user;
  saveUsers(users);
  return Promise.resolve(ok(user));
}

export function apiLogin({ phone }) {
  const users = getUsers();
  const user = users[phone];
  if (!user) return Promise.resolve(fail('Nomor tidak ditemukan.'));
  return Promise.resolve(ok(user));
}

export function apiLogout(_token) {
  return Promise.resolve(ok(null));
}

// ── User / Profile ───────────────────────────────────────────────────────────

export function apiGetProfile(_token) {
  return Promise.resolve(ok(null));
}

export function apiUpdateRewardPref(_token, payload) {
  return Promise.resolve(ok(payload));
}

// ── Trash Scanning ───────────────────────────────────────────────────────────

export function apiScanImage(_token, _imageBase64) {
  const results = [
    { category: 'Plastik PET (Bening)', estimatedPoints: 150, confidence: 0.94, grade: 'Grade A', status: 'accepted', anomalies: [], instruction: 'Pastikan botol bersih dan tidak penyok.' },
    { category: 'Kardus Cokelat', estimatedPoints: 80, confidence: 0.88, grade: 'Grade B', status: 'accepted', anomalies: [], instruction: 'Lipat kardus agar lebih ringkas.' },
    { category: 'Plastik HDPE', estimatedPoints: 120, confidence: 0.91, grade: 'Grade A', status: 'accepted', anomalies: [], instruction: 'Cuci dahulu sebelum dikumpulkan.' },
    { category: 'Bahan Tidak Dikenal', estimatedPoints: 0, confidence: 0.42, grade: '-', status: 'rejected', anomalies: ['Tidak dapat diidentifikasi'], instruction: 'Coba foto ulang dengan pencahayaan yang lebih baik.' },
  ];
  const pick = results[Math.floor(Math.random() * results.length)];
  return Promise.resolve(ok(pick));
}

// ── Cart / Pickup ─────────────────────────────────────────────────────────────

export function apiRequestPickup(_token, payload) {
  return Promise.resolve(ok({ pickupId: `pickup_${Date.now()}`, status: 'pending', estimatedArrival: null, ...payload }));
}

export function apiGetPickupStatus(_token, pickupId) {
  return Promise.resolve(ok({ pickupId, status: 'pending', mitraName: null, estimatedArrival: null, completedAt: null }));
}

// ── Points / Redemption ───────────────────────────────────────────────────────

export function apiGetPointsHistory(_token) {
  return Promise.resolve(ok({ items: [] }));
}

export function apiRedeemPoints(_token, payload) {
  return Promise.resolve(ok({ transactionId: `tx_${Date.now()}`, status: 'pending', estimatedSettlement: null, ...payload }));
}
