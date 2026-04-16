# Chatnalyxer: Granular Master Phase Plan (V3.5)

This document provides a comprehensive, field-level breakdown of every requirement, from foundational scaffolding to high-end AI learning loops and futuristic V2.0 features.

---

## Phase 1 — Foundational Scaffolding & Zero-Knowledge Vault
**Goal:** Establish the architecture that guarantees the "Private Office" promise.

### 1.1 Monorepo & DX (TurboRepo)
- Initialize `turbo` workspace with strict `pnpm` workspaces.
- **Apps:** `apps/mobile` (React Native), `apps/web` (Next.js), `apps/backend` (FastAPI).
- **Packages:** `packages/design-system`, `packages/types`, `packages/crypto-core`.
- Configure `GitHub Actions` for multi-package linting/testing.
- Setup `Doppler/SOPS` for dynamic secret injection (no `.env` files).

### 1.2 "Midnight & Snow" Design System
- **Typography:** Import 'Outfit' (Headings) and 'Inter' (Body).
- **Spacing:** Implement strict 8px increment grid variables.
- **Tokens:** Midnight (`#050505`), Snow (`#FFFFFF`), Primary Accent, Warning Red.
- **ThemeProvider:** Implement automatic system theme detection.
- **UX Polish:** Add the optimized 0.3s fade-transition for theme switching.

### 1.3 The SQLCipher Vault (Mobile)
- Setup `WatermelonDB` with `op-sqlite` + `SQLCipher` adapter.
- **Key Derivation:** Implement `PBKDF2-SHA256` with 600,000 iterations for master key.
- **Persistence:** Store salt in device Secure Enclave (Keychain/Keystore).
- **Data Model:** Draft initial `messages`, `obligations`, `channels`, and `user_profiles` schemas.

### 1.4 Silent Cloud Backup (Zero-Knowledge)
- **Logic:** Implement version-vector checks to avoid redundant uploads; 30s execution limit handling.
- **Harden Sync:** Implement **Silent Push Notifications (FCM/APNs)** to reliably wake the app for zero-knowledge backup, bypassing unreliable OS fetch heuristics.
- **Storage Silo:** Configure dedicated `/Chatnalyxer_Backups` directory in user's personal Google Drive/iCloud.

---

## Phase 2 — High-Throughput Multichannel Ingestion
**Goal:** Ingest thousands of messages per second with absolute order guarantees.

### 2.1 Ingestion Gateways
- **WhatsApp (Sandbox):** Baileys session manager with paired-terminal QR endpoints.
- **WhatsApp (Prod):** Webhook receiver with cryptographic signature validation.
- **Email:** IMAP poller + Microsoft Graph API integration using UID incremental sync.
- **Attachments:** Implement binary extraction for PDFs and Images (`application/pdf`, `image/*`).

### 2.2 RabbitMQ Sharding (The Hash Exchange)
- Configure `RabbitMQ Hash Exchange`.
- **Routing:** Use `user_id` as routing key to guarantee per-user message ordering.
- **Reliability:** Setup **Quorum Queues** for high availability.
- **Dead Lettering:** Implement DLQ routing for malformed payloads or schema errors.

### 2.3 CloudEvents Normalizer
- Build the schema-validation layer for `NormalizedMessage` (CloudEvent spec).
- **Idempotency:** Add `message_fingerprint` to prevent double-processing.

---

## Phase 3 — Vault Sync & CRDT Conflict Resolution
**Goal:** Perfect consistency across Mobile and Desktop with offline-first support.

### 3.1 Pull/Push Engine
- Implement `lastPulledAt` cursor logic for incremental sync.
- **Batched Sync:** Group local mutations into JSON change-sets.

### 3.2 Conflict Resolution (CRDT)
- Implement logical clocks (Hybrid Logical Clocks).
- **Field-Level Merging:** Title vs Date collisions resolved via field-specific timestamps.
- **Conflict Hub:** Surface UI cards for non-deterministic collisions (Human-in-the-loop).

### 3.3 Safety Net & Remote Wipe
- **Undo Buffer:** Implement 5-second `Redis` delay before committing deletions.
- **Trash Logic:** Set 30-day logic-retention flag (`is_deleted` + `deleted_at`).
- **Killswitch:** Implement remote trigger to wipe local PBKDF2 salt/keys.

---

## Phase 4 — The Multilingual Brain (The Sieve)
**Goal:** Tiered AI extraction that learns user preferences.

### 4.1 The AI Sieve (3-Tier)
- **Level 0 (PII/Noise):** High-speed Multilingual Regex engine + PII Redaction filter.
- **Level 1 (Scorer):** Categorization via `Grok-Fast` (Low latency).
- **Level 2 (Extractor):** Detailed JSON schema extraction via `Gemini Pro`.
- **Vision:** Attachment analysis using `Gemini 2.0 Flash` (Multimodal).

### 4.2 Message Sessionization
- **Debounce Window:** 45-second silence-based aggregator in `Redis`.
- **Proactive Trigger:** Override 45s window if terminal punctuation (`?`, `!`) is detected.

### 4.3 Multilingual Feedback Loop
- **Prompt Enrichment:** Dynamically inject historical "Yes/No" context into AI system prompts (RAG pattern).
- **Cross-lingual Normalization:** Natively multilingual embedding lookup (no translation-to-English required).
- **Judge Mechanism:** Implement **LLM-as-a-judge Evaluator** to periodically audit scoring decisions against a static rubric to prevent In-Context Reward Hacking (ICRH).
- **Prompt Shield:** Implement **LLM-Guard / Prompt Shielding** in the Sieve to prevent "Instruction Injection" attacks from malicious chat messages.
- **Edit Learning:** Capture manual user edits to task cards as "High-Priority" training signals, feeding back into the Personalization Vector Store.

---

## Phase 5 — State Machine & Event Lifecycle
**Goal:** Automated management of obligations through time.

### 5.1 The 4-Stage State Machine
- **Proposed:** Initial AI output awaiting human triage.
- **Active:** Confirmed task with active calendar integration.
- **Expired:** Auto-transition when `end_time` is reached.
- **Archive:** Cleanup based on 30-day post-expiry policy.

### 5.2 Chronobiological Scheduling
- Implement RabbitMQ delayed exchanges for TTL triggers.
- **Notification Triggers:** Dispatch re-engagement push if `Proposed` item is < 60m from start.
- **Post-Event Loop:** Dispatch "Did you complete this?" notification 30m after end-time.

---

## Phase 6 — UX Polish & Native Monetization
**Goal:** An "Instagram-snappy" experience with non-intrusive revenue.

### 6.1 Interaction Physics
- **Transitions:** Hero card expansions (0.3s cubic-bezier).
- **Privacy Peeking:** Global toggle to blur sensitive cards.
- **Grayscale Mode:** Auto-desaturate UI when network connectivity is lost.

### 6.2 Native Ad Engine
- **Kinetic Parity:** Support Swipe-to-Dismiss on ad cards for negative feedback loop.
- **Ad Cadence:** Enforce injection of the first native ad only after the **3rd or 4th** organic item.
- **Layout Robustness:** Mandate `flex-wrap` CSS wrappers for all ad components to prevent text overflow at high accessibility zoom levels.
- **Transparency:** Add FTC-mandated "Sponsored" badges with proper contrast.

---

## Phase 7 — Quota Management & Reliability
**Goal:** Multi-tenant resource policing and chaos hardening.

### 7.1 Tiered Resource Allocation
- **Free Tier:** 2 Group / 1 Email / 21 RPD limits.
- **Pro/Max:** Unlimited channels / High priority shards / dedicated Workers.
- **Token Bucket:** Implement global and per-user rate limiting in `Redis`.

### 7.2 Chaos & Resilience
- **Chaos Engineering:** Automated worker SIGTERM testing.
- **DLP Gate:** Content size/MIME filtering at the API Gateway.
- **Tenant Isolation:** Explicitly inject `tenant_id` into **JWT Claims** to enforce mandatory context for PostgreSQL RLS policies.
- **Observability:** OpenTelemetry (OTel) traces for all AI inference steps.

---

## Phase 8 — Global Scale & Production
**Goal:** Launch the official high-capacity engine.
- **Stripe Integration:** Full subscription lifecycle (Webhooks, Portal, Seat management).
- **De-boarding Logic:** Implement "Right to be Forgotten" workflow; revoke all OAuth tokens (WA/MS/Google); purge Vector Memory and Cloud Backup blobs on account deletion.
- **Feedback & Reviews:** Build in-app "Rating Request" logic and a redacted "Bug Report" tool that strips PII before sending logs to engineers.
- **WhatsApp Cutover:** Official API migration with signature verification.
- **Analytics:** Privacy-preserving usage metrics (Anonymized event counts).

---

## Phase 9: Edge AI & Predictive Contextualization (V2.0)
**Goal:** Localized intelligence with zero latency.
- Integrate SLMs (like Gemma 3 1B) directly into mobile clients using 4-bit integer channel-wise quantization.
- Deploy an on-device vector database (e.g., ObjectBox) to store semantic embeddings locally.
- Create a background thread to generate predictive completions and task suggestions in real-time as the user types.

## Phase 10: Cryptographic Semantic Deduplication (V2.0)
**Goal:** Cross-channel task merging without data leakage.
- Implement the **DA-PSI protocol** to enable local SQLCipher vaults to compare incoming Email and WhatsApp embeddings securely.
- Set a semantic distance threshold that automatically merges incoming obligations if they fall within proximity limits.

## Phase 11: Chronobiological UI Adaptation (V2.0)
**Goal:** UI that synchronizes with the user's energy levels.
- Build a local tracking algorithm to categorize user chronotype (morning lark vs. night owl) based on interaction timestamps.
- Integrate dynamic feed-sorting logic that desaturates high-cognitive-load tasks during predicted afternoon energy dips.

## Phase 12: Utility-Driven Native Monetization (V2.0)
**Goal:** Monetization as a service.
- Bind ad delivery API to specific task metadata (e.g., surfacing a sponsored florist only when a "Gift" or "Anniversary" obligation is extracted).
- Ensure the advertisement acts as an immediate utility rather than a distraction.

## Phase 13: Decentralized Multi-User Consensus (V2.0)
**Goal:** Private group collaboration.
- Deploy a privacy-preserving maximum consensus algorithm for shared group tasks.
- Utilize virtual dummy nodes and in-context **zk-SNARK proofs** to cross-validate shared obligations without the central server viewing raw text.
