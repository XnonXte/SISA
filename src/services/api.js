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

export async function apiScanImage(_token, imageBase64) {
 const blob=await (await fetch(imageBase64)).blob();
 const fd=new FormData(); fd.append('file',blob,'scan.jpg');
 const r=await fetch(`${import.meta.env.VITE_API_URL}/classify-waste`,{method:'POST',body:fd});
 if(!r.ok) return fail('Scan gagal');
 const j=await r.json();
 const accepted=['Plastic','Cardboard'].includes(j.primary_material);
 const grade=j.sub_classification||'-';
 const points=grade==='Grade A'?150:grade==='Grade B'?100:0;
 return ok({category:j.primary_material,estimatedPoints:points,confidence:parseFloat(j.primary_accuracy)/100,grade,status:accepted?'accepted':'rejected',anomalies:[],instruction:''});
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
