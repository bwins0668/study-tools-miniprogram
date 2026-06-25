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
