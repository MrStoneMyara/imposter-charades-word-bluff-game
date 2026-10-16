#!/usr/bin/env python3
"""
Fix word bank hint leaks across all languages.
Ensures that no hint in any language ever leaks the secret word or any of its key tokens.
"""

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
WORD_BANKS_DIR = ROOT / "src" / "data" / "word-banks"

from scripts.find_hint_leaks import scan_file, check_entry_leak

HYPERNYMS = {
    "es": {"objects": "artículo", "food": "preparación", "animals": "criatura", "countries": "nación", "professions": "especialista", "sports": "disciplina", "logos": "marca", "transport": "transporte móvil", "nature": "elemento natural", "music": "pieza sonora", "hobbies": "actividad"},
    "fr": {"objects": "article", "food": "préparation", "animals": "créature", "countries": "nation", "professions": "spécialiste", "sports": "discipline", "logos": "marque", "transport": "engin", "nature": "élément naturel", "music": "pièce sonore", "hobbies": "activité"},
    "de": {"objects": "Vorrichtung", "food": "Zubereitung", "animals": "Geschöpf", "countries": "Nation", "professions": "Fachkraft", "sports": "Disziplin", "logos": "Marke", "transport": "Gefährt", "nature": "Naturphänomen", "music": "Klangstück", "hobbies": "Aktivität"},
    "it": {"objects": "articolo", "food": "preparazione", "animals": "creatura", "countries": "nazione", "professions": "specialista", "sports": "disciplina", "logos": "marchio", "transport": "mezzo", "nature": "elemento naturale", "music": "brano sonoro", "hobbies": "attività"},
    "pt": {"objects": "artigo", "food": "preparação", "animals": "criatura", "countries": "nação", "professions": "especialista", "sports": "disciplina", "logos": "marca", "transport": "transporte", "nature": "elemento natural", "music": "peça sonora", "hobbies": "atividade"},
    "nl": {"objects": "artikel", "food": "bereiding", "animals": "wezen", "countries": "natie", "professions": "specialist", "sports": "discipline", "logos": "merk", "transport": "vervoermiddel", "nature": "natuurelement", "music": "klankstuk", "hobbies": "activiteit"},
    "da": {"objects": "genstand", "food": "anretning", "animals": "væsen", "countries": "nation", "professions": "fagperson", "sports": "disciplin", "logos": "mærke", "transport": "fartøj", "nature": "naturelement", "music": "lydstykke", "hobbies": "aktivitet"},
    "sv": {"objects": "föremål", "food": "anrättning", "animals": "varelse", "countries": "nation", "professions": "fackman", "sports": "disciplin", "logos": "märke", "transport": "farkost", "nature": "naturelement", "music": "tonstycke", "hobbies": "aktivitet"},
    "no": {"objects": "gjenstand", "food": "anretning", "animals": "vesen", "countries": "nasjon", "professions": "fagperson", "sports": "disiplin", "logos": "merke", "transport": "fartøy", "nature": "naturelement", "music": "lydstykke", "hobbies": "aktivitet"},
    "ru": {"objects": "приспособление", "food": "угощение", "animals": "создание", "countries": "страна", "professions": "мастер", "sports": "дисциплина", "logos": "бренд", "transport": "экипаж", "nature": "природный объект", "music": "звучание", "hobbies": "занятие"},
    "uk": {"objects": "пристосування", "food": "страва", "animals": "істота", "countries": "країна", "professions": "фахівець", "sports": "дисципліна", "logos": "бренд", "transport": "рухомий засіб", "nature": "природний обєкт", "music": "звучання", "hobbies": "заняття"},
    "pl": {"objects": "narzędzie", "food": "potrawa", "animals": "stworzenie", "countries": "kraj", "professions": "fachowiec", "sports": "dyscyplina", "logos": "marka", "transport": "wehikuł", "nature": "obiekt natury", "music": "utwór", "hobbies": "zajęcie"},
    "cs": {"objects": "nástroj", "food": "pokrm", "animals": "tvor", "countries": "země", "professions": "pracovník", "sports": "disciplína", "logos": "značka", "transport": "stroj", "nature": "přírodní prvek", "music": "skladba", "hobbies": "činnost"},
    "hr": {"objects": "naprava", "food": "jelo", "animals": "biće", "countries": "zemlja", "professions": "stručnjak", "sports": "disciplina", "logos": "marka", "transport": "prometalo", "nature": "prirodni element", "music": "skladba", "hobbies": "aktivnost"},
    "ro": {"objects": "piesă", "food": "preparat", "animals": "creatură", "countries": "țară", "professions": "expert", "sports": "disciplină", "logos": "marcă", "transport": "echipaj", "nature": "element natural", "music": "piesă sonoră", "hobbies": "activitate"},
    "hu": {"objects": "eszköz", "food": "fogás", "animals": "lény", "countries": "nemzet", "professions": "dolgozó", "sports": "sportág", "logos": "márka", "transport": "szerkezet", "nature": "természeti elem", "music": "hangdarab", "hobbies": "foglalkozás"},
    "fi": {"objects": "väline", "food": "annos", "animals": "olento", "countries": "valtio", "professions": "asiantuntija", "sports": "laji", "logos": "merkki", "transport": "laite", "nature": "luontokohde", "music": "sävellys", "hobbies": "harrastus"},
    "tr": {"objects": "gereç", "food": "lezzet", "animals": "canlı", "countries": "ülke", "professions": "uzman", "sports": "branş", "logos": "marka", "transport": "vasıta", "nature": "doğal yapı", "music": "ezgi", "hobbies": "uğraş"},
    "el": {"objects": "σκεύος", "food": "έδεσμα", "animals": "πλάσμα", "countries": "έθνος", "professions": "ειδικός", "sports": "άθλημα", "logos": "σήμα", "transport": "μηχάνημα", "nature": "φυσικό στοιχείο", "music": "κομμάτι", "hobbies": "δραστηριότητα"},
    "he": {"objects": "אביזר", "food": "מעדן", "animals": "יצור", "countries": "מדינה", "professions": "מומחה", "sports": "ענף", "logos": "מותג", "transport": "מכונה", "nature": "תופעה", "music": "צליל", "hobbies": "עיסוק"},
    "ar": {"objects": "أداة", "food": "وجبة", "animals": "كائن", "countries": "دولة", "professions": "مختص", "sports": "نشاط", "logos": "علامة", "transport": "آلة", "nature": "موقع طبيعي", "music": "نغمة", "hobbies": "هواية"},
    "id": {"objects": "peranti", "food": "sajian", "animals": "makhluk", "countries": "wilayah", "professions": "pakar", "sports": "cabang", "logos": "jenama", "transport": "angkutan", "nature": "bentang alam", "music": "alunan", "hobbies": "kegiatan"},
    "vi": {"objects": "đồ dùng", "food": "món ngon", "animals": "sinh linh", "countries": "vùng đất", "professions": "chuyên trách", "sports": "tranh tài", "logos": "nhãn hiệu", "transport": "xe cộ", "nature": "thắng cảnh", "music": "giai điệu", "hobbies": "thú vui"},
    "ja": {"objects": "道具", "food": "名物", "animals": "生物", "countries": "地域", "professions": "達人", "sports": "競技", "logos": "標章", "transport": "移動手段", "nature": "自然景観", "music": "旋律", "hobbies": "趣味"},
    "zh": {"objects": "器具", "food": "美食", "animals": "生灵", "countries": "疆土", "professions": "达人", "sports": "赛事", "logos": "标识", "transport": "载具", "nature": "自然风貌", "music": "韵律", "hobbies": "风雅爱好"},
    "ko": {"objects": "도구", "food": "음식", "animals": "생물", "countries": "국토", "professions": "달인", "sports": "종목", "logos": "표식", "transport": "탈것", "nature": "자연경관", "music": "가락", "hobbies": "취미"},
    "th": {"objects": "สิ่งประดิษฐ์", "food": "ตำรับอาหาร", "animals": "สรรพสัตว์", "countries": "ดินแดน", "professions": "ผู้ชำนาญ", "sports": "กีฬา", "logos": "สัญลักษณ์", "transport": "ยวดยาน", "nature": "ภูมิทัศน์", "music": "ท่วงทำนอง", "hobbies": "กิจกรรมยามว่าง"},
    "hi": {"objects": "साधन", "food": "खानपान", "animals": "प्राणी", "countries": "भूभाग", "professions": "कारीगर", "sports": "प्रतियोगिता", "logos": "पहचान", "transport": "सवारी", "nature": "प्राकृतिक छटा", "music": "सुर", "hobbies": "रुचि"},
}

CUSTOM_WORD_FIXES = {
    ("cs", "Vodní skútr"): {"vodním": "kapalinovým"},
    ("cs", "Auto"): {"automobil": "osobní vůz"},
    ("cs", "Závodní auto"): {"automobil": "vůz"},
    ("da", "terrængående køretøj"): {"terræn": "underlag"},
    ("he", "במאי קולנוע"): {"קולנועיים": "למסך הגדול"},
    ("hr", "automobil"): {"automobil": "putničko vozilo"},
    ("id", "Selai kacang"): {"kacangan": "polong-polongan"},
    ("pl", "Pojazd terenowy"): {"pojazd": "czterokołowiec"},
    ("ru", "Автомобиль"): {"автомобиль": "легковая машина"},
    ("tr", "Notalar"): {"nota": "ses"},
    ("uk", "автомобіль"): {"автомобіль": "легкова машина"},
    ("vi", "Có thể chuyển đổi"): {"phương tiện di chuyển": "mui trần"},
}


def sanitize_language_bank(path: Path):
    lang = path.stem
    data = json.loads(path.read_text(encoding="utf-8"))
    modified_count = 0

    for cat, items in data.items():
        hyp = HYPERNYMS.get(lang, {}).get(cat, "item")
        for item in items:
            word = item.get("word", "")
            clues = item.get("clues", {})
            for diff in ("easy", "medium"):
                clue = clues.get(diff, "")
                reasons = check_entry_leak(word, clue, lang)
                if not reasons:
                    continue

                new_clue = clue
                if (lang, word) in CUSTOM_WORD_FIXES:
                    for k, v in CUSTOM_WORD_FIXES[(lang, word)].items():
                        new_clue = re.sub(re.escape(k), v, new_clue, flags=re.IGNORECASE)

                tokens_to_replace = []
                for r in reasons:
                    m = re.findall(r"'([^']+)'", r)
                    tokens_to_replace.extend(m)

                for tok in tokens_to_replace:
                    if lang in ("zh", "ja", "ko", "th", "de", "da", "sv", "no", "nl"):
                        new_clue = re.sub(re.escape(tok), hyp, new_clue, flags=re.IGNORECASE)
                    else:
                        pat = re.compile(r"(?<!\w)" + re.escape(tok) + r"(?!\w)", re.IGNORECASE)
                        if pat.search(new_clue):
                            new_clue = pat.sub(hyp, new_clue)
                        else:
                            new_clue = re.sub(re.escape(tok), hyp, new_clue, flags=re.IGNORECASE)

                new_clue = " ".join(new_clue.split())
                if new_clue != clue:
                    clues[diff] = new_clue
                    modified_count += 1

    if modified_count > 0:
        path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return modified_count


def main():
    target_langs = sys.argv[1:] if len(sys.argv) > 1 else None
    json_files = sorted(WORD_BANKS_DIR.glob("*.json"))
    if target_langs:
        json_files = [f for f in json_files if f.stem in target_langs]

    print(f"Applying leak fixes to {len(json_files)} word bank files...")
    total_modified = 0
    for path in json_files:
        mod = sanitize_language_bank(path)
        if mod:
            print(f"  Fixed {mod} clue leaks in {path.stem}.json")
            total_modified += mod

    print(f"\nTotal clues sanitized: {total_modified}")

    # Re-verify with leak scanner
    all_leaks = []
    for f in json_files:
        leaks = scan_file(f)
        all_leaks.extend(leaks)

    if not all_leaks:
        print("\nSUCCESS: All word banks are 100% clean! Zero hint leaks found anywhere.")
        return 0
    else:
        print(f"\nWARNING: {len(all_leaks)} leaks still remain:")
        for l in all_leaks[:10]:
            print(f"  [{l['lang']}] {l['word']} ({l['category']}) | {l['difficulty']}: {l['clue']} -> {l['reasons']}")
        return 1


if __name__ == "__main__":
    sys.exit(main())
