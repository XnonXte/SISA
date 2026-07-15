import { configureStore } from '@reduxjs/toolkit';
import userReducer, { initialState as userInitialState } from '../features/user/userSlice';
import navigationReducer from '../features/navigation/navigationSlice';

// ── localStorage keys ────────────────────────────────────────────────────────
const STORAGE_KEY = 'sisa_session';

/**
 * Persist only the auth + profile fields that survive a page reload.
 * Cart, scan result, and pickup draft are session-only — deliberately excluded.
 */
// store.js (Potongan fungsi saveSession)
function saveSession(userState) {
  try {
    const session = {
      userId: userState.userId,
      token: userState.token,
      accessToken: userState.accessToken,
      refreshToken: userState.refreshToken,
      name: userState.name,
      username: userState.username,
      email: userState.email,
      phone: userState.phone,
      rewardPhone: userState.rewardPhone,
      pickupAddress: userState.pickupAddress,
      profilePhoto: userState.profilePhoto,
      tanggalLahir: userState.tanggalLahir,
      jenisKelamin: userState.jenisKelamin,
      tanggalBergabung: userState.tanggalBergabung, // Ikut disimpan
      wallet: userState.wallet,
      ewalletAccount: userState.ewalletAccount,
      rewardType: userState.rewardType,
      points: userState.points,
      milestone: userState.milestone,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    // Fail silently
  }
}

export function loadSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}

// ── Preloaded state from storage ─────────────────────────────────────────────
const saved = loadSession();
const preloadedUser = saved
  ? { ...userInitialState, ...saved }
  : userInitialState;

// If a valid session exists, drop the user straight onto the dashboard.
const preloadedNav = saved?.token
  ? { current: 'dashboard', history: [] }
  : { current: 'splash', history: [] };

// ── Store ────────────────────────────────────────────────────────────────────
export const store = configureStore({
  reducer: {
    user: userReducer,
    navigation: navigationReducer,
  },
  preloadedState: {
    user: preloadedUser,
    navigation: preloadedNav,
  },
});

// ── Persistence middleware (subscribe) ───────────────────────────────────────
// Write to localStorage on every dispatch that changes user state.
let previousUser = store.getState().user;
store.subscribe(() => {
  const currentUser = store.getState().user;
  if (currentUser !== previousUser) {
    if (currentUser.token) {
      saveSession(currentUser);
    } else {
      // Token gone (logout) — clear storage
      clearSession();
    }
    previousUser = currentUser;
  }
});

/** @typedef {ReturnType<typeof store.getState>} RootState */
/** @typedef {typeof store.dispatch} AppDispatch */
