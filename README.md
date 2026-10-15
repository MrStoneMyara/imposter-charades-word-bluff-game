# 🕵️‍♂️ The Imposter (Imposter Charades & Word Bluff Game)

A fast-paced multiplayer party game built with React, Vite, Tailwind CSS, and Express. Everyone in the group knows the secret word—except the imposter!

Playable in two modes:
* **📱 Pass & Play:** Single device passed around a circle of friends.
* **🌐 Online Rooms:** Realtime rooms where everyone connects on their own device with a 4-letter room code.

---

## 📚 Multilingual Word Banks & Hints (29 Languages)

The repository includes a complete database of **31,900 words & hints** across **29 languages** (1,100 words per language).

All files are stored in [`src/data/word-banks/`](src/data/word-banks/):

| Language | Code | File Link | Words | Categories |
| :--- | :---: | :--- | :---: | :---: |
| 🇺🇸 **English** | `en` | [src/data/word-banks/en.json](src/data/word-banks/en.json) | 1,100 | 11 |
| 🇪🇸 **Spanish** (Español) | `es` | [src/data/word-banks/es.json](src/data/word-banks/es.json) | 1,100 | 11 |
| 🇫🇷 **French** (Français) | `fr` | [src/data/word-banks/fr.json](src/data/word-banks/fr.json) | 1,100 | 11 |
| 🇩🇪 **German** (Deutsch) | `de` | [src/data/word-banks/de.json](src/data/word-banks/de.json) | 1,100 | 11 |
| 🇮🇹 **Italian** (Italiano) | `it` | [src/data/word-banks/it.json](src/data/word-banks/it.json) | 1,100 | 11 |
| 🇵🇹 **Portuguese** (Português) | `pt` | [src/data/word-banks/pt.json](src/data/word-banks/pt.json) | 1,100 | 11 |
| 🇳🇱 **Dutch** (Nederlands) | `nl` | [src/data/word-banks/nl.json](src/data/word-banks/nl.json) | 1,100 | 11 |
| 🇵🇱 **Polish** (Polski) | `pl` | [src/data/word-banks/pl.json](src/data/word-banks/pl.json) | 1,100 | 11 |
| 🇷🇺 **Russian** (Русский) | `ru` | [src/data/word-banks/ru.json](src/data/word-banks/ru.json) | 1,100 | 11 |
| 🇺🇦 **Ukrainian** (Українська) | `uk` | [src/data/word-banks/uk.json](src/data/word-banks/uk.json) | 1,100 | 11 |
| 🇯🇵 **Japanese** (日本語) | `ja` | [src/data/word-banks/ja.json](src/data/word-banks/ja.json) | 1,100 | 11 |
| 🇨🇳 **Chinese** (中文) | `zh` | [src/data/word-banks/zh.json](src/data/word-banks/zh.json) | 1,100 | 11 |
| 🇰🇷 **Korean** (한국어) | `ko` | [src/data/word-banks/ko.json](src/data/word-banks/ko.json) | 1,100 | 11 |
| 🇮🇱 **Hebrew** (עברית) | `he` | [src/data/word-banks/he.json](src/data/word-banks/he.json) | 1,100 | 11 |
| 🇸🇦 **Arabic** (العربية) | `ar` | [src/data/word-banks/ar.json](src/data/word-banks/ar.json) | 1,100 | 11 |
| 🇮🇳 **Hindi** (हिन्दी) | `hi` | [src/data/word-banks/hi.json](src/data/word-banks/hi.json) | 1,100 | 11 |
| 🇹🇷 **Turkish** (Türkçe) | `tr` | [src/data/word-banks/tr.json](src/data/word-banks/tr.json) | 1,100 | 11 |
| 🇬🇷 **Greek** (Ελληνικά) | `el` | [src/data/word-banks/el.json](src/data/word-banks/el.json) | 1,100 | 11 |
| 🇸🇪 **Swedish** (Svenska) | `sv` | [src/data/word-banks/sv.json](src/data/word-banks/sv.json) | 1,100 | 11 |
| 🇳🇴 **Norwegian** (Norsk Bokmål) | `no` | [src/data/word-banks/no.json](src/data/word-banks/no.json) | 1,100 | 11 |
| 🇩🇰 **Danish** (Dansk) | `da` | [src/data/word-banks/da.json](src/data/word-banks/da.json) | 1,100 | 11 |
| 🇫🇮 **Finnish** (Suomi) | `fi` | [src/data/word-banks/fi.json](src/data/word-banks/fi.json) | 1,100 | 11 |
| 🇨🇿 **Czech** (Čeština) | `cs` | [src/data/word-banks/cs.json](src/data/word-banks/cs.json) | 1,100 | 11 |
| 🇭🇷 **Croatian** (Hrvatski) | `hr` | [src/data/word-banks/hr.json](src/data/word-banks/hr.json) | 1,100 | 11 |
| 🇭🇺 **Hungarian** (Magyar) | `hu` | [src/data/word-banks/hu.json](src/data/word-banks/hu.json) | 1,100 | 11 |
| 🇷🇴 **Romanian** (Română) | `ro` | [src/data/word-banks/ro.json](src/data/word-banks/ro.json) | 1,100 | 11 |
| 🇮🇩 **Indonesian** (Bahasa Indonesia) | `id` | [src/data/word-banks/id.json](src/data/word-banks/id.json) | 1,100 | 11 |
| 🇻🇳 **Vietnamese** (Tiếng Việt) | `vi` | [src/data/word-banks/vi.json](src/data/word-banks/vi.json) | 1,100 | 11 |
| 🇹🇭 **Thai** (ภาษาไทย) | `th` | [src/data/word-banks/th.json](src/data/word-banks/th.json) | 1,100 | 11 |

---

### 📂 Categories per Language

Each language includes 100 words in each of the 11 categories (1,100 words total):
1. 💡 **Everyday Objects** (`objects`)
2. 🍕 **Food & Drinks** (`food`)
3. 🦁 **Animals** (`animals`)
4. 🌍 **Countries & Geography** (`countries`)
5. 👨‍⚕️ **Professions** (`professions`)
6. ⚽ **Sports & Activities** (`sports`)
7. 🏷️ **Logos & Brands** (`logos`)
8. 🚗 **Transport** (`transport`)
9. 🌲 **Nature** (`nature`)
10. 🎵 **Music** (`music`)
11. 🎨 **Hobbies & Leisure** (`hobbies`)

---

### 🎯 Clue Difficulty Structure

Each word item contains 3 calibrated clue levels to help the imposter blend in during gameplay:

```json
{
  "word": "Umbrella",
  "clues": {
    "easy": "Folding canopy with a handle",
    "medium": "Portable stormy weather canopy",
    "hard": "Everyday Objects"
  }
}
```

* **Easy:** Descriptive concept clue (helps beginners or casual games bluff naturally).
* **Medium:** Subtle, abstract essence clue (challenging, prevents dead giveaways).
* **Hard:** Broader category name (the imposter only learns the broad topic, requiring sharp deduction).

---

## 🛠️ Generator Scripts

The word lists and generation pipeline are located in `scripts/`:
* `scripts/word_bank/entries_1.py` through `entries_11.py`: Source English entries (100 words x 11 categories) with hand-crafted easy and medium clues.
* `scripts/word_bank/categories_by_lang.json`: Localized category names for all 29 languages.
* `scripts/build_word_banks.py`: Builder that generates all 29 language JSON files in `src/data/word-banks/`.

---

## 🚀 Running Locally

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```
