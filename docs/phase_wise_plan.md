# Chatnalyxer: Simplified Master Implementation Strategy (V5.0)

This is the definitive, field-level source of truth for Chatnalyxer, optimized for a 6-week MVP delivery followed by a scalable growth roadmap.

---

# SECTION A — The Core Engine (Week 1–6)
**Objective:** Build and launch the Zero-Knowledge functional MVP for high-impact task triage.

## A.1 Foundations & Identity (Weeks 1–2)
- **Monorepo:** Initialize TurboRepo with `apps/mobile` (React Native), `apps/web` (Next.js), and `apps/backend` (FastAPI).
- **Identity Flow:** Build the **Auth Entry (OAuth/Email)** and the **Persona Selection** (Student/Faculty/Pro).
- **The Vault:** Setup `SQLCipher` for local storage with **600,000 PBKDF2 iterations** for the master key.
- **Design System:** Implement **Midnight & Snow** tokens (Outfit/Inter typography, 8px grid, 0.3s fade-transitions).
- **Data Model:** Finalize `Events` (Raw) and `Obligations` (Extracted) Postgres/SQLite schemas.

## A.2 The Integration Hub & Channel Sync (Weeks 3–4)
- **Hub Dashboard:** Build the "Control Tower" for managing multiple active integrations.
- **Selective Sync (WA):** Implement the "Group Selector" page for WhatsApp (Linked via Baileys QR).
- **Folder Sync (Email):** Implement IMAP/OAuth folder targeting (Inbox/Labels).
- **Ingestion Pipeline:** Basic FastAPI `BackgroundTasks` to pipe raw messages into the `Events` table.
- **Idempotency:** Implement `SHA-256` fingerprinting to drop duplicate messages immediately.

## A.3 The AI Brain & Triage Feed (Weeks 5–6)
- **The Extractor:** Implement a single-model pipeline using **Gemini 2.0 Flash** for extraction and noise filtering.
- **Interaction Physics:** Build the **Instagram-style Gesture Cards** (Swipe Right: Accept | Swipe Left: Reject).
- **The Dashboard:** Implement the Feed with **Privacy Peeking** (global blur/unblur toggle).
- **Manual Control:** Build the "Manual Task Entry" and "Manual Edit" screens for AI correction.
- **Self-Correction:** Capture manual edits as training signals for future extraction weights.

## A.4 Security, Guide & De-boarding (Polish)
- **Interaction Guide:** Build the in-app knowledge base explaining the Sieve and Swipe loops.
- **Profile Hub:** Build extended settings for **Persona Switching** and **Data Portability (Export JSON/CSV)**.
- **Nuclear Delete:** Implement the GDPR "Wipe" button (Purging local vault + Cloud Silo).
- **Sync Harden:** Implement **Silent Push Notifications (FCM/APNs)** for reliable cloud backup wake-ups.

---

# SECTION B — Scalability Roadmap (Activate Post-Launch)
**Objective:** Harden for 10,000+ users and enterprise stability.

## B.1 High-Throughput Management
- **Persistence:** Move from `BackgroundTasks` to **Huey/RabbitMQ** for reliable job queues.
- **Caching:** Add **Redis** for state debouncing and global rate-limiting.
- **Sync Engine:** Implement `lastPulledAt` cursor logic and **Logical Clocks (HLC)** for conflict resolution.

## B.2 Operations & Monetization
- **Billing:** Full **Stripe** integration for Pro/Max tiers.
- **Monetization:** Deploy the **Native Ad Engine** (injection logic after Card 3).
- **Observability:** Implement **OpenTelemetry (OTel)** for deep AI latency tracing.

---

# SECTION C — Future Innovations (The Moat)
**Objective:** Futuristic proprietary technology to maintain competitive dominance.

## C.1 Edge & Advanced Processing
- **Edge AI:** Move inference to **quantized Gemma 3 1B** directly on-device.
- **Semantic Dedupe:** Implement **DA-PSI** for cross-channel cryptographic task merging.
- **Consensus:** Implement **zk-SNARK proofs** for decentralized multi-user task verification.

## C.2 Chronobiological UI
- **Energy Mapping:** Build local tracking to categorize user **chronotypes** and dynamically sort tasks by cognitive load.
