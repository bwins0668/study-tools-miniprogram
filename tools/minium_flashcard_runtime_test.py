#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Formal Minium E2E matrix for flashcards, v2 (Runtime Recovery + Atomic Report).

Every case follows the visible V3 route:
  home -> Flashcard tab -> course card -> year deck -> local player
  -> answer -> explanation -> next -> native back to the correct year page.

The runner is fully idempotent: transport failures during *running* phases are
probed and, when the session is confirmed dead, a fresh session is created and
the current deck is retried.  Transport failures during the *cleanup* phase
(triggered by intentional mini.shutdown()) are classified as expected teardown.
"""
from __future__ import print_function

import csv
import hashlib
import json
import multiprocessing
import os
import subprocess
import sys
import threading
import time
import traceback
from datetime import datetime

try:
    import minium
except ImportError:
    py314_site = os.path.join(
        os.environ.get('LOCALAPPDATA', ''),
        'Programs', 'Python', 'Python314', 'Lib', 'site-packages'
    )
    if os.path.isdir(py314_site):
        sys.path.insert(0, py314_site)
    import minium

ROOT = os.path.dirname(os.path.abspath(__file__))
PROJECT = os.path.dirname(ROOT)
ARTIFACTS = os.path.join(ROOT, 'test-artifacts', 'minium-flashcard-v3-runtime')
REPORT_PATH = os.path.join(
    ARTIFACTS,
    os.environ.get('MINIUM_FLASHCARD_REPORT_NAME', 'minium-report.json')
)
REPORT_TMP = REPORT_PATH + '.tmp'
HOME_ROUTE = 'pages/home/home'
CENTER_ROUTE = 'pages/flashcards/flashcards'
MAX_ATTEMPTS = 2
MAX_RETRIES = 2          # per-deck transport recovery retries
POLL_INTERVAL_SECONDS = 0.15
HOME_RESET_TIMEOUT = 8.0
NAVIGATION_TIMEOUT = 12.0
CAPTURE_ENABLED = os.environ.get('MINIUM_FLASHCARD_CAPTURE') == '1'
ISOLATED_STORAGE_KEYS = [
    'study_tools_spaced_repetition_v1',
    'study_tools_spaced_repetition_summary_v1',
    'study_tools_spaced_repetition_v1_quarantine',
    'study_tools_review_session_v1'
]
os.makedirs(ARTIFACTS, exist_ok=True)

# ── REPORT SCHEMA ─────────────────────────────────────────────────────
REPORT = {
    'reportSchemaVersion': 2,
    'reportJsonValidated': False,
    'timestamp': datetime.now().isoformat(),
    'status': 'RUNNING',
    'gateStatus': 'BLOCKED_ON_FLASHCARD_RUNTIME',
    'attemptsPerCase': MAX_ATTEMPTS,
    'decks': [],
    'hotPath': [],
    'screenshots': [],
    'errors': [],
    'executionPhase': 'initializing',
    'transportRecovery': {
        'count': 0,
        'events': []
    },
    'targetBinding': {
        'verified': False,
        'projectRoot': PROJECT,
        'realPath': os.path.realpath(PROJECT),
        'expectedRoot': os.path.realpath(PROJECT),
        'fingerprint': {}
    },
    'cleanup': {},
    'storageIsolation': {
        'enabled': True,
        'clearStorageUsed': False,
        'keys': ISOLATED_STORAGE_KEYS,
        'backup': {},
        'restore': {},
        'restoreVerified': None
    }
}

# ── STATE MACHINE ─────────────────────────────────────────────────────
# Allowed phases (ordered):
#   initializing → running → case_prepare → case_navigating →
#   case_interacting → transport_recovering → report_writing →
#   cleanup_started → cleanup_complete
EXECUTION_PHASE = 'initializing'

# Session lifecycle tracking
INTENTIONAL_SHUTDOWN_SESSION_IDS = set()
ACTIVE_SESSIONS = []
CLOSED_SESSION_IDS = set()
SESSION_CLOSE_RESULTS = []

# Recovery tracking (written into REPORT at finalize)
TRANSPORT_RECOVERY_EVENTS = []
TRANSPORT_RECOVERY_DECKS_TRIED = {}
TRANSPORT_RECOVERY_COUNT = 0


# ═══════════════════════════════════════════════════════════════════════
# Utility helpers
# ═══════════════════════════════════════════════════════════════════════

def log(message):
    try:
        print(message)
    except UnicodeEncodeError:
        print(str(message).encode('ascii', errors='replace').decode('ascii'))


def norm_route(value):
    return str(value or '').lstrip('/')


def safe_str(value, maxlen=4000):
    """Convert *any* value to a safe, JSON-encodable string: strip control
    chars (except \n, \t), encode chars, truncate at maxlen."""
    raw = str(value) if value is not None else ''
    # Remove chars below 0x20 except \t(0x09) \n(0x0a)
    cleaned = ''.join(ch if ch == '\t' or ch == '\n' or ord(ch) >= 0x20 else ' ' for ch in raw)
    if len(cleaned) > maxlen:
        cleaned = cleaned[:maxlen] + '...[truncated %d]' % len(raw)
    return cleaned


STORAGE_ISOLATION_BACKUP = None


def storage_digest(value):
    return hashlib.sha256(json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(',', ':')).encode('utf-8')).hexdigest()


def unwrap_wx_result(value):
    if isinstance(value, dict):
        outer = value.get('result', value)
        if isinstance(outer, dict) and 'result' in outer:
            return outer.get('result')
        return outer
    return value


def wx_storage_call(mini, method, args=None):
    return unwrap_wx_result(mini.app.call_wx_method(method, args or {}))


def wx_storage_keys(mini):
    info = wx_storage_call(mini, 'getStorageInfoSync') or {}
    keys = info.get('keys', []) if isinstance(info, dict) else []
    if not isinstance(keys, list):
        raise RuntimeError('wx storage key listing malformed: %s' % safe_str(info, 500))
    return set(keys)


def capture_storage_isolation(mini):
    present = wx_storage_keys(mini)
    backup = {}
    for key in ISOLATED_STORAGE_KEYS:
        value = wx_storage_call(mini, 'getStorageSync', {'key': key}) if key in present else None
        backup[key] = {'present': key in present, 'value': value, 'digest': storage_digest(value) if key in present else None}
    REPORT['storageIsolation']['backup'] = {key: {'present': data['present'], 'digest': data['digest']} for key, data in backup.items()}
    return backup


def restore_storage_isolation(mini, backup):
    details = {}
    for key in ISOLATED_STORAGE_KEYS:
        snapshot = backup[key]
        if snapshot['present']:
            wx_storage_call(mini, 'setStorageSync', {'key': key, 'data': snapshot['value']})
            observed = wx_storage_call(mini, 'getStorageSync', {'key': key})
            restored = storage_digest(observed) == snapshot['digest'] and key in wx_storage_keys(mini)
        else:
            if key in wx_storage_keys(mini):
                wx_storage_call(mini, 'removeStorageSync', {'key': key})
            restored = key not in wx_storage_keys(mini)
        details[key] = {'restored': restored, 'presentAfter': key in wx_storage_keys(mini)}
        if not restored:
            raise RuntimeError('storage restore verification failed for %s' % key)
    REPORT['storageIsolation']['restore'] = details
    REPORT['storageIsolation']['restoreVerified'] = all(detail['restored'] for detail in details.values())
    return details


def sanitize_for_json(obj):
    """Recursively walk *obj* and replace every string with safe_str()."""
    if isinstance(obj, dict):
        return {k: sanitize_for_json(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [sanitize_for_json(item) for item in obj]
    if isinstance(obj, str):
        return safe_str(obj)
    return obj


# ═══════════════════════════════════════════════════════════════════════
# Atomic report writing
# ═══════════════════════════════════════════════════════════════════════

def write_report_atomic(payload=None):
    """Write REPORT (or an explicit payload) as JSON using a temporary file
    with fsync + self-verification + atomic os.replace.

    Returns True on success.  Raises RuntimeError on failure (no half-written
    file is ever left at the final path).
    """
    data = sanitize_for_json(payload if payload is not None else REPORT)
    serialized = json.dumps(data, ensure_ascii=False, allow_nan=False, indent=2)

    # Write to temp
    try:
        with open(REPORT_TMP, 'w', encoding='utf-8', newline='') as handle:
            handle.write(serialized)
            handle.flush()
            os.fsync(handle.fileno())
    except (OSError, IOError, ValueError) as exc:
        raise RuntimeError('REPORT_ATOMIC_WRITE_FAILED: temp write: %s' % safe_str(exc))

    # Self-verify: read back and parse
    try:
        with open(REPORT_TMP, 'r', encoding='utf-8') as verify:
            reloaded = json.load(verify)
            if reloaded is None:
                raise RuntimeError('REPORT_ATOMIC_VERIFY_NULL')
    except (json.JSONDecodeError, OSError, IOError) as exc:
        # Remove the corrupt temp file so we never leave junk
        try:
            os.remove(REPORT_TMP)
        except OSError:
            pass
        raise RuntimeError('REPORT_JSON_INVALID: self-verify failed: %s' % safe_str(exc))

    # Atomic replace (os.replace is atomic on same filesystem)
    try:
        os.replace(REPORT_TMP, REPORT_PATH)
    except OSError as exc:
        raise RuntimeError('REPORT_ATOMIC_REPLACE_FAILED: %s' % safe_str(exc))

    # Update the integrated payload if it was the global REPORT
    if payload is None:
        REPORT['reportJsonValidated'] = True

    return True


# ═══════════════════════════════════════════════════════════════════════
# Session lifecycling
# ═══════════════════════════════════════════════════════════════════════

def current_page(mini):
    try:
        return mini.app.get_current_page()
    except Exception:
        return None


def current_route(mini):
    page = current_page(mini)
    return norm_route(getattr(page, 'path', '') if page else '')


def page_data(mini):
    page = current_page(mini)
    if not page:
        return {}
    try:
        data = page.data
        return data() if callable(data) else (data or {})
    except Exception:
        return {}


def page_stack(mini):
    app = getattr(mini, 'app', None)
    for name in ('get_current_pages', 'get_page_stack'):
        method = getattr(app, name, None)
        if callable(method):
            try:
                pages = method() or []
                return [norm_route(getattr(page, 'path', page)) for page in pages]
            except Exception:
                pass
    route = current_route(mini)
    return [route] if route else []


def connect_session():
    cli_path = r'I:\微信web开发者工具\cli.bat'
    auto_port = os.environ.get('MINIUM_TEST_PORT', '9420')
    mini = minium.Minium({
        'project_path': PROJECT,
        'dev_tool_path': cli_path,
        'platform': 'ide',
        'debug_mode': 'error',
        'test_port': int(auto_port)
    })
    ACTIVE_SESSIONS.append(mini)
    return mini


def available_lifecycle_methods(target):
    if target is None:
        return []
    return [
        name for name in ('shutdown', 'close', 'quit', 'disconnect', 'stop', 'destroy', 'exit')
        if callable(getattr(target, name, None))
    ]


def close_session(mini):
    """Close a single Minium session, tracking intentional shutdowns for
    transport-close classification.  Returns a detail dict."""
    detail = {'sessionId': id(mini) if mini else None, 'closed': True}
    if not mini:
        return detail
    if id(mini) in CLOSED_SESSION_IDS:
        detail['alreadyClosed'] = True
        return detail
    close_candidates = ('shutdown', 'close', 'quit', 'disconnect', 'exit')
    available = [name for name in close_candidates if callable(getattr(mini, name, None))]
    detail['objectType'] = type(mini).__name__
    detail['availableCloseMethods'] = available
    detail['nestedLifecycleMethods'] = {
        name: available_lifecycle_methods(getattr(mini, name, None))
        for name in ('app', 'connection', '_connection', 'driver', '_driver', 'dev_tool', '_dev_tool')
        if getattr(mini, name, None) is not None
    }
    started = time.time()
    session_id = id(mini)
    try:
        if not available:
            raise RuntimeError('no public Minium session close method available')
        detail['method'] = 'mini.' + available[0]
        getattr(mini, available[0])()
        detail['elapsedMs'] = int((time.time() - started) * 1000)
        INTENTIONAL_SHUTDOWN_SESSION_IDS.add(session_id)
    except Exception as error:
        detail['closed'] = False
        detail['error'] = safe_str(error)
    finally:
        CLOSED_SESSION_IDS.add(session_id)
        while mini in ACTIVE_SESSIONS:
            ACTIVE_SESSIONS.remove(mini)
        SESSION_CLOSE_RESULTS.append(detail)
    return detail


def close_all_sessions():
    return [close_session(mini) for mini in list(reversed(ACTIVE_SESSIONS))]


def wait_for_runtime_quiescence(timeout_seconds=8.0):
    before_threads = snapshot_threads()
    before_children = snapshot_children()
    deadline = time.time() + timeout_seconds
    while time.time() < deadline:
        live_threads = [
            thread for thread in threading.enumerate()
            if thread is not threading.current_thread() and thread.is_alive() and not thread.daemon
        ]
        live_children = [child for child in multiprocessing.active_children() if child.is_alive()]
        if not live_threads and not live_children:
            break
        for thread in live_threads:
            thread.join(timeout=0.1)
        for child in live_children:
            child.join(timeout=0.1)
        time.sleep(0.05)
    after_threads = snapshot_threads()
    after_children = snapshot_children()
    blocking_threads = [thread for thread in after_threads if thread.get('alive') and not thread.get('daemon')]
    blocking_children = [child for child in after_children if child.get('alive')]
    return {
        'sessionsRemaining': len(ACTIVE_SESSIONS),
        'threadsBefore': before_threads,
        'threadsAfter': after_threads,
        'childrenBefore': before_children,
        'childrenAfter': after_children,
        'blockingThreads': blocking_threads,
        'blockingChildren': blocking_children,
        'quiescent': not ACTIVE_SESSIONS and not blocking_threads and not blocking_children
    }


def snapshot_threads():
    return [
        {'name': thread.name, 'daemon': thread.daemon, 'alive': thread.is_alive()}
        for thread in threading.enumerate()
        if thread is not threading.current_thread()
    ]


def snapshot_children():
    try:
        return [
            {'pid': child.pid, 'name': child.name, 'alive': child.is_alive()}
            for child in multiprocessing.active_children()
        ]
    except Exception as error:
        return [{'inspectionError': safe_str(error)}]


# ═══════════════════════════════════════════════════════════════════════
# Transport health probe
# ═══════════════════════════════════════════════════════════════════════

def probe_session_health(mini):
    """Lightweight health check that distinguishes transport-dead sessions
    from slow / mis-routed but otherwise alive sessions.

    Returns dict:
      {healthy: bool, transportDead: bool, route: str, stack: list, probeError: str}
    """
    result = {
        'healthy': False,
        'transportDead': False,
        'route': '',
        'stack': [],
        'probeError': None
    }
    if mini is None:
        result['probeError'] = 'session_is_None'
        result['transportDead'] = True
        return result

    # Probe 1: try to read the current route (fast, no side effects)
    try:
        route = current_route(mini)
        result['route'] = route
    except Exception as exc:
        error_text = safe_str(exc)
        result['probeError'] = 'current_route_exception: %s' % error_text
        # Classic transport-dead signals
        if any(signal in error_text.lower()
               for signal in ('remote host was lost', 'connection', 'lost', 'timeout', 'websocket',
                              'not connected', 'transport', 'disconnect', 'closed')):
            result['transportDead'] = True
        return result

    # Probe 2: try page stack (slightly deeper, still read-only)
    try:
        stack = page_stack(mini)
        result['stack'] = stack
    except Exception as exc:
        error_text = safe_str(exc)
        # If route probe passed but stack fails, transport may be flaky
        result['probeError'] = 'page_stack_exception: %s' % error_text
        if any(signal in error_text.lower()
               for signal in ('remote host was lost', 'connection', 'lost', 'timeout', 'websocket',
                              'not connected', 'transport', 'disconnect', 'closed')):
            result['transportDead'] = True
        return result

    # Both probes passed — session is healthy
    result['healthy'] = True
    return result


def is_known_transport_loss(error_str):
    """Return True if *error_str* matches known signals of transport/connection loss
    (as opposed to a business-level failure)."""
    error_lower = error_str.lower()
    signals = [
        'remote host was lost',
        'connection to remote host was',
        'websocket closed',
        'websocket disconnected',
        'transport closed',
        'not connected',
        'connection refused',
        'connection reset',
    ]
    return any(signal in error_lower for signal in signals)


# ═══════════════════════════════════════════════════════════════════════
# Business-level navigation helpers
# ═══════════════════════════════════════════════════════════════════════

def wait_route(mini, expected, timeout=8.0):
    expected = norm_route(expected)
    deadline = time.time() + timeout
    last = ''
    while time.time() < deadline:
        last = current_route(mini)
        if last == expected:
            return True, last
        time.sleep(POLL_INTERVAL_SECONDS)
    return False, last


def wait_contains_route(mini, fragment, timeout=12.0):
    deadline = time.time() + timeout
    last = ''
    while time.time() < deadline:
        last = current_route(mini)
        if fragment in last:
            return True, last
        time.sleep(POLL_INTERVAL_SECONDS)
    return False, last


def element_count(page, selector):
    try:
        return len(page.get_elements(selector) or [])
    except Exception:
        return 0


def take_shot(mini, case, stage):
    if not CAPTURE_ENABLED:
        return 'CAPTURE_DISABLED'
    path = os.path.join(ARTIFACTS, '%d_%s_%s.png' % (int(time.time() * 1000), case, stage))
    try:
        mini.app.screen_shot(path)
        REPORT['screenshots'].append(path)
        return path
    except Exception as error:
        return 'SCREENSHOT_FAILED:%s' % safe_str(error)


def confirm_home(mini):
    page = current_page(mini)
    route = current_route(mini)
    if route != HOME_ROUTE:
        return False, {'expectedRoute': HOME_ROUTE, 'actualRoute': route, 'stack': page_stack(mini)}
    home_nodes = element_count(page, '.home-page')
    hero_nodes = element_count(page, '.hero-title')
    tab_nodes = 0
    if home_nodes < 1 or hero_nodes < 1:
        return False, {
            'expectedRoute': HOME_ROUTE,
            'actualRoute': route,
            'stack': page_stack(mini),
            'homeNodes': home_nodes,
            'heroNodes': hero_nodes,
            'tabBarNodes': tab_nodes
        }
    return True, {
        'route': route,
        'homeNodes': home_nodes,
        'heroNodes': hero_nodes,
        'tabBarNodes': tab_nodes
    }


def reset_to_home(mini):
    try:
        mini.app.relaunch('/' + HOME_ROUTE)
    except Exception as error:
        return False, {'reason': 'relaunch_exception', 'error': safe_str(error),
                       'actualRoute': current_route(mini), 'stack': page_stack(mini)}
    ok, actual = wait_route(mini, HOME_ROUTE, timeout=HOME_RESET_TIMEOUT)
    if not ok:
        return False, {'reason': 'home_route_timeout', 'expectedRoute': HOME_ROUTE,
                       'actualRoute': actual, 'stack': page_stack(mini)}
    return confirm_home(mini)


def switch_to_center(mini):
    try:
        mini.app.switch_tab('/' + CENTER_ROUTE)
    except Exception as error:
        return False, {'reason': 'switch_tab_exception', 'error': safe_str(error),
                       'actualRoute': current_route(mini), 'stack': page_stack(mini)}
    ok, actual = wait_route(mini, CENTER_ROUTE, timeout=8.0)
    if not ok:
        return False, {'reason': 'center_route_timeout', 'expectedRoute': CENTER_ROUTE,
                       'actualRoute': actual, 'stack': page_stack(mini)}
    page = current_page(mini)
    cards = element_count(page, '.course-card')
    if cards < 2:
        return False, {'reason': 'course_cards_missing', 'actualRoute': actual,
                       'courseCards': cards, 'stack': page_stack(mini)}
    return True, {'route': actual, 'courseCards': cards}


def course_index(course):
    return 0 if course == 'itpass' else 1


def open_course(mini, course):
    page = current_page(mini)
    cards = page.get_elements('.course-card') if page else []
    index = course_index(course)
    if len(cards) <= index:
        return False, {'reason': 'target_course_card_missing', 'course': course,
                       'count': len(cards), 'stack': page_stack(mini)}
    try:
        cards[index].click()
    except Exception as error:
        return False, {'reason': 'course_click_exception', 'course': course,
                       'error': safe_str(error), 'stack': page_stack(mini)}
    ok, actual = wait_contains_route(mini, 'flashcard-deck-select', timeout=8.0)
    if not ok:
        return False, {'reason': 'deck_select_timeout', 'course': course,
                       'actualRoute': actual, 'stack': page_stack(mini)}
    data = page_data(mini)
    decks = data.get('decks') or []
    return True, {'route': actual, 'decks': decks}


def find_deck_index(decks, year_id):
    for index, deck in enumerate(decks):
        if str((deck or {}).get('yearId', '')) == str(year_id):
            return index
    return -1


def open_deck(mini, deck):
    page = current_page(mini)
    data = page_data(mini)
    decks = data.get('decks') or []
    index = find_deck_index(decks, deck['yearId'])
    cards = page.get_elements('.fds-deck-card') if page else []
    if index < 0 or len(cards) <= index:
        return False, {
            'reason': 'target_deck_card_missing',
            'deckId': deck['deckId'],
            'targetIndex': index,
            'deckCount': len(decks),
            'cardCount': len(cards),
            'actualRoute': current_route(mini),
            'stack': page_stack(mini)
        }
    try:
        cards[index].click()
    except Exception as error:
        return False, {'reason': 'deck_click_exception', 'deckId': deck['deckId'],
                       'error': safe_str(error), 'stack': page_stack(mini)}
    expected_fragment = 'packages/%s/pages/flashcard-player' % deck['packageName']
    ok, actual = wait_contains_route(mini, expected_fragment, timeout=NAVIGATION_TIMEOUT)
    if not ok:
        return False, {
            'reason': 'player_route_timeout',
            'expectedRouteFragment': expected_fragment,
            'actualRoute': actual,
            'stack': page_stack(mini),
            'deckSelectData': page_data(mini)
        }
    return True, {'route': actual}


def wait_player_content(mini, expected_playable):
    deadline = time.time() + 8.0
    last = {}
    while time.time() < deadline:
        last = page_data(mini)
        state = last.get('viewState')
        total = int(last.get('totalCards') or 0)
        error = last.get('errorDetail') or last.get('loadError') or ''
        if state == 'error' or state == 'empty' or error:
            return False, {'reason': 'player_error', 'state': state, 'error': safe_str(error), 'data': last}
        if total > 0:
            actual = last.get('playableCountActual', last.get('renderableCardCount', total))
            expected = last.get('playableCountExpected', expected_playable)
            if int(actual or 0) != int(expected_playable) or total != int(actual or 0):
                return False, {
                    'reason': 'player_count_contract',
                    'totalCards': total,
                    'playableActual': actual,
                    'playableExpected': expected,
                    'deckExpected': expected_playable
                }
            return True, {'totalCards': total, 'playableActual': actual, 'playableExpected': expected, 'state': state or 'content'}
        time.sleep(POLL_INTERVAL_SECONDS)
    return False, {'reason': 'player_content_timeout', 'data': last,
                   'actualRoute': current_route(mini), 'stack': page_stack(mini)}


def answer_explain_next_back(mini, deck):
    page = current_page(mini)
    options = page.get_elements('.fc-option') if page else []
    if len(options) < 2:
        return False, {'reason': 'options_missing', 'count': len(options), 'data': page_data(mini)}
    try:
        options[0].click()
    except Exception as error:
        return False, {'reason': 'option_click_exception', 'error': safe_str(error)}
    deadline = time.time() + 5.0
    data = {}
    while time.time() < deadline:
        data = page_data(mini)
        if data.get('hasAnswered'):
            break
        time.sleep(POLL_INTERVAL_SECONDS)
    if not data.get('hasAnswered'):
        return False, {'reason': 'answer_feedback_timeout', 'data': data}

    selected = data.get('selectedOption') or {}
    correct = data.get('correctOption') or {}
    answer_bilingual = bool(selected.get('textJa') and selected.get('textZh')
                            and correct.get('textJa') and correct.get('textZh'))

    page = current_page(mini)
    buttons = page.get_elements('.fc-action-row .fc-btn') if page else []
    if not buttons:
        return False, {'reason': 'explanation_button_missing', 'data': data}
    try:
        buttons[0].click()
    except Exception as error:
        return False, {'reason': 'explanation_click_exception', 'error': safe_str(error)}
    deadline = time.time() + 5.0
    while time.time() < deadline:
        data = page_data(mini)
        if data.get('showBack'):
            break
        time.sleep(POLL_INTERVAL_SECONDS)
    if not data.get('showBack'):
        return False, {'reason': 'explanation_timeout', 'data': data}

    before = int(data.get('currentIndex') or 0)
    page = current_page(mini)
    buttons = page.get_elements('.fc-action-row .fc-btn') if page else []
    if not buttons:
        return False, {'reason': 'next_button_missing', 'data': data}
    try:
        buttons[-1].click()
    except Exception as error:
        return False, {'reason': 'next_click_exception', 'error': safe_str(error)}
    deadline = time.time() + 5.0
    while time.time() < deadline:
        data = page_data(mini)
        if int(data.get('currentIndex') or 0) == before + 1:
            break
        time.sleep(POLL_INTERVAL_SECONDS)
    if int(data.get('currentIndex') or 0) != before + 1 or data.get('hasAnswered'):
        return False, {'reason': 'next_contract', 'before': before, 'data': data}

    try:
        mini.app.navigate_back()
    except Exception as error:
        return False, {'reason': 'native_back_exception', 'error': safe_str(error)}
    ok, actual = wait_contains_route(mini, 'flashcard-deck-select', timeout=6.0)
    if not ok:
        # ── Action-level retry ──────────────────────────────────────
        # The first navigate_back() may have hit a transient transport
        # glitch (minium WebSocket message timeout).  Only retry when
        # ALL of the following hold:
        #   1. Transport is still healthy (can read route/stack)
        #   2. Still on the correct player page (not lost/misrouted)
        #   3. Stack includes deck-select (the expected return target)
        #   4. The first call did NOT change the route (no side effects)
        route_after = current_route(mini)
        stack_after = page_stack(mini)
        on_player = 'flashcard-player' in route_after
        has_deck_select_in_stack = any('flashcard-deck-select' in p for p in stack_after)
        transport_healthy = route_after != '' and route_after != 'unknown'
        can_retry = transport_healthy and on_player and has_deck_select_in_stack \
                    and route_after == actual  # first call didn't change route

        action_retry_info = {
            'used': False,
            'firstAttemptRoute': actual,
            'firstAttemptStack': stack_after,
            'transportHealthy': transport_healthy,
            'onPlayer': on_player,
            'hasDeckSelectInStack': has_deck_select_in_stack
        }

        if can_retry:
            log('ACTION_RETRY: navigate_back for %s | route=%s' % (deck['deckId'], actual))
            time.sleep(0.5)  # brief quiescence before retry
            try:
                mini.app.navigate_back()
            except Exception as error:
                action_retry_info['secondAttemptException'] = safe_str(error)
                action_retry_info['used'] = True
                return False, {
                    'reason': 'return_timeout',
                    'actualRoute': current_route(mini),
                    'stack': page_stack(mini),
                    'actionRetry': action_retry_info
                }
            ok2, actual2 = wait_contains_route(mini, 'flashcard-deck-select', timeout=6.0)
            action_retry_info['used'] = True
            action_retry_info['secondAttemptRoute'] = actual2
            action_retry_info['secondAttemptOk'] = ok2
            if ok2:
                return True, {'answerBilingual': answer_bilingual, 'returnRoute': actual2,
                              'actionRetry': action_retry_info}
            # Second attempt also failed — genuine business failure
            return False, {
                'reason': 'return_timeout',
                'actualRoute': actual2,
                'stack': page_stack(mini),
                'actionRetry': action_retry_info
            }

        return False, {
            'reason': 'return_timeout',
            'actualRoute': actual,
            'stack': stack_after,
            'actionRetry': action_retry_info
        }
    return True, {'answerBilingual': answer_bilingual, 'returnRoute': actual}


# ═══════════════════════════════════════════════════════════════════════
# Deck contracts
# ═══════════════════════════════════════════════════════════════════════

def load_contracts():
    node = 'node.exe' if os.name == 'nt' else 'node'
    command = [node, os.path.join(ROOT, 'check_flashcard_deck_integrity.js'), '--json']
    result = subprocess.run(
        command,
        cwd=PROJECT,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        encoding='utf-8',
        errors='replace'
    )
    if result.returncode != 0:
        raise RuntimeError('deck contract command failed: %s' % result.stderr[-1000:])
    payload = json.loads(result.stdout)
    if not payload.get('ok'):
        raise RuntimeError('deck contract reported issues: %s' % payload.get('issues'))
    decks = payload.get('decks') or []
    for deck in decks:
        deck_id = str(deck.get('deckId') or '')
        if '/' not in deck_id:
            raise RuntimeError('invalid canonical deckId: %s' % deck_id)
        course, year_id = deck_id.split('/', 1)
        if deck.get('course') and deck.get('course') != course:
            raise RuntimeError('course mismatch for deckId: %s' % deck_id)
        deck['course'] = course
        deck['yearId'] = year_id
    return decks


# ═══════════════════════════════════════════════════════════════════════
# Single-case runner
# ═══════════════════════════════════════════════════════════════════════

def one_case(mini, deck, attempt):
    started = time.time()
    result = {
        'course': deck['course'],
        'deckId': deck['deckId'],
        'year': deck.get('yearLabel', ''),
        'package': deck['packageName'],
        'source': deck.get('sourceActual'),
        'playable': deck.get('playableActual'),
        'attempt': attempt,
        'steps': {},
        'consoleErrors': 0,
        'screenshots': []
    }

    ok, detail = reset_to_home(mini)
    result['steps']['homeReset'] = detail
    if not ok:
        result['status'] = 'FAIL'
        result['failure'] = 'homeReset'
        result['elapsedMs'] = int((time.time() - started) * 1000)
        return result
    ok, detail = switch_to_center(mini)
    result['steps']['flashcardCenter'] = detail
    if not ok:
        result['status'] = 'FAIL'
        result['failure'] = 'flashcardCenter'
        result['elapsedMs'] = int((time.time() - started) * 1000)
        return result

    ok, detail = open_course(mini, deck['course'])
    result['steps']['course'] = detail
    if not ok:
        result['status'] = 'FAIL'
        result['failure'] = 'course'
        result['elapsedMs'] = int((time.time() - started) * 1000)
        return result

    ok, detail = open_deck(mini, deck)
    result['steps']['deck'] = detail
    if not ok:
        result['status'] = 'FAIL'
        result['failure'] = 'deck'
        result['elapsedMs'] = int((time.time() - started) * 1000)
        return result

    ok, detail = wait_player_content(mini, int(deck.get('playableExpected') or deck.get('playableActual') or 0))
    result['steps']['player'] = detail
    if not ok:
        result['status'] = 'FAIL'
        result['failure'] = 'player'
        result['elapsedMs'] = int((time.time() - started) * 1000)
        return result
    result['screenshots'].append(take_shot(mini, deck['deckId'].replace('/', '_'), '02_player'))

    ok, detail = answer_explain_next_back(mini, deck)
    result['steps']['interaction'] = detail
    if not ok:
        result['status'] = 'FAIL'
        result['failure'] = 'interaction'
        result['elapsedMs'] = int((time.time() - started) * 1000)
        return result
    result['status'] = 'PASS'
    result['elapsedMs'] = int((time.time() - started) * 1000)
    return result


# ═══════════════════════════════════════════════════════════════════════
# Matrix runner with transport recovery
# ═══════════════════════════════════════════════════════════════════════

def run_matrix(decks):
    """Run the full deck matrix.

    If an exception during *one_case* is identified as a transport-loss (the
    session is dead), we:
      1. Record the event in TRANSPORT_RECOVERY_EVENTS.
      2. Close the dead session normally.
      3. Create a fresh session.
      4. Relaunch to home.
      5. Retry the *current* deck only (up to MAX_RETRIES times).

    Business-level failures (navigateTo:fail timeout while transport is alive)
    are NOT recovered — they are genuine deck failures.
    """
    global EXECUTION_PHASE, TRANSPORT_RECOVERY_COUNT
    mini = None
    try:
        for deck in decks:
            deck_id = deck['deckId']
            final = None

            # Track how many times we have recovered for this deck
            recovery_key = deck_id
            if recovery_key not in TRANSPORT_RECOVERY_DECKS_TRIED:
                TRANSPORT_RECOVERY_DECKS_TRIED[recovery_key] = 0

            for attempt in range(1, MAX_ATTEMPTS + 1):
                if mini is None:
                    EXECUTION_PHASE = 'case_prepare'
                    mini = connect_session()

                try:
                    EXECUTION_PHASE = 'case_navigating'
                    final = one_case(mini, deck, attempt)
                except Exception as error:
                    error_str = safe_str(error)
                    EXECUTION_PHASE = 'transport_recovering'
                    is_transport = is_known_transport_loss(error_str)

                    # Probe the session to distinguish transport death from biz failure
                    health = probe_session_health(mini) if mini else {'transportDead': True, 'healthy': False}
                    probe_dead = health.get('transportDead', False) or health.get('probeError') is not None
                    transport_dead = is_transport or probe_dead

                    recovery_event = {
                        'phase': EXECUTION_PHASE,
                        'deckId': deck_id,
                        'attempt': attempt,
                        'sessionId': id(mini) if mini else None,
                        'route': health.get('route', ''),
                        'stack': health.get('stack', []),
                        'errorType': 'transport_loss' if transport_dead else 'business_failure',
                        'errorText': error_str,
                        'transportHealthyBeforeRetry': not transport_dead,
                    }
                    TRANSPORT_RECOVERY_EVENTS.append(recovery_event)

                    if transport_dead and TRANSPORT_RECOVERY_DECKS_TRIED[recovery_key] < MAX_RETRIES:
                        # ── Recover: close dead session, connect fresh ──
                        log('TRANSPORT_RECOVERY: deck=%s attempt=%d recovery_attempt=%d' %
                            (deck_id, attempt, TRANSPORT_RECOVERY_DECKS_TRIED[recovery_key] + 1))
                        close_session(mini)
                        mini = None

                        # Connect fresh session
                        EXECUTION_PHASE = 'case_prepare'
                        mini = connect_session()

                        # Re-establish home baseline
                        if not reset_to_home(mini)[0]:
                            # Even the fresh session cannot reach home — real failure
                            log('TRANSPORT_RECOVERY_FAILED: fresh session cannot reach home for deck=%s' % deck_id)
                            final = {
                                'course': deck['course'],
                                'deckId': deck_id,
                                'year': deck.get('yearLabel', ''),
                                'package': deck['packageName'],
                                'attempt': attempt,
                                'status': 'FAIL',
                                'failure': 'transportRecoveryFailed',
                                'steps': {'recovery': {
                                    'error': error_str,
                                    'healthProbe': health,
                                    'recoveryAttempt': TRANSPORT_RECOVERY_DECKS_TRIED[recovery_key] + 1
                                }},
                                'elapsedMs': 0
                            }
                            TRANSPORT_RECOVERY_DECKS_TRIED[recovery_key] += 1
                            # Break out of retry loop — this deck is truly dead
                            break
                        else:
                            # Recovery successful — retry the current deck
                            TRANSPORT_RECOVERY_DECKS_TRIED[recovery_key] += 1
                            TRANSPORT_RECOVERY_COUNT = sum(TRANSPORT_RECOVERY_DECKS_TRIED.values())
                            # Continue the attempt loop (re-try same deck with fresh session)
                            EXECUTION_PHASE = 'case_navigating'
                            continue
                    else:
                        # Not recoverable: either transport dead but exhausted retries,
                        # or a genuine business failure (transport alive but navigate failed)
                        final = {
                            'course': deck['course'],
                            'deckId': deck_id,
                            'year': deck.get('yearLabel', ''),
                            'package': deck['packageName'],
                            'attempt': attempt,
                            'status': 'FAIL',
                            'failure': 'sessionException',
                            'steps': {'sessionException': {
                                'error': error_str,
                                'traceback': traceback.format_exc(),
                                'transportDead': transport_dead,
                                'healthProbe': health
                            }},
                            'elapsedMs': 0
                        }

                if final.get('status') == 'PASS':
                    break

                # Standard retry for homeReset / sessionException (pre-recovery)
                if mini is not None and final.get('failure') in ('homeReset', 'sessionException'):
                    close_session(mini)
                    mini = None
                    if attempt < MAX_ATTEMPTS:
                        EXECUTION_PHASE = 'case_prepare'
                        continue
                break

            REPORT['decks'].append(final)
    finally:
        close_session(mini)


def run_hot_path(decks):
    wanted = [
        'sg/sg_01_aki',
        'itpass/01_aki',
        'sg/sg_28_haru',
        'itpass/30_aki'
    ]
    lookup = {deck['deckId']: deck for deck in decks}
    for deck_id in wanted:
        if deck_id not in lookup:
            REPORT['hotPath'].append({'deckId': deck_id, 'status': 'SKIP', 'reason': 'not in contract'})
            continue
        mini = None
        try:
            mini = connect_session()
            result = one_case(mini, lookup[deck_id], 1)
            result['hotPath'] = True
            REPORT['hotPath'].append(result)
        except Exception as error:
            REPORT['hotPath'].append({'deckId': deck_id, 'status': 'FAIL', 'reason': safe_str(error)})
        finally:
            close_session(mini)


# ═══════════════════════════════════════════════════════════════════════
# Finalization
# ═══════════════════════════════════════════════════════════════════════

def report_test_status():
    failures = [item for item in REPORT['decks'] if item.get('status') != 'PASS']
    hot_failures = [item for item in REPORT['hotPath'] if item.get('status') == 'FAIL']
    REPORT['status'] = 'FAILED' if failures or hot_failures or REPORT['errors'] else 'PASSED'
    REPORT['gateStatus'] = 'BLOCKED_ON_FLASHCARD_RUNTIME' if REPORT['status'] == 'FAILED' else 'READY_FOR_USER_PROOF'
    return failures, hot_failures


def finalize():
    global EXECUTION_PHASE, TRANSPORT_RECOVERY_COUNT

    # Phase 1: compute status + first report write
    failures, hot_failures = report_test_status()
    REPORT['executionPhase'] = 'report_writing'
    REPORT['cleanup'] = {'phase': 'not_started'}
    REPORT['transportRecovery'] = {
        'count': TRANSPORT_RECOVERY_COUNT,
        'events': TRANSPORT_RECOVERY_EVENTS
    }
    write_report_atomic()

    # Phase 2: restore only the isolated review-state keys before closing sessions.
    EXECUTION_PHASE = 'cleanup_started'
    REPORT['executionPhase'] = 'cleanup_started'
    if STORAGE_ISOLATION_BACKUP is not None:
        restore_mini = None
        try:
            restore_mini = connect_session()
            restore_storage_isolation(restore_mini, STORAGE_ISOLATION_BACKUP)
        except Exception as error:
            REPORT['storageIsolation']['restoreVerified'] = False
            REPORT['errors'].append({'fatal': 'storage_restore_failed: ' + safe_str(error), 'traceback': traceback.format_exc()})
        finally:
            close_session(restore_mini)

    late_sessions = close_all_sessions()
    quiescence = wait_for_runtime_quiescence()
    cleanup_failures = [item for item in SESSION_CLOSE_RESULTS if not item.get('closed')]
    REPORT['cleanup'] = {
        'phase': 'cleanup_complete',
        'sessionCloseResults': SESSION_CLOSE_RESULTS,
        'lateSessionCloseResults': late_sessions,
        'quiescence': quiescence,
        'intentionalShutdownCount': len(INTENTIONAL_SHUTDOWN_SESSION_IDS),
        'activeSessionsAtCleanupStart': len(ACTIVE_SESSIONS)
    }

    # ── Expected transport-close classification ──────────────────────
    # See R2b design: "Connection to remote host was lost" during cleanup
    # (after all tests pass and mini.shutdown() was called) is expected.
    # This is a *classification inference* — the log message itself comes
    # from the minium library for which we can't catch stderr, but we know
    # the shutdown was intentional.
    expected_transport_close = False
    transport_close_phase = None
    transport_close_session_id = None
    if EXECUTION_PHASE in ('cleanup_started', 'cleanup_complete') \
       and INTENTIONAL_SHUTDOWN_SESSION_IDS:
        expected_transport_close = True
        transport_close_phase = EXECUTION_PHASE
        transport_close_session_id = list(INTENTIONAL_SHUTDOWN_SESSION_IDS)[0]

    failures, hot_failures = report_test_status()
    EXECUTION_PHASE = 'cleanup_complete'
    REPORT['executionPhase'] = 'cleanup_complete'

    # Final report with cleanup details
    REPORT['cleanup']['expectedTransportClose'] = expected_transport_close
    REPORT['cleanup']['transportClosePhase'] = transport_close_phase
    REPORT['cleanup']['transportCloseSessionId'] = transport_close_session_id
    REPORT['cleanup']['finalExitIntent'] = 0
    write_report_atomic()

    # ── Terminal output ──────────────────────────────────────────────
    log('REPORT: %s' % REPORT_PATH)
    total_decks = len(REPORT['decks'])
    passed_decks = len([item for item in REPORT['decks'] if item.get('status') == 'PASS'])
    log('STATUS: %s | matrix=%d/%d passed | hotFailures=%d | recovery=%d' % (
        REPORT['gateStatus'],
        passed_decks,
        total_decks,
        len(hot_failures),
        TRANSPORT_RECOVERY_COUNT
    ))
    if REPORT['errors']:
        log('FATAL: %s' % REPORT['errors'][-1].get('fatal', 'unknown error'))
    elif failures:
        log('FIRST_FAILURE: %s' % failures[0].get('failure', 'unknown failure'))
    else:
        log('ALL_DECKS_PASSED')

    return 0 if REPORT['status'] == 'PASSED' else 1


# ═══════════════════════════════════════════════════════════════════════
# DevTools target binding
# ═══════════════════════════════════════════════════════════════════════

def windows_runtime_processes():
    """Return a read-only snapshot of DevTools-related Windows processes."""
    result = {'devtools': [], 'weChatAppEx': [], 'errors': []}
    if os.name != 'nt':
        return result
    try:
        completed = subprocess.run(
            ['tasklist', '/FO', 'CSV', '/NH'],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            encoding='utf-8',
            errors='replace',
            timeout=8
        )
        if completed.returncode != 0:
            result['errors'].append('tasklist_exit_%s:%s' % (completed.returncode, safe_str(completed.stderr, 300)))
            return result
        for row in csv.reader(completed.stdout.splitlines()):
            if len(row) < 2:
                continue
            image_name = row[0]
            try:
                pid = int(row[1].replace(',', ''))
            except (TypeError, ValueError):
                continue
            snapshot = {'pid': pid, 'imageName': image_name}
            lowered = image_name.lower()
            if 'wechatappex' in lowered:
                result['weChatAppEx'].append(snapshot)
            if 'devtools' in lowered or 'wechatdevtools' in lowered:
                result['devtools'].append(snapshot)
    except Exception as error:
        result['errors'].append('tasklist_failed:%s' % safe_str(error, 300))
    return result


def windows_port_owners(port):
    """Return LISTENING TCP owners for *port* without changing process state."""
    result = {'port': int(port), 'owners': [], 'errors': []}
    if os.name != 'nt':
        return result
    try:
        completed = subprocess.run(
            ['netstat', '-ano', '-p', 'tcp'],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            encoding='utf-8',
            errors='replace',
            timeout=8
        )
        if completed.returncode != 0:
            result['errors'].append('netstat_exit_%s:%s' % (completed.returncode, safe_str(completed.stderr, 300)))
            return result
        suffix = ':%s' % int(port)
        seen = set()
        for line in completed.stdout.splitlines():
            columns = line.split()
            if len(columns) < 5 or columns[0].upper() != 'TCP' or columns[3].upper() != 'LISTENING':
                continue
            if not columns[1].endswith(suffix):
                continue
            try:
                pid = int(columns[-1])
            except (TypeError, ValueError):
                continue
            if pid not in seen:
                seen.add(pid)
                result['owners'].append(pid)
    except Exception as error:
        result['errors'].append('netstat_failed:%s' % safe_str(error, 300))
    return result


def verify_target_binding(mini):
    """Verify the DevTools session is connected to the correct worktree.

    Returns a dict with 'verified' (bool) and a fingerprint of the runtime.
    If verification fails, returns 'verified': False and a 'reason'.
    """
    result = {
        'verified': False,
        'projectRoot': PROJECT,
        'realProjectRoot': os.path.realpath(PROJECT),
        'devtoolsPid': None,
        'devtoolsPids': [],
        'weChatAppExPids': [],
        'multipleDevtoolsInstances': False,
        'automationPort': int(os.environ.get('MINIUM_TEST_PORT', '9420')),
        'portOwnerPids': [],
        'processSnapshotErrors': [],
        'debugPort': None,
        'connectionMode': 'ide',
        'sourceTreeFingerprint': '',
        'runtimeFingerprint': {},
        'reason': ''
    }

    process_snapshot = windows_runtime_processes()
    result['devtoolsPids'] = [entry.get('pid') for entry in process_snapshot.get('devtools', [])]
    result['weChatAppExPids'] = [entry.get('pid') for entry in process_snapshot.get('weChatAppEx', [])]
    result['multipleDevtoolsInstances'] = len(result['devtoolsPids']) > 1
    port_snapshot = windows_port_owners(result['automationPort'])
    result['portOwnerPids'] = port_snapshot.get('owners', [])
    result['processSnapshotErrors'] = process_snapshot.get('errors', []) + port_snapshot.get('errors', [])
    if len(result['portOwnerPids']) == 1:
        result['devtoolsPid'] = result['portOwnerPids'][0]
    elif len(result['devtoolsPids']) == 1:
        result['devtoolsPid'] = result['devtoolsPids'][0]

    # 1. Sanity: can we reach the home page?
    try:
        mini.app.relaunch('/' + HOME_ROUTE)
    except Exception as e:
        result['reason'] = 'home_relaunch_failed: ' + safe_str(e)[:200]
        return result

    time.sleep(1.0)

    # 2. Read home route
    route = current_route(mini)
    if route != HOME_ROUTE:
        result['reason'] = 'home_route_mismatch: got %s, expected %s' % (route, HOME_ROUTE)
        result['runtimeFingerprint'] = {'route': route}
        return result

    # 3. Read page data for version check
    data = page_data(mini)
    version = data.get('version') or data.get('appVersion') or data.get('__version') or ''
    if version:
        result['runtimeFingerprint']['version'] = version

    # 4. Navigate to flashcard center and check deck counts
    try:
        mini.app.switch_tab('/' + CENTER_ROUTE)
    except Exception as e:
        result['reason'] = 'flashcard_center_failed: ' + safe_str(e)[:200]
        return result

    time.sleep(1.0)
    froute = current_route(mini)
    if froute != CENTER_ROUTE:
        result['reason'] = 'flashcard_center_route_mismatch: got %s' % froute
        return result

    fp = current_page(mini)
    if not fp:
        result['reason'] = 'flashcard_center_page_null'
        return result

    # Count course cards
    cards = fp.get_elements('.course-card') if fp else []
    result['runtimeFingerprint']['courseCardsVisible'] = len(cards)

    # Try opening SG (index 1) and count deck years
    try:
        if len(cards) >= 2:
            cards[1].click()
            time.sleep(2)
            croute = current_route(mini)
            if 'flashcard-deck-select' in croute:
                sg_data = page_data(mini)
                sg_decks = sg_data.get('decks') or []
                result['runtimeFingerprint']['sgDeckCount'] = len(sg_decks)
                result['runtimeFingerprint']['sgDeckIds'] = [d.get('yearId', '') for d in sg_decks[:5]]

                # Navigate back
                mini.app.relaunch('/' + HOME_ROUTE)
                time.sleep(1)
                mini.app.switch_tab('/' + CENTER_ROUTE)
                time.sleep(1)
                fp2 = current_page(mini)
                cards2 = fp2.get_elements('.course-card') if fp2 else []

                # Try opening IT Passport (index 0) and count deck years
                if len(cards2) >= 1:
                    cards2[0].click()
                    time.sleep(2)
                    itroute = current_route(mini)
                    if 'flashcard-deck-select' in itroute:
                        it_data = page_data(mini)
                        it_decks = it_data.get('decks') or []
                        result['runtimeFingerprint']['itpassDeckCount'] = len(it_decks)
                        result['runtimeFingerprint']['itpassDeckIds'] = [d.get('yearId', '') for d in it_decks[:5]]
    except Exception as e:
        result['runtimeFingerprint']['deckCountError'] = safe_str(e)[:200]

    # Fingerprint check: expected counts
    sg_ok = result['runtimeFingerprint'].get('sgDeckCount') == 11
    it_ok = result['runtimeFingerprint'].get('itpassDeckCount') == 15

    result['runtimeFingerprint']['deckCountMatch'] = sg_ok and it_ok

    if not sg_ok and not it_ok:
        result['reason'] = 'deck_counts_mismatch: sg=%s itpass=%s' % (
            result['runtimeFingerprint'].get('sgDeckCount', '?'),
            result['runtimeFingerprint'].get('itpassDeckCount', '?'))

    # If we got here with deck counts matching, the target is verified
    if sg_ok and it_ok:
        result['verified'] = True

    # Clean up: relaunch home
    try:
        mini.app.relaunch('/' + HOME_ROUTE)
        time.sleep(1)
    except:
        pass

    return result


# ═══════════════════════════════════════════════════════════════════════
# Entry point
# ═══════════════════════════════════════════════════════════════════════

def main():
    global EXECUTION_PHASE, TRANSPORT_RECOVERY_EVENTS, TRANSPORT_RECOVERY_DECKS_TRIED, TRANSPORT_RECOVERY_COUNT, STORAGE_ISOLATION_BACKUP
    try:
        REPORT['executionPhase'] = 'loading_contracts'
        EXECUTION_PHASE = 'running'
        decks = load_contracts()

        requested_course = os.environ.get('MINIUM_FLASHCARD_COURSE', '').strip()
        expected_by_course = {'itpass': 15, 'sg': 11}
        if requested_course:
            if requested_course not in expected_by_course:
                raise RuntimeError('unsupported course filter: %s' % requested_course)
            decks = [deck for deck in decks if deck.get('course') == requested_course]
            if len(decks) != expected_by_course[requested_course]:
                raise RuntimeError(
                    'expected %d %s decks, got %d' % (
                        expected_by_course[requested_course],
                        requested_course,
                        len(decks)
                    )
                )
        elif len(decks) != 26:
            raise RuntimeError('expected 26 decks, got %d' % len(decks))

        requested_deck_ids = [
            value.strip() for value in os.environ.get('MINIUM_FLASHCARD_DECK_IDS', '').split(',')
            if value.strip()
        ]
        if requested_deck_ids:
            lookup = {deck['deckId']: deck for deck in decks}
            missing = [deck_id for deck_id in requested_deck_ids if deck_id not in lookup]
            if missing:
                raise RuntimeError('unknown requested deckId(s): %s' % ', '.join(missing))
            decks = [lookup[deck_id] for deck_id in requested_deck_ids]

        REPORT['executionPhase'] = 'running_matrix'
        EXECUTION_PHASE = 'running'

        # ── Target binding verification ────────────────────────────
        if os.environ.get('MINIUM_FLASHCARD_SKIP_TARGET_BINDING') != '1':
            binding_mini = connect_session()
            binding = verify_target_binding(binding_mini)
            REPORT['targetBinding'] = binding
            close_session(binding_mini)
            if not binding.get('verified'):
                log('BLOCKED_ON_MINIUM_TARGET_BINDING: %s' % binding.get('reason', 'unknown'))
                REPORT['errors'].append({'fatal': 'target_binding_failed', 'targetBinding': binding})
                REPORT['status'] = 'FAILED'
                REPORT['gateStatus'] = 'BLOCKED_ON_MINIUM_TARGET_BINDING'
                return finalize()
            log('TARGET_BINDING_OK: sgDeckCount=%s itpassDeckCount=%s' % (
                binding['runtimeFingerprint'].get('sgDeckCount', '?'),
                binding['runtimeFingerprint'].get('itpassDeckCount', '?')))

        storage_mini = None
        try:
            storage_mini = connect_session()
            STORAGE_ISOLATION_BACKUP = capture_storage_isolation(storage_mini)
        finally:
            close_session(storage_mini)

        run_matrix(decks)

        if os.environ.get('MINIUM_FLASHCARD_RUN_HOT_PATH') == '1':
            REPORT['executionPhase'] = 'running_hot_path'
            EXECUTION_PHASE = 'running'
            run_hot_path(decks)

    except Exception as error:
        error_str = safe_str(error)
        REPORT['errors'].append({'fatal': error_str, 'traceback': traceback.format_exc()})

    return finalize()


if __name__ == '__main__':
    sys.exit(main())
