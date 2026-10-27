# 🌟 DesignVerse Kids — Experience Points (XP) & Stars Engine

## 1. Principles
- **Server-Side Security:** Total XP and Level are computed by the backend ledger (`XPEngine`). Client-submitted XP values are rejected unless tied to verified lesson/challenge completion.
- **Append-Only Ledger:** Every XP award creates an event entry with `event_id`, `source`, `timestamp`, and `xp`.
- **Idempotency:** Re-submitting the same `event_id` returns current status without duplicating XP.
- **Non-Punitive:** Children never lose XP for mistakes. Mistakes trigger friendly hints.

## 2. XP Reward Values
- **Lesson Step:** +30 to +40 XP
- **Mini-Game Solve:** +25 to +40 XP
- **Spatial Challenge Complete:** +50 to +100 XP
- **Full Room Designed & Saved:** +60 XP
- **Graduation Dream Room Masterpiece:** +200 XP
- **Star Conversion:** 1 Golden Star `⭐` is awarded for every 10 XP earned.
