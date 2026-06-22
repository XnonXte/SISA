# SISA — Infrastruktur Validasi Mutu Rantai Pasok

Platform B2B2C agregator sampah berbekal teknologi Computer Vision. Memfasilitasi konversi material kardus dan PET bening menjadi aset likuid secara presisi, tanpa perantara fisik.

---

## Tech Stack

| Layer | Library |
|---|---|
| UI | React 18 |
| State Management | Redux Toolkit + React Redux |
| Styling | Tailwind CSS v3 + custom design tokens |
| Bundler | Vite |
| Icons | Bootstrap Icons (CDN) |
| Font | Plus Jakarta Sans (Google Fonts) |

---

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

The app runs at `http://localhost:5173` by default.

---

## Project Structure

```
src/
├── app/
│   ├── store.js              # Redux store (user + navigation reducers)
│   └── useAppNavigation.js   # Hook wrapping navigationSlice (go, back, reset)
│
├── features/
│   ├── user/
│   │   └── userSlice.js      # All user data: profile, points, cart, pickup draft, reward prefs
│   └── navigation/
│       └── navigationSlice.js # Screen router with history stack
│
├── screens/
│   ├── Splash.jsx
│   ├── Register.jsx
│   ├── RewardPref.jsx
│   ├── Kamera.jsx
│   ├── HasilScan.jsx
│   ├── FormPickup.jsx
│   ├── Tracking.jsx
│   ├── Dashboard.jsx
│   ├── Keranjang.jsx
│   ├── Riwayat.jsx
│   ├── TukarPoin.jsx
│   ├── Konfirmasi.jsx
│   └── Profil.jsx
│
├── components/
│   └── BottomNav.jsx         # Fixed bottom navigation (HOME · RIWAYAT · SCAN · KERANJANG · PROFIL)
│
├── styles/
│   └── index.css             # Tailwind directives + global component classes
│
├── App.jsx                   # Screen switcher, reads active screen from Redux
└── main.jsx                  # React root + Redux Provider
```

---

## State Management

All app state lives in two Redux slices. Screens read via `useSelector` and write via `useDispatch` — no prop drilling.

### `userSlice` — `/src/features/user/userSlice.js`

| Action | Dispatched by | What it does |
|---|---|---|
| `setProfile` | Register | Saves name + phone |
| `setRewardPref` | RewardPref | Saves reward type, wallet provider, account number |
| `setScanResult` | Kamera → HasilScan | Stores AI scan output (category, estimated points) |
| `addToCart` | HasilScan | Appends a scanned item to the cart |
| `removeFromCart` | Keranjang | Removes selected items after pickup is requested |
| `setPickupDraft` | HasilScan, Keranjang | Stages items for the FormPickup flow |
| `clearPickupDraft` | — | Clears staged draft after pickup is confirmed |
| `redeemPoints` | Konfirmasi | Deducts redeemed amount from points balance |
| `addPoints` | — | Credits points (e.g. after a pickup completes) |

### `navigationSlice` — `/src/features/navigation/navigationSlice.js`

Replaces the original `useState('splash') + go(screen)` pattern with a proper history stack.

| Action | Effect |
|---|---|
| `navigate(screen)` | Push current screen to history, switch to new screen |
| `goBack()` | Pop history stack, return to previous screen |
| `resetNavigation()` | Clear history, return to splash (used on logout) |

Use the `useAppNavigation()` hook in any screen:

```js
const { go, back, reset } = useAppNavigation();
go('dashboard');   // navigate forward
back();            // go to previous screen
reset();           // logout — clears history
```

---

## Tailwind Design Tokens

All brand tokens are defined in `tailwind.config.cjs` and available as Tailwind utilities.

### Colors

| Token | Value | Usage |
|---|---|---|
| `primary` | `#1DB954` | CTAs, active states, success |
| `primary-hover` | `#179443` | Button hover/active |
| `primary-tint` | `#E8F5E9` | Backgrounds, info banners |
| `accent` | `#F5A623` | Points, rewards, gamification |
| `accent-tint` | `#FFFCF7` | Card backgrounds |
| `accent-tint2` | `#FFF8E1` | Deeper accent backgrounds |
| `ink` | `#1A1A1A` | Primary text |
| `muted` | `#707070` | Secondary text |
| `placeholder` | `#9E9E9E` | Placeholder text, inactive nav |
| `line` | `#E0E0E0` | Borders, dividers |
| `surface` | `#FAFAFA` | Page backgrounds |
| `danger` | `#D32F2F` | Error, rejected states |
| `danger-tint` | `#FFEBEE` | Error backgrounds |

### Border Radius — Asymmetric "Geo-Curve"

SISA's signature shape: two corners square, two rounded diagonally opposite.

| Class | Value | Usage |
|---|---|---|
| `rounded-geo-xs` | `0px 8px 0px 8px` | Small badges, tags |
| `rounded-geo-sm` | `0px 12px 0px 12px` | Chips, small buttons |
| `rounded-geo` | `0px 16px 0px 16px` | Default cards |
| `rounded-geo-lg` | `0px 20px 0px 20px` | Buttons, form elements |
| `rounded-geo-xl` | `0px 24px 0px 24px` | Large cards, photo previews |
| `rounded-geo-2xl` | `0px 32px 0px 32px` | Bottom sheets |
| `rounded-geo-*-flip` | Mirrors of the above | Alternate orientation |

### Global Component Classes

Defined in `src/styles/index.css` under `@layer components`:

| Class | Description |
|---|---|
| `.btn-primary` | Full-width green CTA button |
| `.btn-secondary` | Full-width muted secondary button |
| `.input-field` | Standard text input |
| `.poin-card` | Points balance card with orange left-rail accent |
| `.progress-track` / `.progress-fill` | Gamification progress bar |
| `.chip` | Pill-shaped toggle (green-tint active) — e-wallet selectors |
| `.chip-filter` | Square toggle (black-invert active) — mode/schedule selectors |
| `.card` | Generic white card |
| `.top-app-bar` | Screen header bar with centered title |
| `.back-btn` | 36×36px rounded square back button |
| `.bottom-nav` | Fixed 5-tab navigation bar |
| `.nav-tab` | Individual tab inside `.bottom-nav` |
| `.nav-scan-btn` | Center scan CTA with `0% 50% 0% 50%` radius |

---

## Public Assets

Place these in `/public/` before running:

```
public/
├── logo-mark-sisa.svg    # Used on Splash screen
├── logo-text-sisa.svg    # Used on Splash screen
├── gopay.png
├── ovo.png
├── dana.png
└── pln.png
```

---

## Screen Flow

```
Splash
  └── Register
        └── RewardPref
              └── Dashboard ──────────────────────────────┐
                    ├── Kamera                            │
                    │     └── HasilScan                   │
                    │           ├── Keranjang             │
                    │           │     └── FormPickup      │
                    │           │           └── Tracking ─┘
                    │           └── FormPickup (direct)
                    ├── TukarPoin
                    │     └── Konfirmasi
                    ├── Riwayat
                    └── Profil
                          └── RewardPref (edit)
```