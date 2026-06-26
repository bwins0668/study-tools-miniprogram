# -*- coding: utf-8 -*-
"""R2d controlled Minium evidence for Review Center due sessions.

This test only snapshots and restores four spaced-repetition keys.  It never
calls clearStorage/clearStorageSync and never touches unrelated wx storage.
It exercises two real player routes (IT Passport and SG) plus valid-session
restart persistence and an expired-session safety fallback.
"""
from __future__ import print_function

import copy
import hashlib
import json
import os
import sys
import time
import traceback
from urllib.parse import quote

import minium


PROJECT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
DEVTOOLS_CLI = r'I:\微信web开发者工具\cli.bat'
REPORT_PATH = os.path.join(PROJECT, 'tools', 'test-artifacts', 'r2d-due-runtime-report.json')
REVIEW_CENTER_ROUTE = '/pages/review-center/review-center'
SESSION_KEY = 'study_tools_review_session_v1'
STATE_KEY = 'study_tools_spaced_repetition_v1'
SUMMARY_KEY = 'study_tools_spaced_repetition_summary_v1'
QUARANTINE_KEY = 'study_tools_spaced_repetition_v1_quarantine'
CONTROLLED_KEYS = [STATE_KEY, SUMMARY_KEY, QUARANTINE_KEY, SESSION_KEY]
POLL_SECONDS = 0.10
ROUTE_TIMEOUT_SECONDS = 12.0
DATA_TIMEOUT_SECONDS = 12.0

CASES = [
    {
        'label': 'itpass_due',
        'course': 'itpass',
        'deckId': '01_aki',
        'questionId': '01_AKI_Q1',
        'playerRoute': '/packages/quiz-itpass-1/pages/flashcard-player/flashcard-player'
    },
    {
        'label': 'sg_due',
        'course': 'sg',
        'deckId': 'sg_01_aki',
        'questionId': 'SG_01_AKI_問1',
        'playerRoute': '/packages/quiz-sg-1/pages/flashcard-player/flashcard-player'
    }
]


def now_ms():
    return int(time.time() * 1000)


def normalized_route(value):
    raw = str(value or '').split('?', 1)[0].strip()
    if not raw:
        return ''
    return raw if raw.startswith('/') else '/' + raw


def safe_text(value, limit=500):
    text = str(value)
    return text if len(text) <= limit else text[:limit] + '…'


def json_digest(value):
    encoded = json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(',', ':')).encode('utf-8')
    return hashlib.sha256(encoded).hexdigest()


def unwrap_wx_result(value):
    if isinstance(value, dict):
        outer = value.get('result', value)
        if isinstance(outer, dict) and 'result' in outer:
            return outer.get('result')
        return outer
    return value


def current_page(mini):
    return mini.app.get_current_page()


def current_route(mini):
    page = current_page(mini)
    return normalized_route(getattr(page, 'path', '') if page else '')


def page_data(page):
    data = getattr(page, 'data', None)
    try:
        return data() if callable(data) else (data or {})
    except Exception:
        return {}


def wait_for_route(mini, expected_route, label):
    expected = normalized_route(expected_route)
    deadline = time.time() + ROUTE_TIMEOUT_SECONDS
    observed = []
    while time.time() < deadline:
        actual = current_route(mini)
        if actual not in observed:
            observed.append(actual)
        if actual == expected:
            return current_page(mini)
        time.sleep(POLL_SECONDS)
    raise AssertionError('%s route timeout expected=%s observed=%s' % (label, expected, observed))


def wait_for_data(page, predicate, label):
    deadline = time.time() + DATA_TIMEOUT_SECONDS
    last = {}
    while time.time() < deadline:
        last = page_data(page)
        if predicate(last):
            return last
        time.sleep(POLL_SECONDS)
    raise AssertionError('%s data timeout last=%s' % (label, safe_text(last, 1200)))


def wx_call(mini, method, args=None):
    response = mini.app.call_wx_method(method, args or {})
    return unwrap_wx_result(response)


def storage_keys(mini):
    info = wx_call(mini, 'getStorageInfoSync') or {}
    if not isinstance(info, dict):
        raise AssertionError('getStorageInfoSync returned %s' % safe_text(info))
    keys = info.get('keys', [])
    if not isinstance(keys, list):
        raise AssertionError('storage keys not a list: %s' % safe_text(info))
    return set(keys)


def read_key(mini, key):
    return copy.deepcopy(wx_call(mini, 'getStorageSync', {'key': key}))


def write_key(mini, key, value):
    wx_call(mini, 'setStorageSync', {'key': key, 'data': value})
    observed = read_key(mini, key)
    if json_digest(observed) != json_digest(value):
        raise AssertionError('setStorageSync verification failed for %s' % key)


def remove_key(mini, key):
    wx_call(mini, 'removeStorageSync', {'key': key})
    if key in storage_keys(mini):
        raise AssertionError('removeStorageSync verification failed for %s' % key)


def capture_backup(mini):
    existing = storage_keys(mini)
    result = {}
    for key in CONTROLLED_KEYS:
        present = key in existing
        value = read_key(mini, key) if present else None
        result[key] = {
            'present': present,
            'value': value,
            'digest': json_digest(value) if present else None
        }
    return result


def restore_backup(mini, backup):
    details = {}
    for key in CONTROLLED_KEYS:
        snapshot = backup[key]
        if snapshot['present']:
            write_key(mini, key, snapshot['value'])
            observed = read_key(mini, key)
            details[key] = {
                'restored': json_digest(observed) == snapshot['digest'],
                'presentAfter': key in storage_keys(mini)
            }
        else:
            if key in storage_keys(mini):
                remove_key(mini, key)
            details[key] = {
                'restored': key not in storage_keys(mini),
                'presentAfter': key in storage_keys(mini)
            }
        if not details[key]['restored']:
            raise AssertionError('backup restore verification failed for %s' % key)
    return details


def memory_item_id(course, deck_id, question_id):
    return 'sr:v1:exam:%s:%s:%s' % (
        course,
        quote(deck_id, safe=''),
        quote(question_id, safe='')
    )


def controlled_due_state(case):
    current = now_ms()
    item_id = memory_item_id(case['course'], case['deckId'], case['questionId'])
    item = {
        'memoryItemId': item_id,
        'sourceType': 'exam',
        'sourceRef': {
            'course': case['course'],
            'deckId': case['deckId'],
            'questionId': case['questionId']
        },
        'state': 'REVIEW',
        'createdAt': current - 60000,
        'lastReviewAt': current - 60000,
        'dueAt': current - 1000,
        'overdue': False,
        'intervalDays': 1,
        'stepIndex': 0,
        'repetitions': 1,
        'lapses': 0,
        'correctCount': 1,
        'wrongCount': 0,
        'hardCount': 0,
        'easyCount': 0,
        'lastGrade': 'GOOD',
        'priority': 0,
        'isFavorite': False,
        'isMistake': False,
        'updatedAt': current - 60000
    }
    return {
        'schemaVersion': 1,
        'items': {item_id: item},
        'daily': {},
        'reviewLog': [],
        'processedEventIds': {},
        'updatedAt': current - 1000
    }, item_id


def apply_isolated_state(mini, state):
    write_key(mini, STATE_KEY, state)
    for key in (SUMMARY_KEY, QUARANTINE_KEY, SESSION_KEY):
        if key in storage_keys(mini):
            remove_key(mini, key)


def assert_review_center_due(mini, case, label):
    mini.app.relaunch(REVIEW_CENTER_ROUTE)
    page = wait_for_route(mini, REVIEW_CENTER_ROUTE, label + ':review-center')
    data = wait_for_data(
        page,
        lambda value: value.get('dueCount') == 1 and value.get('isEmpty') is False and isinstance(value.get('groups'), list),
        label + ':review-center-due'
    )
    groups = data.get('groups') or []
    match = [group for group in groups if group.get('course') == case['course'] and group.get('deckId') == case['deckId'] and group.get('count') == 1]
    if len(match) != 1:
        raise AssertionError('%s expected one due group, got %s' % (label, safe_text(groups, 1200)))
    return page, data


def click_start_review(mini, case, label):
    page, center_data = assert_review_center_due(mini, case, label)
    buttons = page.get_elements('.rc-btn-primary')
    if len(buttons) != 1:
        raise AssertionError('%s expected one start review button, got %s' % (label, len(buttons)))
    buttons[0].click()
    player = wait_for_route(mini, case['playerRoute'], label + ':player-open')
    return player, center_data


def assert_due_player_data(page, case, item_id, label):
    data = wait_for_data(
        page,
        lambda value: value.get('viewState') == 'content' and value.get('dueMode') is True and value.get('totalCards') == 1 and value.get('playableCountActual') == 1 and isinstance(value.get('currentCard'), dict),
        label + ':due-player-data'
    )
    current_card = data.get('currentCard') or {}
    if current_card.get('id') != case['questionId']:
        raise AssertionError('%s due filter chose unexpected card=%s expected=%s' % (label, current_card.get('id'), case['questionId']))
    if data.get('deckId') != case['course'] + '/' + case['deckId']:
        raise AssertionError('%s due player deck mismatch=%s' % (label, data.get('deckId')))
    if data.get('totalCards') != 1 or len(data.get('cards') or []) != 1:
        raise AssertionError('%s due filter did not narrow player state to one card' % label)
    return data


def build_resume_url(case, session_id):
    return (
        case['playerRoute'] +
        '?deckId=' + quote(case['course'] + '/' + case['deckId'], safe='') +
        '&backCourse=' + quote(case['course'], safe='') +
        '&backPath=' + quote(REVIEW_CENTER_ROUTE, safe='') +
        '&mode=due&reviewSessionId=' + quote(session_id, safe='')
    )


def read_session(mini, label):
    session = read_key(mini, SESSION_KEY)
    if not isinstance(session, dict):
        raise AssertionError('%s session missing or invalid=%s' % (label, safe_text(session)))
    return session


def assert_session(session, case, item_id, label, completed):
    if session.get('mode') != 'due':
        raise AssertionError('%s expected due session mode, got %s' % (label, session.get('mode')))
    if session.get('course') != case['course'] or session.get('deckId') != case['deckId']:
        raise AssertionError('%s session route identity mismatch=%s' % (label, safe_text(session, 1000)))
    if session.get('itemIds') != [item_id]:
        raise AssertionError('%s canonical itemIds mismatch=%s' % (label, safe_text(session.get('itemIds'))))
    completed_ids = session.get('completedItemIds') or []
    if completed:
        if completed_ids != [item_id] or not isinstance(session.get('completedAt'), (int, float)):
            raise AssertionError('%s session completion mismatch=%s' % (label, safe_text(session, 1200)))
    else:
        if completed_ids or session.get('completedAt') is not None:
            raise AssertionError('%s session should be open=%s' % (label, safe_text(session, 1200)))


def finish_single_card(mini, page, case, item_id, label):
    options = page.get_elements('.fc-option')
    if not options:
        raise AssertionError('%s no answer options rendered' % label)
    options[0].click()
    wait_for_data(page, lambda value: value.get('hasAnswered') is True, label + ':answer')
    session = read_session(mini, label + ':session-after-answer')
    assert_session(session, case, item_id, label + ':session-after-answer', completed=True)

    buttons = page.get_elements('.fc-btn')
    if len(buttons) < 2:
        raise AssertionError('%s expected answer feedback action buttons, got %s' % (label, len(buttons)))
    buttons[-1].click()
    finished = wait_for_data(page, lambda value: value.get('isFinished') is True and value.get('totalCards') == 1, label + ':result')
    result_nodes = page.get_elements('.fc-result')
    if not result_nodes:
        raise AssertionError('%s result UI did not render' % label)
    return finished


def assert_return_to_review_center(mini, case, label):
    mini.app.navigate_back()
    page = wait_for_route(mini, REVIEW_CENTER_ROUTE, label + ':navigate-back')
    data = wait_for_data(page, lambda value: value.get('dueCount') == 0 and value.get('isEmpty') is True, label + ':review-complete')
    return data


def run_due_case(mini, case):
    label = case['label']
    state, item_id = controlled_due_state(case)
    apply_isolated_state(mini, state)

    player, center_data = click_start_review(mini, case, label)
    before_restart = assert_due_player_data(player, case, item_id, label + ':initial')
    created_session = read_session(mini, label + ':created-session')
    assert_session(created_session, case, item_id, label + ':created-session', completed=False)

    # Native back keeps the valid session in isolated storage; relaunch then
    # direct resume verifies state/session survival without waiting two hours.
    mini.app.navigate_back()
    wait_for_route(mini, REVIEW_CENTER_ROUTE, label + ':pre-restart-back')
    mini.app.relaunch(REVIEW_CENTER_ROUTE)
    wait_for_route(mini, REVIEW_CENTER_ROUTE, label + ':restart-review-center')
    recovered_session = read_session(mini, label + ':recovered-session')
    if recovered_session.get('reviewSessionId') != created_session.get('reviewSessionId'):
        raise AssertionError('%s valid session did not persist through relaunch' % label)
    assert_session(recovered_session, case, item_id, label + ':recovered-session', completed=False)

    mini.app.navigate_to(build_resume_url(case, recovered_session['reviewSessionId']))
    resumed_player = wait_for_route(mini, case['playerRoute'], label + ':resume-player')
    resumed_data = assert_due_player_data(resumed_player, case, item_id, label + ':resumed')
    result_data = finish_single_card(mini, resumed_player, case, item_id, label)
    after_back = assert_return_to_review_center(mini, case, label)

    return {
        'case': label,
        'course': case['course'],
        'deckId': case['deckId'],
        'playerRoute': case['playerRoute'],
        'centerDueCountBefore': center_data.get('dueCount'),
        'initialDueTotalCards': before_restart.get('totalCards'),
        'resumedDueTotalCards': resumed_data.get('totalCards'),
        'sessionIdPresent': bool(created_session.get('reviewSessionId')),
        'sessionCompletedCanonicalItem': True,
        'resultRendered': bool(result_data.get('isFinished')),
        'centerDueCountAfterBack': after_back.get('dueCount'),
        'normalReturnRoute': REVIEW_CENTER_ROUTE
    }


def run_expired_session_case(mini, case):
    label = 'expired_' + case['label']
    state, item_id = controlled_due_state(case)
    apply_isolated_state(mini, state)
    current = now_ms()
    expired = {
        'reviewSessionId': 'rs-r2d-expired-' + case['course'],
        'course': case['course'],
        'deckId': case['deckId'],
        'itemIds': [item_id],
        'createdAt': current - (2 * 60 * 60 * 1000) - 1000,
        'expiresAt': current - 1,
        'backPath': REVIEW_CENTER_ROUTE,
        'mode': 'due',
        'completedAt': None,
        'completedItemIds': []
    }
    write_key(mini, SESSION_KEY, expired)
    mini.app.relaunch(REVIEW_CENTER_ROUTE)
    wait_for_route(mini, REVIEW_CENTER_ROUTE, label + ':review-center')
    mini.app.navigate_to(build_resume_url(case, expired['reviewSessionId']))
    player = wait_for_route(mini, case['playerRoute'], label + ':player')
    data = wait_for_data(
        player,
        lambda value: value.get('viewState') == 'empty' and value.get('isEmpty') is True and not value.get('currentCard'),
        label + ':safe-empty'
    )
    mini.app.navigate_back()
    wait_for_route(mini, REVIEW_CENTER_ROUTE, label + ':back')
    return {
        'case': label,
        'course': case['course'],
        'deckId': case['deckId'],
        'playerRoute': case['playerRoute'],
        'expiredSafeEmpty': True,
        'emptyMessage': data.get('loadError', ''),
        'backRoute': REVIEW_CENTER_ROUTE
    }


def report_write(payload):
    os.makedirs(os.path.dirname(REPORT_PATH), exist_ok=True)
    temp_path = REPORT_PATH + '.tmp'
    with open(temp_path, 'w', encoding='utf-8') as handle:
        json.dump(payload, handle, ensure_ascii=False, indent=2, sort_keys=True)
        handle.flush()
        os.fsync(handle.fileno())
    os.replace(temp_path, REPORT_PATH)


def main():
    report = {
        'status': 'FAILED',
        'projectRoot': PROJECT,
        'automationPort': int(os.environ.get('MINIUM_TEST_PORT', '9420')),
        'controlledKeys': CONTROLLED_KEYS,
        'clearStorageUsed': False,
        'cases': [],
        'backup': {},
        'restore': {},
        'errors': [],
        'startedAt': now_ms(),
        'finishedAt': None
    }
    mini = None
    backup = None
    exit_code = 1
    try:
        mini = minium.Minium({
            'project_path': PROJECT,
            'dev_tool_path': DEVTOOLS_CLI,
            'platform': 'ide',
            'debug_mode': 'error',
            'test_port': report['automationPort']
        })
        backup = capture_backup(mini)
        report['backup'] = {
            key: {'present': value['present'], 'digest': value['digest']}
            for key, value in backup.items()
        }
        for case in CASES:
            report['cases'].append(run_due_case(mini, case))
        # One expired case is sufficient to prove the shared player fallback.
        report['cases'].append(run_expired_session_case(mini, CASES[0]))
        session_key_count = sum(1 for key in storage_keys(mini) if key == SESSION_KEY)
        if session_key_count > 1:
            raise AssertionError('session storage key unexpectedly accumulated: %s' % session_key_count)
        report['sessionKeyBounded'] = True
        report['status'] = 'PASS'
        exit_code = 0
    except Exception as error:
        report['errors'].append({
            'type': type(error).__name__,
            'message': safe_text(error, 2000),
            'traceback': traceback.format_exc(limit=12)
        })
    finally:
        if mini is not None and backup is not None:
            try:
                report['restore'] = restore_backup(mini, backup)
                report['restoreVerified'] = all(value.get('restored') for value in report['restore'].values())
                if not report['restoreVerified']:
                    exit_code = 1
                    report['status'] = 'FAILED'
            except Exception as restore_error:
                report['errors'].append({
                    'type': type(restore_error).__name__,
                    'message': 'restore:' + safe_text(restore_error, 2000),
                    'traceback': traceback.format_exc(limit=12)
                })
                report['restoreVerified'] = False
                exit_code = 1
                report['status'] = 'FAILED'
        if mini is not None:
            try:
                mini.shutdown()
            except Exception as shutdown_error:
                report['errors'].append({
                    'type': type(shutdown_error).__name__,
                    'message': 'shutdown:' + safe_text(shutdown_error, 1000)
                })
                exit_code = 1
                report['status'] = 'FAILED'
        report['finishedAt'] = now_ms()
        report_write(report)

    print('R2D_DUE_RUNTIME status=%s cases=%s errors=%s restoreVerified=%s report=%s' % (
        report['status'], len(report['cases']), len(report['errors']), report.get('restoreVerified'), REPORT_PATH
    ))
    return exit_code


if __name__ == '__main__':
    sys.exit(main())
