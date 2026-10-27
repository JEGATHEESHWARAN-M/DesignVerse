# DESIGNVERSE — DECISIONS LOG

_Conflicts between spec and reality, and how they were resolved._

---

## D-001: Flutter does not exist

**Conflict:** Learning Engine spec assumes an existing Flutter app.
**Reality:** The app is a Capacitor-wrapped web app (HTML/JS). No Flutter code exists.
**Decision:** Implement Learning Engine as:
  1. Backend (FastAPI) — full server-side logic, XP ledger, unlock manager
  2. Web UI layer — learning overlay in existing JS/CSS
  3. Flutter deferred — document architecture so Flutter can be added later without backend changes
**Why:** Least destructive. Existing web app + Android APK stays working. Backend API is Flutter-ready.

---

## D-002: Python 3.13 installed, not 3.11

**Conflict:** Spec says "use `py -3.11`".
**Reality:** Python 3.13 is installed (`py` launcher resolves to 3.13).
**Decision:** Use `py` (which is 3.13) for all commands. All code is compatible with both 3.11 and 3.13.
**Why:** Cannot install a different Python version without user action. 3.13 is a superset.

---

## D-003: No PostgreSQL database

**Conflict:** Spec requires persistent XP ledger and user progress in DB.
**Reality:** No database provisioned. No migrations run.
**Decision:** 
  - Phase 3-5: Use localStorage on client + in-memory on backend (development mode)
  - Phase 9: Add SQLite via `aiosqlite` (zero-install, file-based) as dev DB, migrate to PostgreSQL for production
**Why:** Unblocks UI/logic work immediately without requiring DB setup.

---

## D-004: No Unity project

**Conflict:** Spec references Unity learning components in-engine.
**Reality:** Only C# script files exist. No Unity Editor installation detected.
**Decision:** Unity C# learning scripts are authored and committed; Unity integration is deferred until Unity Editor is confirmed installed.
**Why:** Scripts are valid C# and can be imported when Unity is available.

---

## D-005: "Basic Mode / Pro Mode" prohibition

**Spec rule:** "No Basic/Pro toggle. The Learning Engine only gates and explains."
**Implementation:** All unlock checks are `feature_unlock.is_unlocked(user_id, feature_id)` server-side. UI shows a friendly lock message with "How to unlock" — never silently hides. Internal engine code is always intact.

---

## D-006: Existing users grandfathering

**Spec rule:** "Existing users must not lose functionality."
**Implementation:** Any user with no learning profile is assigned a virtual Level 10 (all unlocked) until they opt into the learning journey via the Placement Check. This is handled in `FeatureUnlockManager.get_effective_level()`.
