#!/usr/bin/env python3
"""
Scan word banks for leaks where a word (or any of its meaningful tokens/stems)
appears inside its hint.
"""

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
WORD_BANKS_DIR = ROOT / "src" / "data" / "word-banks"

# Common stopwords across languages that should not be treated as unique word tokens
STOPWORDS = {
    # English
    "a", "an", "the", "of", "and", "in", "on", "at", "to", "for", "with", "by", "from", "de", "la", "el",
    # German/French/Spanish articles
    "der", "die", "das", "ein", "eine", "un", "une", "des", "les", "du", "del", "los", "las", "y", "e",
}


def get_tokens(text: str, min_len: int = 3):
    """Extract alphanumeric words of length >= min_len, excluding stopwords."""
    words = re.findall(r"\b\w+\b", text.lower())
    return [w for w in words if len(w) >= min_len and w not in STOPWORDS]


def check_entry_leak(word: str, clue: str, lang: str):
    """
    Check if `clue` leaks `word`.
    Returns list of reasons / matched leaked substrings.
    """
    if not clue or not word:
        return []

    word_clean = word.strip().lower()
    clue_clean = clue.strip().lower()
    reasons = []

    # 1. Exact full word match (substring or whole word depending on script)
    # For CJK (Chinese, Japanese), word boundary \b doesn't apply
    if lang in ("zh", "ja", "ko", "th"):
        if word_clean in clue_clean:
            reasons.append(f"exact CJK substring '{word_clean}'")
    else:
        # Regex boundary check for full phrase
        escaped = re.escape(word_clean)
        if re.search(r"(?<!\w)" + escaped + r"(?!\w)", clue_clean):
            reasons.append(f"exact full phrase '{word_clean}'")
        elif word_clean in clue_clean and len(word_clean) >= 4:
            reasons.append(f"substring '{word_clean}'")

    # 2. Token match for multi-word entries (e.g. "Ice cream" leaking "cream", "Bath towel" leaking "bath")
    tokens = get_tokens(word)
    clue_tokens = get_tokens(clue, min_len=2)

    for tok in tokens:
        # Avoid single generic short tokens
        if len(tok) < 3:
            continue
        # Check whole-word token presence in clue
        for ctok in clue_tokens:
            if tok == ctok:
                reasons.append(f"token '{tok}'")
                break
            # Check stem leak for tokens length >= 4 (e.g. 'cleaner' vs 'clean', 'potato' vs 'potatoes')
            elif len(tok) >= 4 and len(ctok) >= 4:
                if ctok.startswith(tok) or tok.startswith(ctok):
                    reasons.append(f"stem match '{tok}' ~ '{ctok}'")
                    break

    return list(dict.fromkeys(reasons))  # unique preserve order


def scan_file(path: Path):
    lang = path.stem
    data = json.loads(path.read_text(encoding="utf-8"))
    leaks = []

    for cat, items in data.items():
        for idx, item in enumerate(items):
            word = item.get("word", "").strip()
            clues = item.get("clues", {})
            for diff in ("easy", "medium"):
                clue = clues.get(diff, "").strip()
                match = check_entry_leak(word, clue, lang)
                if match:
                    leaks.append({
                        "lang": lang,
                        "category": cat,
                        "index": idx,
                        "word": word,
                        "difficulty": diff,
                        "clue": clue,
                        "reasons": match,
                    })
    return leaks


def main():
    target_langs = sys.argv[1:] if len(sys.argv) > 1 else None
    all_leaks = []

    json_files = sorted(WORD_BANKS_DIR.glob("*.json"))
    if target_langs:
        json_files = [f for f in json_files if f.stem in target_langs]

    print(f"Scanning {len(json_files)} word bank files...")

    summary = {}
    for f in json_files:
        leaks = scan_file(f)
        if leaks:
            summary[f.stem] = len(leaks)
            all_leaks.extend(leaks)

    if not all_leaks:
        print(" SUCCESS: No leaks found across all checked word banks!")
        return 0

    print(f"\n Found {len(all_leaks)} total leak instances across {len(summary)} languages:")
    for lang, count in summary.items():
        print(f"  - {lang}: {count} leaks")

    # Print first few leaks per language
    print("\nSample leaks:")
    shown_langs = set()
    for item in all_leaks:
        l = item["lang"]
        if l not in shown_langs:
            shown_langs.add(l)
            print(f"\n[{l.upper()}] Word: \"{item['word']}\" ({item['category']}) | Diff: {item['difficulty']}")
            print(f"  Clue: \"{item['clue']}\"")
            print(f"  Reason: {', '.join(item['reasons'])}")

    return 1


if __name__ == "__main__":
    sys.exit(main())
