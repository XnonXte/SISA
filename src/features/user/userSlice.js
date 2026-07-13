import { createSlice, nanoid } from '@reduxjs/toolkit';

// Clean blank slate — no demo data. All values populated after login/register.
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
  wallet: null,
  ewalletAccount: '',
  rewardType: null, // 'ewallet' | 'listrik'

  // Points
  points: 0,
  milestone: 1000,

  // Scan session — set by Kamera, consumed by HasilScan
  scanResult: null, // { imageBase64, category, estimatedPoints, confidence, grade, instruction }

  // Cart
  cartItems: [], // { id, category, icon, estimatedPoints, daysInCart }

  // Pickup
  pickupDraft: null,
  pickupHistory: []
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Called after successful login API response
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
      state.wallet = wallet ?? null;
      state.ewalletAccount = ewalletAccount ?? '';
      state.rewardType = rewardType ?? null;
      state.points = points ?? 0;
      state.milestone = milestone ?? 1000;
    },

    // Register.jsx — handleSubmit
    setProfile: (state, action) => {
      const { name, phone, email, username, profilePhoto } = action.payload;
      if (name?.trim()) state.name = name.trim();
      if (username?.trim()) state.username = username.trim();
      if (phone) state.phone = phone;
      if (profilePhoto) state.profilePhoto = profilePhoto;
      if (email?.trim()) state.email = email.trim().toLowerCase();
    },

    // RewardPref.jsx — handleConfirm
    setRewardPref: (state, action) => {
      const { rewardType, wallet, ewalletAccount } = action.payload;
      state.rewardType = rewardType;
      state.wallet = rewardType === 'ewallet' ? wallet : null;
      state.ewalletAccount = rewardType === 'ewallet' ? ewalletAccount : null;
    },

    // Kamera.jsx — stores the full API scan response for HasilScan to read
    setScanResult: (state, action) => {
      // action.payload = { imageBase64, category, estimatedPoints, confidence, grade, instruction }
      state.scanResult = action.payload;
    },

    clearScanResult: (state) => {
      state.scanResult = null;
    },

    // HasilScan.jsx — addToCart
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

    // Keranjang.jsx — after requesting pickup for selected items
    removeFromCart: (state, action) => {
      const ids = action.payload; // string[]
      state.cartItems = state.cartItems.filter((item) => !ids.includes(item.id));
    },

    // HasilScan.jsx / Keranjang.jsx — stage items for FormPickup
    setPickupDraft: (state, action) => {
      state.pickupDraft = action.payload; // { source, items }
    },

    clearPickupDraft: (state) => {
      state.pickupDraft = null;
    },

    // Konfirmasi.jsx — Tukar Sekarang
    redeemPoints: (state, action) => {
      state.points = Math.max(state.points - action.payload, 0);
    },

    // Credited when a pickup completes on the backend
    addPoints: (state, action) => {
      state.points += action.payload;
    },

    setPickupHistory:(state,action)=>{
      state.pickupHistory=action.payload;
    },

    // Logout — wipe everything back to blank slate
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
