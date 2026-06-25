'use strict';

var fs = require('fs');
var path = require('path');

var ARTIFACT_DIR = path.join(__dirname, 'test-artifacts', 'spaced-repetition-foundation');

function assert(condition, message) {
  if (!condition) throw new Error(message || 'ASSERTION_FAILED');
}

function equal(actual, expected, message) {
  if (actual !== expected) throw new Error((message || 'VALUES_NOT_EQUAL') + ': expected=' + expected + ' actual=' + actual);
}

function run(name, callback) {
  var startedAt = Date.now();
  var payload;
  try {
    payload = callback() || {};
    var result = { name: name, status: 'PASS', durationMs: Date.now() - startedAt, details: payload };
    writeArtifact(name, result);
    process.stdout.write(JSON.stringify(result) + '\n');
    return result;
  } catch (error) {
    var failure = { name: name, status: 'FAIL', durationMs: Date.now() - startedAt, error: error && error.stack ? error.stack : String(error) };
    writeArtifact(name, failure);
    process.stderr.write(JSON.stringify(failure) + '\n');
    process.exitCode = 1;
    return failure;
  }
}

function writeArtifact(name, result) {
  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
  fs.writeFileSync(path.join(ARTIFACT_DIR, name + '.json'), JSON.stringify(result, null, 2) + '\n');
}

module.exports = {
  assert: assert,
  equal: equal,
  run: run,
  ARTIFACT_DIR: ARTIFACT_DIR
};
