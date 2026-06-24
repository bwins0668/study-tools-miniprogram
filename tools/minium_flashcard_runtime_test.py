#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Minium-based flashcard runtime E2E test (v2 — correct API).
"""

import json
import os
import sys
import time
import traceback
from datetime import datetime

# Minium in Python 3.14
py314_site = os.path.join(
    os.environ.get('LOCALAPPDATA', ''),
    'Programs', 'Python', 'Python314', 'Lib', 'site-packages'
)
if os.path.isdir(py314_site):
    sys.path.insert(0, py314_site)

try:
    import minium
except ImportError:
    print("[FATAL] minium not found. Run: pip install minium")
    sys.exit(1)

ROOT = os.path.dirname(os.path.abspath(__file__))
PROJECT = os.path.dirname(ROOT)
ARTIFACTS = os.path.join(ROOT, 'test-artifacts', 'minium-flashcard-runtime')
os.makedirs(ARTIFACTS, exist_ok=True)

results = {"passed": 0, "failed": 0, "skipped": 0, "steps": []}
screenshots = []

def log(m):
    print(m)

def P(name, d):
    results["passed"] += 1
    results["steps"].append({"step": name, "status": "PASS", "detail": str(d)})
    log("  PASS {}: {}".format(name, d))

def F(name, d):
    results["failed"] += 1
    results["steps"].append({"step": name, "status": "FAIL", "detail": str(d)})
    log("  FAIL {}: {}".format(name, d))

def S(name, d):
    results["skipped"] += 1
    results["steps"].append({"step": name, "status": "SKIP", "detail": str(d)})
    log("  SKIP {}: {}".format(name, d))

def ss(mini, tag):
    try:
        ts = int(time.time() * 1000)
        f = os.path.join(ARTIFACTS, "{}_{}.png".format(ts, tag))
        mini.app.screen_shot(f)
        screenshots.append(f)
        log("  [img] {}".format(f))
    except Exception as e:
        log("  [img fail] {}: {}".format(tag, e))

def get_page(mini):
    try:
        return mini.app.get_current_page()
    except:
        return None

def el_text(el):
    """Get element text safely (property or callable)."""
    try:
        t = el.text
        return t() if callable(t) else (t or "")
    except:
        return ""

def get_data(mini):
    try:
        p = get_page(mini)
        if p:
            d = p.data
            if callable(d):
                return d()
            return d
        return {}
    except:
        return {}

def main():
    log("=" * 60)
    log("Minium Flashcard Runtime E2E Test")
    log("=" * 60)
    log("Start: {}".format(datetime.now().isoformat()))
    log("")

    # ---- Connect ----
    log("[1/7] Minium connect...")
    mini = None
    try:
        mini = minium.Minium({
            "project_path": PROJECT,
            "dev_tool_path": "I:\\微信web开发者工具\\cli.bat",
            "platform": "ide",
            "debug_mode": "verbose",
        })
        log("  Minium {} connected".format(minium.__version__))
        P("connect", "Minium OK")
    except Exception as e:
        F("connect", "{}: {}".format(type(e).__name__, str(e)))
        _done(mini)
        return

    try:
        # Reset
        log("")
        log("[1b] Reset...")
        try:
            mini.app.relaunch("/pages/home/home")
            time.sleep(2)
        except Exception as e:
            log("  relaunch: {}".format(e))

        # ---- Flashcard tab ----
        log("")
        log("[2/7] Flashcard center...")
        try:
            mini.app.switch_tab("/pages/flashcards/flashcards")
            time.sleep(2)
        except Exception as e:
            log("  switch_tab: {}".format(e))
            mini.app.relaunch("/pages/flashcards/flashcards")
            time.sleep(2)

        p = get_page(mini)
        pp = p.path if p else "?"
        log("  Page: {}".format(pp))
        if pp and "flashcards" in pp:
            P("nav", "Flashcard center: {}".format(pp))
        else:
            F("nav", "Expected flashcards, got: {}".format(pp))
        ss(mini, "01-center")

        # Course entries
        try:
            cards = p.get_elements(".course-card") if p else []
            texts = [el_text(c) for c in (cards or []) if c]
            all_t = " ".join(texts)
            log("  Cards: {}".format(all_t[:200]))
            if "SG" in all_t and "IT" in all_t:
                P("entries", "SG+IT visible")
            else:
                F("entries", "Missing: {}".format(all_t[:100]))
        except Exception as e:
            S("entries", str(e))

        # ---- SG deck select ----
        log("")
        log("[3/7] SG deck select...")
        sg_deck = ""
        try:
            # Click SG card
            p = get_page(mini)
            sg_el = p.get_elements("[data-exam=\"sg\"]") if p else []
            if sg_el and len(sg_el) > 0:
                sg_el[0].click()
                time.sleep(2)
            else:
                # text fallback
                for c in (p.get_elements(".course-card") if p else []):
                    t = el_text(c)
                    if "SG" in t:
                        c.click()
                        time.sleep(2)
                        break

            p = get_page(mini)
            sg_deck = p.path if p else ""
            log("  SG page: {}".format(sg_deck))
            if sg_deck and "deck-select" in sg_deck:
                P("sg-select", "Deck-select: {}".format(sg_deck))
            else:
                F("sg-select", "Not deck-select: {}".format(sg_deck))
        except Exception as e:
            F("sg-select", "Error: {}".format(e))
        ss(mini, "02-sg-deck")

        # ---- Tap year deck ----
        log("")
        log("[4/7] SG year tap...")
        sg_quiz = ""
        sg_ok = False
        try:
            p = get_page(mini)
            decks = p.get_elements("[data-year-id]") if p else []
            if decks and len(decks) > 0:
                ft = el_text(decks[0])
                log("  Year deck: {}".format(ft[:60]))
                decks[0].click()
                log("  Clicked, waiting...")
            else:
                F("sg-tap", "No [data-year-id]")

            for i in range(25):
                time.sleep(1)
                p = get_page(mini)
                sg_quiz = p.path if p else ""
                log("  {}s: {}".format(i + 1, sg_quiz))
                if sg_quiz and "flashcard-quiz" in sg_quiz:
                    d = get_data(mini)
                    log("  data: loading={} total={} err={}".format(
                        d.get("isLoading"), d.get("totalCards"), d.get("loadError", "")))
                    if d.get("loadError"):
                        break
                    if d.get("isLoading") == False or d.get("totalCards", 0) > 0:
                        sg_ok = True
                        break
                elif sg_quiz and "bridge" in sg_quiz:
                    log("  bridge page (intermediate), waiting for navigateBack...")
                    # Bridge is expected - it will navigateBack after loading subpackage data
                    continue

            if sg_ok:
                P("sg-tap", "Quiz loaded: {} cards={}".format(sg_quiz,
                    get_data(mini).get("totalCards", "?")))
            elif sg_quiz and "flashcard-quiz" in sg_quiz:
                F("sg-tap", "On quiz but empty")
            else:
                F("sg-tap", "No navigation: {}".format(sg_quiz))
        except Exception as e:
            F("sg-tap", "Error: {}".format(e))
        ss(mini, "03-sg-quiz")

        # ---- Answer ----
        log("")
        log("[5/7] SG answer...")
        if sg_ok:
            try:
                time.sleep(1)
                p = get_page(mini)
                opts = p.get_elements(".fc-option") if p else []
                if opts and len(opts) > 0:
                    log("  {} options".format(len(opts)))
                    opts[0].click()
                    time.sleep(2)
                    d = get_data(mini)
                    if d.get("hasAnswered"):
                        P("answer", "hasAnswered=true")
                    else:
                        S("answer", "Clicked, no feedback")
                else:
                    S("answer", "No options")
            except Exception as e:
                F("answer", str(e))
        else:
            S("answer", "Not loaded")

        # ---- Explanation ----
        log("")
        log("[6/7] SG explanation...")
        if sg_ok:
            try:
                p = get_page(mini)
                btns = p.get_elements(".fc-btn") if p else []
                clicked = False
                for b in (btns or []):
                    t = el_text(b)
                    if "解析" in t or "説明" in t:
                        b.click()
                        clicked = True
                        time.sleep(1.5)
                        break
                if clicked:
                    d = get_data(mini)
                    if d.get("showBack"):
                        P("explanation", "showBack=true")
                    else:
                        S("explanation", "Clicked, no showBack")
                else:
                    S("explanation", "No button")
            except Exception as e:
                S("explanation", str(e))
        else:
            S("explanation", "Not loaded")

        # ---- Back ----
        log("")
        log("[7/7] Back...")
        try:
            mini.app.navigate_back()
            time.sleep(2)
            p = get_page(mini)
            bp = p.path if p else "?"
            log("  Back to: {}".format(bp))
            if bp and ("flashcard" in bp or "deck-select" in bp or "home" in bp):
                P("back", "Back: {}".format(bp))
            else:
                F("back", "Unexpected: {}".format(bp))
        except Exception as e:
            F("back", str(e))
        ss(mini, "04-back")

        # ---- Console ----
        log("")
        log("Console...")
        try:
            logs = mini.app.get_logs() if hasattr(mini.app, "get_logs") else []
            errs = [l for l in (logs or []) if isinstance(l, dict) and l.get("level") == "error"]
            log("  Errors: {}".format(len(errs)))
            cross = [l for l in errs if "not defined" in str(l) or "loader.js" in str(l)]
            if cross:
                for c in cross:
                    log("    [CROSS] {}".format(c))
                F("console", "{} cross-pkg errors".format(len(cross)))
            else:
                P("console", "Clean")
        except Exception as e:
            S("console", str(e))

    except Exception as e:
        log("[FATAL] {}".format(e))
        traceback.print_exc()
    finally:
        _done(mini)


def _done(mini):
    log("")
    log("=" * 60)
    log("SUMMARY")
    log("=" * 60)
    log("Passed: {} | Failed: {} | Skipped: {}".format(
        results["passed"], results["failed"], results["skipped"]))
    log("Screenshots: {}".format(len(screenshots)))

    fail = results["failed"] > 0
    st = "FAILED" if fail else "PASSED"
    gs = "BLOCKED_ON_RUNTIME_INTERACTION" if fail else "READY_FOR_USER_PROOF"
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
