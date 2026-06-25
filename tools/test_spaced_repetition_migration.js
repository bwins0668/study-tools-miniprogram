'use strict';

var helpers = require('./spaced_repetition_test_helpers');
var identity = require('../utils/spaced-repetition/identity');
var schema = require('../utils/spaced-repetition/schema');
var migration = require('../utils/spaced-repetition/migration');

helpers.run('test_spaced_repetition_migration', function () {
  var now = 1700000000000;
  var fresh = migration.migrateState(null, now, 540);
  helpers.equal(Object.keys(fresh.state.items).length, 0, 'MIGRATION_DOES_NOT_BULK_INITIALIZE');

  var built = identity.createExamIdentity('itpass', '01_aki', 'question-1');
  var item = schema.createMemoryItem(built, now);
  item.futureItem = { keep: true };
  item.sourceRef.futureLocator = 'deck-alias';
  var raw = {
    schemaVersion: 1,
    items: [item, item, { memoryItemId: 'bad', sourceType: 'exam', sourceRef: {} }],
    daily: { '2023-11-15': { completed: 2, newCount: 1, updatedAt: now, futureDaily: 'keep' } },
    reviewLog: [{
      eventId: 'migration-event',
      memoryItemId: item.memoryItemId,
      sourceType: 'exam',
      action: 'SELF_GRADED',
      grade: 'GOOD',
      occurredAt: now,
      futureEvent: { keep: true }
    }],
    updatedAt: now,
    futureRoot: { keep: true }
  };
  var unsafe = JSON.parse('{"__proto__":{"polluted":true}}');
  Object.keys(unsafe).forEach(function (key) { raw[key] = unsafe[key]; });

  var migrated = migration.migrateState(raw, now, 540);
  helpers.equal(Object.keys(migrated.state.items).length, 1, 'MIGRATION_DEDUPES_ITEMS');
  helpers.assert(migrated.review.length >= 2, 'MIGRATION_RECORDS_REVIEW_ITEMS');
  helpers.equal(migrated.state.futureRoot.keep, true, 'UNKNOWN_ROOT_RETAINED');
  helpers.equal(migrated.state.items[item.memoryItemId].futureItem.keep, true, 'UNKNOWN_ITEM_RETAINED');
  helpers.equal(migrated.state.items[item.memoryItemId].sourceRef.futureLocator, 'deck-alias', 'UNKNOWN_SOURCE_REF_RETAINED');
  helpers.equal(migrated.state.daily['2023-11-15'].futureDaily, 'keep', 'UNKNOWN_DAILY_RETAINED');
  helpers.equal(migrated.state.reviewLog[0].futureEvent.keep, true, 'UNKNOWN_EVENT_RETAINED');
  helpers.equal(Object.prototype.polluted, undefined, 'UNSAFE_KEYS_MUST_NOT_POLLUTE');
  helpers.equal(Object.prototype.hasOwnProperty.call(migrated.state, '__proto__'), false, 'UNSAFE_ROOT_KEY_DROPPED');

  var again = migration.migrateState(migrated.state, now, 540);
  helpers.equal(JSON.stringify(again.state), JSON.stringify(migrated.state), 'MIGRATION_IDEMPOTENT_WITH_UNKNOWN_FIELDS');
  helpers.equal(again.review.length, 0, 'MIGRATION_STABLE_ON_SECOND_PASS');

  var legacyAmbiguous = migration.migrateLegacyRecord({ sourceType: 'exam', exam: 'itpass', id: 'same-id' });
  helpers.equal(legacyAmbiguous.status, 'NEEDS_REVIEW', 'LEGACY_EXAM_MISSING_DECK_REVIEW');
  var legacyTerm = migration.migrateLegacyRecord({ sourceType: 'term', id: 'term-1' });
  helpers.equal(legacyTerm.status, 'MIGRATABLE', 'LEGACY_TERM_MIGRATABLE');

  var ensuredOne = migration.ensureItem(fresh.state, identity.createTermIdentity('term-ensure'), now);
  var ensuredTwo = migration.ensureItem(ensuredOne.state, identity.createTermIdentity('term-ensure'), now + 1);
  helpers.equal(ensuredOne.created, true, 'CREATE_ON_FIRST_EVENT');
  helpers.equal(ensuredTwo.created, false, 'ONE_KNOWLEDGE_POINT_ONE_ITEM');

  return { reviewCount: migrated.review.length, itemCount: Object.keys(migrated.state.items).length };
});
