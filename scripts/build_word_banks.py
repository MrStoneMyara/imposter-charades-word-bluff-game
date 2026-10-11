#!/usr/bin/env python3
"""Build per-language word banks from the English source lists."""

import importlib
import json
import sys
import threading
import time
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "scripts" / "word_bank"
OUT = ROOT / "src" / "data" / "word-banks"
CACHE_PATH = SRC / "translate_cache.json"
sys.path.insert(0, str(SRC))

DROP = {}

LOCK_WORD = {"logos"}

LANGS = {
    "ja": "ja",
    "zh": "zh-CN",
    "he": "he",
    "ar": "ar",
    "de": "de",
    "es": "es",
    "fr": "fr",
    "it": "it",
    "nl": "nl",
    "pl": "pl",
    "pt": "pt",
    "no": "no",
    "ru": "ru",
    "da": "da",
    "fi": "fi",
    "sv": "sv",
    "tr": "tr",
    "hu": "hu",
    "el": "el",
    "ro": "ro",
    "cs": "cs",
    "hr": "hr",
    "uk": "uk",
    "id": "id",
    "ko": "ko",
    "vi": "vi",
    "th": "th",
    "hi": "hi",
}

MODULES = [
    ("objects", "entries_1", "OBJECTS"),
    ("food", "entries_2", "FOOD"),
    ("animals", "entries_3", "ANIMALS"),
    ("countries", "entries_4", "COUNTRIES"),
    ("professions", "entries_5", "PROFESSIONS"),
    ("sports", "entries_6", "SPORTS"),
    ("logos", "entries_7", "LOGOS"),
    ("transport", "entries_8", "TRANSPORT"),
    ("nature", "entries_9", "NATURE"),
    ("music", "entries_10", "MUSIC"),
    ("hobbies", "entries_11", "HOBBIES"),
]


def load_english():
    bank = {}
    for cat, mod_name, attr in MODULES:
        mod = importlib.import_module(mod_name)
        items = []
        seen = set()
        for word, easy, medium, hard in getattr(mod, attr):
            if word in DROP.get(cat, set()):
                continue
            key = word.lower()
            if key in seen:
                raise SystemExit(f"duplicate {cat}: {word}")
            seen.add(key)
            for label, clue in (("easy", easy), ("medium", medium), ("hard", hard)):
                if word.lower() in clue.lower():
                    raise SystemExit(f"clue leaks {cat}/{word} {label}: {clue}")
                if not clue.strip():
                    raise SystemExit(f"empty clue {cat}/{word} {label}")
            items.append({
                "word": word,
                "clues": {"easy": easy, "medium": medium, "hard": hard},
            })
        if len(items) != 100:
            raise SystemExit(f"{cat} has {len(items)} words, expected 100")
        bank[cat] = items
    return bank


def load_cache():
    if CACHE_PATH.exists():
        return json.loads(CACHE_PATH.read_text())
    return {}


CACHE_LOCK = threading.Lock()


def save_cache(cache):
    CACHE_PATH.write_text(json.dumps(cache, ensure_ascii=False))


def remember(cache, updates):
    with CACHE_LOCK:
        cache.update(updates)
        save_cache(cache)


def translate_request(text, target):
    url = (
        "https://clients5.google.com/translate_a/t?client=dict-chrome-ex&sl=en&tl="
        + urllib.parse.quote(target)
        + "&q="
        + urllib.parse.quote(text)
    )
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=40) as res:
        data = json.loads(res.read().decode())
    if isinstance(data, list) and data and isinstance(data[0], str):
        return data[0]
    if isinstance(data, str):
        return data
    return "".join(part[0] for part in data[0] if part[0])


def translate_batch(texts, target):
    joined = translate_request("\n⟦⟧\n".join(texts), target)
    parts = [p.strip() for p in joined.split("⟦⟧")]
    if len(parts) != len(texts):
        return [translate_request(text, target).strip() for text in texts]
    return parts


def translate_one(text, target):
    return translate_request(text, target).strip()


def translate_with_retry(texts, target):
    delay = 2.0
    for attempt in range(8):
        try:
            time.sleep(0.05)
            return translate_batch(texts, target)
        except Exception as err:
            if attempt == 7:
                raise
            print(f"retry {target} ({err})", flush=True)
            time.sleep(delay)
            delay = min(delay * 1.8, 30)


def strings_for_lang(bank):
    needed = []
    for cat, items in bank.items():
        for item in items:
            if cat not in LOCK_WORD:
                needed.append(item["word"])
            needed.extend(item["clues"].values())
    # unique preserve order
    seen = set()
    unique = []
    for text in needed:
        if text not in seen:
            seen.add(text)
            unique.append(text)
    return unique


CATEGORIES_BY_LANG = json.loads((SRC / "categories_by_lang.json").read_text()) if (SRC / "categories_by_lang.json").exists() else {}


def fill_language(bank, translated, code):
    out = {}
    lang_cats = CATEGORIES_BY_LANG.get(code, {})
    for cat, items in bank.items():
        cat_hard_label = lang_cats.get(cat) or translated.get(items[0]["clues"]["hard"], items[0]["clues"]["hard"])
        rows = []
        for item in items:
            word = item["word"] if cat in LOCK_WORD else translated.get(item["word"], item["word"])
            rows.append({
                "word": word,
                "clues": {
                    "easy": translated.get(item["clues"]["easy"], item["clues"]["easy"]),
                    "medium": translated.get(item["clues"]["medium"], item["clues"]["medium"]),
                    "hard": cat_hard_label,
                },
            })
        out[cat] = rows
    return out


def write_json(code, data):
    OUT.mkdir(parents=True, exist_ok=True)
    path = OUT / f"{code}.json"
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n")


def write_word_bank_module():
    codes = ["en", *LANGS.keys()]
    lines = ["// Generated by scripts/build_word_banks.py"]
    for code in codes:
        lines.append(f"import {code} from './word-banks/{code}.json';")
    lines.append("")
    lines.append("export type WordBank = Record<string, { word: string; clues: { easy: string; medium: string; hard: string } }[]>;")
    lines.append("")
    lines.append("export const WORD_BANKS: Record<string, WordBank> = {")
    for code in codes:
        lines.append(f"  {code}: {code} as WordBank,")
    lines.append("};")
    lines.append("")
    (ROOT / "src" / "data" / "wordBank.ts").write_text("\n".join(lines))


def main():
    bank = load_english()
    write_json("en", bank)
    print("wrote en", flush=True)

    cache = load_cache()
    unique = strings_for_lang(bank)

    # Immediately populate all languages with cached translations or English fallbacks
    for code, target in LANGS.items():
        translated = {text: cache.get(f"{target}\t{text}", text) for text in unique}
        write_json(code, fill_language(bank, translated, code))
        print(f"initialized {code}", flush=True)

    write_word_bank_module()

    jobs = []
    for code, target in LANGS.items():
        missing = [text for text in unique if f"{target}\t{text}" not in cache]
        jobs.append((code, target, missing))
        print(f"{code}: {len(missing)} strings to translate", flush=True)

    def work(code, target, missing):
        local = {}
        batch_size = 50
        for i in range(0, len(missing), batch_size):
            chunk = missing[i:i + batch_size]
            translated = translate_with_retry(chunk, target)
            for src, dst in zip(chunk, translated):
                local[f"{target}\t{src}"] = dst
            remember(cache, local)
            print(f"{code} {min(i + batch_size, len(missing))}/{len(missing)}", flush=True)

        target = LANGS[code]
        translated = {text: cache.get(f"{target}\t{text}", text) for text in unique}
        write_json(code, fill_language(bank, translated, code))
        print(f"wrote translated {code}", flush=True)
        return code

    with ThreadPoolExecutor(max_workers=4) as pool:
        futures = [pool.submit(work, code, target, missing) for code, target, missing in jobs if missing]
        for fut in as_completed(futures):
            fut.result()

    print("all word banks built successfully", flush=True)


if __name__ == "__main__":
    main()
