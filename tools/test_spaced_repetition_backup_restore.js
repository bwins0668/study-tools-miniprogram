'use strict';

var helpers = require('./spaced_repetition_test_helpers');
var constants = require('../utils/spaced-repetition/constants');
var identity = require('../utils/spaced-repetition/identity');
var schema = require('../utils/spaced-repetition/schema');
var storage = require('../utils/spaced-repetition/storage');

function makeReviewItem(memoryIdentity, now, options) {
  options = options || {};
  var item = schema.createMemoryItem(memoryIdentity, now);
  item.state = constants.STATES.REVIEW;
  item.dueAt = now - 1;
  item.updatedAt = options.updatedAt || now;
  item.priority = options.priority || 0;
  return item;
}

helpers.run('test_spaced_repetition_backup_restore', function () {
  var now = 1700000000000;
  var sharedIdentity = identity.createExamIdentity('sg', 'sg-2024', 'q-9');
  var currentOnlyIdentity = identity.createTermIdentity('current-only');
  var importedOnlyIdentity = identity.createAnkiIdentity('imported-only');

  var currentState = schema.createEmptyState(now);
  currentState.updatedAt = now + 100;
  currentState.currentRoot = { keep: true };
  currentState.items[sharedIdentity.memoryItemId] = makeReviewItem(sharedIdentity, now, { updatedAt: now + 100, priority: 1 });
  currentState.items[sharedIdentity.memoryItemId].currentOnlyField = { keep: true };
  currentState.items[sharedIdentity.memoryItemId].sourceRef.currentLocator = 'keep';
  currentState.items[currentOnlyIdentity.memoryItemId] = makeReviewItem(currentOnlyIdentity, now, { updatedAt: now + 100, priority: 2 });
  currentState.daily['2023-11-15'] = { completed: 3, newCount: 1, updatedAt: now + 100, currentDaily: 'keep' };
  currentState.reviewLog = [{
    eventId: 'current-event',
    memoryItemId: sharedIdentity.memoryItemId,
    sourceType: 'exam',
    action: 'SELF_GRADED',
    grade: 'GOOD',
    occurredAt: now,
    currentEvent: 'keep'
  }];

  var importedState = schema.createEmptyState(now);
  importedState.updatedAt = now + 200;
  importedState.importedRoot = { keep: true };
  importedState.items[sharedIdentity.memoryItemId] = makeReviewItem(sharedIdentity, now, { updatedAt: now + 200, priority: 9 });
  importedState.items[sharedIdentity.memoryItemId].importedOnlyField = { keep: true };
  importedState.items[sharedIdentity.memoryItemId].sourceRef.importedLocator = 'keep';
  importedState.items[importedOnlyIdentity.memoryItemId] = makeReviewItem(importedOnlyIdentity, now, { updatedAt: now + 200, priority: 3 });
  importedState.daily['2023-11-15'] = { completed: 2, newCount: 4, updatedAt: now + 200, importedDaily: 'keep' };
  importedState.reviewLog = [{
    eventId: 'imported-event',
    memoryItemId: sharedIdentity.memoryItemId,
    sourceType: 'exam',
    action: 'SELF_GRADED',
    grade: 'EASY',
    occurredAt: now + 1,
    importedEvent: 'keep'
  }];

  var exported = storage.exportSpacedRepetitionState(importedState, now, 540);
  helpers.assert(exported.spacedRepetition, 'FIXED_BACKUP_FIELD');
  helpers.equal(Object.keys(exported).length, 1, 'EXPORT_ONLY_CONTAINS_SPACED_REPETITION');

  var adapter = storage.createMemoryStorageAdapter({
    unrelated: { mustRemain: true },
    [constants.STORAGE_KEY]: currentState
  });
  var restored = storage.restoreSpacedRepetitionState(adapter, exported, now, 540);
  var snapshot = adapter.snapshot();
  helpers.equal(restored.restored, true, 'VALID_BACKUP_WRITTEN');
  helpers.assert(snapshot.unrelated.mustRemain, 'RESTORE_DOES_NOT_TOUCH_OTHER_MODULE_DATA');
  helpers.equal(Object.keys(restored.state.items).length, 3, 'RESTORE_MERGES_DISTINCT_ITEMS');
  helpers.equal(restored.state.items[sharedIdentity.memoryItemId].priority, 9, 'NEWER_KNOWN_ITEM_STATE_WINS');
  helpers.equal(restored.state.items[sharedIdentity.memoryItemId].currentOnlyField.keep, true, 'CURRENT_UNKNOWN_ITEM_FIELD_RETAINED');
  helpers.equal(restored.state.items[sharedIdentity.memoryItemId].importedOnlyField.keep, true, 'IMPORTED_UNKNOWN_ITEM_FIELD_RETAINED');
  helpers.equal(restored.state.items[sharedIdentity.memoryItemId].sourceRef.currentLocator, 'keep', 'CURRENT_UNKNOWN_SOURCE_REF_RETAINED');
  helpers.equal(restored.state.items[sharedIdentity.memoryItemId].sourceRef.importedLocator, 'keep', 'IMPORTED_UNKNOWN_SOURCE_REF_RETAINED');
  helpers.equal(restored.state.currentRoot.keep, true, 'CURRENT_UNKNOWN_ROOT_RETAINED');
  helpers.equal(restored.state.importedRoot.keep, true, 'IMPORTED_UNKNOWN_ROOT_RETAINED');
  helpers.equal(restored.state.daily['2023-11-15'].completed, 3, 'DAILY_COMPLETED_MERGES_WITHOUT_DOUBLE_COUNTING');
  helpers.equal(restored.state.daily['2023-11-15'].newCount, 4, 'DAILY_NEW_COUNT_MERGES_WITHOUT_DOUBLE_COUNTING');
  helpers.equal(restored.state.daily['2023-11-15'].currentDaily, 'keep', 'CURRENT_UNKNOWN_DAILY_RETAINED');
  helpers.equal(restored.state.daily['2023-11-15'].importedDaily, 'keep', 'IMPORTED_UNKNOWN_DAILY_RETAINED');
  helpers.equal(restored.state.reviewLog.length, 2, 'REVIEW_LOGS_MERGED_BY_EVENT_ID');
  helpers.assert(snapshot[constants.SUMMARY_KEY], 'RESTORE_SUMMARY_REGENERATED');

  var once = JSON.stringify(adapter.snapshot());
  var secondRestore = storage.restoreSpacedRepetitionState(adapter, exported, now, 540);
  helpers.equal(secondRestore.restored, true, 'SECOND_VALID_RESTORE_ACCEPTED');
  helpers.equal(JSON.stringify(adapter.snapshot()), once, 'DUPLICATE_RESTORE_IDEMPOTENT');

  var beforeBadVersion = adapter.snapshot();
  var badVersion = { spacedRepetition: { schemaVersion: 99, items: {} } };
  var badVersionResult = storage.validateImportedSpacedRepetitionState(badVersion, now, 540);
  helpers.equal(badVersionResult.valid, false, 'SCHEMA_VERSION_REJECTED_FOR_RESTORE');
  var rejected = storage.restoreSpacedRepetitionState(adapter, badVersion, now, 540);
  helpers.equal(rejected.restored, false, 'INVALID_SCHEMA_NOT_WRITTEN');
  helpers.equal(JSON.stringify(adapter.snapshot()), JSON.stringify(beforeBadVersion), 'INVALID_SCHEMA_PRESERVES_EXISTING_STATE');

  return { itemCount: Object.keys(restored.state.items).length, dueCount: restored.summary.dueCount };
});
