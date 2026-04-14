# Chatnalyxer v1 — Architecture

## Purpose & Scope
Local-first, privacy-focused obligation engine that ingests WhatsApp and Email, extracts obligations with AI, and schedules them to external calendars without exposing raw content to the cloud.

## Goals
- Channels: WhatsApp (Baileys dev, Cloud API prod), Email (IMAP/Graph).
- Local-first: full content stays on device (SQLCipher vault); cloud sees redacted envelopes unless consented.
- AI: Gemini 2.0 Flash (structured JSON), Azure Document Intelligence OCR; RAG-ready embeddings of sanitized text.
- Outputs: calendar events (Google/Microsoft), notifications/alarms, audit trail.

## High-Level Topology
```mermaid
graph TD
  subgraph Clients
    RN[React Native Mobile]
    HUB[Next.js Web Hub]
    LAND[Landing]
  end
  subgraph Edge
    WAF[WAF]
    APIGW[API Gateway]
    REDIS[Redis: rate limits / sessions]
  end
  subgraph Ingestion
    WA_DEV[Baileys Session Manager]
    WA_PROD[Cloud API Webhook]
    MAIL[IMAP/Graph Poller]
    EVBUS[SQS + DLQ]
  end
  subgraph AI
    REDACT[Redaction Proxy]
    GEM[Gemini 2.0 Flash]
    OCR[Azure Document Intelligence]
  end
  subgraph Core (FastAPI, clean arch)
    GATE[Gateway/API]
    STATE[Obligation Engine]
    SCHED[Scheduler]
    NOTIF[Notification Service]
    PG[(Postgres + RLS)]
    S3[(S3 encrypted)]
    KMS[KMS]
  end
  subgraph External
    GCAL[Google Calendar]
    MSCAL[Microsoft Graph Calendar]
  end

  RN <--> APIGW
  HUB <--> APIGW
  APIGW --- REDIS
  APIGW --> GATE
  WA_DEV --> EVBUS
  WA_PROD --> EVBUS
  MAIL --> EVBUS
  EVBUS --> REDACT --> GEM
  REDACT --> OCR
  REDACT --> STATE
  STATE --> SCHED --> GCAL
  STATE --> SCHED --> MSCAL
  STATE --> NOTIF
  GATE <--> PG
  STATE <--> PG
  STATE --> S3
  PG --- KMS
```

## Component Responsibilities
- **Mobile (RN)**: Local encrypted vault (SQLCipher/WatermelonDB), offline triage, push/pull sync, QR/pairing UI.
- **Web Hub (Next.js)**: Connect center, privacy console, audit timeline, admin (DLQ replay).
- **Ingestion**: Baileys multi-session for dev; Cloud API webhook for prod; IMAP/Graph poller for email; normalize to CloudEvents and push to SQS.
- **Redaction Proxy**: Presidio + regex + LLM-Guard; deterministic tokenization; ephemeral token map encrypted with tenant KMS key.
- **AI Service**: Gemini with structured outputs; Azure DI for PDFs/images; emits obligations and evidence spans.
- **Obligation/State Engine**: State machine (Detected → Proposed → Confirmed → Scheduled → Rescheduled → Canceled); versioned analyses; dedupe across channels.
- **Scheduler**: Google/Microsoft adapters; conflict checks; time-zone safe; reschedule/cancel hooks.
- **Notification**: SES email, WA acks (templates), push (Expo/Firebase), in-app toasts.
- **Data Stores**: Postgres with RLS per user; Redis for limits/locks; S3 for consented blobs; local vault on device.
- **Observability**: OTel traces/metrics/logs → CloudWatch/X-Ray; dashboards for ingest latency, AI latency, calendar success, DLQ depth.

## Data Model (server)
| Table | Key Columns | Notes |
| --- | --- | --- |
| users | id (uuid), email, kms_key_id, settings | root; RLS by id |
| channels | id, user_id, provider (wa/email), auth_token_enc | per-tenant tokens |
| conversations | id, channel_id, external_thread_id, participant_hash | |
| messages | id, conversation_id, external_msg_id, content_enc, ts | redacted or empty; envelope only |
| obligations | id, conversation_id, title, start_time, end_time, state, confidence, source_fingerprint, analysis_version | lifecycle entity |
| schedules | id, obligation_id, external_event_id, provider, tz | calendar linkage |
| attachments | id, message_id, s3_url_enc, mime, size | only if consented |
| audits | id, user_id, action, actor, reason, ts | all state transitions |

RLS policy example: `USING (user_id = current_setting('app.current_tenant')::uuid)` on every user-scoped table.

## Event Contracts (CloudEvents v1.0)
- `chat.message.received`: `{message_id, thread_id, channel, sender_hash, ts, raw_text?, attachments[]}`
- `chat.message.updated`: `{message_id, thread_id, prev_text?, new_text, ts}`
- `chat.message.deleted`: `{message_id, thread_id, ts}`
- `channel.group.sync`: `{user_id, groups:[{whatsapp_id|folder_id, name, is_active}]}`
- `ai.analysis.requested`: `{payload_id, anonymized_text, context[], schema_version}`
- `obligation.created|updated`: `{obligation_id, delta, state, reason}`
- `calendar.schedule.changed`: `{obligation_id, provider, external_event_id, new_start, status}`

## API Surface (FastAPI)
- WhatsApp: `/whatsapp connect|status|qr|pairing|disconnect|sync-groups`
- Email: `/email connect|status|folders|sync`
- Groups: `/groups list|selection`
- Obligations: `/obligations`, `/obligations/{id}`
- Notifications: `/notifications/preferences`
- Audit: `/audit`
- Auth handled upstream (Cognito/Clerk) → JWT → app.current_tenant set in DB pool.

## Security & Privacy
- Default redacted-only to cloud; full text/attachments require explicit per-channel consent.
- Per-tenant KMS keys; column encryption for tokens; S3 SSE-KMS; device keystore for vault key; remote wipe supported.
- WAF + Redis rate limits; DLP size/type gates; secret scanning + SAST/DAST in CI.

## Performance Targets
- Ingest → analysis: P50 < 4s, P95 < 8s (redacted path).
- Calendar write success > 99%; retries with backoff.
- Attachment OCR limit: 15 MB; overflow rejected with user notice.
- Offline tolerance: 72h queued ops without loss.

## Observability & Reliability
- OTel everywhere; dashboards: ingest latency, AI latency, calendar success, DLQ depth.
- SQS DLQ + replay tool; session watchdog (Baileys); email poller heartbeat.
- Chaos drills: kill WA session, drop IMAP, network partition; verify recovery.

## Rollout
- Alpha: Baileys-only, internal testers, mock calendars allowed.
- Beta: Email + calendar writes, redacted-by-default, cohort waitlist.
- Prod: Cloud API primary; Baileys dev-only; tighten WAF/rate limits; start Slack/Discord adapters; consent-gated monetization hooks.
```
