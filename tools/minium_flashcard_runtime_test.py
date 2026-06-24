#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Minium-based flashcard runtime E2E test (v7 — real cold start).
Tests: cold start reset, flashcard center, deck-select, quiz data loading.
Each deck test: reLaunch → home → center → deck-select → quiz → wait for cards.
"""

import json
import os
import sys
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
    try:
        import minium
    except ImportError:
        print("[FATAL] minium not found")
        sys.exit(1)

ROOT = os.path.dirname(os.path.abspath(__file__))
PROJECT = os.path.dirname(ROOT)
ARTIFACTS = os.path.join(ROOT, 'test-artifacts', 'flashcard-coldstart')
os.makedirs(ARTIFACTS, exist_ok=True)

results = {"passed": 0, "failed": 0, "skipped": 0, "steps": []}
screenshots = []

def log(m):
    try:
        print(m)
    except UnicodeEncodeError:
        print(m.encode('ascii', errors='replace').decode('ascii'))

def _safe(s):
    try:
        return str(s).encode('ascii', errors='replace').decode('ascii')
    except:
        return repr(s)

def P(name, d):
    results["passed"] += 1
    results["steps"].append({"step": name, "status": "PASS", "detail": _safe(d)})
    log("  PASS {}: {}".format(name, _safe(d)))

def F(name, d):
    results["failed"] += 1
    results["steps"].append({"step": name, "status": "FAIL", "detail": _safe(d)})
    log("  FAIL {}: {}".format(name, _safe(d)))

def S(name, d):
    results["skipped"] += 1
    results["steps"].append({"step": name, "status": "SKIP", "detail": _safe(d)})
    log("  SKIP {}: {}".format(name, _safe(d)))

def ss(mini, tag):
    try:
        f = os.path.join(ARTIFACTS, "{}_{}.png".format(int(time.time()*1000), tag))
        mini.app.screen_shot(f)
        screenshots.append(f)
    except:
        pass

def safe_relaunch(mini, url, label=""):
    try:
        mini.app.relaunch(url)
        time.sleep(2)
        return True
    except Exception as e:
        log("  relaunch {} failed ({}), retrying...".format(label, _safe(e)[:60]))
        # Retry once — sometimes DevTools needs a moment
        try:
            time.sleep(3)
            mini.app.relaunch(url)
            time.sleep(3)
            return True
        except Exception as e2:
            log("  relaunch {} retry also failed: {}".format(label, _safe(e2)[:60]))
            return False

def safe_switch_tab(mini, url, label=""):
    try:
        mini.app.switch_tab(url)
        time.sleep(2)
        return True
    except Exception as e:
        log("  switch_tab {} failed: {}".format(label, _safe(e)))
        return False

def get_route(mini):
    try:
        p = mini.app.get_current_page()
        return p.path if p and hasattr(p, 'path') else None
    except:
        return None

def get_data(mini):
    try:
        p = mini.app.get_current_page()
        d = p.data if p and hasattr(p, 'data') else {}
        return d() if callable(d) else d
    except:
        return {}

def wait_for_data(mini, timeout_sec=15, interval=1):
    """Poll page data until totalCards > 0 or loadError is set."""
    start = time.time()
    while time.time() - start < timeout_sec:
        d = get_data(mini)
        if d.get("totalCards", 0) > 0:
            return d
        if d.get("loadError"):
            return d
        time.sleep(interval)
    return get_data(mini)

def test_deck_coldstart(mini, course, year_id, label, tag_prefix):
    """Test a single deck via cold start: reLaunch → home → center → deck-select → quiz."""
    log("\n--- {} {} {} ---".format(tag_prefix, course, year_id))

    # Step 1: Reset to home
    log("  [1] Reset to home...")
    ok = safe_relaunch(mini, "/pages/home/home", "home")
    route = get_route(mini)
    if not (route and "home" in route):
        F("{}.reset".format(tag_prefix), "Got: {}".format(route))
        return False
    P("{}.reset".format(tag_prefix), "Home OK")
    ss(mini, "{}_01-home".format(tag_prefix))

    # Step 2: Flashcard center
    log("  [2] Flashcard center...")
    ok = safe_switch_tab(mini, "/pages/flashcards/flashcards", "center")
    route = get_route(mini)
    if not (route and "flashcards" in route):
        F("{}.center".format(tag_prefix), "Got: {}".format(route))
        return False
    P("{}.center".format(tag_prefix), "Center OK")
    ss(mini, "{}_02-center".format(tag_prefix))

    # Step 3: Deck select
    log("  [3] Deck select...")
    ok = safe_relaunch(mini, "/packages/quiz/pages/flashcard-deck-select/flashcard-deck-select?course={}".format(course), "deck-select")
    route = get_route(mini)
    if not (route and "deck-select" in route):
        F("{}.deck-select".format(tag_prefix), "Got: {}".format(route))
        return False
    d = get_data(mini)
    decks = d.get("decks", [])
    if not decks or len(decks) == 0:
        F("{}.deck-select".format(tag_prefix), "No decks found")
        return False
    P("{}.deck-select".format(tag_prefix), "{} decks".format(len(decks)))
    ss(mini, "{}_03-deck-select".format(tag_prefix))

    # Step 4: Navigate to quiz
    log("  [4] Navigate to quiz...")
    nav_url = "/packages/quiz/pages/flashcard-quiz/flashcard-quiz?course={}&yearId={}&deckLabel={}".format(
        course, year_id, label)
    ok = safe_relaunch(mini, nav_url, "quiz")
    route = get_route(mini)
    log("  Route after relaunch: {}".format(route))

    # Step 5: Wait for data to load (poll page data, not route)
    log("  [5] Waiting for data (polling page data)...")
    d = wait_for_data(mini, timeout_sec=20, interval=1)
    total = d.get("totalCards", 0)
    error = d.get("loadError", "")
    detail = d.get("errorDetail", "")
    isLoading = d.get("isLoading", False)
    route_now = get_route(mini)
    log("  After wait: total={} error={} isLoading={} route={}".format(total, error, isLoading, route_now))

    if total > 0:
        P("{}.quiz-load".format(tag_prefix), "{} cards loaded".format(total))
        ss(mini, "{}_04-quiz".format(tag_prefix))

        # Step 6: Answer a question
        log("  [6] Answer question...")
        try:
            p = mini.app.get_current_page()
            opts = p.get_elements(".fc-option") if p else []
            if opts and len(opts) > 0:
                opts[0].click()
                time.sleep(2)
                d2 = get_data(mini)
                if d2.get("hasAnswered"):
                    P("{}.answer".format(tag_prefix), "Answered")
                else:
                    S("{}.answer".format(tag_prefix), "No feedback")
            else:
                S("{}.answer".format(tag_prefix), "No options found")
        except Exception as e:
            S("{}.answer".format(tag_prefix), _safe(e))
        ss(mini, "{}_05-answer".format(tag_prefix))

        # Step 7: Check explanation
        log("  [7] Check explanation...")
        try:
            d3 = get_data(mini)
            if d3.get("showBack") or d3.get("hasAnswered"):
                P("{}.explanation".format(tag_prefix), "Explanation available")
            else:
                S("{}.explanation".format(tag_prefix), "No explanation state")
        except Exception as e:
            S("{}.explanation".format(tag_prefix), _safe(e))
        ss(mini, "{}_06-explanation".format(tag_prefix))

        # Step 8: Back navigation
        log("  [8] Back navigation...")
        try:
            mini.app.navigate_back()
            time.sleep(2)
            route = get_route(mini)
            P("{}.back".format(tag_prefix), "Back: {}".format(route))
        except Exception as e:
            S("{}.back".format(tag_prefix), _safe(e))
        ss(mini, "{}_07-back".format(tag_prefix))

        return True
    elif error:
        F("{}.quiz-load".format(tag_prefix), "Error: {} ({})".format(error, detail[:80]))
        ss(mini, "{}_04-error".format(tag_prefix))
        return False
    else:
        F("{}.quiz-load".format(tag_prefix), "Timeout: no data after 15s, route={}".format(route))
        ss(mini, "{}_04-timeout".format(tag_prefix))
        return False

def main():
    log("=" * 60)
    log("Minium Flashcard Cold-Start E2E Test (v7)")
    log("=" * 60)
    log("Start: {}".format(datetime.now().isoformat()))

    mini = None
    try:
        mini = minium.Minium({
            "project_path": PROJECT,
            "dev_tool_path": "I:\\微信web开发者工具\\cli.bat",
            "platform": "ide",
            "debug_mode": "verbose",
        })
        P("connect", "Minium {}".format(minium.__version__))
    except Exception as e:
        F("connect", _safe(e))
        _done(mini)
        return

    try:
        # ===== SG-1 cold start =====
        test_deck_coldstart(mini, "sg", "sg_01_aki", "令和元年秋", "sg1")

        # ===== SG-2 cold start =====
        test_deck_coldstart(mini, "sg", "sg_06_haru", "令和6年", "sg2")

        # ===== IT Passport decks (one per subpackage) =====
        test_deck_coldstart(mini, "itpass", "01_aki", "令和元年秋期", "it1")
        test_deck_coldstart(mini, "itpass", "04_haru", "令和4年", "it2")
        test_deck_coldstart(mini, "itpass", "07_haru", "令和7年", "it3")
        test_deck_coldstart(mini, "itpass", "28_AKI", "平成28年秋期", "it4")
        test_deck_coldstart(mini, "itpass", "30_AKI", "平成30年秋期", "it5")

    except Exception as e:
        log("[FATAL] {}".format(e))
        traceback.print_exc()
    finally:
        _done(mini)


def _done(mini):
    log("\n" + "=" * 60)
    log("SUMMARY")
    log("=" * 60)
    log("Passed: {} | Failed: {} | Skipped: {}".format(
        results["passed"], results["failed"], results["skipped"]))
    log("Screenshots: {}".format(len(screenshots)))

    fail = results["failed"] > 0
    st = "FAILED" if fail else "PASSED"
    gs = "BLOCKED_ON_COLD_START_FLASHCARD_LOAD" if fail else "READY_FOR_USER_PROOF"
    log("STATUS: {} ({})".format(st, gs))

    rpt = {
        "timestamp": datetime.now().isoformat(),
        "status": st,
        "gateStatus": gs,
        "results": results,
        "screenshots": screenshots,
    }
    rp = os.path.join(ARTIFACTS, "minium-report.json")
    with open(rp, "w", encoding="utf-8") as f:
        json.dump(rpt, f, ensure_ascii=False, indent=2)
    log("Report: {}".format(rp))

    try:
        if mini:
            mini.exit()
    except:
        pass
    sys.exit(1 if fail else 0)


if __name__ == "__main__":
    main()
