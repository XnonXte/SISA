import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/user/userSlice';
import navigationReducer from '../features/navigation/navigationSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    navigation: navigationReducer,
  },
});

// JSDoc typedefs for editor intellisense without requiring TypeScript
/** @typedef {ReturnType<typeof store.getState>} RootState */
/** @typedef {typeof store.dispatch} AppDispatch */
