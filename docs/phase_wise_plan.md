# Chatnalyxer v1 — Phase-wise Plan
_8 phases, Sh_R_Mail style. Acceptance criteria are hard gates._

## Phase 1 — Foundations
**Tasks**
- Scaffold monorepo (turbo/nx), workspace packages, root scripts (`dev`, `test`, `lint`, `format`).
- Set up CI (GH Actions): lint, typecheck, unit, contract stubs; pre-commit with lint+format.
- Secrets management: SOPS/Doppler, baseline `.env.example`, bootstrap instructions.
- Provision Postgres with RLS; connection pool sets `app.current_tenant` per request; migration baseline.
- Mobile vault skeleton: WatermelonDB + SQLCipher wiring; local encrypt/decrypt smoke test.
- OpenAPI generation from FastAPI → shared TS client package; publish as workspace dependency.
**Accept**: Fresh clone passes CI; RLS denies cross-tenant access; RN can persist+read encrypted row; generated client builds.

## Phase 2 — Ingestion
**Tasks**
- Implement Baileys session manager (QR/pairing endpoints, per-user port map, health watchdog).
- Add WhatsApp Cloud API webhook endpoint with signature verification stub; config for phone number ID/token.
- Build IMAP/Graph poller (UID incremental sync, folder allowlist, retry/backoff).
- CloudEvents normalizer module; schema validation; publish to SQS; DLQ plumbing.
- Health endpoints & dashboards for ingestion components.
**Accept**: WA and email test messages appear on SQS as `chat.message.received`; forced bad payload lands in DLQ; ingestion health endpoints green.

## Phase 3 — Vault & Sync
**Tasks**
- Implement pull/push (lastPulledAt), offline queue, client-wins conflict policy.
- Remote wipe signal + device key rotation path; keystore integration.
- Redis watchdog for session state; attachment LRU eviction on device.
- Sync resilience: exponential backoff, retry caps, telemetry for failures.
**Accept**: Offline edits sync cleanly after reconnect; conflict test shows client edit prevails; remote wipe nukes vault key and data; attachment cache evicts by size/age.

## Phase 4 — Redaction & AI
**Tasks**
- Deploy gatekeeper proxy (Presidio + regex + LLM-Guard); deterministic tokenization; KMS-encrypted token map.
- Integrate Gemini 2.0 Flash with Pydantic output schema; error handling + retries.
- Wire Azure DI OCR; reject >15MB; fallback handling.
- Store sanitized embeddings (toggle-able RAG); index lifecycle (TTL/eviction).
**Accept**: PII tokenized before exit; Gemini returns schema-valid JSON on fixtures; de-tokenization restores values; sample PDF returns OCR text; RAG toggle stores/retrieves embedding.

## Phase 5 — State Machine & Scheduling
**Tasks**
- Implement obligation lifecycle with audit trail; idempotent transitions.
- Link `chat.message.updated/deleted` to reschedule/cancel flows.
- Calendar adapters (Google/MS): OAuth, conflict checks, retries/backoff; alarms/notifications matrix.
- Time-zone safety and daylight-shift handling; buffer rules.
**Accept**: Chat/email creates Proposed; user confirm -> calendar event; edit -> reschedule; cancel -> delete event; audits recorded; TZ tests pass.

## Phase 6 — UX Delivery
**Tasks**
- Mobile: onboarding + QR/pairing, connect status, group/folder selector (search/bulk/inactive badge/last-seen), triage swipe, offline banners, privacy settings, notifications prefs.
- Web Hub: Connect Center, Privacy Console (scopes, what-left-device view), Audit timeline, DLQ/replay admin, feature flags view.
- Landing: waitlist form, pricing toggle, FAQ, privacy summary, analytics snippet (consent-aware).
**Accept**: End-to-end happy path on device (onboard→connect→select→confirm→calendar); Hub shows live status/audit; landing collects waitlist entries.

## Phase 7 — Reliability & Security
**Tasks**
- OTel traces/metrics/logs; dashboards for ingest latency, AI latency, calendar success, DLQ depth.
- WAF + Redis rate limits; DLP size/type gates.
- Chaos drills: kill Baileys, drop IMAP, network partition; observe auto-recovery; DLQ replay CLI/tool.
- Backups/restore tested; key rotation runbook executed in staging.
**Accept**: Dashboards live; chaos tests auto-recover; DLQ replay clears backlog; backup-restore and key-rotation succeed in staging.

## Phase 8 — Scale & Multichannel
**Tasks**
- Prod cutover to WhatsApp Cloud API; Baileys dev-only.
- Performance tuning: queue sizing, autoscaling policies, connection pools.
- Slack/Discord adapter interface reusing CloudEvents; adapter skeletons + contract tests.
- RAG-store toggle hardened; consent-gated monetization hooks behind feature flags.
- Load test + cost/SLO review.
**Accept**: Load test (thousands concurrent webhooks) meets SLOs; Cloud API templates send acks; Slack/Discord adapter tests pass; monetization flag deploys cleanly; cost/SLO doc signed off.
