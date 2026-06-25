'use strict';

var helpers = require('./spaced_repetition_test_helpers');
var constants = require('../utils/spaced-repetition/constants');
var identity = require('../utils/spaced-repetition/identity');
var schema = require('../utils/spaced-repetition/schema');
var summary = require('../utils/spaced-repetition/summary');
var storage = require('../utils/spaced-repetition/storage');

helpers.run('test_spaced_repetition_storage', function () {
  var now = 1700000000000;
  var adapter = storage.createMemoryStorageAdapter();
  var initial = storage.loadSpacedRepetitionState(adapter, now, 540);
  helpers.equal(Object.keys(initial.state.items).length, 0, 'EMPTY_FIRST_INITIALIZATION');
  helpers.equal(initial.summary.dueCount, 0, 'EMPTY_SUMMARY');

  var built = identity.createTermIdentity('storage-term');
  var state = schema.createEmptyState(now);
  state.futureRoot = { retained: true };
  state.items[built.memoryItemId] = schema.createMemoryItem(built, now);
  state.items[built.memoryItemId].futureItem = { retained: true };
  state.items[built.memoryItemId].sourceRef.futureLocator = 'keep-me';
  state.daily = summary.recordDailyActivity(state.daily, now, 540, { created: true });
  state.daily['2023-11-15'].futureDaily = 'keep-me';
  var saved = storage.saveSpacedRepetitionState(adapter, state, now, 540);
  helpers.equal(Object.keys(saved.state.items).length, 1, 'SAVED_ONE_ITEM');
  helpers.equal(storage.loadSummary(adapter, now, 540).todayNewCount, 1, 'SUMMARY_KEY_SAVED');

  var snapshot = adapter.snapshot();
  helpers.assert(snapshot[constants.STORAGE_KEY], 'STATE_WRITTEN_TO_SR_KEY');
  helpers.assert(snapshot[constants.SUMMARY_KEY], 'SUMMARY_WRITTEN_TO_SR_KEY');
  helpers.assert(!snapshot['study-tools-mini-favorite-terms-v1'], 'OTHER_MODULE_STORAGE_UNTOUCHED');
  helpers.equal(snapshot[constants.STORAGE_KEY].futureRoot.retained, true, 'UNKNOWN_ROOT_FIELD_RETAINED');
  helpers.equal(snapshot[constants.STORAGE_KEY].items[built.memoryItemId].futureItem.retained, true, 'UNKNOWN_ITEM_FIELD_RETAINED');
  helpers.equal(snapshot[constants.STORAGE_KEY].items[built.memoryItemId].sourceRef.futureLocator, 'keep-me', 'UNKNOWN_SOURCE_REF_FIELD_RETAINED');

  var corruptAdapter = storage.createMemoryStorageAdapter();
  corruptAdapter.set(constants.STORAGE_KEY, '{not-json');
  var corrupt = storage.loadSpacedRepetitionState(corruptAdapter, now, 540);
  helpers.equal(Object.keys(corrupt.state.items).length, 0, 'CORRUPT_STATE_SAFE_DOWNGRADE');
  helpers.assert(corruptAdapter.snapshot()[constants.QUARANTINE_KEY], 'CORRUPT_STATE_QUARANTINED');

  var fakeWx = {
    values: {},
    getStorageSync: function (key) { return this.values[key]; },
    setStorageSync: function (key, value) { this.values[key] = value; },
    removeStorageSync: function (key) { delete this.values[key]; }
  };
  var wxAdapter = storage.createWxStorageAdapter(fakeWx);
  wxAdapter.set('probe', { ok: true });
  helpers.equal(wxAdapter.get('probe').ok, true, 'INJECTED_WX_ADAPTER');

  return { storageKey: constants.STORAGE_KEY, summaryKey: constants.SUMMARY_KEY };
});
