export interface FaqItem {
  question: string;
  answer: string;
}

export interface ArticleSection {
  heading: string;
  subheading?: string;
  paragraphs: string[];
  bulletPoints?: string[];
  callout?: {
    title: string;
    text: string;
  };
}

export interface SeoArticle {
  slug: string;
  title: string;
  seoTitle: string;
  metaDescription: string;
  category: 'Game Rules' | 'Party Games' | 'Team Building' | 'Word Lists & Tools';
  readTime: string;
  publishedDate: string;
  keywords: string[];
  summary: string;
  sections: ArticleSection[];
  faqs: FaqItem[];
  relatedSlugs: string[];
}

export const SEO_ARTICLES: Record<string, SeoArticle> = {
  'how-to-play-imposter': {
    slug: 'how-to-play-imposter',
    title: 'How to Play Imposter Game: Official Rules & Complete Guide',
    seoTitle: 'How to Play Imposter Game: Rules & Guide (Pass & Play + Online)',
    metaDescription: 'Master the Imposter word game! Complete rules for Pass-and-Play on one phone and instant online multiplayer lobbies. Learn clue tactics and bluffing tips.',
    category: 'Game Rules',
    readTime: '4 min read',
    publishedDate: '2026-10-11',
    keywords: ['how to play imposter', 'imposter game rules', 'party word game rules', 'imposter pass and play', 'social deduction rules'],
    summary: 'Imposter Charades is a fast-paced social deduction word game where everyone knows the secret word except the imposter. Your goal is either to unmask the imposter or bluff your way to victory without getting caught.',
    sections: [
      {
        heading: 'Overview: The Core Concept',
        paragraphs: [
          'Imposter Charades is an accessible social deduction party game designed for 3 or more players. At the beginning of each round, a secret word is secretly assigned from a chosen category (like Animals, Food, Movies, or Everyday Objects).',
          'Every Innocent player sees the exact same secret word. However, the chosen Imposter sees only that they are the Imposter (or a subtle contextual hint if clues are enabled). Nobody knows who the Imposter is except the Imposter themselves!'
        ],
        bulletPoints: [
          'Innocents: Must give clever clues to prove they know the word without making it too obvious for the imposter.',
          'The Imposter: Must listen attentively, deduce what the secret word is, and bluff with believable clues.',
          'Goal: Innocents vote to eliminate the imposter; the Imposter tries to survive or guess the secret word.'
        ]
      },
      {
        heading: 'Two Ways to Play: Pass & Play vs. Play Online',
        subheading: 'No app download required on any phone or laptop',
        paragraphs: [
          'Mode 1: Pass & Play (Single Phone): Perfect for living rooms, bars, car trips, or dinner tables. One person sets up player names, taps "Start Game", and passes the phone around. Each player holds down the screen to discreetly peek at their card, then hands it to the next player.',
          'Mode 2: Play Online (Multi-Device Lobby): Ideal for remote teams on Zoom or groups where everyone has their own smartphone. One host creates a 4-letter room code, shares the link or QR/code, and everyone joins instantly in their mobile browser.'
        ],
        callout: {
          title: 'Pro Tip: Instant Link Sharing',
          text: 'Tapping the "Share" button inside an online lobby copies a direct join link. When friends open it, their lobby code is automatically filled!'
        }
      },
      {
        heading: 'Step-by-Step Round Breakdown',
        paragraphs: [
          'Step 1: Role Reveal. Each player checks their card in private.',
          'Step 2: The Clue Round. Starting with the designated First Speaker, each player in turn speaks ONE clue word or short phrase related to the secret item. No repetition, no rhymes, and no direct spelling!',
          'Step 3: Discussion & Accusation. Once everyone has delivered their clue, a 60-second open debate begins. Who hesitated? Whose clue was suspiciously vague or generic?',
          'Step 4: The Vote. All players point or cast their vote simultaneously. The player with the most votes is eliminated.'
        ]
      },
      {
        heading: 'Winning Conditions & The Imposter Final Guess',
        paragraphs: [
          'If the Innocents vote out an Innocent, the Imposter instantly wins!',
          'If the Innocents correctly identify and vote out the Imposter, the game is NOT over yet: the Imposter gets one final opportunity to guess the exact secret word. If the Imposter guesses correctly, they steal the victory! If they guess wrong, the Innocents win.'
        ]
      },
      {
        heading: 'Winning Strategies for Both Sides',
        paragraphs: [
          'Strategy for Innocents: Never say an obvious characteristic on turn one. If the word is "Penguin", saying "Antarctica" or "Tuxedo" gives the game away immediately to a smart imposter. Say something nuanced like "Flightless diver" or "Cold pebble lover".',
          'Strategy for Imposters: If you are early in the speaking order, pick versatile adjectives that fit broad categories. If you go later, carefully bridge themes mentioned by earlier players without copying them word-for-word.'
        ]
      }
    ],
    faqs: [
      {
        question: 'How many players can play Imposter?',
        answer: 'You can play with 3 to 20+ players! The sweet spot for maximum tension is 4 to 8 players. For groups larger than 7, enabling 2 imposters makes the debate exciting.'
      },
      {
        question: 'Do players need to install an app or create an account?',
        answer: 'No! Imposter Charades runs 100% in any modern mobile or desktop web browser with zero installs, accounts, or payments required.'
      },
      {
        question: 'What happens if there is a tie during the voting phase?',
        answer: 'In a tie vote, players hold a 30-second rapid defense round between the tied suspects followed by a revote. If still tied, the Imposter escapes undetected!'
      }
    ],
    relatedSlugs: ['games-like-spyfall', 'imposter-game-word-list', 'best-icebreaker-games-for-work', 'best-party-games-for-groups']
  },

  'games-like-spyfall': {
    slug: 'games-like-spyfall',
    title: 'Games Like Spyfall: 7 Best Online Word Deduction & Bluffing Games',
    seoTitle: 'Games Like Spyfall: Top Free Online Bluffing Games (2026)',
    metaDescription: 'Looking for games like Spyfall, The Chameleon, or A Fake Artist? Compare the best free social deduction party games you can play instantly in your browser.',
    category: 'Party Games',
    readTime: '5 min read',
    publishedDate: '2026-10-11',
    keywords: ['games like spyfall', 'spyfall alternatives', 'games like the chameleon', 'online bluffing games', 'browser party games'],
    summary: 'Spyfall became a worldwide sensation by turning conversation into a high-stakes investigation. Here are the top alternatives and how modern browser games take the genre to the next level.',
    sections: [
      {
        heading: 'Why Everyone Loves Spyfall',
        paragraphs: [
          'Spyfall introduced an irresistible mechanic: everyone knows the secret location (e.g. Submarine, Airplane, Spa) except the Spy. Players ask each other casual questions, trying to catch someone who does not know where they are, while the Spy tries to deduce the location before being exposed.',
          'While brilliant, classic Spyfall has a few pain points: players have to constantly reference a large cheat sheet of 30 locations, questioning can stall if someone freezes, and setting up games across different phones often requires buggy third-party websites.'
        ]
      },
      {
        heading: '1. Imposter Charades (Best Modern Spyfall Alternative)',
        paragraphs: [
          'Imposter Charades preserves the psychological thrill of Spyfall while stripping away clunky setup hurdles. Instead of memorizing 30 complex locations, players work with vivid real-world secret words organized by categories (Animals, Movies, Food, Everyday Objects).',
          'With built-in Pass & Play on a single smartphone or instant 4-letter online lobby codes, games start in under 5 seconds. It also includes subtle clue difficulty settings and a final word-guess comeback mechanic.'
        ],
        bulletPoints: [
          'No app download or account login required.',
          'Works on a single shared phone or multi-device web lobby.',
          'Supports 29+ languages with localized word dictionaries.',
          'Built-in audio cues, dark mode, and customizable imposter ratios.'
        ]
      },
      {
        heading: '2. The Chameleon',
        paragraphs: [
          'In The Chameleon by Big Potato Games, players use a grid of 16 words and a dice-coded card. Everyone says one word clue related to the secret word, and the Chameleon must blend in.',
          'Imposter Charades offers a digital version of this exact streamlined one-word clue mechanic, eliminating the need to carry physical cards and dice.'
        ]
      },
      {
        heading: '3. A Fake Artist Goes to New York',
        paragraphs: [
          'Created by Oink Games, this title swaps verbal clues for drawing. Everyone contributes a single line to a shared drawing of the secret subject, while the Fake Artist doodles blindly.',
          'Fantastic for artistic groups, though it requires paper and pens or a shared digital drawing canvas.'
        ]
      },
      {
        heading: 'Feature Comparison: Spyfall vs. Imposter Charades',
        paragraphs: [
          'Below is a breakdown of how traditional Spyfall stacks up against Imposter Charades for casual group play:'
        ],
        bulletPoints: [
          'Setup Time: Spyfall (~2-3 mins) vs Imposter Charades (<10 seconds).',
          'Learning Curve: Spyfall requires location cheat sheet; Imposter Charades uses intuitive everyday nouns.',
          'Hardware: Spyfall requires every player to have a phone with internet; Imposter Charades works on 1 shared device or online.',
          'Pacing: Fast 3-minute rounds with structured speaker turns prevent awkward silences.'
        ]
      }
    ],
    faqs: [
      {
        question: 'Can you play Imposter Charades without downloading anything?',
        answer: 'Yes! Unlike native app store games, Imposter Charades runs directly in Safari, Chrome, Firefox, or Edge on iOS, Android, and PC.'
      },
      {
        question: 'Is Imposter Charades completely free to play?',
        answer: 'Yes, both the single-phone pass-and-play mode and online multi-device lobbies are 100% free with unlimited games.'
      },
      {
        question: 'How does it prevent the imposter from guessing immediately?',
        answer: 'Innocent players are incentivized to provide subtle, cryptic clues. If an innocent gives an overly obvious clue, the imposter easily guesses the word during the reveal phase.'
      }
    ],
    relatedSlugs: ['how-to-play-imposter', 'best-party-games-for-groups', 'best-icebreaker-games-for-work', 'imposter-game-word-list']
  },

  'best-icebreaker-games-for-work': {
    slug: 'best-icebreaker-games-for-work',
    title: 'Best Icebreaker Games for Work: Virtual & In-Person Team Word Games',
    seoTitle: 'Best Icebreaker Games for Work: Quick Virtual & Office Word Games',
    metaDescription: 'Ditch boring corporate icebreakers! Discover why word deduction games like Imposter are the #1 quick team building activity for Zoom calls and office groups.',
    category: 'Team Building',
    readTime: '4 min read',
    publishedDate: '2026-10-11',
    keywords: ['icebreaker games for work', 'zoom team building games', 'virtual team icebreakers', 'quick meeting games', 'work group games'],
    summary: 'Traditional icebreakers often feel forced and awkward. Word deduction games provide instant psychological safety, lighthearted laughter, and authentic collaboration in under 7 minutes.',
    sections: [
      {
        heading: 'The Problem with Traditional Meeting Icebreakers',
        paragraphs: [
          'Most team leaders have suffered through "Two Truths and a Lie" or "What is an interesting fact about yourself?". These prompts place employees on the spot, creating social anxiety rather than building genuine rapport.',
          'High-performing teams need low-stakes, structured social interactions that encourage active listening, observation, and gentle humor.'
        ]
      },
      {
        heading: 'Why Social Deduction Games Work So Well in the Workplace',
        paragraphs: [
          'Games like Imposter Charades flatten organizational hierarchy. When an executive and an intern are both trying to figure out who does not know the secret word "Pancake", everyone is on equal ground.',
          'Key psychological benefits include:'
        ],
        bulletPoints: [
          'Active Listening: Team members must pay close attention to each colleague\'s choice of words.',
          'Psychological Safety: Being the "Imposter" is part of the game design, removing fear of making mistakes.',
          'Speed: A full round takes only 4 to 6 minutes, making it ideal for the start of all-hands or sprint retrospectives.',
          'Zero IT Friction: No software installation, no company email signups, and works seamlessly over Zoom or Google Meet screenshare.'
        ]
      },
      {
        heading: 'How to Run Imposter on Zoom or Microsoft Teams',
        paragraphs: [
          'Step 1: Meeting facilitator opens Imposter Charades and creates an online lobby.',
          'Step 2: Facilitator clicks "Share" to copy the room link and pastes it into the meeting chat.',
          'Step 3: Everyone opens the link in their browser on their laptop or phone and enters their name.',
          'Step 4: Facilitator starts the round. Players speak their clues unmuted in clockwise order, followed by a fast 60-second debate.',
          'Step 5: Facilitator triggers the vote and watches the laughter unfold!'
        ]
      },
      {
        heading: 'Top Word Categories for Work Environments',
        paragraphs: [
          'Stick to neutral, universally familiar categories like Food & Drink, Everyday Objects, and Animals. Avoid deep niche pop culture unless your entire team shares a specific interest.'
        ]
      }
    ],
    faqs: [
      {
        question: 'Can remote coworkers join from their company laptops?',
        answer: 'Yes! The game runs entirely over standard HTTPS in web browsers without downloading software or browser extensions, making it compliant with corporate firewalls.'
      },
      {
        question: 'What is the recommended group size for a company meeting?',
        answer: 'Groups of 5 to 10 players are ideal for meetings. For larger teams (20+), split into Zoom breakout rooms with 6 people per room.'
      }
    ],
    relatedSlugs: ['how-to-play-imposter', 'icebreaker-games-online', 'games-like-spyfall', 'imposter-game-word-list']
  },

  'imposter-game-word-list': {
    slug: 'imposter-game-word-list',
    title: 'Imposter Game Word List: 150+ Secret Words & Clues by Category',
    seoTitle: 'Imposter Game Word List: 150+ Words, Categories & Clue Ideas',
    metaDescription: 'Explore 150+ curated secret words for Imposter Charades across Animals, Food, Movies, and Objects. Learn how to craft clever clues without giving the secret away.',
    category: 'Word Lists & Tools',
    readTime: '6 min read',
    publishedDate: '2026-10-11',
    keywords: ['imposter game word list', 'chameleon secret words', 'spyfall word ideas', 'word deduction clues', 'party game word ideas'],
    summary: 'A great game of Imposter depends on balanced secret words. Words that are too obscure confuse the innocents, while words that are too broad make it too easy for the imposter. Here is our curated list.',
    sections: [
      {
        heading: 'What Makes a Great Secret Word?',
        paragraphs: [
          'The ideal secret word has distinctive features, but also belongs to a family of similar concepts. For example, "Flamingo" is a brilliant secret word because players can give clues about color, posture, or habitat without naming the bird directly.',
          'Below are tested, high-replayability word collections across our top categories.'
        ]
      },
      {
        heading: 'Category 1: Animals & Wildlife',
        paragraphs: [
          'Animals are universally understood across all ages and cultures, making them the safest pick for mixed groups.'
        ],
        bulletPoints: [
          'Penguin — Good clues: "Tuxedo", "Antarctica", "Waddler", "Pebble lover"',
          'Chameleon — Good clues: "Camouflage", "Eyes rotate", "Tongue zap", "Lizard"',
          'Kangaroo — Good clues: "Outback", "Pouch", "Hopper", "Boxing"',
          'Platypus — Good clues: "Egg-laying", "Bill", "Venomous spur", "Australia"',
          'Giraffe — Good clues: "Long neck", "Acacia trees", "Spotted", "Tallest"'
        ]
      },
      {
        heading: 'Category 2: Food & Cuisine',
        paragraphs: [
          'Food triggers emotional and sensory memories, leading to hilarious debates over ingredients and preparation styles.'
        ],
        bulletPoints: [
          'Sushi — Good clues: "Raw", "Wasabi", "Vinegar rice", "Chopsticks"',
          'Pancake — Good clues: "Flapjack", "Syrup stack", "Flat pan", "Breakfast"',
          'Espresso — Good clues: "Crema", "High pressure", "Tiny cup", "Caffeine shot"',
          'Croissant — Good clues: "Layers", "Butter flake", "Crescent shape", "Bakery"',
          'Guacamole — Good clues: "Avocado", "Lime zest", "Tortilla dip", "Green bowl"'
        ]
      },
      {
        heading: 'Category 3: Everyday Household Objects',
        paragraphs: [
          'Household items force players to think about mechanics and physical utility.'
        ],
        bulletPoints: [
          'Toaster — Good clues: "Pop-up", "Heat coils", "Crumb tray", "Breakfast gadget"',
          'Toothbrush — Good clues: "Bristles", "Twice daily", "Paste partner", "Dental"',
          'Umbrella — Good clues: "Canopy", "Rain shield", "Folding ribs", "Wet weather"',
          'Stapler — Good clues: "Metal bend", "Office supply", "Paper binder", "Desk tool"'
        ]
      },
      {
        heading: 'The Art of Giving the Perfect Clue',
        paragraphs: [
          'Beginner mistake: Giving a defining clue too early. If the secret word is "Airplane", saying "Wings" or "Jet engine" instantly reveals the word to the Imposter.',
          'Master technique: Give associative clues. Mention a ritual, a sensory detail, or a secondary attribute. For "Airplane", saying "Peanuts in high altitudes" or "Tray table upright" proves you know the word while keeping the Imposter guessing.'
        ]
      }
    ],
    faqs: [
      {
        question: 'How does Imposter Charades choose random words?',
        answer: 'Our game includes thousands of hand-curated words with localized translations across 29 languages, ensuring balanced difficulty and zero offensive terms.'
      },
      {
        question: 'Can you filter by specific categories in the game?',
        answer: 'Yes! Our multi-select category dropdown lets you choose exactly which categories to include, from Animals and Food to Pop Culture and Movies.'
      }
    ],
    relatedSlugs: ['how-to-play-imposter', 'imposter-word-generator', 'games-like-spyfall', 'best-party-games-for-groups']
  },

  'best-party-games-for-groups': {
    slug: 'best-party-games-for-groups',
    title: '10 Best Party Games for Groups (No Cards or Props Needed)',
    seoTitle: '10 Best Party Games for Groups (No Props or Cards Needed)',
    metaDescription: 'Discover the top party games for large and small groups that require zero props or physical cards. Play instantly on any smartphone with friends and family.',
    category: 'Party Games',
    readTime: '5 min read',
    publishedDate: '2026-10-11',
    keywords: ['best party games for groups', 'games with no props', 'phone party games', 'group word games', 'social deduction party games'],
    summary: 'When you have a room full of friends, the last thing you want is a 20-page rulebook. Here are the best zero-friction party games you can launch right now.',
    sections: [
      {
        heading: 'The Rise of Digital Zero-Setup Party Games',
        paragraphs: [
          'Traditional board games require carrying heavy boxes, keeping track of dice and tokens, and spending 15 minutes explaining rules. Modern digital party games eliminate all setup time so you can jump straight into the fun.'
        ]
      },
      {
        heading: 'Top Picks for Social Bluffing & Word Play',
        paragraphs: [
          '1. Imposter Charades: Fast-paced bluffing where one person is out of the loop. Pass one phone around the circle or join an online lobby in seconds.',
          '2. Heads Up / Charades: High-energy physical guessing where a player holds a screen to their forehead while others shout clues.',
          '3. Codenames: Two spymasters give one-word clues to guide their teams toward identifying secret agents on a 25-card word grid.',
          '4. Mafia / Werewolf: Classic village elimination game featuring hidden roles, nocturnal actions, and intense daytime trials.'
        ],
        bulletPoints: [
          'Best for fast icebreakers: Imposter Charades (3-5 mins per round).',
          'Best for physical energy: Charades / Heads Up.',
          'Best for team competition: Codenames.'
        ]
      }
    ],
    faqs: [
      {
        question: 'What is the best party game for people who don\'t like board games?',
        answer: 'Imposter Charades and Charades are universally loved because they feel like lively conversations rather than math or heavy strategy.'
      }
    ],
    relatedSlugs: ['how-to-play-imposter', 'games-like-spyfall', 'icebreaker-games-online', 'imposter-game-word-list']
  },

  'icebreaker-games-online': {
    slug: 'icebreaker-games-online',
    title: 'Icebreaker Games Online: Free Browser Games for Any Group Size',
    seoTitle: 'Icebreaker Games Online: Free Browser Games for Remote Groups',
    metaDescription: 'Looking for fun online icebreaker games for teams and friends? Play free instant browser games that work on any smartphone or desktop with no downloads.',
    category: 'Team Building',
    readTime: '4 min read',
    publishedDate: '2026-10-11',
    keywords: ['icebreaker games online', 'free online group games', 'browser party games', 'remote icebreakers', 'quick team games online'],
    summary: 'Connect distributed friends, remote teammates, and family members anywhere in the world with instant browser-based group games.',
    sections: [
      {
        heading: 'Instant Fun Without Login Friction',
        paragraphs: [
          'The greatest barrier to playing games online is asking participants to download apps, make accounts, or verify email addresses. The best online icebreakers provide zero-friction web links that load immediately in any mobile browser.'
        ]
      },
      {
        heading: 'Why Imposter Charades Is the Ultimate Remote Icebreaker',
        paragraphs: [
          'With automatic room link sharing and cross-device sync, players simply tap the link, type their name, and immediately enter the lobby. Rounds last under 5 minutes, allowing groups to play during lunch breaks or before team meetings.'
        ]
      }
    ],
    faqs: [
      {
        question: 'Can players join on different devices (phones and computers)?',
        answer: 'Yes! In online lobby mode, players can join from iPhones, Android phones, MacBooks, Windows PCs, and Chromebooks simultaneously.'
      }
    ],
    relatedSlugs: ['best-icebreaker-games-for-work', 'how-to-play-imposter', 'games-like-spyfall']
  },

  'imposter-word-generator': {
    slug: 'imposter-word-generator',
    title: 'Imposter Word Generator: Free Secret Word & Clue Picker',
    seoTitle: 'Imposter Word Generator: Instant Secret Words & Clues',
    metaDescription: 'Need balanced secret words for your home deduction game? Use our curated word generator categories or play directly online with automatic role assignments.',
    category: 'Word Lists & Tools',
    readTime: '3 min read',
    publishedDate: '2026-10-11',
    keywords: ['imposter word generator', 'spyfall location generator', 'secret word generator', 'party game word ideas', 'word clue helper'],
    summary: 'Generating fair and exciting secret words on the fly is hard. Our database balances nuance, recognizability, and deceptive clue potential.',
    sections: [
      {
        heading: 'Balanced Word Selection by Difficulty',
        paragraphs: [
          'A balanced secret word must provide sufficient clue angles so innocents can verify each other without revealing the concept to the imposter. Explore our built-in curated lists or launch a live game with our dynamic word engine.'
        ]
      }
    ],
    faqs: [
      {
        question: 'Does the game support custom word lists?',
        answer: 'You can customize your games by toggling between multiple thematic categories including Animals, Food, Movies, Everyday Objects, and Pop Culture!'
      }
    ],
    relatedSlugs: ['imposter-game-word-list', 'how-to-play-imposter', 'games-like-spyfall']
  }
};

export const ALL_SEO_SLUGS = Object.keys(SEO_ARTICLES);

export function generateSoftwareApplicationJsonLd(baseUrl = 'https://impostergame.app') {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Imposter Charades - Word Bluff Game',
    operatingSystem: 'All (Web, iOS, Android, macOS, Windows)',
    applicationCategory: 'GameApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description:
      'Fast-paced party word bluffing game where everyone knows the secret word except the imposter. Play on one phone or in online multi-device lobbies in 29+ languages.',
    url: baseUrl,
  };
}

export function generateFaqJsonLd(faqs: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function generateArticleJsonLd(article: SeoArticle, baseUrl = 'https://impostergame.app') {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.seoTitle,
    description: article.metaDescription,
    datePublished: article.publishedDate,
    dateModified: article.publishedDate,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/${article.slug}`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Imposter Charades',
    },
  };
}
