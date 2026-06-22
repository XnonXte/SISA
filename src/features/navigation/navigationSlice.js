import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  current: 'splash',
  history: [], // stack of previous screens, for goBack()
};

const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    // Equivalent to the old go(screen) call — push current screen to history, navigate forward
    navigate: (state, action) => {
      if (state.current !== action.payload) {
        state.history.push(state.current);
      }
      state.current = action.payload;
    },
    // Pop the history stack — used by back-btn instead of hardcoding the previous screen
    goBack: (state) => {
      const prev = state.history.pop();
      if (prev) state.current = prev;
    },
    // Reset to splash and clear history — used on logout (Profil "Keluar")
    resetNavigation: (state) => {
      state.current = 'splash';
      state.history = [];
    },
  },
});

export const { navigate, goBack, resetNavigation } = navigationSlice.actions;
export default navigationSlice.reducer;
