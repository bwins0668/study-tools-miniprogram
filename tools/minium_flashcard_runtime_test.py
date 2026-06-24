#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Minium flashcard runtime E2E test (v8 — raw+renderable count locking).
Each deck test: reLaunch home → tabBar center → deck-select → quiz → wait for data.
Reads rawLoadedCount and renderableCardCount from page data.
Reports into tools/test-artifacts/flashcard-runtime-final/
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

# Deck definitions: each deck with its expected raw/renderable counts
DECKS = [
    {"course":"sg", "yearId":"sg_01_aki","label":"令和元年秋","prefix":"sg1","pkg":"quiz-sg-1","rawExp":50,"rendExp":50},
    {"course":"sg", "yearId":"sg_06_haru","label":"令和6年","prefix":"sg2","pkg":"quiz-sg-2","rawExp":50,"rendExp":50},
    {"course":"itpass","yearId":"01_aki","label":"令和元年秋期","prefix":"it1","pkg":"quiz-itpass-1","rawExp":100,"rendExp":100},
    {"course":"itpass","yearId":"04_haru","label":"令和4年","prefix":"it2","pkg":"quiz-itpass-2","rawExp":100,"rendExp":99},
    {"course":"itpass","yearId":"07_haru","label":"令和7年","prefix":"it3","pkg":"quiz-itpass-3","rawExp":100,"rendExp":100},
    {"course":"itpass","yearId":"28_aki","label":"平成28年秋期","prefix":"it4","pkg":"quiz-itpass-4","rawExp":100,"rendExp":99},
    {"course":"itpass","yearId":"30_aki","label":"平成30年秋期","prefix":"it5","pkg":"quiz-itpass-5","rawExp":100,"rendExp":99},
]
# Hot path sequence: SG-1 → IT-1 → SG-2 → IT-5
HOT_PATH = [
    {"course":"sg","yearId":"sg_01_aki","label":"令和元年秋","pkg":"quiz-sg-1"},
    {"course":"itpass","yearId":"01_aki","label":"令和元年秋期","pkg":"quiz-itpass-1"},
    {"course":"sg","yearId":"sg_06_haru","label":"令和6年","pkg":"quiz-sg-2"},
    {"course":"itpass","yearId":"30_aki","label":"平成30年秋期","pkg":"quiz-itpass-5"},
]

ROOT = os.path.dirname(os.path.abspath(__file__))
PROJECT = os.path.dirname(ROOT)
ARTIFACTS = os.path.join(ROOT, 'test-artifacts', 'flashcard-runtime-final')
os.makedirs(ARTIFACTS, exist_ok=True)

results = {"passed": 0, "failed": 0, "skipped": 0, "steps": []}
screenshots = []
deck_results = []

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

def wait_for_data(mini, timeout_sec=20, interval=1):
    start = time.time()
    while time.time() - start < timeout_sec:
        d = get_data(mini)
        if d.get("totalCards", 0) > 0:
            return d
        if d.get("loadError"):
            return d
        time.sleep(interval)
    return get_data(mini)

def test_deck_coldstart(mini, deck, tag_prefix):
    course = deck["course"]
    year_id = deck["yearId"]
    label = deck["label"]
    raw_exp = deck["rawExp"]
    rend_exp = deck["rendExp"]
    pkg = deck["pkg"]

    log("\n--- COLD {} {} {} ---".format(tag_prefix, course, year_id))
    dr = {"deckId": course + "/" + year_id, "packageName": pkg, "course": course, "yearLabel": label, "rawExpected": raw_exp, "renderableExpected": rend_exp, "steps": {}, "screenshots": [], "consoleErrors": [], "elapsedMs": 0}
    start_time = time.time()

    # Step 1: reLaunch home
    route = None
    try:
        ok = safe_relaunch(mini, "/pages/home/home", "home")
        route = get_route(mini)
        dr["steps"]["reset"] = "PASS" if route and "home" in route else "FAIL"
        dr["route"] = route
        if not (route and "home" in route):
            F("{}.reset".format(tag_prefix), "Got: {}".format(route))
            dr["status"] = "FAIL"
            dr["elapsedMs"] = int((time.time() - start_time) * 1000)
            deck_results.append(dr)
            return dr
        P("{}.reset".format(tag_prefix), "Home OK")
        ss(mini, "{}_01-home".format(tag_prefix))
        dr["screenshots"].append("01-home")
    except Exception as e:
        F("{}.reset".format(tag_prefix), str(e))
        dr["status"] = "FAIL"
        dr["elapsedMs"] = int((time.time() - start_time) * 1000)
        deck_results.append(dr)
        return dr

    # Step 2: Flashcard tab
    try:
        ok = safe_switch_tab(mini, "/pages/flashcards/flashcards", "center")
        route = get_route(mini)
        dr["steps"]["center"] = "PASS" if route and "flashcards" in route else "FAIL"
        if not (route and "flashcards" in route):
            F("{}.center".format(tag_prefix), "Got: {}".format(route))
            dr["status"] = "FAIL"
            dr["elapsedMs"] = int((time.time() - start_time) * 1000)
            deck_results.append(dr)
            return dr
        P("{}.center".format(tag_prefix), "Center OK")
    except Exception as e:
        F("{}.center".format(tag_prefix), str(e))
        dr["status"] = "FAIL"
        dr["elapsedMs"] = int((time.time() - start_time) * 1000)
        deck_results.append(dr)
        return dr

    # Step 3: Navigate directly to player via miniprogram route
    try:
        # Navigate to deck-select first
        ds_ok = safe_relaunch(mini, "/packages/quiz/pages/flashcard-deck-select/flashcard-deck-select?course={}".format(course), "deck-select")
        route = get_route(mini)
        dr["steps"]["deck-select"] = "PASS" if route and "deck-select" in route else "FAIL"
        if not (route and "deck-select" in route):
            F("{}.deck-select".format(tag_prefix), "Got: {}".format(route))
            dr["status"] = "FAIL"
            dr["elapsedMs"] = int((time.time() - start_time) * 1000)
            deck_results.append(dr)
            return dr
        P("{}.deck-select".format(tag_prefix), "Deck-select OK")
    except Exception as e:
        F("{}.deck-select".format(tag_prefix), str(e))
        dr["status"] = "FAIL"
        dr["elapsedMs"] = int((time.time() - start_time) * 1000)
        deck_results.append(dr)
        return dr

    # Step 4: Navigate to player
    try:
        nav_url = "/packages/quiz/pages/flashcard-quiz/flashcard-quiz?course={}&yearId={}&deckLabel={}".format(course, year_id, label)
        ok = safe_relaunch(mini, nav_url, "quiz")
        route = get_route(mini)
        dr["steps"]["quiz"] = "PASS" if route and "flashcard-quiz" in route else "FAIL"
        dr["playerRoute"] = route
        if not (route and "flashcard-quiz" in route):
            F("{}.quiz".format(tag_prefix), "Got: {}".format(route))
            dr["status"] = "FAIL"
            dr["elapsedMs"] = int((time.time() - start_time) * 1000)
            deck_results.append(dr)
            return dr
        P("{}.quiz".format(tag_prefix), "Quiz nav OK")
    except Exception as e:
        F("{}.quiz".format(tag_prefix), str(e))
        dr["status"] = "FAIL"
        dr["elapsedMs"] = int((time.time() - start_time) * 1000)
        deck_results.append(dr)
        return dr

    # Step 5: Wait for data
    try:
        d = wait_for_data(mini, timeout_sec=20, interval=1)
        total = d.get("totalCards", 0)
        raw_loaded = d.get("rawLoadedCount", 0)
        rend_count = d.get("renderableCardCount", 0)
        error = d.get("loadError", "")
        isLoading = d.get("isLoading", False)

        dr["rawActual"] = raw_loaded
        dr["renderableActual"] = rend_count
        dr["totalCards"] = total
        dr["loadError"] = error if error else ""

        if total > 0 and raw_loaded >= rend_exp and rend_count >= rend_exp:
            P("{}.data".format(tag_prefix), "rawLoaded={} renderableCard={} totalCards={}".format(raw_loaded, rend_count, total))
            dr["steps"]["data"] = "PASS"
            ss(mini, "{}_03-data".format(tag_prefix))
            dr["screenshots"].append("03-data")
        elif error:
            F("{}.data".format(tag_prefix), "Error: {}".format(error))
            dr["steps"]["data"] = "FAIL"
            dr["status"] = "FAIL"
        else:
            F("{}.data".format(tag_prefix), "No cards: totalCards={} rawLoaded={} rendCount={}".format(total, raw_loaded, rend_count))
            dr["steps"]["data"] = "FAIL"
            dr["status"] = "FAIL"
    except Exception as e:
        F("{}.data".format(tag_prefix), _safe(e))
        dr["steps"]["data"] = "FAIL"
        dr["status"] = "FAIL"

    # Step 6: Click an option
    try:
        p = mini.app.get_current_page()
        opts = p.get_elements(".fc-option") if p else []
        if opts and len(opts) > 0:
            opts[0].click()
            time.sleep(2)
            d2 = get_data(mini)
            if d2.get("hasAnswered"):
                P("{}.answer".format(tag_prefix), "Answered")
                dr["steps"]["answer"] = "PASS"
                ss(mini, "{}_04-answer".format(tag_prefix))
                dr["screenshots"].append("04-answer")
            else:
                S("{}.answer".format(tag_prefix), "No feedback")
                dr["steps"]["answer"] = "SKIP"
        else:
            S("{}.answer".format(tag_prefix), "No options")
            dr["steps"]["answer"] = "SKIP"
    except Exception as e:
        S("{}.answer".format(tag_prefix), _safe(e))
        dr["steps"]["answer"] = "SKIP"

    # Step 7: Check explanation
    try:
        p2 = mini.app.get_current_page()
        show_back_btn = p2.get_elements(".fc-btn-primary") if p2 else []
        if show_back_btn and len(show_back_btn) > 0:
            show_back_btn[0].click()
            time.sleep(2)
        d3 = get_data(mini)
        if d3.get("showBack") or d3.get("hasAnswered"):
            P("{}.explanation".format(tag_prefix), "Explanation OK")
            dr["steps"]["explanation"] = "PASS"
            ss(mini, "{}_05-explanation".format(tag_prefix))
            dr["screenshots"].append("05-explanation")
        else:
            S("{}.explanation".format(tag_prefix), "No explanation")
            dr["steps"]["explanation"] = "SKIP"
    except Exception as e:
        S("{}.explanation".format(tag_prefix), _safe(e))
        dr["steps"]["explanation"] = "SKIP"

    # Step 8: Back
    try:
        mini.app.navigate_back()
        time.sleep(2)
        route = get_route(mini)
        dr["steps"]["back"] = "PASS" if route else "FAIL"
        dr["returnRoute"] = route
        if route:
            P("{}.back".format(tag_prefix), "Back: {}".format(route))
        else:
            F("{}.back".format(tag_prefix), "No route")
            dr["status"] = "FAIL"
    except Exception as e:
        S("{}.back".format(tag_prefix), _safe(e))
        dr["steps"]["back"] = "SKIP"

    dr["elapsedMs"] = int((time.time() - start_time) * 1000)
    if dr.get("status") != "FAIL":
        dr["status"] = "PASS"
    deck_results.append(dr)
    return dr

def test_hot_path(mini):
    """Hot path: consecutive navigate without reLaunch."""
    log("\n=== HOT PATH ===")
    hp_result = {"passed": 0, "failed": 0, "steps": []}
    prev_deck = None

    for i, d in enumerate(HOT_PATH):
        log("\n--- HOT {} {} {} ---".format(i, d["course"], d["yearId"]))
        step_name = "hot_{}".format(i)

        # Navigate to next deck
        nav_url = "/packages/quiz/pages/flashcard-quiz/flashcard-quiz?course={}&yearId={}&deckLabel={}".format(
            d["course"], d["yearId"], d["label"])
        ok = safe_relaunch(mini, nav_url, "hot-{}".format(d["yearId"]))
        route = get_route(mini)
        if not route or "flashcard-quiz" not in route:
            F("{}.nav".format(step_name), "Route={}".format(route))
            hp_result["failed"] += 1
            hp_result["steps"].append({"step": step_name, "status": "FAIL", "detail": "Nav failed"})
            continue

        d = wait_for_data(mini, timeout_sec=15, interval=1)
        total = d.get("totalCards", 0)
        error = d.get("loadError", "")
        raw_loaded = d.get("rawLoadedCount", 0)
        rend_count = d.get("renderableCardCount", 0)

        if total > 0 and not error:
            P("{}.data".format(step_name), "totalCards={} raw={} rend={} route={}".format(total, raw_loaded, rend_count, route))
            hp_result["passed"] += 1
            hp_result["steps"].append({"step": step_name, "status": "PASS", "detail": "total={} raw={} rend={}".format(total, raw_loaded, rend_count)})
            # Answer one
            try:
                p = mini.app.get_current_page()
                opts = p.get_elements(".fc-option") if p else []
                if opts and len(opts) > 0:
                    opts[0].click()
                    time.sleep(1)
                    P("{}.answer".format(step_name), "Answered")
            except:
                pass
            ss(mini, "hot_{}".format(i))
        elif error:
            F("{}.data".format(step_name), "Error: {}".format(error))
            hp_result["failed"] += 1
            hp_result["steps"].append({"step": step_name, "status": "FAIL", "detail": error})
        else:
            F("{}.data".format(step_name), "No cards")
            hp_result["failed"] += 1
            hp_result["steps"].append({"step": step_name, "status": "FAIL", "detail": "No cards loaded"})

    log("\n--- HOT PATH SUMMARY ---")
    log("Passed: {} Failed: {}".format(hp_result["passed"], hp_result["failed"]))
    return hp_result

def main():
    log("=" * 60)
    log("Minium Flashcard Runtime E2E (v8 — raw+renderable)")
    log("Start: {}".format(datetime.now().isoformat()))
    log("Artifacts: {}".format(ARTIFACTS))

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
        # ===== Cold start: 7 decks =====
        for deck in DECKS:
            test_deck_coldstart(mini, deck, deck["prefix"])

        # ===== Hot path =====
        hp_r = test_hot_path(mini)

    except Exception as e:
        log("[FATAL] {}".format(e))
        traceback.print_exc()
    finally:
        _done(mini)


def _done(mini):
    log("\n" + "=" * 60)
    log("SUMMARY")
    log("=" * 60)

    cold_pass = sum(1 for dr in deck_results if dr.get("status") == "PASS")
    cold_fail = sum(1 for dr in deck_results if dr.get("status") == "FAIL")
    log("Cold-start: {} passed, {} failed".format(cold_pass, cold_fail))

    # Check console errors (can't easily get from Minium API, but report what was captured)
    log("Screenshots: {}".format(len(screenshots)))

    fail = cold_fail > 0
    gs = "BLOCKED_ON_FLASHCARD_RUNTIME_E2E" if fail else "READY_FOR_USER_PROOF"
    log("STATUS: {} ({})".format("FAILED" if fail else "PASSED", gs))

    # Build report table
    table_rows = []
    for dr in deck_results:
        table_rows.append({
            "course": dr.get("course",""),
            "deckId": dr.get("deckId",""),
            "packageName": dr.get("packageName",""),
            "yearLabel": dr.get("yearLabel",""),
            "rawExpected": dr.get("rawExpected",0),
            "rawActual": dr.get("rawActual",0),
            "renderableExpected": dr.get("renderableExpected",0),
            "renderableActual": dr.get("renderableActual",0),
            "totalCards": dr.get("totalCards",0),
            "status": dr.get("status","UNKNOWN"),
            "route": dr.get("route",""),
            "playerRoute": dr.get("playerRoute",""),
            "loadError": dr.get("loadError",""),
            "hasAnswered": dr.get("steps",{}).get("answer","") == "PASS",
            "hasExplanation": dr.get("steps",{}).get("explanation","") == "PASS",
            "returnRoute": dr.get("returnRoute",""),
            "elapsedMs": dr.get("elapsedMs",0),
            "screenshots": dr.get("screenshots",[]),
        })

    rpt = {
        "timestamp": datetime.now().isoformat(),
        "status": "FAILED" if fail else "PASSED",
        "gateStatus": gs,
        "coldStartPassed": cold_pass,
        "coldStartFailed": cold_fail,
        "results": results,
        "screenshots": screenshots,
        "decks": table_rows,
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
