# Chatnalyxer v1 — Phase-wise Plan
_8 phases, Sh_R_Mail style. Acceptance criteria are hard gates._

## Phase 1 — Foundations
**Tasks**
- Scaffold monorepo (turbo/nx) with `apps` and `packages/design-system` (Tokens, shared components).
- Set up Design System: **Midnight (`#050505`) & Snow (`#FFFFFF`)** themes; `Outfit` (Headings) + `Inter` (Body) typography; and the `8px` spacing grid.
- Integrate ThemeProvider for **Automatic System Theme Syncing** (0.3s fade transition).
- Set up CI (GH Actions): lint, typecheck, unit, contract stubs; pre-commit with lint+format.
- Secrets management: SOPS/Doppler, baseline `.env.example`, bootstrap instructions.
- Provision Postgres with RLS; connection pool sets `app.current_tenant` per request; migration baseline.
- Mobile vault skeleton: WatermelonDB + SQLCipher wiring; local encrypt/decrypt smoke test.
- OpenAPI generation from FastAPI → shared TS client package; publish as workspace dependency.
**Accept**: Fresh clone passes CI; RLS denies cross-tenant access; RN can persist+read encrypted row; generated client builds.

## Phase 2 — Ingestion
**Tasks**
- Implement Baileys session manager (QR/pairing endpoints, per-user port map, health watchdog) **in isolated dev sandbox**.
- Add WhatsApp Cloud API webhook endpoint with signature verification; config for phone number ID/token; content never persisted raw.
- Build IMAP/Graph poller (UID incremental sync, folder allowlist, retry/backoff; no raw disk persistence).
- **Architecture Scaling:** Implement RabbitMQ **Hash Exchange** based on `user_id` for worker sharding and local state performance.
- CloudEvents normalizer module; schema validation; **Support for binary attachments (PDF/Images)**; publish to RabbitMQ; DLQ/Retry exchange plumbing.
- Health endpoints & dashboards for ingestion components.
**Accept**: WA and email test messages appear on SQS as `chat.message.received`; forced bad payload lands in DLQ; ingestion health endpoints green; Baileys traffic tagged dev-only.

## Phase 3 — Vault & Sync
**Tasks**
- Implement pull/push (lastPulledAt), offline queue with priorities/TTL, **version vectors + field-level merge** (no silent client-wins); conflict UI hook.
- Deletion/Restoration logic: Swipe-to-trash with **5s "Undo" safety net** (toast).
- Implement 30-day **Trash retention** and silent restoration logic (quiet toast, no push).
- Remote wipe signal + device key rotation path; keystore integration.
- Redis watchdog for session state; attachment LRU eviction on device; hot/cold storage tiers.
- Sync resilience: exponential backoff, retry caps, telemetry for failures; revalidate obligations on reconnect before apply.
**Accept**: Offline edits sync cleanly; conflict test surfaces prompt and merges correctly; remote wipe nukes vault key/data; attachment cache evicts by size/age; priority queue flush respects TTL.

## Phase 4 — Redaction & AI
**Tasks**
- **Multi-Tier Filtering (The Sieve):** Implement Level 0 (Regex Engine with Multilingual support) -> Level 1 (Grok-Fast Scorer) -> Level 2 (Gemini Pro Extraction).
- **Message Sessionization (Silence-based):** Implement a **45-second "Debounced" aggregation window**. The system waits for silence before processing, ensuring that whether a user sends 2 messages or 20, they are bundled correctly when the thought is finished.
- **Proactive Trigger:** Instantly trigger extraction if a message contains terminal punctuation (e.g., "?") to reduce perceived latency.
- **Multimodal & Multilingual Brain:** Integrate Gemini 2.0 Flash (Vision) for PDF/Image extraction and cross-lingual task normalization.
- Implement **Privacy-First Vector Memory (pgvector)** to store user decision patterns and event fingerprints.
- Wire Azure DI OCR via **RabbitMQ async queue**; pre-filter MIME/size/pages; reject >15MB; user “processing” status.
- Store sanitized embeddings always; inference-time toggle for usage; TTL/eviction policy.
**Accept**: PII tokenized with differing tokens per request; Gemini returns schema-valid JSON; low-confidence routed to confirm; sample PDF returns OCR text via async queue; embeddings stored and retrievable; map auto-destroyed within SLA.

## Phase 5 — State Machine & Scheduling
**Tasks**
- Implement obligation lifecycle with audit trail; idempotent transitions; per-user event ordering key.
- **Learning Loop Engine:** Update "User Preference Profile" based on Swipe-Left/Right and manual edits; incorporate profile into AI system prompts.
- **Cross-Channel Deduplication:** Implement **Semantic Fingerprinting** using pgvector to detect and merge overlaps between WhatsApp and Email.
- Refined States: **Proposed <-> Deleted <-> Restored**; silent notification on restore/undo.
- Link `chat.message.updated/deleted` to reschedule/cancel flows; dedupe: time-window + participant hash + embedding similarity.
- Calendar adapters (Google/MS): OAuth, conflict rules (buffers, working hours, no double-book), retries/backoff; alarms/notifications matrix.
- Time-zone safety and daylight-shift handling; auto-propose alternates on conflict; user choice flow.
**Accept**: Chat/email creates Proposed; user confirm -> calendar event; edit -> reschedule respecting buffers; cancel -> delete event; audits recorded; dedupe prompt shown on similar items; TZ/conflict tests pass.

## Phase 6 — UX Delivery
**Tasks**
- Mobile: onboarding + QR/pairing, connect status, group/folder selector (**sticky search & sorting**), triage swipe.
- Implement **"Hero" Card Expansions** (cards expand to fill screen on tap) and **Privacy Peeking** toggle.
- Add **Grayscale Offline Mode**: UI desaturates when network is lost for intuitive feedback.
- Mobile: **Edit Bottom Sheet** for high-speed field correction.
- Web Hub: Connect Center, Privacy Console (scopes, what-left-device view), Audit timeline, DLQ/replay admin, feature flags view.
- Landing: waitlist form, pricing toggle, FAQ, privacy summary, analytics snippet (consent-aware).
**Accept**: End-to-end happy path on device (onboard→connect→select→confirm→calendar); sticky sorting and search work flawlessly; edits sync to calendar in background; Hub shows live status/audit; landing collects waitlist entries.

## Phase 7 — Reliability & Security
**Tasks**
- OTel traces/metrics/logs; dashboards for ingest latency, AI latency, calendar success, **RabbitMQ queue depth**, OCR queue age.
- WAF + Redis rate limits; DLP size/type gates; “tenant required” DB guard; JWT tenant to DB session check.
- Chaos drills: kill Baileys, drop IMAP, network partition; observe auto-recovery; **RabbitMQ management console** checks; idempotency validation.
- Backups/restore tested; key rotation runbook executed in staging; audit logs verified; deletion SLA checks.
**Accept**: Dashboards live; chaos tests auto-recover; DLQ replay clears backlog; backup-restore/key-rotation succeed; deletion SLA met; tenant guard rejects unset sessions.

## Phase 8 — Scale & Multichannel
**Tasks**
- Prod cutover to WhatsApp Cloud API; Baileys dev-only isolated infra; disable raw logging in prod.
- Performance tuning: queue sizing, autoscaling policies, connection pools, per-user ordering guarantees.
- Slack/Discord adapter interface reusing CloudEvents; adapter skeletons + contract tests.
- RAG usage toggle hardened; consent-gated monetization hooks behind feature flags; cost guardrails.
- Load test + cost/SLO review; ban-risk monitoring for WA numbers.
**Accept**: Load test (thousands concurrent webhooks) meets SLOs; Cloud API templates send acks; Slack/Discord adapter tests pass; monetization flag deploys cleanly; cost/SLO doc signed off; prod logs scrub content.
