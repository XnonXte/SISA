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

function findUserByEmail(email) {
  const normalized = email.trim().toLowerCase();
  const users = getUsers();
  return Object.values(users).find((u) => u.email?.toLowerCase() === normalized) ?? null;
}

// ── Login lockout (max 5 attempts → 15 min lock) ─────────────────────────────

const LOCKOUT_KEY = 'sisa_login_lockout';
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000;

function getLockoutMap() {
  try { return JSON.parse(localStorage.getItem(LOCKOUT_KEY) ?? '{}'); } catch { return {}; }
}
function saveLockoutMap(map) {
  localStorage.setItem(LOCKOUT_KEY, JSON.stringify(map));
}

export function getLoginLockoutStatus(email) {
  const key = email.trim().toLowerCase();
  const entry = getLockoutMap()[key];
  if (!entry?.lockedUntil) return { locked: false, remainingMs: 0, attempts: entry?.attempts ?? 0 };

  const remainingMs = entry.lockedUntil - Date.now();
  if (remainingMs <= 0) {
    const map = getLockoutMap();
    delete map[key];
    saveLockoutMap(map);
    return { locked: false, remainingMs: 0, attempts: 0 };
  }

  return { locked: true, remainingMs, attempts: entry.attempts ?? MAX_LOGIN_ATTEMPTS };
}

function recordFailedLogin(email) {
  const key = email.trim().toLowerCase();
  const map = getLockoutMap();
  const attempts = (map[key]?.attempts ?? 0) + 1;

  if (attempts >= MAX_LOGIN_ATTEMPTS) {
    map[key] = { attempts, lockedUntil: Date.now() + LOCKOUT_DURATION_MS };
  } else {
    map[key] = { attempts, lockedUntil: null };
  }

  saveLockoutMap(map);
  return attempts;
}

function clearLoginAttempts(email) {
  const key = email.trim().toLowerCase();
  const map = getLockoutMap();
  if (map[key]) {
    delete map[key];
    saveLockoutMap(map);
  }
}

function issueTokens(userId) {
  const ts = Date.now();
  return {
    accessToken: `acc_${userId}_${ts}`,
    refreshToken: `ref_${userId}_${ts}`,
  };
}

// ── Auth ─────────────────────────────────────────────────────────────────────

export function apiRegister({ name, phone, email, password }) {
  const users = getUsers();
  if (users[phone]) return Promise.resolve(fail('Nomor sudah terdaftar.'));
  if (email && findUserByEmail(email)) return Promise.resolve(fail('Email sudah terdaftar.'));

  const userId = `u_${Date.now()}`;
  const { accessToken, refreshToken } = issueTokens(userId);
  const user = {
    userId,
    email: email?.trim().toLowerCase() ?? '',
    password: password ?? '',
    accessToken,
    refreshToken,
    token: accessToken,
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

export function apiLogin({ email, password }) {
  const normalizedEmail = email?.trim().toLowerCase();
  if (!normalizedEmail) return Promise.resolve(fail('Email wajib diisi.'));

  const lockout = getLoginLockoutStatus(normalizedEmail);
  if (lockout.locked) {
    const minutes = Math.ceil(lockout.remainingMs / 60000);
    return Promise.resolve(fail(`Akun terkunci sementara. Coba lagi dalam ${minutes} menit.`));
  }

  const user = findUserByEmail(normalizedEmail);
  if (!user) {
    recordFailedLogin(normalizedEmail);
    return Promise.resolve(fail('Email atau password salah.'));
  }

  if (!password || password.length < 8) {
    return Promise.resolve(fail('Password minimal 8 karakter.'));
  }

  if (user.password !== password) {
    const attempts = recordFailedLogin(normalizedEmail);
    const remaining = MAX_LOGIN_ATTEMPTS - attempts;
    if (remaining <= 0) {
      return Promise.resolve(fail('Terlalu banyak percobaan gagal. Akun terkunci selama 15 menit.'));
    }
    return Promise.resolve(fail(`Email atau password salah. Sisa percobaan: ${remaining}.`));
  }

  clearLoginAttempts(normalizedEmail);

  const { accessToken, refreshToken } = issueTokens(user.userId);
  const updated = { ...user, accessToken, refreshToken, token: accessToken };
  const users = getUsers();
  users[user.phone] = updated;
  saveUsers(users);

  return Promise.resolve(ok({
    userId: updated.userId,
    accessToken,
    refreshToken,
    token: accessToken,
    name: updated.name,
    phone: updated.phone,
    email: updated.email,
    wallet: updated.wallet,
    ewalletAccount: updated.ewalletAccount,
    rewardType: updated.rewardType,
    points: updated.points,
    milestone: updated.milestone,
  }));
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
