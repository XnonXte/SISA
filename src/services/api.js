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

function normalizeEmail(email) {
  return email?.trim().toLowerCase() ?? '';
}

function hashPassword(password) {
  let hash = 0;
  for (let i = 0; i < password.length; i += 1) {
    hash = (hash << 5) - hash + password.charCodeAt(i);
    hash |= 0;
  }
  return `h_${Math.abs(hash).toString(16)}`;
}

function findUserByEmail(email) {
  const normalized = normalizeEmail(email);
  const users = getUsers();
  return Object.values(users).find((u) => u.email?.toLowerCase() === normalized) ?? null;
}

function findUserByPhone(phone) {
  const normalized = phone?.trim() ?? '';
  if (!normalized) return null;
  const users = getUsers();
  return Object.values(users).find((u) => u.phone === normalized) ?? null;
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

export function apiSendOtp({ email }) {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) return Promise.resolve(fail('Email wajib diisi.'));
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    return Promise.resolve(fail('Email wajib valid.'));
  }
  if (findUserByEmail(normalizedEmail)) {
    return Promise.resolve(fail('Email sudah terdaftar.'));
  }

  return Promise.resolve(ok({
    otp: '123456',
    expiresAt: Date.now() + 5 * 60 * 1000,
    maxResends: 3,
  }));
}

export function apiSendPasswordResetOtp({ email }) {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) return Promise.resolve(fail('Email wajib diisi.'));
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    return Promise.resolve(fail('Email wajib valid.'));
  }
  if (!findUserByEmail(normalizedEmail)) {
    return Promise.resolve(fail('Email tidak ditemukan.'));
  }

  return Promise.resolve(ok({
    otp: '123456',
    expiresAt: Date.now() + 5 * 60 * 1000,
  }));
}

export function apiResetPassword({ email, otp, password }) {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) return Promise.resolve(fail('Email wajib diisi.'));
  if (!findUserByEmail(normalizedEmail)) {
    return Promise.resolve(fail('Email tidak ditemukan.'));
  }
  if (otp !== '123456') {
    return Promise.resolve(fail('OTP salah.'));
  }
  if (!password || password.length < 8) {
    return Promise.resolve(fail('Password minimal 8 karakter.'));
  }
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    return Promise.resolve(fail('Password harus mengandung huruf dan angka.'));
  }

  const users = getUsers();
  const user = findUserByEmail(normalizedEmail);
  const updated = {
    ...user,
    password: hashPassword(password),
  };

  users[normalizedEmail] = updated;
  if (updated.phone) users[updated.phone] = updated;
  saveUsers(users);
  clearLoginAttempts(normalizedEmail);

  return Promise.resolve(ok({ email: updated.email }));
}

export function apiRegister({ name, phone, email, password }) {
  const normalizedEmail = normalizeEmail(email);
  const normalizedPhone = phone?.trim() ?? '';

  if (!name?.trim()) return Promise.resolve(fail('Nama wajib diisi.'));
  if (!normalizedEmail) return Promise.resolve(fail('Email wajib diisi.'));
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) return Promise.resolve(fail('Email wajib valid.'));
  if (!password || password.length < 8) return Promise.resolve(fail('Password minimal 8 karakter.'));
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    return Promise.resolve(fail('Password harus mengandung huruf dan angka.'));
  }
  if (normalizedPhone && findUserByPhone(normalizedPhone)) return Promise.resolve(fail('Nomor telepon sudah terdaftar.'));
  if (findUserByEmail(normalizedEmail)) return Promise.resolve(fail('Email sudah terdaftar.'));

  const users = getUsers();
  const userId = `u_${Date.now()}`;
  const { accessToken, refreshToken } = issueTokens(userId);
  const user = {
    userId,
    email: normalizedEmail,
    password: hashPassword(password),
    accessToken,
    refreshToken,
    token: accessToken,
    name: name.trim(),
    phone: normalizedPhone,
    points: 0,
    milestone: 1000,
    rewardType: null,
    wallet: null,
    ewalletAccount: '',
  };
  users[normalizedEmail] = user;
  if (normalizedPhone) users[normalizedPhone] = user;
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

  if (user.password !== hashPassword(password)) {
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
    username: updated.username,
    phone: updated.phone,
    email: updated.email,
    profilePhoto: updated.profilePhoto,
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

// Update basic profile after registration (sets name, username, phone, profile photo)
export function apiUpdateProfile({ email, name, username, phone, profilePhoto }) {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) return Promise.resolve(fail('Email wajib diisi.'));
  const users = getUsers();
  const user = Object.values(users).find((u) => u.email === normalizedEmail);
  if (!user) return Promise.resolve(fail('Pengguna tidak ditemukan.'));

  // Check username uniqueness
  if (username) {
    const conflict = Object.values(users).find((u) => u.username === username && u.email !== normalizedEmail);
    if (conflict) return Promise.resolve(fail('Username sudah digunakan.'));
  }

  // Check phone uniqueness
  if (phone) {
    const conflictPhone = Object.values(users).find((u) => u.phone === phone && u.email !== normalizedEmail);
    if (conflictPhone) return Promise.resolve(fail('Nomor HP sudah terdaftar.'));
  }

  // Update stored user
  const updated = {
    ...user,
    name: name ?? user.name,
    username: username ?? user.username,
    phone: phone ?? user.phone,
    profilePhoto: profilePhoto ?? user.profilePhoto,
    ewalletAccount: user.ewalletAccount,
  };

  // Save by email key
  users[normalizedEmail] = updated;
  // Also keep phone mapping for quick lookup
  if (phone) users[phone] = updated;
  saveUsers(users);

  return Promise.resolve(ok({
    userId: updated.userId,
    email: updated.email,
    name: updated.name,
    phone: updated.phone,
    username: updated.username,
    profilePhoto: updated.profilePhoto,
    ewalletAccount: updated.ewalletAccount,
  }));
}

// ── Trash Scanning ───────────────────────────────────────────────────────────

const MATERIAL_DB = {
  Plastic: {
    displayName: 'PET Bening',
    subtype: 'Botol PET',
    icon: 'bi-recycle',
    recycleCategory: 'Daur Ulang',
    prices: { 'Grade A': 6000, 'Grade B': 5000 },
    recommendation: 'Lepaskan tutup dan label botol agar peluang mendapatkan Grade A lebih tinggi.',
  },
  Cardboard: {
    displayName: 'Kardus',
    subtype: 'Kardus Bekas',
    icon: 'bi-box-seam',
    recycleCategory: 'Daur Ulang',
    prices: { 'Grade A': 3500, 'Grade B': 2500 },
    recommendation: 'Pastikan kardus kering dan tidak basah agar tetap Grade A.',
  },
};

export const WEIGHT_RANGES = {
  sedikit: { id: 'sedikit', label: 'Sedikit', range: '< 1 kg', minKg: 0, maxKg: 1, boxes: 1 },
  sedang: { id: 'sedang', label: 'Sedang', range: '1–2 kg', minKg: 1, maxKg: 2, boxes: 2 },
  banyak: { id: 'banyak', label: 'Banyak', range: '2–5 kg', minKg: 2, maxKg: 5, boxes: 3, minimumPickup: true },
  sangat_banyak: { id: 'sangat_banyak', label: 'Sangat Banyak', range: '> 5 kg', minKg: 5, maxKg: 7, boxes: 4 },
};

function getReferenceWeightKg(rangeInfo) {
  return (rangeInfo.minKg + rangeInfo.maxKg) / 2;
}

function getMaterialPrice(category, grade) {
  const info = MATERIAL_DB[category];
  if (!info) return 0;
  return info.prices[grade] ?? info.prices['Grade B'] ?? 0;
}

export function calculateRangeEstimate(category, grade, weightRangeId) {
  const materialInfo = MATERIAL_DB[category];
  const rangeInfo = WEIGHT_RANGES[weightRangeId];
  if (!materialInfo || !rangeInfo) return null;

  const materialPrice = getMaterialPrice(category, grade);
  const estimatedWeight = getReferenceWeightKg(rangeInfo);
  const estimatedPrice = Math.round(materialPrice * estimatedWeight);
  const estimatedPoints = Math.round(estimatedPrice / 10);
  const pickupEligible = weightRangeId === 'banyak' || weightRangeId === 'sangat_banyak';

  return {
    materialPrice,
    estimatedWeight,
    estimatedPrice,
    estimatedPoints,
    pickupEligible,
  };
}

export function apiCalculateScanEstimate({ category, grade, weightRange }) {
  const result = calculateRangeEstimate(category, grade, weightRange);
  if (!result) {
    if (!MATERIAL_DB[category]) return Promise.resolve(fail('Material tidak dikenali.'));
    return Promise.resolve(fail('Weight range tidak valid.'));
  }

  return Promise.resolve(ok(result));
}

export async function apiScanImage(_token, imageBase64) {
  const blob = await (await fetch(imageBase64)).blob();
  const fd = new FormData();
  fd.append('file', blob, 'scan.jpg');
  const r = await fetch(`${import.meta.env.VITE_API_URL}/classify-waste`, { method: 'POST', body: fd });
  if (!r.ok) return fail('Material tidak dapat dikenali.');
  const j = await r.json();

  const category = j.primary_material;
  const materialInfo = MATERIAL_DB[category];
  if (!materialInfo) {
    return fail('Material tidak dapat dikenali.');
  }

  const accepted = ['Plastic', 'Cardboard'].includes(category);
  const grade = j.sub_classification || 'Grade B';
  const confidence = parseFloat(j.primary_accuracy) / 100;

  return ok({
    scanId: `scan_${Date.now()}`,
    category,
    material: materialInfo.displayName,
    subtype: materialInfo.subtype,
    grade,
    confidence,
    status: accepted ? 'accepted' : 'rejected',
    recycleCategory: materialInfo.recycleCategory,
    recommendation: materialInfo.recommendation,
    icon: materialInfo.icon,
    materialPrice: getMaterialPrice(category, grade),
    anomalies: [],
    instruction: materialInfo.recommendation,
  });
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
