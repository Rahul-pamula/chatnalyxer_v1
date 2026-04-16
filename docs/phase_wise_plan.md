# Chatnalyxer: Master Implementation Strategy

This is the definitive, field-level source of truth for Chatnalyxer, incorporating every screen and interaction from the Product Blueprint.

---

# SECTION A — The Core Engine
**Objective:** Build and launch the Zero-Knowledge functional MVP for 2-person delivery.

## A.1 Authentication, Identity & Onboarding
- **Monorepo:** Initialize TurboRepo with `apps/mobile` (React Native), `apps/web` (Next.js), and `apps/backend` (FastAPI).
- **The Vault:** Setup `SQLCipher` for local storage with **600,000 PBKDF2 iterations** and Mnemonic Recovery Phrase UI.
- **Auth Flow Implementation:**
  - Build **Splash Screen** with auth-state logic.
  - Build **Login / Signup Screen** with OAuth (Google/GitHub) and Email entry.
  - Build **OTP / Verification Screen** with numeric input and resend logic.
- **Onboarding Journey:**
  - Build **Persona Selection Screen** (Interactive 3-card layout: Student/Faculty/Professional) with **Contextual Tooltips** explaining AI weighting.
  - Build **Preference Setup Screen** (Basic notification and focus area selectors).
- **Design System:** Implement **Midnight & Snow** tokens (Outfit/Inter, 0.3s fade-transitions).

## A.2 The Integration Hub & Channel Sync
- **The Hub Dashboard:** Build the central "Control Tower" (Notion-level clarity) to manage all connections.
- **WhatsApp Channel:**
  - Build **QR Pair Screen** using Baileys session management.
  - Build **Selective Group Sync UI** (Searchable list of groups with 2-group limit logic for Free Tier).
- **Email Channel:**
  - Build **Connection Screen** (IMAP/OAuth Microsoft/Google).
  - Build **Folder/Label Selection UI** (Inbox/Custom targeting).
- **Ingestion Pipeline:** FastAPI `BackgroundTasks` piping raw text into the `Events` table.
- **Transparency UI:** Build the **"Sieving..." Progress Bars** for initial ingestion and the **"Raw Message Log"** screen for **Manual Force Extraction**.
- **Idempotency:** `SHA-256` hashing on incoming messages to drop redundant data.

## A.3 The AI Brain & Triage Feed
- **The Extractor:** Implement single-model pipeline using **Gemini 2.0 Flash** (Noise filtering + JSON extraction).
- **The Home Feed:** Build the dashboard with global **Privacy Peeking** (Blurred/Unblurred toggle).
- **The "Undo" Safety Loop:** Implement the **Restore Toast/Snackbar** with a 5-second countdown timer for accidental swipes.
- **The Detail Hub:**
  - Build **Task Card Expand View** (Summary view + Blurred Source context).
  - Build **Alarm & Reminder Configuration** (5m/30m trigger prompts).
  - Build **Manual Task Entry Screen** and **Manual Edit/Correction** form.
- **AI Feedback Loop:** Capture manual user edits to feed back into Personalization weights.

## A.4 System Settings, Guide & De-boarding
- **Profile & Role Hub:** 
  - Build **Persona Switcher** to update AI scoring (e.g., Student -> Professional).
  - Build **Notification Customization Hub:** Granular toggles for alerts, quiet hours, and alarm sounds.
  - Build **Subscription Tier Management** (Free/Pro indicators).
- **The History Tab:** Build the checklist for `Completed` tasks with an instant **[Re-activate]** button for accidental archives.
- **The Knowledge Base:** Build the **Interaction Guide** (visual how-to for Sieve and Swipe).
- **Security & Data Sovereignty:** 
  - Build **Data Export Tool** (Local decryption -> JSON/CSV download).
  - Build the **"Nuclear Delete Account"** (GDPR) logic: Revoke tokens -> Purge Vault -> Purge Cloud Silo.
- **Sync Harden:** Implement **Silent Push Notifications (FCM/APNs)** for reliable cloud backup.

---

# SECTION B — Scalability Roadmap (Activate Post-Launch)
**Objective:** Harden for 10,000+ users.

## B.1 High-Throughput & Sync
- **Messaging:** Migrate to **Huey/RabbitMQ** for reliable job persistence.
- **Caching:** Integrate **Redis** for state debouncing and rate-limiting.
- **Conflict Resolution:** Implement `lastPulledAt` cursors and **Logical Clocks (HLC)**.

## B.2 Operations & Monetization
- **Payments:** Integrate **Stripe** for Pro/Max subscription billing.
- **Ads:** Deploy **Native Ad Engine** (injection logic after Card 3).
- **Observability:** Implement **OpenTelemetry (OTel)** for AI latency tracing.

---

# SECTION C — Future Innovations (The Moat)
**Objective:** Futuristic proprietary technology.

## C.1 Edge AI & Advanced Privacy
- **Edge AI:** Move inference to **quantized Gemma 3 1B** on-device.
- **Semantic Dedupe:** Implement **DA-PSI** for cross-channel task merging.
- **Private Consensus:** Implement **zk-SNARK proofs** for group-task verification.
