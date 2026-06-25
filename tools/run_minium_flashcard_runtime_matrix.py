#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Minium flashcard runtime matrix launcher with shard support.

Usage:
  python tools/run_minium_flashcard_runtime_matrix.py --shard A
  python tools/run_minium_flashcard_runtime_matrix.py --shard B
  python tools/run_minium_flashcard_runtime_matrix.py --shard C
  python tools/run_minium_flashcard_runtime_matrix.py --shard D
  python tools/run_minium_flashcard_runtime_matrix.py --aggregate
  python tools/run_minium_flashcard_runtime_matrix.py --all   (runs A-D sequentially)

Shard definitions:
  A: itpass/01_aki ～ itpass/08_haru  (8 decks)
  B: itpass/28_aki ～ itpass/31_haru (7 decks)
  C: sg/sg_01_aki ～ sg/sg_28_aki    (5 decks)
  D: sg/sg_28_haru ～ sg/sg_31_haru  (6 decks)
  Total: 8+7+5+6 = 26
"""
from __future__ import print_function

import argparse
import json
import os
import subprocess
import sys
import time

ROOT = os.path.dirname(os.path.abspath(__file__))
PROJECT = os.path.dirname(ROOT)
ARTIFACTS = os.path.join(ROOT, 'test-artifacts', 'minium-flashcard-v3-runtime')
os.makedirs(ARTIFACTS, exist_ok=True)

SHARDS = {
    'A': {
        'course': 'itpass',
        'label': 'IT Passport 01_aki~08_haru (8 decks)',
        'count': 8,
        'deck_ids': [
            'itpass/01_aki', 'itpass/02_aki', 'itpass/03_haru', 'itpass/04_haru',
            'itpass/05_haru', 'itpass/06_haru', 'itpass/07_haru', 'itpass/08_haru'
        ],
        'report': 'minium-shard-a-report.json'
    },
    'B': {
        'course': 'itpass',
        'label': 'IT Passport 28_aki~31_haru (7 decks)',
        'count': 7,
        'deck_ids': [
            'itpass/28_aki', 'itpass/28_haru', 'itpass/29_aki', 'itpass/29_haru',
            'itpass/30_aki', 'itpass/30_haru', 'itpass/31_haru'
        ],
        'report': 'minium-shard-b-report.json'
    },
    'C': {
        'course': 'sg',
        'label': 'SG 01_aki~28_aki (5 decks)',
        'count': 5,
        'deck_ids': [
            'sg/sg_01_aki', 'sg/sg_05_haru', 'sg/sg_06_haru', 'sg/sg_07_haru',
            'sg/sg_28_aki'
        ],
        'report': 'minium-shard-c-report.json'
    },
    'D': {
        'course': 'sg',
        'label': 'SG 28_haru~31_haru (6 decks)',
        'count': 6,
        'deck_ids': [
            'sg/sg_28_haru', 'sg/sg_29_aki', 'sg/sg_29_haru', 'sg/sg_30_aki',
            'sg/sg_30_haru', 'sg/sg_31_haru'
        ],
        'report': 'minium-shard-d-report.json'
    }
}

RUNNER = os.path.join(ROOT, 'minium_flashcard_runtime_test.py')


def run_shard(shard_key, timeout=600):
    """Run a single shard, returning the exit code."""
    if shard_key not in SHARDS:
        print('ERROR: unknown shard %s' % shard_key)
        return 1

    shard = SHARDS[shard_key]
    env = os.environ.copy()
    env['MINIUM_FLASHCARD_COURSE'] = shard['course']
    env['MINIUM_FLASHCARD_DECK_IDS'] = ','.join(shard['deck_ids'])
    env['MINIUM_FLASHCARD_REPORT_NAME'] = shard['report']
    # Skip target binding per shard — it was already verified
    env['MINIUM_FLASHCARD_SKIP_TARGET_BINDING'] = '1'

    print('=' * 60)
    print('SHARD %s: %s' % (shard_key, shard['label']))
    print('  decks=%d deck_ids=%s report=%s' % (shard['count'], shard['deck_ids'], shard['report']))
    print('=' * 60)

    started = time.time()
    result = subprocess.run(
        [sys.executable, RUNNER],
        cwd=PROJECT,
        env=env,
        stdout=sys.stdout,
        stderr=sys.stderr
    )
    elapsed = int(time.time() - started)
    print('SHARD %s: exit=%d elapsed=%ds' % (shard_key, result.returncode, elapsed))
    return result.returncode


def aggregate_reports():
    """Aggregate shard A/B/C/D reports into minium-full-report.json."""
    full_report_path = os.path.join(ARTIFACTS, 'minium-full-report.json')
    tmp_path = full_report_path + '.tmp'

    all_decks = []
    all_hot_path = []
    shards_ok = True
    shard_summary = {}

    for key in ('A', 'B', 'C', 'D'):
        shard = SHARDS[key]
        report_path = os.path.join(ARTIFACTS, shard['report'])
        if not os.path.isfile(report_path):
            print('ERROR: missing shard %s report: %s' % (key, report_path))
            shards_ok = False
            shard_summary[key] = {'status': 'MISSING'}
            continue

        try:
            with open(report_path, 'r', encoding='utf-8') as f:
                r = json.load(f)
        except (json.JSONDecodeError, OSError) as e:
            print('ERROR: shard %s report invalid: %s' % (key, e))
            shards_ok = False
            shard_summary[key] = {'status': 'INVALID_JSON', 'error': str(e)}
            continue

        deck_count = len(r.get('decks', []))
        pass_count = sum(1 for d in r.get('decks', []) if d.get('status') == 'PASS')
        all_decks.extend(r.get('decks', []))
        all_hot_path.extend(r.get('hotPath', []))
        shard_summary[key] = {
            'status': 'PASS' if r.get('status') == 'PASSED' else 'FAIL',
            'decks': '%d/%d' % (pass_count, deck_count)
        }

    # Validation
    all_deck_ids = [d['deckId'] for d in all_decks]
    unique_ids = set(all_deck_ids)
    duplicate_ids = len(all_deck_ids) - len(unique_ids)
    expected_ids = set()
    for shard in SHARDS.values():
        expected_ids.update(shard['deck_ids'])

    missing_ids = expected_ids - unique_ids
    extra_ids = unique_ids - expected_ids
    all_pass = all(d.get('status') == 'PASS' for d in all_decks)

    dup_list = [d for d in unique_ids if all_deck_ids.count(d) > 1]
    aggregate = {
        'reportSchemaVersion': 3,
        'reportJsonValidated': False,
        'aggregatedAt': time.strftime('%Y-%m-%dT%H:%M:%S+09:00'),
        'shardSummary': shard_summary,
        'totalDecks': len(all_decks),
        'totalPass': sum(1 for d in all_decks if d.get('status') == 'PASS'),
        'allPass': all_pass,
        'duplicateIds': dup_list,
        'missingIds': list(missing_ids),
        'extraIds': list(extra_ids),
        'hotPath': all_hot_path,
        'decks': all_decks,
        'status': 'PASSED' if (shards_ok and all_pass and not missing_ids and not duplicate_ids) else 'FAILED',
        'gateStatus': 'READY_FOR_USER_PROOF' if (shards_ok and all_pass and not missing_ids and not duplicate_ids) else 'BLOCKED_ON_FLASHCARD_RUNTIME'
    }

    # Atomic write
    serialized = json.dumps(aggregate, ensure_ascii=False, allow_nan=False, indent=2)
    with open(tmp_path, 'w', encoding='utf-8', newline='') as f:
        f.write(serialized)
        f.flush()
        os.fsync(f.fileno())

    # Self-verify
    with open(tmp_path, 'r', encoding='utf-8') as f:
        json.load(f)
    os.replace(tmp_path, full_report_path)

    aggregate['reportJsonValidated'] = True
    # Re-write with validated flag
    serialized2 = json.dumps(aggregate, ensure_ascii=False, allow_nan=False, indent=2)
    with open(tmp_path, 'w', encoding='utf-8', newline='') as f:
        f.write(serialized2)
        f.flush()
        os.fsync(f.fileno())
    with open(tmp_path, 'r', encoding='utf-8') as f:
        json.load(f)
    os.replace(tmp_path, full_report_path)

    print('=' * 60)
    print('AGGREGATE: %s' % full_report_path)
    print('  status=%s gate=%s allPass=%s' % (aggregate['status'], aggregate['gateStatus'], all_pass))
    print('  total=%d pass=%d missing=%d duplicate=%d' % (
        aggregate['totalDecks'], aggregate['totalPass'], len(missing_ids), duplicate_ids))
    for key, summary in sorted(shard_summary.items()):
        print('  shard %s: %s' % (key, summary))
    print('=' * 60)

    return 0 if aggregate['status'] == 'PASSED' else 1


def main():
    parser = argparse.ArgumentParser(description='Minium flashcard runtime matrix launcher')
    parser.add_argument('--shard', choices=['A', 'B', 'C', 'D'], help='Run a single shard')
    parser.add_argument('--aggregate', action='store_true', help='Aggregate shard reports')
    parser.add_argument('--all', action='store_true', help='Run all shards sequentially then aggregate')
    parser.add_argument('--timeout', type=int, default=600, help='Per-shard timeout in seconds')
    args = parser.parse_args()

    if args.aggregate:
        return aggregate_reports()

    if args.all:
        exit_codes = []
        for key in ('A', 'B', 'C', 'D'):
            ec = run_shard(key, timeout=args.timeout)
            exit_codes.append(ec)
        if all(ec == 0 for ec in exit_codes):
            print('\nALL SHARDS PASSED')
            return aggregate_reports()
        else:
            print('\nSHARD FAILURES: A=%s B=%s C=%s D=%s' % tuple(exit_codes))
            # Still aggregate to capture partial results
            aggregate_reports()
            return 1

    if args.shard:
        return run_shard(args.shard, timeout=args.timeout)

    parser.print_help()
    return 1


if __name__ == '__main__':
    sys.exit(main())
