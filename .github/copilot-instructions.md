# SISA Copilot Instructions

## Quick Start

### Build & Serve
```bash
npm install          # Install dependencies
npm run dev          # Start dev server (http://localhost:5173)
npm run build        # Production build → dist/
npm run preview      # Preview production bundle locally
```

There are **no test or lint commands** in this project—focus on manual testing during development.

---

## Architecture Overview

SISA is a **mobile-first React 18 + Redux Toolkit B2B2C app** for validating waste cardboard and PET recyclables using Computer Vision.

### Three-Layer Stack
1. **Navigation Layer** (`navigationSlice`) — Maintains screen history stack for proper back navigation
2. **Data Layer** (`userSlice`) — Centralizes all app state: auth tokens, profile, cart, scan results, pickup data
3. **UI Layer** — Screen components consume Redux state and dispatch actions; no prop drilling

### Key Concepts

**Screens** are full-page components (13 total) registered in `App.jsx` SCREENS map. Each screen:
- Reads state via `useSelector((state) => state.user.*)` or `state.navigation.current`
- Writes state via `dispatch(userSlice.action(payload))`
- Navigates via `useAppNavigation()` hook: `go(screenName)`, `back()`, `reset()`

**State Persistence** — `store.js` subscribes to user state changes and syncs to localStorage (auth + profile only; cart/scan/pickup are session-only by design).

**Fixed Bottom Navigation** — `BottomNav.jsx` renders 5 tabs (HOME, RIWAYAT, SCAN, KERANJANG, PROFIL) + center CTA for camera. Cart badge shows item count.

---

## Redux State Structure

All Redux state lives in two slices:

### `userSlice` — User Data + Cart + Scan Results
```javascript
{
  // Auth
  userId, token, accessToken, refreshToken,
  
  // Profile (persisted to localStorage)
  name, username, email, phone, profilePhoto,
  wallet, ewalletAccount, rewardType, points, milestone,
  
  // Session-only (cleared on reload)
  scanResult,      // { imageBase64, category, estimatedPoints, confidence, grade, instruction }
  cartItems,       // [{ id, category, estimatedPoints, daysInCart, ... }]
  pickupDraft,
  pickupHistory
}
```

### `navigationSlice` — Screen Router
```javascript
{
  current: 'splash' | 'dashboard' | 'kamera' | ...,
  history: ['splash', 'dashboard']  // Stack for goBack()
}
```

### Key Actions
- **Auth/Profile**: `loginSuccess`, `setProfile`, `setRewardPref`
- **Scan**: `setScanResult`, `clearScanResult`
- **Cart**: `addToCart`, `removeFromCart`
- **Pickup**: `setPickupDraft`, `clearPickupDraft`, `addPoints`
- **Navigation**: `navigate(screen)`, `goBack()`, `resetNavigation()`

---

## Styling System

### Tailwind Design Tokens (from `tailwind.config.cjs`)

**Colors**
- `primary` / `primary-hover` / `primary-tint` — Tech green CTAs
- `accent` / `accent-tint` / `accent-tint2` — Gamification orange (points, rewards)
- `ink` / `muted` / `placeholder` — Text hierarchy
- `surface` / `surface-alt` / `surface-card` — Backgrounds
- `line` — Borders, dividers
- `danger` / `danger-tint` — Error states

**Border Radius** — SISA's signature "Geo-Curve" (opposite corners square, two diagonal rounded)
- `rounded-geo-xs` / `rounded-geo-sm` / `rounded-geo` / `rounded-geo-lg` / `rounded-geo-xl` / `rounded-geo-2xl`
- Append `-flip` to mirror the curve (top-left/bottom-right instead of top-right/bottom-left)

**Typography** — `Plus Jakarta Sans` font family
- `text-h1` / `text-h2` / `text-h3` — Headings with tight line-height
- `text-body-md` / `text-body-reg` — Body text (14px, weight 500/400)
- `text-caption` / `text-overline` — Small utilities

**Shadows** — Pre-defined card and CTA shadows
- `shadow-card` — Default card shadow
- `shadow-cta-primary` / `shadow-cta-accent` — Button shadows

**Animations** — Keyframes defined in config (scanLine, fadeUp, popIn, dotFade, pingAnim, drive)

### Global Component Classes (in `src/styles/index.css`)

Used throughout all screens:
- `.btn-primary` — Full-width green CTA button
- `.btn-secondary` — Full-width muted secondary button
- `.input-field` — Standard text input (52px height)
- `.card` — Generic white card with border-radius
- `.top-app-bar` — Screen header bar with centered title + back button (z-10)
- `.back-btn` — 36×36px square back button (rounded corners)
- `.phone-shell` — Wrapper div (height: 100dvh, prevents address bar scroll)
- `.scroll-content` — Scrollable content area (flex-1, touch-optimized)
- `.poin-card` — Points balance card (orange left-rail accent)
- `.bottom-nav` — Fixed 5-tab navigation bar (z-20 sticky)
- `.nav-tab` — Individual tab inside `.bottom-nav`
- `.nav-scan-btn` — Center scan CTA with `0% 50% 0% 50%` border-radius
- `.chip` — Pill-shaped toggle (green-tint when active)
- `.chip-filter` — Square toggle (inverted colors when active)

**Mobile Viewport** — Use `height: 100dvh` (dynamic viewport height) for full-screen layouts on mobile browsers with address bars.

---

## Screen Flow & Responsibilities

**Entry Points**: Splash → Login/Register → RewardPref → Dashboard

**Dashboard Hub**: Central screen with 5 navigation options (via BottomNav)
- SCAN (Kamera) → HasilScan → Keranjang (or FormPickup directly)
- RIWAYAT (pickup history)
- KERANJANG (view/edit cart, request pickup)
- PROFIL (edit profile, logout)
- TukarPoin (points redemption → Konfirmasi)

**Key Flows**:
- **Scan to Cart**: Kamera (capture) → HasilScan (preview + estimate) → Keranjang (review) → FormPickup (details) → Tracking
- **Points Redemption**: TukarPoin → Konfirmasi (redeem)
- **Edit Profile**: Profil → RewardPref (update wallet preference)

---

## File Organization Conventions

- **`src/screens/`** — Full-page components (one per screen); import BottomNav internally if needed
- **`src/features/{slice}/`** — Redux slice with initialState + reducers
- **`src/app/`** — Store config + navigation hook
- **`src/components/`** — Reusable UI components (BottomNav)
- **`src/styles/index.css`** — Global Tailwind directives + component layer classes
- **`src/services/api.js`** — API calls (e.g., `apiScanImage`, `apiLogin`)
- **`public/`** — Static assets (SVG logos, e-wallet provider PNGs)

---

## Common Patterns

### Dispatch from Screen
```javascript
import { useDispatch } from 'react-redux';
import { setScanResult } from '../features/user/userSlice';

const dispatch = useDispatch();
dispatch(setScanResult({ category: 'cardboard', estimatedPoints: 50 }));
```

### Read State
```javascript
const scanResult = useSelector((state) => state.user.scanResult);
const currentScreen = useSelector((state) => state.navigation.current);
```

### Navigate with History
```javascript
import { useAppNavigation } from '../app/useAppNavigation';

const { go, back, reset } = useAppNavigation();
go('dashboard');   // Push current screen, navigate forward
back();            // Pop history stack
reset();           // Logout: clear history, return to splash
```

### Persist to localStorage
State changes to `user` slice are automatically persisted in `store.subscribe()`. No explicit saves needed—only auth + profile fields are synced (see `store.js` `saveSession` function).

---

## API Integration

API calls live in `src/services/api.js`. Import and use as needed:
```javascript
import { apiScanImage, apiLogin, apiPickup } from '../services/api';

const response = await apiScanImage(imageBase64, token);
// Handle response, dispatch setScanResult() with result
```

---

## Performance & Accessibility Notes

- **Mobile-First**: All layouts use `width: 100%` + Tailwind responsive utilities; test on 375px width
- **Keyboard Navigation**: Focus states defined globally (`focus:ring-2 ring-primary`)
- **Reduced Motion**: CSS respects `prefers-reduced-motion: reduce` (disables animations)
- **Touch-Optimized**: Bottom nav, buttons use `:active:scale-95` for tactile feedback
- **LocalStorage**: Fails silently in private browsing (try/catch in store.js)
