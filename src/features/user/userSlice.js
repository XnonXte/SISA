import { createSlice, nanoid } from '@reduxjs/toolkit';

const initialState = {
  name: 'Budi Setiawan',
  phone: '',
  wallet: 'GoPay',
  ewalletAccount: '',
  rewardType: 'ewallet', // 'ewallet' | 'listrik'
  points: 750,
  milestone: 1000,
  estimatedPoints: 150,
  scannedCategory: null,
  verifiedPoints: null,
  cartItems: [], // { id, category, icon, estimatedPoints, daysInCart }
  pickupDraft: null, // { source: 'cart' | 'direct', items: [...] }
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Register.jsx — handleSubmit
    setProfile: (state, action) => {
      const { name, phone } = action.payload;
      if (name && name.trim()) state.name = name.trim();
      state.phone = phone;
    },

    // RewardPref.jsx — handleConfirm
    setRewardPref: (state, action) => {
      const { rewardType, wallet, ewalletAccount } = action.payload;
      state.rewardType = rewardType;
      state.wallet = rewardType === 'ewallet' ? wallet : null;
      state.ewalletAccount = rewardType === 'ewallet' ? ewalletAccount : null;
    },

    // Kamera.jsx → HasilScan.jsx — store the simulated AI scan result
    setScanResult: (state, action) => {
      const { estimatedPoints, scannedCategory } = action.payload;
      if (estimatedPoints != null) state.estimatedPoints = estimatedPoints;
      if (scannedCategory) state.scannedCategory = scannedCategory;
    },

    // HasilScan.jsx — handleAddToCart
    addToCart: {
      reducer: (state, action) => {
        state.cartItems.push(action.payload);
      },
      prepare: (item) => ({
        payload: {
          id: item.id || `item_${nanoid()}`,
          category: item.category,
          icon: item.icon,
          estimatedPoints: item.estimatedPoints,
          daysInCart: item.daysInCart ?? 0,
        },
      }),
    },

    // Keranjang.jsx — remove items once they're pulled into a pickup draft
    removeFromCart: (state, action) => {
      const ids = action.payload; // array of item ids
      state.cartItems = state.cartItems.filter((item) => !ids.includes(item.id));
    },

    // HasilScan.jsx (direct) & Keranjang.jsx (from cart) — both build a pickupDraft
    setPickupDraft: (state, action) => {
      state.pickupDraft = action.payload; // { source, items }
    },

    clearPickupDraft: (state) => {
      state.pickupDraft = null;
    },

    // Konfirmasi.jsx — handleRedeem (Tukar Sekarang)
    redeemPoints: (state, action) => {
      const amount = action.payload;
      state.points = Math.max(state.points - amount, 0);
    },

    // Generic credit, e.g. when a tracked pickup completes and points land
    addPoints: (state, action) => {
      state.points += action.payload;
    },
  },
});

export const {
  setProfile,
  setRewardPref,
  setScanResult,
  addToCart,
  removeFromCart,
  setPickupDraft,
  clearPickupDraft,
  redeemPoints,
  addPoints,
} = userSlice.actions;

export default userSlice.reducer;
