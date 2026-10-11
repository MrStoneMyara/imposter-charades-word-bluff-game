# -*- coding: utf-8 -*-
import json
import os

LANG_INFO = {
    "en": {"name": "English", "nativeName": "English", "shortLabel": "EN", "menuLabel": "Language", "dir": "ltr", "flag": "🇺🇸", "names": ["Emma", "Liam", "Noah"]},
    "he": {"name": "Hebrew", "nativeName": "עברית", "shortLabel": "HE", "menuLabel": "שפה", "dir": "rtl", "flag": "🇮🇱", "names": ["דניאל", "נועה", "איתי"]},
    "ar": {"name": "Arabic", "nativeName": "العربية", "shortLabel": "AR", "menuLabel": "اللغة", "dir": "rtl", "flag": "🇸🇦", "names": ["عمر", "فاطمة", "يوسف"]},
    "ja": {"name": "Japanese", "nativeName": "日本語", "shortLabel": "JA", "menuLabel": "言語", "dir": "ltr", "flag": "🇯🇵", "names": ["レン", "ユイ", "ハルト"]},
    "zh": {"name": "Chinese", "nativeName": "中文", "shortLabel": "ZH", "menuLabel": "语言", "dir": "ltr", "flag": "🇨🇳", "names": ["小明", "小红", "李华"]},
    "de": {"name": "German", "nativeName": "Deutsch", "shortLabel": "DE", "menuLabel": "Sprache", "dir": "ltr", "flag": "🇩🇪", "names": ["Lukas", "Mia", "Felix"]},
    "es": {"name": "Spanish", "nativeName": "Español", "shortLabel": "ES", "menuLabel": "Idioma", "dir": "ltr", "flag": "🇪🇸", "names": ["Mateo", "Sofía", "Lucas"]},
    "fr": {"name": "French", "nativeName": "Français", "shortLabel": "FR", "menuLabel": "Langue", "dir": "ltr", "flag": "🇫🇷", "names": ["Lucas", "Camille", "Thomas"]},
    "it": {"name": "Italian", "nativeName": "Italiano", "shortLabel": "IT", "menuLabel": "Lingua", "dir": "ltr", "flag": "🇮🇹", "names": ["Marco", "Giulia", "Leonardo"]},
    "nl": {"name": "Dutch", "nativeName": "Nederlands", "shortLabel": "NL", "menuLabel": "Taal", "dir": "ltr", "flag": "🇳🇱", "names": ["Daan", "Emma", "Sem"]},
    "pl": {"name": "Polish", "nativeName": "Polski", "shortLabel": "PL", "menuLabel": "Język", "dir": "ltr", "flag": "🇵🇱", "names": ["Jan", "Zuzanna", "Antoni"]},
    "pt": {"name": "Portuguese", "nativeName": "Português", "shortLabel": "PT", "menuLabel": "Idioma", "dir": "ltr", "flag": "🇧🇷", "names": ["Gabriel", "Alice", "Lucas"]},
    "no": {"name": "Norwegian", "nativeName": "Norsk Bokmål", "shortLabel": "NO", "menuLabel": "Språk", "dir": "ltr", "flag": "🇳🇴", "names": ["Jakob", "Nora", "Emil"]},
    "ru": {"name": "Russian", "nativeName": "Русский", "shortLabel": "RU", "menuLabel": "Язык", "dir": "ltr", "flag": "🇷🇺", "names": ["Александр", "Анна", "Максим"]},
    "da": {"name": "Danish", "nativeName": "Dansk", "shortLabel": "DA", "menuLabel": "Sprog", "dir": "ltr", "flag": "🇩🇰", "names": ["William", "Ida", "Oliver"]},
    "fi": {"name": "Finnish", "nativeName": "Suomi", "shortLabel": "FI", "menuLabel": "Kieli", "dir": "ltr", "flag": "🇫🇮", "names": ["Eetu", "Sofia", "Onni"]},
    "sv": {"name": "Swedish", "nativeName": "Svenska", "shortLabel": "SV", "menuLabel": "Språk", "dir": "ltr", "flag": "🇸🇪", "names": ["Liam", "Alice", "Lucas"]},
    "tr": {"name": "Turkish", "nativeName": "Türkçe", "shortLabel": "TR", "menuLabel": "Dil", "dir": "ltr", "flag": "🇹🇷", "names": ["Yusuf", "Zeynep", "Emir"]},
    "hu": {"name": "Hungarian", "nativeName": "Magyar", "shortLabel": "HU", "menuLabel": "Nyelv", "dir": "ltr", "flag": "🇭🇺", "names": ["Bence", "Hanna", "Máté"]},
    "el": {"name": "Greek", "nativeName": "Ελληνικά", "shortLabel": "EL", "menuLabel": "Γλώσσα", "dir": "ltr", "flag": "🇬🇷", "names": ["Γιώργος", "Μαρία", "Νίκος"]},
    "ro": {"name": "Romanian", "nativeName": "Română", "shortLabel": "RO", "menuLabel": "Limbă", "dir": "ltr", "flag": "🇷🇴", "names": ["Andrei", "Maria", "Alexandru"]},
    "cs": {"name": "Czech", "nativeName": "Čeština", "shortLabel": "CS", "menuLabel": "Jazyk", "dir": "ltr", "flag": "🇨🇿", "names": ["Jakub", "Eliška", "Jan"]},
    "hr": {"name": "Croatian", "nativeName": "Hrvatski", "shortLabel": "HR", "menuLabel": "Jezik", "dir": "ltr", "flag": "🇭🇷", "names": ["Luka", "Mia", "Ivan"]},
    "uk": {"name": "Ukrainian", "nativeName": "Українська", "shortLabel": "UK", "menuLabel": "Мова", "dir": "ltr", "flag": "🇺🇦", "names": ["Максим", "Софія", "Олександр"]},
    "id": {"name": "Indonesian", "nativeName": "Bahasa Indonesia", "shortLabel": "ID", "menuLabel": "Bahasa", "dir": "ltr", "flag": "🇮🇩", "names": ["Budi", "Siti", "Rizky"]},
    "ko": {"name": "Korean", "nativeName": "한국어", "shortLabel": "KO", "menuLabel": "언어", "dir": "ltr", "flag": "🇰🇷", "names": ["민준", "서연", "지호"]},
    "vi": {"name": "Vietnamese", "nativeName": "Tiếng Việt", "shortLabel": "VI", "menuLabel": "Ngôn ngữ", "dir": "ltr", "flag": "🇻🇳", "names": ["Minh", "Linh", "Nam"]},
    "th": {"name": "Thai", "nativeName": "ภาษาไทย", "shortLabel": "TH", "menuLabel": "ภาษา", "dir": "ltr", "flag": "🇹🇭", "names": ["ก้อง", "ฟ้า", "บอส"]},
    "hi": {"name": "Hindi", "nativeName": "हिन्दी", "shortLabel": "HI", "menuLabel": "भाषा", "dir": "ltr", "flag": "🇮🇳", "names": ["Aarav", "Ananya", "Vivaan"]},
}

print(f"Loaded {len(LANG_INFO)} languages.")
