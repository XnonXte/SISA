# USER INFO Backend Implementation

## 1) Scope and Goal

This document defines the backend implementation needed to move persistent state from frontend local storage into a real backend.

Target: backend becomes the source of truth for:

- Authentication and session lifecycle
- User profile and reward preferences
- Cart contents
- Pickup requests and pickup history
- Points and redemption history
- OTP verification for registration and password reset

Frontend keeps only short-lived UI state (loading flags, modal state, unsaved form drafts).

## 2) Current Frontend State to Migrate

Based on the current codebase, these Redux/localStorage fields should be persisted server-side:

Auth and user identity:

- userId
- accessToken, refreshToken, token
- email, phone, username

Profile and reward:

- name, profilePhoto
- rewardType, wallet, ewalletAccount

Balance and rewards:

- points, milestone
- redemption transactions

Operational data:

- cartItems
- pickupDraft (optional: can remain frontend draft)
- pickupHistory

Security controls:

- login attempt counters
- lockout timers
- OTP issue/verify records

Current local-only keys that should be removed after migration:

- sisa_session
- sisa_users
- sisa_login_lockout
- pickupHistory
- lastScan
- activeTrackingId

## 3) Suggested Backend Stack

Recommended baseline:

- Runtime: Node.js + TypeScript
- Framework: NestJS or Express + Zod validation
- Database: PostgreSQL
- Cache/rate limiting: Redis
- Queue (optional but recommended): BullMQ/SQS for OTP delivery retries
- Auth tokens: JWT access token + opaque refresh token (stored hashed)

Why PostgreSQL:

- relational integrity for user/cart/pickup/history
- easy audit trails and constraints

## 4) Data Model (SQL-Oriented)

Use UUID primary keys and server timestamps.

### 4.1 users

- id (uuid, pk)
- email (citext, unique, not null)
- phone (varchar, unique, nullable)
- username (varchar, unique, nullable)
- password_hash (varchar, not null)
- name (varchar, nullable)
- profile_photo_url (text, nullable)
- reward_type (enum: ewallet, listrik, nullable)
- wallet_provider (varchar, nullable)
- wallet_account (varchar, nullable)
- points_balance (int, not null default 0)
- milestone_target (int, not null default 1000)
- is_email_verified (boolean, default false)
- status (enum: active, suspended, deleted)
- created_at, updated_at

### 4.2 refresh_sessions

- id (uuid, pk)
- user_id (uuid, fk -> users.id)
- refresh_token_hash (varchar, not null)
- device_id (varchar, nullable)
- user_agent (text, nullable)
- ip_address (inet, nullable)
- expires_at (timestamp, not null)
- revoked_at (timestamp, nullable)
- created_at

### 4.3 otp_challenges

- id (uuid, pk)
- user_id (uuid, nullable, fk -> users.id)
- target_channel (enum: email, sms)
- target_value (varchar, not null) // email or phone
- purpose (enum: register_verify, reset_password, login_2fa)
- otp_hash (varchar, not null)
- expires_at (timestamp, not null)
- consumed_at (timestamp, nullable)
- attempts_used (int, default 0)
- max_attempts (int, default 5)
- resend_count (int, default 0)
- max_resends (int, default 3)
- locked_until (timestamp, nullable)
- metadata (jsonb, nullable)
- created_at

### 4.4 login_security

- id (uuid, pk)
- principal_type (enum: email, phone)
- principal_value (varchar, indexed)
- failed_attempts (int, default 0)
- locked_until (timestamp, nullable)
- last_failed_at (timestamp, nullable)
- updated_at

### 4.5 cart_items

- id (uuid, pk)
- user_id (uuid, fk)
- category (varchar, not null) // Cardboard, Plastic
- icon (varchar, nullable)
- estimated_points (int, not null)
- estimated_weight_kg (numeric(6,2), nullable)
- days_in_cart (int, default 0)
- source_scan_id (uuid, nullable)
- created_at, updated_at

### 4.6 pickups

- id (uuid, pk)
- user_id (uuid, fk)
- pickup_type (enum: instant, scheduled)
- slot_name (varchar, nullable)
- slot_start_at (timestamp, nullable)
- slot_end_at (timestamp, nullable)
- address_text (text, not null)
- address_lat (numeric(10,7), nullable)
- address_lng (numeric(10,7), nullable)
- status (enum: MENUNGGU_MITRA, MENUNGGU_MITRA_TERSEDIA, DIJADWALKAN, DALAM_PROSES, SELESAI, DIBATALKAN)
- start_time (timestamp, nullable)
- completed_at (timestamp, nullable)
- created_at, updated_at

### 4.7 pickup_items

- id (uuid, pk)
- pickup_id (uuid, fk -> pickups.id)
- cart_item_snapshot (jsonb, not null)
- estimated_points (int, not null)
- verified_points (int, nullable)
- material (varchar, nullable)
- grade (varchar, nullable)
- created_at

### 4.8 point_ledger

- id (uuid, pk)
- user_id (uuid, fk)
- event_type (enum: pickup_credit, redemption_debit, adjustment)
- amount (int, not null) // signed
- reference_type (enum: pickup, redemption, manual)
- reference_id (uuid, nullable)
- note (text, nullable)
- created_at

### 4.9 redemptions

- id (uuid, pk)
- user_id (uuid, fk)
- points_used (int, not null)
- cash_value (int, not null)
- destination_type (enum: gopay, ovo, dana, pln)
- destination_account (varchar, not null)
- status (enum: pending, processing, success, failed)
- processed_at (timestamp, nullable)
- created_at, updated_at

### 4.10 Optional: scan_records

- id (uuid, pk)
- user_id (uuid, fk)
- category (varchar)
- grade (varchar)
- confidence (numeric(5,4))
- estimated_points (int)
- image_url (text, nullable)
- created_at

## 5) API Contracts (v1)

All APIs return:

- success: true/false
- data
- error: { code, message, details? }

Use JSON over HTTPS only.

### 5.1 Auth

POST /v1/auth/register/init

- input: { name, email }
- behavior: create OTP challenge for register_verify
- output: { challengeId, expiresAt, resendRemaining }

POST /v1/auth/register/verify-otp

- input: { challengeId, otp }
- output: { verificationToken } // short-lived token used to finalize registration

POST /v1/auth/register/complete

- input: { verificationToken, password }
- output: { user, accessToken, refreshToken }

POST /v1/auth/login

- input: { email, password }
- behavior: enforce lockout rules
- output: { user, accessToken, refreshToken }

POST /v1/auth/refresh

- input: { refreshToken }
- output: { accessToken, refreshToken }

POST /v1/auth/logout

- input: { refreshToken }
- output: { success: true }

POST /v1/auth/password-reset/init

- input: { email }
- behavior: issue reset OTP challenge
- output: { challengeId, expiresAt }

POST /v1/auth/password-reset/verify-otp

- input: { challengeId, otp }
- output: { resetToken }

POST /v1/auth/password-reset/complete

- input: { resetToken, newPassword }
- output: { success: true }

### 5.2 User Profile

GET /v1/me

- output: profile + points + reward prefs

PATCH /v1/me

- input: { name, username, phone, profilePhotoUrl }

PATCH /v1/me/reward-preferences

- input: { rewardType, walletProvider, walletAccount }

### 5.3 Cart

GET /v1/cart

- output: { items: [...] }

POST /v1/cart/items

- input: { category, icon, estimatedPoints, estimatedWeightKg, daysInCart, sourceScanId? }

DELETE /v1/cart/items/:itemId

POST /v1/cart/items/bulk-delete

- input: { itemIds: [] }

### 5.4 Pickup

POST /v1/pickups

- input: {
  pickupType: instant|scheduled,
  slotName?, slotStartAt?, slotEndAt?,
  addressText, addressLat?, addressLng?,
  itemIds: []
  }
- behavior: snapshot cart items into pickup_items, remove from cart
- output: { pickupId, status }

GET /v1/pickups

- query: status?, page?, limit?

GET /v1/pickups/:pickupId

PATCH /v1/pickups/:pickupId/status

- internal/admin/mitra only

### 5.5 Points and Redemption

GET /v1/points/balance

GET /v1/points/history

POST /v1/redemptions

- input: { destinationType, destinationAccount, pointsUsed }
- behavior: atomic balance check + debit + create redemption

GET /v1/redemptions

## 6) OTP Solution (Production-Ready)

### 6.1 OTP Rules

- OTP length: 6 digits
- OTP expiry: 5 minutes
- Max verification attempts: 5
- Max resend: 3 per challenge
- Cooldown resend: 30-60 seconds
- One-time use only (mark consumed_at)

### 6.2 Security Requirements

- Never store OTP plaintext; store salted hash only
- Compare OTP hash in constant time
- Do not reveal whether account exists (for reset and login init endpoints)
- Rate-limit OTP requests by IP + target (email/phone)
- Lock challenge temporarily after too many failed attempts
- Invalidate previous active challenges for same purpose on new issue

### 6.3 Delivery Providers

Pick one email + one SMS provider abstraction:

- Email: SendGrid, Mailgun, Amazon SES
- SMS/WhatsApp: Twilio, MessageBird, Vonage

Implement provider adapter interface:

- sendOtp(target, messageTemplate, params)
- fallback provider on transient failures

### 6.4 OTP Message Template

- Include brand, purpose, OTP code, expiry, and security warning
- Example: "Kode OTP SISA Anda: 482931. Berlaku 5 menit. Jangan bagikan ke siapa pun."

### 6.5 Optional Hardening (Recommended)

- Add device fingerprint check for high-risk login
- Add CAPTCHA after abnormal OTP traffic
- Add TOTP (RFC 6238) as future account security upgrade

## 7) Auth and Session Security

- Access token TTL: 15 minutes
- Refresh token TTL: 30 days
- Rotate refresh token on every refresh
- Store refresh token hashes in refresh_sessions table
- Revoke old refresh token on rotation/logout
- Add jti claim in JWT for traceability
- Include role/scopes in JWT claims
- Support global logout by revoking all active sessions per user

Password policy:

- min 8 chars
- at least 1 uppercase, 1 lowercase, 1 digit
- hash algorithm: Argon2id (preferred) or bcrypt >= 12 cost

## 8) Business Rules and State Machines

### 8.1 Pickup status flow

- MENUNGGU_MITRA -> MENUNGGU_MITRA_TERSEDIA -> DIJADWALKAN or DALAM_PROSES -> SELESAI or DIBATALKAN

Rules:

- points are credited only when status becomes SELESAI
- status changes must be idempotent and audited
- no direct transition from DIBATALKAN to SELESAI

### 8.2 Points consistency

- Never update points_balance directly without point_ledger entry
- Use DB transaction for:
  - creating pickup completion credit
  - redemption debit
  - manual adjustment

Invariant:

- users.points_balance == SUM(point_ledger.amount for user)

## 9) Migration Plan from Current Frontend

### Phase 1: Backend foundations

1. Implement schema + migrations.
2. Implement auth + OTP + user profile APIs.
3. Implement cart and pickup APIs.
4. Implement points and redemption APIs.

### Phase 2: Frontend API integration

1. Replace localStorage auth stubs in src/services/api.js with real HTTP calls.
2. Stop writing sisa_users/sisa_login_lockout/pickupHistory to localStorage.
3. Keep only minimal session token storage (or move to secure cookie approach).
4. On app start, call GET /v1/me and GET /v1/cart to hydrate Redux.
5. On dashboard/history screens, fetch pickups from backend (paginated).

### Phase 3: Cleanup and hardening

1. Remove OTP test constant (123456) from UI.
2. Add retry/error handling and user-friendly status messages.
3. Add observability (logs/metrics/traces) for auth and OTP paths.
4. Run security test pass and load test for OTP/login burst traffic.

## 10) Frontend Changes Required (SISA-specific)

Files impacted:

- src/services/api.js
- src/app/store.js
- src/screens/Register.jsx
- src/screens/ForgotPassword.jsx
- src/screens/Login.jsx
- src/screens/Keranjang.jsx
- src/screens/FormPickup.jsx
- src/screens/Tracking.jsx
- src/screens/Riwayat.jsx
- src/screens/Dashboard.jsx

Implementation notes:

- apiSendOtp/apiSendPasswordResetOtp must return challengeId, not OTP code.
- OTP verification must call backend endpoint, not local constant comparison.
- login lockout status should come from backend response codes.
- pickup history should be fetched from GET /v1/pickups.
- tracking progress should read real pickup status, not frontend timer/localStorage simulation.
- points updates should follow backend point_ledger events.

## 11) Error Codes (Suggested)

Auth and OTP:

- AUTH_INVALID_CREDENTIALS
- AUTH_ACCOUNT_LOCKED
- AUTH_TOKEN_EXPIRED
- AUTH_REFRESH_REVOKED
- OTP_INVALID
- OTP_EXPIRED
- OTP_MAX_ATTEMPTS_REACHED
- OTP_RESEND_LIMIT_REACHED
- OTP_RATE_LIMITED

Cart and pickup:

- CART_ITEM_NOT_FOUND
- PICKUP_INVALID_STATUS_TRANSITION
- PICKUP_MIN_WEIGHT_NOT_MET

Points:

- POINTS_INSUFFICIENT_BALANCE
- REDEMPTION_DESTINATION_INVALID

## 12) Observability and Audit

Log events:

- auth.login.success / auth.login.failed
- auth.lockout.triggered
- otp.sent / otp.verify.success / otp.verify.failed
- pickup.created / pickup.status.changed / pickup.completed
- points.credited / points.debited

Audit table (optional but recommended):

- entity_type, entity_id, action, actor_id, payload_diff, created_at

Metrics:

- login success rate
- OTP send success rate
- OTP verify conversion
- lockout counts
- pickup completion SLA

## 13) Testing Checklist

Unit tests:

- password hashing and verification
- OTP issue/verify/resend/expiry logic
- lockout increment/reset behavior
- points ledger arithmetic

Integration tests:

- full register flow with OTP
- login + refresh + logout token lifecycle
- create pickup from selected cart items
- pickup completion credits points exactly once (idempotent)
- redemption with insufficient points fails atomically

Security tests:

- brute-force OTP attempts
- login enumeration resistance
- JWT tamper and replay checks
- refresh token reuse detection

## 14) Environment Variables

- DATABASE_URL
- REDIS_URL
- JWT_ACCESS_SECRET
- JWT_REFRESH_SECRET
- JWT_ACCESS_TTL=15m
- JWT_REFRESH_TTL=30d
- OTP_TTL_SECONDS=300
- OTP_MAX_ATTEMPTS=5
- OTP_MAX_RESENDS=3
- OTP_RESEND_COOLDOWN_SECONDS=30
- LOCKOUT_MAX_ATTEMPTS=5
- LOCKOUT_DURATION_MINUTES=15
- EMAIL_PROVIDER_API_KEY
- SMS_PROVIDER_API_KEY

## 15) Non-Goals (for v1)

- Multi-tenant architecture
- Full event sourcing for every domain action
- Real-time websocket tracking (polling is acceptable first)
- Advanced anti-fraud scoring

## 16) Recommended Delivery Order (2-Week Sprint Example)

Week 1:

1. DB schema + migrations
2. auth register/login/refresh/logout
3. OTP challenge endpoints with provider sandbox
4. profile endpoints

Week 2:

1. cart endpoints
2. pickup endpoints + status transitions
3. points ledger + redemption
4. frontend migration and end-to-end test

## 17) Final Notes

Your current frontend already defines the domain shape clearly. The fastest safe path is:

1. Keep existing Redux shape as much as possible.
2. Replace localStorage-backed services with backend APIs.
3. Move all security-critical logic (OTP, lockout, token issuance, points updates) fully to server-side.

This prevents client tampering and makes user/login/cart/history state reliable across devices.
