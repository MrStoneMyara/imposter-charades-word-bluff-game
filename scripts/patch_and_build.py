# -*- coding: utf-8 -*-
import sys
import re

from generate_all_translations import ALL_LANG_OVERRIDES

with open("scripts/build_languages_full.py", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update BASE_EN_STRINGS in build_languages_full.py
new_keys_str = """,
    "discreetlyPassNotice": "Make sure no one else is looking at your screen, then press and hold to view!",
    "peekSecretCardNotice": "Press and hold to peek at your secret card",
    "clueDiscussionRound": "Clue & Discussion Round",
    "theImposter": "The Imposter",
    "theImposters": "The Imposters",
    "whoWonRound": "Who won the round?",
    "innocentsWonBtn": "Innocents (+1)",
    "imposterWonBtn": "Imposter (+2)",
    "scoreboard": "Scoreboard",
    "backToSettings": "Back to Settings"
}"""

content = content.replace('"score": "Score"\n}', '"score": "Score"' + new_keys_str)

# 2. Update LanguageData interface
new_interface_str = """    round: string;
    suspect: string;
    score: string;
    discreetlyPassNotice: string;
    peekSecretCardNotice: string;
    clueDiscussionRound: string;
    theImposter: string;
    theImposters: string;
    whoWonRound: string;
    innocentsWonBtn: string;
    imposterWonBtn: string;
    scoreboard: string;
    backToSettings: string;
  };"""

content = content.replace("""    round: string;
    suspect: string;
    score: string;
  };""", new_interface_str)

# 3. Add import and injection in get_strings
injection = """
from generate_all_translations import ALL_LANG_OVERRIDES

# Generate localized strings for other languages
def get_strings(lang_code):
    s = dict(BASE_EN_STRINGS)
    if lang_code in TRANS:
        s.update(TRANS[lang_code])
    meta = LANG_META[lang_code]
    s["language"] = meta["menuLabel"]
    s["selectLanguage"] = meta["menuLabel"]
    if lang_code in ALL_LANG_OVERRIDES:
        s.update(ALL_LANG_OVERRIDES[lang_code])
    return s
"""

content = re.sub(
    r"# Generate localized strings for other languages\ndef get_strings\(lang_code\):[\s\S]*?print\(\"Language string resolver ready\.\"\)",
    injection + '\nprint("Language string resolver ready.")',
    content
)

with open("scripts/build_languages_full.py", "w", encoding="utf-8") as f:
    f.write(content)

print("build_languages_full.py successfully patched!")
