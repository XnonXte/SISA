// features/user/userSlice.js
import { createSlice, nanoid } from '@reduxjs/toolkit';

export const initialState = {
  // Auth
  userId: null,
  token: null,
  accessToken: null,
  refreshToken: null,

  // Profile
  name: '',
  username: '',
  email: '',
  phone: '',
  profilePhoto: '',
  tanggalLahir: '',
  jenisKelamin: '',
  tanggalBergabung: '', // Field Baru untuk mencatat waktu registrasi/masuk awal
  wallet: null,
  ewalletAccount: '',
  rewardType: null, // 'ewallet' | 'listrik'

  // Points
  points: 0,
  milestone: 1000,

  // Scan session
  scanResult: null,

  // Cart
  cartItems: [],

  // Pickup
  pickupDraft: null,
  pickupHistory: []
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      const {
        userId,
        token,
        accessToken,
        refreshToken,
        name,
        email,
        phone,
        wallet,
        ewalletAccount,
        rewardType,
        points,
        milestone,
        tanggalLahir,
        jenisKelamin,
        tanggalBergabung,
      } = action.payload;
      state.userId = userId;
      state.accessToken = accessToken ?? token ?? null;
      state.refreshToken = refreshToken ?? null;
      state.token = accessToken ?? token ?? null;
      state.name = name ?? '';
      state.username = action.payload.username ?? '';
      state.email = email ?? '';
      state.phone = phone ?? '';
      state.profilePhoto = action.payload.profilePhoto ?? '';
      state.tanggalLahir = tanggalLahir ?? '';
      state.jenisKelamin = jenisKelamin ?? '';
      
      // Jika dari API tidak ada tanggalBergabung, otomatis set bulan & tahun saat ini
      if (tanggalBergabung) {
        state.tanggalBergabung = tanggalBergabung;
      } else if (!state.tanggalBergabung) {
        const opsi = { month: 'long', year: 'numeric' };
        state.tanggalBergabung = new Date().toLocaleDateString('id-ID', opsi);
      }

      state.wallet = wallet ?? null;
      state.ewalletAccount = ewalletAccount ?? '';
      state.rewardType = rewardType ?? null;
      state.points = points ?? 0;
      state.milestone = milestone ?? 1000;
    },

    setProfile: (state, action) => {
      const { name, phone, email, username, profilePhoto, tanggalLahir, jenisKelamin, ewalletAccount } = action.payload;
      if (name?.trim()) state.name = name.trim();
      if (username?.trim()) state.username = username.trim();
      if (phone) state.phone = phone;
      if (profilePhoto) state.profilePhoto = profilePhoto;
      if (email?.trim()) state.email = email.trim().toLowerCase();
      if (tanggalLahir) state.tanggalLahir = tanggalLahir;
      if (jenisKelamin) state.jenisKelamin = jenisKelamin;
      // Support saving a pickup address in the profile temporarily via ewalletAccount
      if (typeof ewalletAccount === 'string') state.ewalletAccount = ewalletAccount;
      
      if (!state.tanggalBergabung) {
        const opsi = { month: 'long', year: 'numeric' };
        state.tanggalBergabung = new Date().toLocaleDateString('id-ID', opsi);
      }
    },

    setRewardPref: (state, action) => {
      const { rewardType, wallet, ewalletAccount } = action.payload;
      state.rewardType = rewardType;
      state.wallet = rewardType === 'ewallet' ? wallet : null;
      state.ewalletAccount = rewardType === 'ewallet' ? ewalletAccount : null;
    },

    setScanResult: (state, action) => {
      state.scanResult = action.payload;
    },

    clearScanResult: (state) => {
      state.scanResult = null;
    },

    addToCart: {
      reducer: (state, action) => {
        state.cartItems.push(action.payload);
      },
      prepare: (item) => ({
        payload: {
          id: item.id || `item_${nanoid()}`,
          name: item.name ?? item.material ?? item.category,
          category: item.category,
          grade: item.grade ?? null,
          weightRange: item.weightRange ?? null,
          icon: item.icon,
          estimatedPoints: item.estimatedPoints,
          estimatedWeightKg: item.estimatedWeightKg ?? null,
          estimatedPrice: item.estimatedPrice ?? null,
          daysInCart: item.daysInCart ?? 0,
        },
      }),
    },

    removeFromCart: (state, action) => {
      const ids = action.payload;
      state.cartItems = state.cartItems.filter((item) => !ids.includes(item.id));
    },

    setPickupDraft: (state, action) => {
      state.pickupDraft = action.payload;
    },

    clearPickupDraft: (state) => {
      state.pickupDraft = null;
    },

    redeemPoints: (state, action) => {
      state.points = Math.max(state.points - action.payload, 0);
    },

    addPoints: (state, action) => {
      state.points += action.payload;
    },

    setPickupHistory: (state, action) => {
      state.pickupHistory = action.payload;
    },

    logout: () => initialState,
  },
});

export const {
  loginSuccess,
  setProfile,
  setRewardPref,
  setScanResult,
  clearScanResult,
  addToCart,
  removeFromCart,
  setPickupDraft,
  clearPickupDraft,
  redeemPoints,
  addPoints,
  setPickupHistory,
  logout,
} = userSlice.actions;

export default userSlice.reducer;