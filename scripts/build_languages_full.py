# -*- coding: utf-8 -*-
import json
import sys

# Language metadata and cultural popular names
LANG_META = {
    "en": {"name": "English", "nativeName": "English", "shortLabel": "EN", "menuLabel": "Language", "dir": "ltr", "flag": "🇺🇸", "names": ["Emma", "Liam", "Noah"]},
    "ja": {"name": "Japanese", "nativeName": "日本語", "shortLabel": "JA", "menuLabel": "言語", "dir": "ltr", "flag": "🇯🇵", "names": ["レン", "ユイ", "ハルト"]},
    "zh": {"name": "Chinese", "nativeName": "中文", "shortLabel": "ZH", "menuLabel": "语言", "dir": "ltr", "flag": "🇨🇳", "names": ["小明", "小红", "李华"]},
    "he": {"name": "Hebrew", "nativeName": "עברית", "shortLabel": "HE", "menuLabel": "שפה", "dir": "rtl", "flag": "🇮🇱", "names": ["דניאל", "נועה", "איתי"]},
    "ar": {"name": "Arabic", "nativeName": "العربية", "shortLabel": "AR", "menuLabel": "اللغة", "dir": "rtl", "flag": "🇸🇦", "names": ["عمر", "فاطمة", "يوسف"]},
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

# Translation templates for key UI strings
BASE_EN_STRINGS = {
    "appTitle": "The Imposter 🕵️‍♂️", "appTagline": "Word guessing party game", "language": "Language",
    "themeToggle": "Toggle Theme", "darkMode": "Dark Mode", "lightMode": "Light Mode",
    "startLobby": "Start Game ▷", "joinLobby": "Join with Code", "enterCode": "4-letter code",
    "enterName": "Your name", "joinBtn": "Join Game", "passAndPlay": "Pass the phone",
    "passAndPlayDesc": "Single phone mode for groups in a circle", "onlineRooms": "Play Online",
    "onlineRoomsDesc": "Each player connects on their phone", "passThePhone": "Pass the phone",
    "passThePhoneDesc": "Single device pass-and-play", "playOnline": "Play Online",
    "playOnlineDesc": "Multi-device online rooms", "lobbyCode": "LOBBY CODE", "copied": "Copied to clipboard!",
    "shareLink": "Share Link", "players": "Players", "reorderNotice": "Drag names to match seating circle order",
    "waitingForHost": "Waiting for host to start...", "startGame": "Start Game", "chooseCategory": "Choose Category",
    "allCategories": "All Categories", "deselectAll": "Deselect All", "selectAll": "Select All",
    "selectedCount": "Selected", "chaosMode": "Chaos Mode", "chaosModeDesc": "Random surprises each round",
    "howManyImposters": "How many imposters?", "imposterMajorityRule": "Max {max} imposters for {players} players (must never be majority)",
    "cluesSettings": "Clues & Assistance", "enableClues": "Give Clues to Imposter",
    "enableCluesDesc": "Provides the imposter a clue to help them blend in", "clueDifficulty": "Clue Level",
    "easy": "Easy", "medium": "Medium", "hard": "Hard", "easyClueDesc": "Direct hint about the word",
    "mediumClueDesc": "Helpful conceptual hint", "hardClueDesc": "Cryptic abstract hint",
    "giveHardClueIfFirst": "Hard clue if imposter is 1st", "giveHardClueIfFirstDesc": "If imposter speaks 1st, they get a hard clue to survive",
    "showHints": "Helpful hints", "showHintsDesc": "Show hints during debate", "category": "Category",
    "categoriesAll": "All Categories", "impostersCount": "Imposters", "imposter": "Imposter",
    "innocent": "Innocent", "yourRole": "Your Secret Role", "secretWord": "Secret Word",
    "unknownWord": "??? (You are the Imposter)", "clue": "Clue", "firstSpeakerWarning": "You speak FIRST in the circle! Here is a hard clue:",
    "tapToReveal": "Hold to peek at your word", "tapToHide": "Release to hide card",
    "holdToReveal": "Press & hold to reveal your secret card",
    "innocentInstructions": "You know the secret word. Give ONE smart clue related to it without giving it away to the imposter!",
    "imposterInstructions": "YOU ARE THE IMPOSTER! You do NOT know the word. Listen carefully, bluff, and do not get caught!",
    "firstSpeaker": "First to speak", "turnNotice": "Go around in a circle. Each person says ONE clue word.",
    "nextPlayer": "Next Player", "readyToVote": "Start Voting & Discussion", "revealImposter": "Reveal the Imposter",
    "votingTitle": "Who is the Imposter?", "votingSubtitle": "Discuss clues and cast your vote on who seems suspicious.",
    "voteBtn": "Vote", "imposterCaught": "Imposter was caught!", "imposterEscaped": "The Imposter was not found!",
    "imposterGuessTitle": "Imposter’s Last Chance!", "imposterGuessSubtitle": "The imposter gets 1 guess to steal the win by naming the secret word.",
    "submitGuess": "Submit Word Guess", "correctGuess": "The imposter guessed correctly! Imposter wins!",
    "wrongGuess": "Wrong guess! Innocents win the round!", "innocentsWin": "Innocents Win!",
    "impostersWin": "Imposter Wins!", "nextRound": "Next Round", "leaveLobby": "Leave Lobby",
    "howToPlayTitle": "How to Play", "rule1": "Everyone gets the same secret word — except the imposter.",
    "rule2": "Each player gives ONE word clue related to the secret word.",
    "rule3": "Discuss clues and reveal who the imposter is!", "selectLanguage": "Language",
    "playerList": "Player Roster", "addPlayer": "Add Player", "minPlayersWarning": "At least 3 players required.",
    "cardPassed": "Card Seen", "passPhoneTo": "Discreetly pass the phone to:", "allRevealed": "All players have seen their cards!",
    "startDebate": "Start Clue Round", "round": "Round", "suspect": "Suspect", "score": "Score",
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
}

# Translations dictionary for UI strings across all 29 languages
TRANS = {
    "en": BASE_EN_STRINGS,
    "he": {
        "appTitle": "המתחזה 🕵️‍♂️", "appTagline": "משחק מילים ומסתורין", "language": "שפה",
        "themeToggle": "החלף ערכת נושא", "darkMode": "מצב כהה", "lightMode": "מצב בהיר",
        "startLobby": "התחל משחק ▷", "joinLobby": "הצטרף עם קוד", "enterCode": "קוד בן 4 אותיות",
        "enterName": "השם שלך", "joinBtn": "הצטרף לחדר", "passAndPlay": "העברת טלפון",
        "passAndPlayDesc": "משחקים יחד על טלפון אחד במעגל", "onlineRooms": "משחק אונליין",
        "onlineRoomsDesc": "כל שחקן מתחבר מהטלפון שלו", "passThePhone": "העברת טלפון",
        "passThePhoneDesc": "טלפון אחד עובר במעגל", "playOnline": "משחק אונליין",
        "playOnlineDesc": "חדרי משחק מרובי מכשירים", "lobbyCode": "קוד חדר", "copied": "הועתק ללוח!",
        "shareLink": "שתף קישור", "players": "שחקנים", "reorderNotice": "גרור שחקנים לפי סדר הישיבה במעגל",
        "waitingForHost": "ממתין למנהל החדר שיתחיל...", "startGame": "התחל משחק", "chooseCategory": "בחר קטגוריה",
        "allCategories": "כל הקטגוריות", "deselectAll": "בטל הכל", "selectAll": "בחר הכל",
        "selectedCount": "נבחרו", "chaosMode": "מצב כאוס", "chaosModeDesc": "הפתעות אקראיות בכל סיבוב",
        "howManyImposters": "כמה מתחזים?", "imposterMajorityRule": "מקסימום {max} מתחזים מתוך {players} שחקנים (לעולם לא רוב)",
        "cluesSettings": "רמזים ועזרה", "enableClues": "תן רמז למתחזה",
        "enableCluesDesc": "מעניק למתחזה רמז כדי לעזור לו להשתלב", "clueDifficulty": "רמת רמז",
        "easy": "קל", "medium": "בינוני", "hard": "קשה", "easyClueDesc": "רמז ישיר על המילה",
        "mediumClueDesc": "רמז מושגי מועיל", "hardClueDesc": "רמז מופשט ומסתורי",
        "giveHardClueIfFirst": "רמז קשה אם ראשון", "giveHardClueIfFirstDesc": "אם המתחזה מתחיל, יקבל רמז קשה לשרוד",
        "showHints": "רמזים מסייעים", "showHintsDesc": "הצג רמזים בדיון", "category": "קטגוריה",
        "categoriesAll": "כל הקטגוריות", "impostersCount": "מתחזים", "imposter": "מתחזה",
        "innocent": "תמים", "yourRole": "התפקיד הסודי שלך", "secretWord": "המילה הסודית",
        "unknownWord": "??? (אתה המתחזה)", "clue": "רמז", "firstSpeakerWarning": "אתה מדבר ראשון במעגל! הנה רמז קשה:",
        "tapToReveal": "לחץ להצגת המילה", "tapToHide": "שחרר להסתרת הכרטיס",
        "holdToReveal": "לחץ והחזק כדי לחשוף את הכרטיס",
        "innocentInstructions": "אתה יודע את המילה הסודית! תן רמז חכם אחד מבלי לחשוף אותה למתחזה.",
        "imposterInstructions": "אתה המתחזה! אתה לא יודע את המילה. הקשב היטב, בלף, ואל תיתפס!",
        "firstSpeaker": "מתחיל לדבר", "turnNotice": "עוברים במעגל. כל אחד אומר מילת רמז אחת.",
        "nextPlayer": "לשחקן הבא", "readyToVote": "מעבר להצבעה ודיון", "revealImposter": "חשוף את המתחזה",
        "votingTitle": "מי המתחזה?", "votingSubtitle": "דנו ברמזים והצביעו על החשוד.",
        "voteBtn": "הצבע", "imposterCaught": "המתחזה נתפס!", "imposterEscaped": "המתחזה לא התגלה!",
        "imposterGuessTitle": "הזדמנות אחרונה למתחזה!", "imposterGuessSubtitle": "למתחזה יש ניחוש אחד לגנוב את הניצחון על ידי ניחוש המילה הסודית.",
        "submitGuess": "שלח ניחוש מילה", "correctGuess": "המתחזה ניחש נכון וניצח!",
        "wrongGuess": "ניחוש שגוי! התמימים ניצחו בסיבוב!", "innocentsWin": "התמימים ניצחו!",
        "impostersWin": "המתחזה ניצח!", "nextRound": "סיבוב הבא", "leaveLobby": "יציאה מהחדר",
        "howToPlayTitle": "איך משחקים", "rule1": "כולם מקבלים את אותה המילה הסודית — חוץ מהמתחזה.",
        "rule2": "כל שחקן אומר בתורו רמז אחד הקשור למילה.",
        "rule3": "בסוף הסיבוב חושפים את המתחזה!", "selectLanguage": "שפה",
        "playerList": "רשימת שחקנים", "addPlayer": "הוסף שחקן", "minPlayersWarning": "דרושים לפחות 3 שחקנים.",
        "cardPassed": "הכרטיס נצפה", "passPhoneTo": "העבר את הטלפון בדיסקרטיות ל:", "allRevealed": "כל השחקנים ראו את הכרטיס שלהם!",
        "startDebate": "התחל סיבוב רמזים", "round": "סיבוב", "suspect": "חשוד", "score": "ניקוד"
    }
}


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

print("Language string resolver ready.")

# Categories definition per language
CATS = {
    "en": {"objects": "Everyday Objects", "food": "Food", "countries": "Countries", "professions": "Professions", "sports": "Sports", "animals": "Animals", "logos": "Logos & Brands", "transport": "Transport", "nature": "Nature", "music": "Music", "hobbies": "Hobbies"},
    "he": {"objects": "חפצי יומיום", "food": "אוכל", "countries": "מדינות", "professions": "מקצועות", "sports": "ספורט", "animals": "חיות", "logos": "לוגואים", "transport": "תחבורה", "nature": "טבע", "music": "מוזיקה", "hobbies": "תחביבים"},
    "ar": {"objects": "أدوات يومية", "food": "طعام", "countries": "دول", "professions": "مهن", "sports": "رياضة", "animals": "حيوانات", "logos": "علامات تجارية", "transport": "مواصلات", "nature": "طبيعة", "music": "موسيقى", "hobbies": "هوايات"},
    "ja": {"objects": "日用品", "food": "食べ物", "countries": "国・地域", "professions": "職業", "sports": "スポーツ", "animals": "動物", "logos": "有名ブランド", "transport": "乗り物", "nature": "自然", "music": "音楽", "hobbies": "趣味"},
    "zh": {"objects": "日常物品", "food": "美食佳肴", "countries": "世界国家", "professions": "职业身份", "sports": "体育运动", "animals": "可爱动物", "logos": "知名品牌", "transport": "交通工具", "nature": "自然风光", "music": "音乐艺术", "hobbies": "休闲爱好"},
    "de": {"objects": "Alltagsgegenstände", "food": "Essen & Trinken", "countries": "Länder", "professions": "Berufe", "sports": "Sport", "animals": "Tiere", "logos": "Marken", "transport": "Verkehrsmittel", "nature": "Natur", "music": "Musik", "hobbies": "Hobbys"},
    "es": {"objects": "Objetos Cotidianos", "food": "Comida", "countries": "Países", "professions": "Profesiones", "sports": "Deportes", "animals": "Animales", "logos": "Marcas", "transport": "Transporte", "nature": "Naturaleza", "music": "Música", "hobbies": "Aficiones"},
    "fr": {"objects": "Objets du Quotidien", "food": "Nourriture", "countries": "Pays", "professions": "Métiers", "sports": "Sports", "animals": "Animaux", "logos": "Marques", "transport": "Transports", "nature": "Nature", "music": "Musique", "hobbies": "Loisirs"},
    "it": {"objects": "Oggetti Quotidiani", "food": "Cibo", "countries": "Paesi", "professions": "Professioni", "sports": "Sport", "animals": "Animali", "logos": "Marchi", "transport": "Trasporti", "nature": "Natura", "music": "Musica", "hobbies": "Hobby"},
}

def get_categories(code):
    if code in CATS:
        return CATS[code]
    return CATS["en"]

print("Categories configured.")

# Common curated word bank with multi-language terms and hints
WORD_ITEMS = [
    {
        "cat": "objects",
        "translations": {
            "en": "Umbrella", "he": "מטריה", "ar": "مظلة", "ja": "傘", "zh": "雨伞", "de": "Regenschirm", "es": "Paraguas", "fr": "Parapluie", "it": "Ombrello", "nl": "Paraplu", "pl": "Parasol", "pt": "Guarda-chuva", "no": "Paraply", "ru": "Зонт", "da": "Paraply", "fi": "Sateenvarjo", "sv": "Paraply", "tr": "Şemsiye", "hu": "Esernyő", "el": "Ομπρέλα", "ro": "Umbrelă", "cs": "Deštník", "hr": "Kišobran", "uk": "Парасолька", "id": "Payung", "ko": "우산", "vi": "Cái ô", "th": "ร่ม", "hi": "छाता"
        },
        "clues": {
            "easy": "Protects you from rain", "medium": "Opens up with canopy and handle", "hard": "Shield against precipitation"
        }
    },
    {
        "cat": "objects",
        "translations": {
            "en": "Sunglasses", "he": "משקפי שמש", "ar": "نظارة شمسية", "ja": "サングラス", "zh": "太阳镜", "de": "Sonnenbrille", "es": "Gafas de sol", "fr": "Lunettes de soleil", "it": "Occhiali da sole", "nl": "Zonnebril", "pl": "Okulary przeciwsłoneczne", "pt": "Óculos de sol", "no": "Solbriller", "ru": "Солнцезащитные очки", "da": "Solbriller", "fi": "Aurinkolasit", "sv": "Solglasögon", "tr": "Güneş gözlüğü", "hu": "Napszemüveg", "el": "Γυαλιά ηλίου", "ro": "Ochelari de soare", "cs": "Sluneční brýle", "hr": "Sunčane naočale", "uk": "Сонцезахисні окуляри", "id": "Kacamata hitam", "ko": "선글라스", "vi": "Kính râm", "th": "แว่นกันแดด", "hi": "धूप का चश्मा"
        },
        "clues": {
            "easy": "Worn on sunny days", "medium": "Dark lenses over eyes", "hard": "UV protection eyewear"
        }
    },
    {
        "cat": "objects",
        "translations": {
            "en": "Smartphone", "he": "סמארטפון", "ar": "هاتف ذكي", "ja": "スマホ", "zh": "智能手机", "de": "Smartphone", "es": "Teléfono inteligente", "fr": "Smartphone", "it": "Smartphone", "nl": "Smartphone", "pl": "Smartfon", "pt": "Smartphone", "no": "Smarttelefon", "ru": "Смартфон", "da": "Smartphone", "fi": "Älypuhelin", "sv": "Smarttelefon", "tr": "Akıllı telefon", "hu": "Okostelefon", "el": "Smartphone", "ro": "Smartphone", "cs": "Chytrý telefon", "hr": "Pametni telefon", "uk": "Смартфон", "id": "Ponsel pintar", "ko": "스마트폰", "vi": "Điện thoại thông minh", "th": "สมาร์ทโฟน", "hi": "स्मार्टफोन"
        },
        "clues": {
            "easy": "Touchscreen in your pocket", "medium": "Calls, messages and camera", "hard": "Handheld digital device"
        }
    },
    {
        "cat": "objects",
        "translations": {
            "en": "Wristwatch", "he": "שעון יד", "ar": "ساعة يد", "ja": "腕時計", "zh": "手表", "de": "Armbanduhr", "es": "Reloj de pulsera", "fr": "Montre", "it": "Orologio da polso", "nl": "Horloge", "pl": "Zegarek", "pt": "Relógio de pulso", "no": "Armbåndsur", "ru": "Наручные часы", "da": "Armbåndsur", "fi": "Rannekello", "sv": "Armbandsur", "tr": "Kol saati", "hu": "Karóra", "el": "Ρολόι χειρός", "ro": "Ceas de mână", "cs": "Náramkové hodinky", "hr": "Ručni sat", "uk": "Наручний годинник", "id": "Jam tangan", "ko": "손목시계", "vi": "Đồng hồ đeo tay", "th": "นาฬิกาข้อมือ", "hi": "कलाई घड़ी"
        },
        "clues": {
            "easy": "Worn on wrist to tell time", "medium": "Has hands or digital display", "hard": "Horological accessory"
        }
    },
    {
        "cat": "food",
        "translations": {
            "en": "Pizza", "he": "פיצה", "ar": "بيتزا", "ja": "ピザ", "zh": "比萨饼", "de": "Pizza", "es": "Pizza", "fr": "Pizza", "it": "Pizza", "nl": "Pizza", "pl": "Pizza", "pt": "Pizza", "no": "Pizza", "ru": "Пицца", "da": "Pizza", "fi": "Pizza", "sv": "Pizza", "tr": "Pizza", "hu": "Pizza", "el": "Πίτσα", "ro": "Pizza", "cs": "Pizza", "hr": "Pizza", "uk": "Піца", "id": "Pizza", "ko": "피자", "vi": "Pizza", "th": "พิซซ่า", "hi": "पिज़्ज़ा"
        },
        "clues": {
            "easy": "Round baked dough with cheese", "medium": "Italian flatbread with toppings", "hard": "Neapolitan wood oven specialty"
        }
    },
    {
        "cat": "food",
        "translations": {
            "en": "Sushi", "he": "סושי", "ar": "سوشي", "ja": "寿司", "zh": "寿司", "de": "Sushi", "es": "Sushi", "fr": "Sushi", "it": "Sushi", "nl": "Sushi", "pl": "Sushi", "pt": "Sushi", "no": "Sushi", "ru": "Суши", "da": "Sushi", "fi": "Sushi", "sv": "Sushi", "tr": "Suşi", "hu": "Sushi", "el": "Σούσι", "ro": "Sushi", "cs": "Suši", "hr": "Sushi", "uk": "Суші", "id": "Sushi", "ko": "초밥", "vi": "Sushi", "th": "ซูชิ", "hi": "सुशी"
        },
        "clues": {
            "easy": "Rolled rice with raw fish", "medium": "Japanese specialty with nori", "hard": "Edomae culinary specialty"
        }
    },
    {
        "cat": "food",
        "translations": {
            "en": "Chocolate", "he": "שוקולד", "ar": "شوكولاتة", "ja": "チョコレート", "zh": "巧克力", "de": "Schokolade", "es": "Chocolate", "fr": "Chocolat", "it": "Cioccolato", "nl": "Chocolade", "pl": "Czekolada", "pt": "Chocolate", "no": "Sjokolade", "ru": "Шоколад", "da": "Chokolade", "fi": "Suklaa", "sv": "Choklad", "tr": "Çikolata", "hu": "Csokoládé", "el": "Σοκολάτα", "ro": "Ciocolată", "cs": "Čokoláda", "hr": "Čokolada", "uk": "Шоколад", "id": "Cokelat", "ko": "초콜릿", "vi": "Sô-cô-la", "th": "ช็อกโกแลต", "hi": "चॉकलेट"
        },
        "clues": {
            "easy": "Sweet brown treat from cocoa", "medium": "Confection made from cacao beans", "hard": "Theobroma cacao sweets"
        }
    },
    {
        "cat": "food",
        "translations": {
            "en": "Coffee", "he": "קפה", "ar": "قهوة", "ja": "コーヒー", "zh": "咖啡", "de": "Kaffee", "es": "Café", "fr": "Café", "it": "Caffè", "nl": "Koffie", "pl": "Kawa", "pt": "Café", "no": "Kaffe", "ru": "Кофе", "da": "Kaffe", "fi": "Kahvi", "sv": "Kaffe", "tr": "Kahve", "hu": "Kávé", "el": "Καφές", "ro": "Cafea", "cs": "Káva", "hr": "Kava", "uk": "Кава", "id": "Kopi", "ko": "커피", "vi": "Cà phê", "th": "กาแฟ", "hi": "कॉफ़ी"
        },
        "clues": {
            "easy": "Hot morning roasted brew", "medium": "Caffeinated beverage", "hard": "Infusion of roasted beans"
        }
    },
    {
        "cat": "countries",
        "translations": {
            "en": "Japan", "he": "יפן", "ar": "اليابان", "ja": "日本", "zh": "日本", "de": "Japan", "es": "Japón", "fr": "Japon", "it": "Giappone", "nl": "Japan", "pl": "Japonia", "pt": "Japão", "no": "Japan", "ru": "Япония", "da": "Japan", "fi": "Japani", "sv": "Japan", "tr": "Japonya", "hu": "Japán", "el": "Ιαπωνία", "ro": "Japonia", "cs": "Japonsko", "hr": "Japan", "uk": "Японія", "id": "Jepang", "ko": "일본", "vi": "Nhật Bản", "th": "ญี่ปุ่น", "hi": "जापान"
        },
        "clues": {
            "easy": "Tokyo, cherry blossoms and Mount Fuji", "medium": "East Asian island nation", "hard": "Land of the rising sun"
        }
    },
    {
        "cat": "countries",
        "translations": {
            "en": "France", "he": "צרפת", "ar": "فرنسا", "ja": "フランス", "zh": "法国", "de": "Frankreich", "es": "Francia", "fr": "France", "it": "Francia", "nl": "Frankrijk", "pl": "Francja", "pt": "França", "no": "Frankrike", "ru": "Франция", "da": "Frankrig", "fi": "Ranska", "sv": "Frankrike", "tr": "Fransa", "hu": "Franciaország", "el": "Γαλλία", "ro": "Franța", "cs": "Francie", "hr": "Francuska", "uk": "Франція", "id": "Prancis", "ko": "프랑스", "vi": "Pháp", "th": "ฝรั่งเศส", "hi": "फ़्रांस"
        },
        "clues": {
            "easy": "Paris and Eiffel Tower", "medium": "Western European republic with tricolor", "hard": "Hexagon nation"
        }
    },
    {
        "cat": "countries",
        "translations": {
            "en": "Italy", "he": "איטליה", "ar": "إيطاليا", "ja": "イタリア", "zh": "意大利", "de": "Italien", "es": "Italia", "fr": "Italie", "it": "Italia", "nl": "Italië", "pl": "Włochy", "pt": "Itália", "no": "Italia", "ru": "Италия", "da": "Italien", "fi": "Italia", "sv": "Italien", "tr": "İtalya", "hu": "Olaszország", "el": "Ιταλία", "ro": "Italia", "cs": "Itálie", "hr": "Italija", "uk": "Італія", "id": "Italia", "ko": "이탈리아", "vi": "Ý", "th": "อิตาลี", "hi": "इटली"
        },
        "clues": {
            "easy": "Rome, Colosseum and boot shape", "medium": "Mediterranean nation famous for pizza", "hard": "Apennine peninsula"
        }
    },
    {
        "cat": "professions",
        "translations": {
            "en": "Doctor", "he": "רופא", "ar": "طبيب", "ja": "医者", "zh": "医生", "de": "Arzt", "es": "Médico", "fr": "Médecin", "it": "Medico", "nl": "Dokter", "pl": "Lekarz", "pt": "Médico", "no": "Lege", "ru": "Врач", "da": "Læge", "fi": "Lääkäri", "sv": "Läkare", "tr": "Doktor", "hu": "Orvos", "el": "Γιατρός", "ro": "Doctor", "cs": "Lékař", "hr": "Liječnik", "uk": "Лікар", "id": "Dokter", "ko": "의사", "vi": "Bác sĩ", "th": "หมอ", "hi": "डॉक्टर"
        },
        "clues": {
            "easy": "Wears white coat and heals sick people", "medium": "Works in hospital with stethoscope", "hard": "Medical practitioner"
        }
    },
    {
        "cat": "professions",
        "translations": {
            "en": "Firefighter", "he": "כבאי", "ar": "إطفائي", "ja": "消防士", "zh": "消防员", "de": "Feuerwehrmann", "es": "Bombero", "fr": "Pompier", "it": "Vigile del fuoco", "nl": "Brandweerman", "pl": "Strażak", "pt": "Bombeiro", "no": "Brannmann", "ru": "Пожарный", "da": "Brandmand", "fi": "Palomies", "sv": "Brandman", "tr": "İtfaiyeci", "hu": "Tűzoltó", "el": "Πυροσβέστης", "ro": "Pompier", "cs": "Hasič", "hr": "Vatrogasac", "uk": "Пожежник", "id": "Pemadam kebakaran", "ko": "소방관", "vi": "Lính cứu hỏa", "th": "นักดับเพลิง", "hi": "दमकलकर्मी"
        },
        "clues": {
            "easy": "Extinguishes fires with water hose", "medium": "Emergency responder with sirens and ladder", "hard": "Thermal suppression specialist"
        }
    },
    {
        "cat": "sports",
        "translations": {
            "en": "Soccer", "he": "כדורגל", "ar": "كرة القدم", "ja": "サッカー", "zh": "足球", "de": "Fußball", "es": "Fútbol", "fr": "Football", "it": "Calcio", "nl": "Voetbal", "pl": "Piłka nożna", "pt": "Futebol", "no": "Fotball", "ru": "Футбол", "da": "Fodbold", "fi": "Jalkapallo", "sv": "Fotboll", "tr": "Futbol", "hu": "Foci", "el": "Ποδόσφαιρο", "ro": "Fotbal", "cs": "Fotbal", "hr": "Nogomet", "uk": "Футбол", "id": "Sepak bola", "ko": "축구", "vi": "Bóng đá", "th": "ฟุตบอล", "hi": "फ़ुटबॉल"
        },
        "clues": {
            "easy": "Kicking black and white ball into goal", "medium": "Eleven players per team on pitch", "hard": "World's most popular sport"
        }
    },
    {
        "cat": "sports",
        "translations": {
            "en": "Basketball", "he": "כדורסל", "ar": "كرة السلة", "ja": "バスケットボール", "zh": "篮球", "de": "Basketball", "es": "Baloncesto", "fr": "Basket-ball", "it": "Pallacanestro", "nl": "Basketbal", "pl": "Koszykówka", "pt": "Basquetebol", "no": "Basketball", "ru": "Баскетбол", "da": "Basketball", "fi": "Koripallo", "sv": "Basket", "tr": "Basketbol", "hu": "Kosárlabda", "el": "Μπάσκετ", "ro": "Baschet", "cs": "Basketbal", "hr": "Košarka", "uk": "Баскетбол", "id": "Bola basket", "ko": "농구", "vi": "Bóng rổ", "th": "บาสเกตบอล", "hi": "बास्केटबॉल"
        },
        "clues": {
            "easy": "Dribbling orange ball through hoop", "medium": "Court game with 3-pointers and dunks", "hard": "Five-a-side hardwood game"
        }
    },
    {
        "cat": "animals",
        "translations": {
            "en": "Elephant", "he": "פיל", "ar": "فيل", "ja": "ゾウ", "zh": "大象", "de": "Elefant", "es": "Elefante", "fr": "Éléphant", "it": "Elefante", "nl": "Olifant", "pl": "Słoń", "pt": "Elefante", "no": "Elefant", "ru": "Слон", "da": "Elefant", "fi": "Norsu", "sv": "Elefant", "tr": "Fil", "hu": "Elefánt", "el": "Ελέφαντας", "ro": "Elefant", "cs": "Slon", "hr": "Slon", "uk": "Слон", "id": "Gajah", "ko": "코끼리", "vi": "Con voi", "th": "ช้าง", "hi": "हाथी"
        },
        "clues": {
            "easy": "Huge mammal with long trunk and tusks", "medium": "Largest living land animal", "hard": "Savanna pachyderm"
        }
    },
    {
        "cat": "animals",
        "translations": {
            "en": "Lion", "he": "אריה", "ar": "أسد", "ja": "ライオン", "zh": "狮子", "de": "Löwe", "es": "León", "fr": "Lion", "it": "Leone", "nl": "Leeuw", "pl": "Lew", "pt": "Leão", "no": "Løve", "ru": "Лев", "da": "Løve", "fi": "Leijona", "sv": "Lejon", "tr": "Aslan", "hu": "Oroszlán", "el": "Λιοντάρι", "ro": "Leu", "cs": "Lev", "hr": "Lav", "uk": "Лев", "id": "Singa", "ko": "사자", "vi": "Sư tử", "th": "สิงโต", "hi": "शेर"
        },
        "clues": {
            "easy": "King of the jungle with big mane", "medium": "Apex predator living in prides", "hard": "Panthera leo carnivore"
        }
    },
    {
        "cat": "logos",
        "translations": {
            "en": "Apple", "he": "אפל", "ar": "أبل", "ja": "アップル", "zh": "苹果公司", "de": "Apple", "es": "Apple", "fr": "Apple", "it": "Apple", "nl": "Apple", "pl": "Apple", "pt": "Apple", "no": "Apple", "ru": "Apple", "da": "Apple", "fi": "Apple", "sv": "Apple", "tr": "Apple", "hu": "Apple", "el": "Apple", "ro": "Apple", "cs": "Apple", "hr": "Apple", "uk": "Apple", "id": "Apple", "ko": "애플", "vi": "Apple", "th": "แอปเปิ้ล", "hi": "एप्पल"
        },
        "clues": {
            "easy": "Fruit logo with a bite taken out", "medium": "Tech giant making iPhones", "hard": "Cupertino corporate emblem"
        }
    },
    {
        "cat": "transport",
        "translations": {
            "en": "Airplane", "he": "מטוס", "ar": "طائرة", "ja": "飛行機", "zh": "飞机", "de": "Flugzeug", "es": "Avión", "fr": "Avion", "it": "Aereo", "nl": "Vliegtuig", "pl": "Samolot", "pt": "Avião", "no": "Fly", "ru": "Самолёт", "da": "Fly", "fi": "Lentokone", "sv": "Flygplan", "tr": "Uçak", "hu": "Repülőgép", "el": "Αεροπλάνο", "ro": "Avion", "cs": "Letadlo", "hr": "Avion", "uk": "Літак", "id": "Pesawat", "ko": "비행기", "vi": "Máy bay", "th": "เครื่องบิน", "hi": "हवाई जहाज"
        },
        "clues": {
            "easy": "Flies high in the sky with wings", "medium": "Transports passengers through clouds", "hard": "Fixed-wing aerodyne"
        }
    },
    {
        "cat": "nature",
        "translations": {
            "en": "Volcano", "he": "הר געש", "ar": "بركان", "ja": "火山", "zh": "火山", "de": "Vulkan", "es": "Volcán", "fr": "Volcan", "it": "Vulcano", "nl": "Vulkaan", "pl": "Wulkan", "pt": "Vulcão", "no": "Vulkan", "ru": "Вулкан", "da": "Vulkan", "fi": "Tulivuori", "sv": "Vulkan", "tr": "Yanardağ", "hu": "Vulkán", "el": "Ηφαίστειο", "ro": "Vulcan", "cs": "Sopka", "hr": "Vulkan", "uk": "Вулкан", "id": "Gunung berapi", "ko": "화산", "vi": "Núi lửa", "th": "ภูเขาไฟ", "hi": "ज्वालामुखी"
        },
        "clues": {
            "easy": "Mountain erupting hot lava and smoke", "medium": "Geological vent releasing magma", "hard": "Igneous geological structure"
        }
    },
    {
        "cat": "music",
        "translations": {
            "en": "Guitar", "he": "גיטרה", "ar": "غيتار", "ja": "ギター", "zh": "吉他", "de": "Gitarre", "es": "Guitarra", "fr": "Guitare", "it": "Chitarra", "nl": "Gitaar", "pl": "Gitara", "pt": "Guitarra", "no": "Gitar", "ru": "Гитара", "da": "Guitar", "fi": "Kitara", "sv": "Gitarr", "tr": "Gitar", "hu": "Gitár", "el": "Κιθάρα", "ro": "Chitară", "cs": "Kytara", "hr": "Gitara", "uk": "Гітара", "id": "Gitar", "ko": "기타", "vi": "Đàn ghi-ta", "th": "กีตาร์", "hi": "गिटार"
        },
        "clues": {
            "easy": "Six strings instrument played by strumming", "medium": "Acoustic or electric music instrument", "hard": "Fretted chordophone"
        }
    },
    {
        "cat": "hobbies",
        "translations": {
            "en": "Photography", "he": "צילום", "ar": "تصوير", "ja": "写真", "zh": "摄影", "de": "Fotografie", "es": "Fotografía", "fr": "Photographie", "it": "Fotografia", "nl": "Fotografie", "pl": "Fotografia", "pt": "Fotografia", "no": "Fotografering", "ru": "Фотография", "da": "Fotografi", "fi": "Valokuvaus", "sv": "Fotografering", "tr": "Fotoğrafçılık", "hu": "Fotózás", "el": "Φωτογραφία", "ro": "Fotografie", "cs": "Fotografování", "hr": "Fotografija", "uk": "Фотографія", "id": "Fotografi", "ko": "사진 촬영", "vi": "Nhiếp ảnh", "th": "การถ่ายภาพ", "hi": "फ़ोटोग्राफ़ी"
        },
        "clues": {
            "easy": "Taking pictures with a camera", "medium": "Capturing moments with lens and shutter", "hard": "Optical exposure craft"
        }
    }
]

print(f"Loaded {len(WORD_ITEMS)} base word sets.")

CATEGORIES_LIST = [
    "objects", "food", "countries", "professions", "sports",
    "animals", "logos", "transport", "nature", "music", "hobbies"
]

def build_words_for_lang(lang_code):
    res = {c: [] for c in CATEGORIES_LIST}
    for item in WORD_ITEMS:
        cat = item["cat"]
        w = item["translations"].get(lang_code, item["translations"]["en"])
        clues = item["clues"]
        res[cat].append({
            "word": w,
            "clues": clues
        })
    # Ensure all categories have at least 1 word
    for cat in CATEGORIES_LIST:
        if len(res[cat]) == 0:
            # Fallback duplicate
            res[cat].append({
                "word": "Secret",
                "clues": {"easy": "Party secret", "medium": "Mystery item", "hard": "Enigma"}
            })
    return res

output_data = {}
for code, meta in LANG_META.items():
    strings = get_strings(code)
    categories = get_categories(code)
    words = build_words_for_lang(code)
    output_data[code] = {
        "code": code,
        "name": meta["name"],
        "nativeName": meta["nativeName"],
        "shortLabel": meta["shortLabel"],
        "menuLabel": meta["menuLabel"],
        "dir": meta["dir"],
        "flag": meta["flag"],
        "defaultPlayerNames": meta["names"],
        "strings": strings,
        "categories": categories,
        "words": words
    }

print(f"Generated data for {len(output_data)} languages.")

# Write to src/data/languages.ts
header = """export interface CategoryItem {
  id: string;
  name: string;
  emoji: string;
}

export interface WordItem {
  word: string;
  hint?: string;
  clues?: {
    easy: string;
    medium: string;
    hard: string;
  };
}

export interface LanguageData {
  code: string;
  name: string;
  nativeName: string;
  shortLabel: string;
  menuLabel: string;
  dir: 'ltr' | 'rtl';
  flag: string;
  defaultPlayerNames: [string, string, string];
  strings: {
    appTitle: string;
    appTagline: string;
    language: string;
    themeToggle: string;
    darkMode: string;
    lightMode: string;
    startLobby: string;
    joinLobby: string;
    enterCode: string;
    enterName: string;
    joinBtn: string;
    passAndPlay: string;
    passAndPlayDesc: string;
    onlineRooms: string;
    onlineRoomsDesc: string;
    passThePhone: string;
    passThePhoneDesc: string;
    playOnline: string;
    playOnlineDesc: string;
    lobbyCode: string;
    copied: string;
    shareLink: string;
    players: string;
    reorderNotice: string;
    waitingForHost: string;
    startGame: string;
    chooseCategory: string;
    allCategories: string;
    deselectAll: string;
    selectAll: string;
    selectedCount: string;
    chaosMode: string;
    chaosModeDesc: string;
    howManyImposters: string;
    imposterMajorityRule: string;
    cluesSettings: string;
    enableClues: string;
    enableCluesDesc: string;
    clueDifficulty: string;
    easy: string;
    medium: string;
    hard: string;
    easyClueDesc: string;
    mediumClueDesc: string;
    hardClueDesc: string;
    giveHardClueIfFirst: string;
    giveHardClueIfFirstDesc: string;
    showHints: string;
    showHintsDesc: string;
    category: string;
    categoriesAll: string;
    impostersCount: string;
    imposter: string;
    innocent: string;
    yourRole: string;
    secretWord: string;
    unknownWord: string;
    clue: string;
    firstSpeakerWarning: string;
    tapToReveal: string;
    tapToHide: string;
    holdToReveal: string;
    innocentInstructions: string;
    imposterInstructions: string;
    firstSpeaker: string;
    turnNotice: string;
    nextPlayer: string;
    readyToVote: string;
    revealImposter: string;
    votingTitle: string;
    votingSubtitle: string;
    voteBtn: string;
    imposterCaught: string;
    imposterEscaped: string;
    imposterGuessTitle: string;
    imposterGuessSubtitle: string;
    submitGuess: string;
    correctGuess: string;
    wrongGuess: string;
    innocentsWin: string;
    impostersWin: string;
    nextRound: string;
    leaveLobby: string;
    howToPlayTitle: string;
    rule1: string;
    rule2: string;
    rule3: string;
    selectLanguage: string;
    playerList: string;
    addPlayer: string;
    minPlayersWarning: string;
    cardPassed: string;
    passPhoneTo: string;
    allRevealed: string;
    startDebate: string;
    round: string;
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
  };
  categories: Record<string, string>;
  categoryIcons: Record<string, string>;
  words: Record<string, WordItem[]>;
}

export const CATEGORY_KEYS = [
  'objects',
  'food',
  'countries',
  'professions',
  'sports',
  'animals',
  'logos',
  'transport',
  'nature',
  'music',
  'hobbies',
] as const;

export const CATEGORY_EMOJIS: Record<string, string> = {
  objects: '🏠',
  food: '🍕',
  countries: '🌍',
  professions: '👨‍⚕️',
  sports: '⚽',
  animals: '🐾',
  logos: '🏷️',
  transport: '✈️',
  nature: '🌈',
  music: '🎵',
  hobbies: '🎨',
};

export const DEFAULT_LANGUAGE = 'en';

"""

with open("src/data/languages.ts", "w", encoding="utf-8") as f:
    f.write(header)
    f.write("export const LANGUAGES: Record<string, LanguageData> = {\n")
    for code, ldata in output_data.items():
        f.write(f'  "{code}": {{\n')
        f.write(f'    code: "{ldata["code"]}",\n')
        f.write(f'    name: "{ldata["name"]}",\n')
        f.write(f'    nativeName: "{ldata["nativeName"]}",\n')
        f.write(f'    shortLabel: "{ldata["shortLabel"]}",\n')
        f.write(f'    menuLabel: "{ldata["menuLabel"]}",\n')
        f.write(f'    dir: "{ldata["dir"]}",\n')
        f.write(f'    flag: "{ldata["flag"]}",\n')
        f.write(f'    defaultPlayerNames: {json.dumps(ldata["defaultPlayerNames"], ensure_ascii=False)},\n')
        f.write(f'    strings: {json.dumps(ldata["strings"], ensure_ascii=False, indent=6)},\n')
        f.write(f'    categories: {json.dumps(ldata["categories"], ensure_ascii=False, indent=6)},\n')
        f.write('    categoryIcons: CATEGORY_EMOJIS,\n')
        f.write(f'    words: {json.dumps(ldata["words"], ensure_ascii=False, indent=6)}\n')
        f.write("  },\n")
    f.write("};\n")

print("Successfully wrote src/data/languages.ts!")
