# Spaced Repetition Foundation v1

## Scope

This module provides an isolated, testable Foundation for future spaced-repetition UI work. It is intentionally **not imported by `app.js`, pages, package page scripts, routes, or tabBar** in v0.28.0. No current flashcard, quiz, glossary, Anki, home, profile, backup, or restore experience is changed by this Foundation.

Runtime source is limited to `utils/spaced-repetition/`. Node-only inspection and test tooling is limited to `tools/`.

## Stable memory identity

Every review item has a stable `memoryItemId` that can be recalculated from its source reference and never depends on list order or array index:

- term: `sr:v1:term:<encoded termId>`
- Anki: `sr:v1:anki:<encoded cardId>`
- exam: `sr:v1:exam:<course>:<encoded deckId>:<encoded questionId>`

The source prefix prevents collisions between term, Anki, IT Passport, and SG cards even where their raw source IDs match. Exam identities include both course and deck because a legacy raw question ID alone is not globally unique.

`tools/audit_spaced_repetition_identity.js` reads the current real glossary, Anki source contract, and playable exam cards. It reports `term`, `anki`, `itpass playable`, `sg playable`, `total playable`, and cross-source `collision` without hardcoding historic counts.

## State machine and scheduling

Item states:

- `NEW`
- `LEARNING`
- `REVIEW`
- `RELEARNING`
- `SUSPENDED`

Grades:

- `AGAIN`
- `HARD`
- `GOOD`
- `EASY`

The deterministic v1 schedule uses a 10-minute learning/relearning delay and review stages of 1, 3, 7, 15, 30, 60, 120, and 240 days. The scheduler receives `now` explicitly so tests are repeatable. `SUSPENDED` items have no due time and are never returned by a normal due queue.

## Eligibility and events

Two independent eligibility contracts exist:

1. Event eligibility decides whether a user activity may create or update a review item.
2. Item eligibility returns one of `LEARNABLE`, `NOT_DUE`, `SUSPENDED`, `INVALID_CARD`, or `MISSING_STABLE_ID` for future UI use.

Events record stable item identity, action, grade, timestamp, and serializable metadata. Replaying the same `eventId` is idempotent. State retains bounded review logs, processed event IDs, review counts, recent review time, next due time, interval, and scheduling counters.

## Independent storage, migration, backup, and restore

Foundation storage uses only these namespaced keys:

- `study_tools_spaced_repetition_v1`
- `study_tools_spaced_repetition_summary_v1`
- `study_tools_spaced_repetition_v1_quarantine`

It does not call or modify `utils/storage.js`, existing storage keys, existing backup structures, or `schemaVersion` values outside its own namespace.

Migration safely handles missing state, invalid JSON, malformed fields, duplicate items, and unsupported schema versions. Invalid raw state is quarantined rather than replacing usable current Foundation data.

Known v1 fields are normalized. JSON-serializable unknown fields at the Foundation root, item, `sourceRef`, daily record, and review-event levels are retained, while unsafe prototype keys are ignored.

Exports are isolated as:

```json
{ "spacedRepetition": { "schemaVersion": 1 } }
```

Restore validates the imported Foundation payload before writing. It merges only the Foundation namespace: distinct items and event IDs are unioned; colliding item records choose known schedule fields deterministically by latest `updatedAt` with a stable tie-break; unknown fields from both sides are retained; daily counts use a non-duplicating maximum; summary is regenerated. Repeating the same restore is idempotent and unrelated module storage is untouched.

## Summary and performance

`summary.js` derives a compact object with due count, overdue count, today’s completed/new counts, streak, and due counts by module. It never embeds complete items or review logs. Incremental summary updates avoid scanning all items for a single event.

## Boundary contract

Runtime Foundation modules must not import package loaders, full glossary data, translations, flashcard bridges, page instances, `EventChannel`, `getApp().globalData`, `wx.loadSubPackage`, current storage wrappers, network APIs, background timers, or Node-only modules such as `fs`, `path`, and `child_process`.

Route helpers only construct and validate review locators; they never load card content or navigate pages.

## Verification

The only Foundation entry point is:

```powershell
npm run test:spaced-foundation
```

It runs real-data identity audit, unit tests for identity/scheduler/storage/migration/backup restore/events/summary/eligibility/routes, package-boundary audit, performance audit, and Foundation contract check. Generated local reports remain under the already ignored `tools/test-artifacts/` directory.

---

## Lifecycle Contract (R2d–R3)

### Review Center

| Aspect | Contract |
|--------|----------|
| Due detection | `getTodayReviewSummary()` scans all items in SR state, filters by `isDue(item, now)`, groups by `sourceRef.course` → `sourceRef.deckId` |
| Recovery detection | On `onShow`, calls `getReviewSession()`. If session exists and `!completedAt`, shows recovery card with `course`, `deckId`, progress (`completedItemIds.length / itemIds.length`) |
| Empty state | Shown when `dueCount === 0` AND no recovery session. Shows next review time if available |
| Recovery card — valid | Shows "继续复习" button → navigates to player with `mode=due&reviewSessionId=<id>` |
| Recovery card — expired | Shows "清除已过期会话" button → calls `clearReviewSession()` then refreshes |
| Recovery card — completed | Not shown (session has `completedAt` set) |

### Due Session

| Aspect | Contract |
|--------|----------|
| Creation | `createReviewSession(course, deckId, itemIds, backPath)` writes to `SESSION_KEY` in wx storage |
| Entry | Player loads deck normally, then applies due filter: `identity.createExamIdentity(course, yearId, card.id)` → match against `session.itemIds` |
| Page data sync | After due filter, `setData` writes: `cards`, `currentCard`, `totalCards`, `playableCountActual`, `progressPercent`, `dueMode=true`, `reviewSessionId` |
| Completion | `completeReviewSessionItem(canonicalMemoryItemId)` pushes ID to `completedItemIds`. When all items done, sets `completedAt = Date.now()` |
| Finish detection | Player checks `currentIndex >= totalCards`; sets `isFinished=true` |
| Return flow | Player's `goBack()` calls `navigateBack()`. Due session returns to Review Center via `backPath` |

### Grade Routing

| Grade | State | Interval | Step | Counters |
|-------|-------|----------|------|----------|
| AGAIN | → RELEARNING | LEARNING_DELAY_MS (10min) | stepIndex − 1 (min −1) | lapses+1, wrongCount+1 |
| HARD (LEARNING/RELEARNING) | → LEARNING | HARD_LEARNING_DELAY_MS (5min) | stepIndex = −1 | hardCount+1 |
| HARD (REVIEW) | → REVIEW | `intervalAt(stepIndex)` (unchanged) | stepIndex unchanged (min 0) | hardCount+1 |
| GOOD (LEARNING/RELEARNING) | → REVIEW | `intervalAt(0)` = 1 day | stepIndex = 0 | correctCount+1 |
| GOOD (REVIEW) | → REVIEW | `intervalAt(stepIndex+1)` | stepIndex + 1 (cap 7) | correctCount+1 |
| EASY (LEARNING/RELEARNING) | → REVIEW | `intervalAt(1)` = 2 days | stepIndex = 1 | easyCount+1, correctCount+1 |
| EASY (REVIEW) | → REVIEW | `intervalAt(stepIndex+2)` | stepIndex + 2 (cap 7) | easyCount+1, correctCount+1 |

Interval table: `[1, 2, 4, 7, 15, 30, 60, 120]` days, indexed by `Math.min(7, max(0, stepIndex))`.

### Storage

| Key | Content |
|-----|---------|
| `study_tools_spaced_repetition_v1` | Full SR state: items map, daily, reviewLog, processedEventIds, schemaVersion |
| `study_tools_spaced_repetition_summary_v1` | Derived summary (dueCount, overdueCount, todayCompleted, streak, moduleDueCounts) |
| `study_tools_spaced_repetition_v1_quarantine` | Captured bad state that couldn't be migrated |
| `study_tools_review_session_v1` | Active review session (course, deckId, itemIds, completedItemIds, mode, TTL) |

**Rules:**
- Session is saved atomically via `setStorageSync`
- `recordReviewDecision` saves SR state + session independently
- No `clearStorage` or `clearStorageSync` is ever called
- Backup/restore only touches the 4 keys above
- Unknown keys are never touched by SR code

### Session Recovery

| Scenario | Behavior |
|----------|----------|
| Cold start with valid session | Player loads deck, reads `getReviewSession()`, applies due filter with `session.itemIds` |
| Cold start with expired session | Player reads session → `_expired=true` → sets `viewState='empty'` + returns early (no cards shown) |
| Cold start with completed session | `session.completedAt` set → not treated as recoverable |
| Cold start — no session | Due filter finds nothing (or session null) → normal mode |
| Interrupted session → Review Center | `getReviewSession()` returns session → recovery card shown |
| After completion → Review Center | `getReviewSession()` returns session with `completedAt` → no recovery card |

### Expiration

| Property | Value |
|----------|-------|
| Session TTL | 2 hours (`SESSION_TTL_MS = 2 * 60 * 60 * 1000`) |
| Clock | Uses `Date.now()` (device local time) |
| Detection | `getReviewSession()` compares `now > session.expiresAt`; sets `_expired=true` on returned object |
| Expired state display | Player shows "viewState: empty, isEmpty: true" with no cards |
| Storage cleanup | Not automatic; done via `clearReviewSession()` on user action or new session creation |

### Isolation

| Boundary | Rule |
|----------|------|
| Deck A → Deck B | Session is scoped to single `course + deckId`. Different decks get different sessions |
| Player A → Player B | Player only loads cards from its own subpackage data. Due filter only affects loaded cards |
| SR → Normal flashcard | All due-mode code is inside `if (this._isDueMode)` guard. Normal path unchanged |
| Session → Other deck | `createReviewSession` creates session for one `deckId`. `completeReviewSessionItem` only checks that session |
| Cross-package import | Gate `check_spaced_repetition_foundation.js` blocks `require()` of private/internal SR modules from pages |

### Invariants (must never break)

1. One session → one player → one deck
2. One grade action never writes to a different deck or player
3. Completed session (`completedAt` set) is never treated as active
4. Expired session is never rendered as valid due content
5. Corrupted/empty session data never crashes the page (try/catch guards)
6. Normal flashcard behavior never changes due to SR state
7. Same card is never duplicated in one session (itemIds are unique per session)
8. Grade is persisted before card advances (sequential, no async race)

### Known Constraints

- No FSRS or machine-learned parameters; deterministic step-based intervals
- Time is device-local; no timezone normalization
- No server-side sync or cross-device state merging
- Daily streak counts consecutive calendar days of completed reviews
- Review log is bounded at 5000 entries; older entries trimmed
- Intervals cap at 120 days
- Session TTL is fixed at 2 hours; not configurable per-user
- No push notifications or background reminders
