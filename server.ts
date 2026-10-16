import express from 'express';
import type { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { LANGUAGES, DEFAULT_LANGUAGE } from './src/data/languages.ts';
import { SEO_ARTICLES, ALL_SEO_SLUGS } from './src/data/seoArticles.ts';
import { generateSitemapXml, generateRobotsTxt, injectSeoIntoHtml, injectLocalizedSeoIntoHtml } from './src/utils/seoStatic.ts';

interface Player {
  id: string;
  name: string;
  isHost: boolean;
  score: number;
  votedForId?: string;
  lastSeen: number;
}

interface Lobby {
  code: string;
  hostId: string;
  language: string;
  category: string | string[];
  imposterCount: number;
  state: 'LOBBY' | 'PLAYING' | 'VOTING' | 'IMPOSTER_GUESS' | 'REVEAL';
  round: number;
  secretWord: string;
  secretCategory: string;
  secretClues?: { easy: string; medium: string; hard: string };
  enableClues?: boolean;
  clueDifficulty?: 'easy' | 'medium' | 'hard';
  giveHardClueIfFirst?: boolean;
  imposterIds: string[];
  firstSpeakerId: string;
  players: Player[];
  guessedWord?: string;
  guessCorrect?: boolean;
  winner?: 'INNOCENTS' | 'IMPOSTERS';
  accusedPlayerId?: string;
  updatedAt: number;
}

const lobbies: Map<string, Lobby> = new Map();

// Helper to generate a 4-character clean room code
function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  if (lobbies.has(code)) {
    return generateRoomCode();
  }
  return code;
}

// Clean inactive lobbies (> 3 hours)
setInterval(() => {
  const now = Date.now();
  for (const [code, lobby] of lobbies.entries()) {
    if (now - lobby.updatedAt > 3 * 60 * 60 * 1000) {
      lobbies.delete(code);
    }
  }
}, 10 * 60 * 1000);

// English URLs canonicalize to paths without the /en prefix. Invite links put the
// room code in the query string, so that redirect has to keep it.
function redirectPreservingQuery(req: Request, res: Response, targetPath: string) {
  const queryIndex = req.originalUrl.indexOf('?');
  const search = queryIndex >= 0 ? req.originalUrl.slice(queryIndex) : '';
  if (search) {
    res.set('Cache-Control', 'no-store');
  }
  res.redirect(search ? 302 : 301, `${targetPath}${search}`);
}

function pickRandomWord(langCode: string, categoryFilter: string | string[]): { category: string; word: string; clues: { easy: string; medium: string; hard: string } } {
  const lang = LANGUAGES[langCode] || LANGUAGES[DEFAULT_LANGUAGE];
  const catKeys = Object.keys(lang.words);
  let availableCategories: string[] = [];

  if (Array.isArray(categoryFilter) && categoryFilter.length > 0) {
    availableCategories = categoryFilter.filter((c) => (lang.words as any)[c]);
  } else if (typeof categoryFilter === 'string' && categoryFilter !== 'all' && (lang.words as any)[categoryFilter]) {
    availableCategories = [categoryFilter];
  }

  if (availableCategories.length === 0) {
    availableCategories = catKeys;
  }

  const chosenCategoryKey = availableCategories[Math.floor(Math.random() * availableCategories.length)];
  const wordList = lang.words[chosenCategoryKey] || (lang.words as any)[catKeys[0]];
  const item = wordList[Math.floor(Math.random() * wordList.length)];
  const word = typeof item === 'string' ? item : item.word;
  const categoryName = (lang.categories as any)[chosenCategoryKey] || chosenCategoryKey;
  const clues = typeof item !== 'string' && item.clues
    ? {
        easy: item.clues.easy,
        medium: item.clues.medium,
        hard: item.clues.hard || categoryName,
      }
    : {
        easy: '',
        medium: typeof item === 'string' ? '' : (item.hint || ''),
        hard: categoryName,
      };

  return { category: categoryName, word, clues };
}

function clueForPlayer(lobby: Lobby, playerId: string | undefined, isImposter: boolean): string | undefined {
  if (!isImposter || !lobby.secretClues) return undefined;
  const isFirst = Boolean(playerId) && lobby.firstSpeakerId === playerId;
  const show = lobby.enableClues !== false || (lobby.giveHardClueIfFirst !== false && isFirst);
  if (!show) return undefined;
  const level = lobby.enableClues === false ? 'hard' : (lobby.clueDifficulty || 'medium');
  if (level === 'hard') {
    return lobby.secretClues.hard || lobby.secretCategory;
  }
  return lobby.secretClues[level] || lobby.secretClues.medium || lobby.secretClues.easy || lobby.secretCategory;
}

function sanitizeLobbyForPlayer(lobby: Lobby, playerId?: string) {
  const isHost = lobby.hostId === playerId;
  const isImposter = lobby.imposterIds.includes(playerId || '');
  const isReveal = lobby.state === 'REVEAL' || lobby.state === 'IMPOSTER_GUESS';

  return {
    code: lobby.code,
    hostId: lobby.hostId,
    language: lobby.language,
    category: lobby.category,
    imposterCount: lobby.imposterCount,
    state: lobby.state,
    round: lobby.round,
    secretCategory: lobby.secretCategory,
    // Mask secret word for imposter during active game
    secretWord: isReveal ? lobby.secretWord : (isImposter ? '' : lobby.secretWord),
    clue: clueForPlayer(lobby, playerId, isImposter),
    // Mask imposter identity during active game unless player is imposter or game is revealed
    imposterIds: isReveal ? lobby.imposterIds : (isImposter ? lobby.imposterIds : []),
    isYouImposter: isImposter,
    firstSpeakerId: lobby.firstSpeakerId,
    players: lobby.players.map((p) => ({
      id: p.id,
      name: p.name,
      isHost: p.isHost,
      score: p.score,
      votedForId: isReveal || isHost || p.id === playerId ? p.votedForId : (p.votedForId ? 'VOTED' : undefined),
    })),
    guessedWord: lobby.guessedWord,
    guessCorrect: lobby.guessCorrect,
    winner: lobby.winner,
    accusedPlayerId: lobby.accusedPlayerId,
    updatedAt: lobby.updatedAt,
  };
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json());

  // API Endpoints
  app.post('/api/lobby/create', (req: Request, res: Response) => {
    const { hostName, language = 'en', category = 'all', imposterCount = 1 } = req.body;
    const name = (hostName || 'Player 1').trim().slice(0, 16);
    const code = generateRoomCode();
    const hostPlayerId = 'p_' + Math.random().toString(36).substring(2, 9);

    const newPlayer: Player = {
      id: hostPlayerId,
      name,
      isHost: true,
      score: 0,
      lastSeen: Date.now(),
    };

    const lobby: Lobby = {
      code,
      hostId: hostPlayerId,
      language: LANGUAGES[language] ? language : DEFAULT_LANGUAGE,
      category,
      imposterCount: Math.max(1, Math.min(3, imposterCount)),
      state: 'LOBBY',
      round: 1,
      secretWord: '',
      secretCategory: '',
      imposterIds: [],
      firstSpeakerId: '',
      players: [newPlayer],
      updatedAt: Date.now(),
    };

    lobbies.set(code, lobby);

    res.json({
      success: true,
      player: newPlayer,
      lobby: sanitizeLobbyForPlayer(lobby, hostPlayerId),
    });
  });

  app.post('/api/lobby/join', (req: Request, res: Response) => {
    const { code, playerName } = req.body;
    const cleanCode = (code || '').toUpperCase().trim();
    const lobby = lobbies.get(cleanCode);

    if (!lobby) {
      return res.status(404).json({ error: 'Lobby not found. Check the code and try again.' });
    }

    const name = (playerName || `Player ${lobby.players.length + 1}`).trim().slice(0, 16);
    const newPlayerId = 'p_' + Math.random().toString(36).substring(2, 9);

    const newPlayer: Player = {
      id: newPlayerId,
      name,
      isHost: false,
      score: 0,
      lastSeen: Date.now(),
    };

    lobby.players.push(newPlayer);
    lobby.updatedAt = Date.now();

    res.json({
      success: true,
      player: newPlayer,
      lobby: sanitizeLobbyForPlayer(lobby, newPlayerId),
    });
  });

  app.get('/api/lobby/:code', (req: Request, res: Response) => {
    const code = req.params.code.toUpperCase();
    const playerId = req.query.playerId as string;
    const lobby = lobbies.get(code);

    if (!lobby) {
      return res.status(404).json({ error: 'Lobby not found' });
    }

    // Update heartbeat
    const player = lobby.players.find((p) => p.id === playerId);
    if (player) {
      player.lastSeen = Date.now();
    }

    res.json(sanitizeLobbyForPlayer(lobby, playerId));
  });

  app.post('/api/lobby/:code/settings', (req: Request, res: Response) => {
    const code = req.params.code.toUpperCase();
    const { playerId, language, category, imposterCount } = req.body;
    const lobby = lobbies.get(code);

    if (!lobby || lobby.hostId !== playerId) {
      return res.status(403).json({ error: 'Only host can change settings' });
    }

    if (language && LANGUAGES[language]) lobby.language = language;
    if (category) lobby.category = category;
    if (typeof imposterCount === 'number') lobby.imposterCount = Math.max(1, Math.min(3, imposterCount));
    lobby.updatedAt = Date.now();

    res.json(sanitizeLobbyForPlayer(lobby, playerId));
  });

  app.post('/api/lobby/:code/start', (req: Request, res: Response) => {
    const code = req.params.code.toUpperCase();
    const { playerId, clueDifficulty, enableClues, giveHardClueIfFirst, imposterCount, category } = req.body;
    const lobby = lobbies.get(code);

    if (!lobby || lobby.hostId !== playerId) {
      return res.status(403).json({ error: 'Only host can start the game' });
    }

    if (lobby.players.length < 3) {
      return res.status(400).json({ error: 'Need at least 3 players to start' });
    }

    if (typeof imposterCount === 'number') {
      lobby.imposterCount = Math.max(1, Math.min(3, imposterCount));
    }
    if (category) lobby.category = category;

    const { category: chosenCategory, word, clues } = pickRandomWord(lobby.language, lobby.category);
    lobby.secretCategory = chosenCategory;
    lobby.secretWord = word;
    lobby.secretClues = clues;
    lobby.enableClues = enableClues !== false;
    lobby.clueDifficulty = clueDifficulty === 'easy' || clueDifficulty === 'hard' || clueDifficulty === 'medium'
      ? clueDifficulty
      : 'medium';
    lobby.giveHardClueIfFirst = giveHardClueIfFirst !== false;

    // Pick imposter(s)
    const shuffledPlayerIds = [...lobby.players.map((p) => p.id)].sort(() => Math.random() - 0.5);
    const count = Math.min(
      lobby.imposterCount,
      Math.max(1, Math.floor((lobby.players.length - 1) / 2)),
    );
    lobby.imposterIds = shuffledPlayerIds.slice(0, count);

    // Pick starting speaker
    const randomSpeaker = lobby.players[Math.floor(Math.random() * lobby.players.length)];
    lobby.firstSpeakerId = randomSpeaker.id;

    // Reset votes & guesses
    lobby.players.forEach((p) => {
      delete p.votedForId;
    });
    delete lobby.guessedWord;
    delete lobby.guessCorrect;
    delete lobby.winner;
    delete lobby.accusedPlayerId;

    lobby.state = 'PLAYING';
    lobby.updatedAt = Date.now();

    res.json(sanitizeLobbyForPlayer(lobby, playerId));
  });

  app.post('/api/lobby/:code/vote-phase', (req: Request, res: Response) => {
    const code = req.params.code.toUpperCase();
    const { playerId } = req.body;
    const lobby = lobbies.get(code);

    if (!lobby) return res.status(404).json({ error: 'Lobby not found' });
    if (lobby.hostId !== playerId) {
      return res.status(403).json({ error: 'Only host can start voting phase' });
    }

    lobby.state = 'VOTING';
    lobby.updatedAt = Date.now();

    res.json(sanitizeLobbyForPlayer(lobby, playerId));
  });

  app.post('/api/lobby/:code/vote', (req: Request, res: Response) => {
    const code = req.params.code.toUpperCase();
    const { playerId, suspectId } = req.body;
    const lobby = lobbies.get(code);

    if (!lobby) return res.status(404).json({ error: 'Lobby not found' });

    const voter = lobby.players.find((p) => p.id === playerId);
    if (voter) {
      voter.votedForId = suspectId;
    }

    // Check if everyone voted
    const totalVotes = lobby.players.filter((p) => p.votedForId).length;
    if (totalVotes === lobby.players.length) {
      // Calculate votes
      const voteCounts: Record<string, number> = {};
      lobby.players.forEach((p) => {
        if (p.votedForId) {
          voteCounts[p.votedForId] = (voteCounts[p.votedForId] || 0) + 1;
        }
      });

      let maxVotes = 0;
      let accusedId = '';
      for (const [id, count] of Object.entries(voteCounts)) {
        if (count > maxVotes) {
          maxVotes = count;
          accusedId = id;
        }
      }

      lobby.accusedPlayerId = accusedId;
      const isImposterCaught = lobby.imposterIds.includes(accusedId);

      if (isImposterCaught) {
        lobby.winner = 'INNOCENTS';
        lobby.players.forEach((p) => {
          if (!lobby.imposterIds.includes(p.id)) p.score += 1;
        });
      } else {
        // Innocents voted for wrong person or tie! Imposter escapes
        lobby.winner = 'IMPOSTERS';
        lobby.players.forEach((p) => {
          if (lobby.imposterIds.includes(p.id)) p.score += 2;
        });
      }
      lobby.state = 'REVEAL';
    }

    lobby.updatedAt = Date.now();
    res.json(sanitizeLobbyForPlayer(lobby, playerId));
  });

  app.post('/api/lobby/:code/guess', (req: Request, res: Response) => {
    const code = req.params.code.toUpperCase();
    const { playerId, guessedWord } = req.body;
    const lobby = lobbies.get(code);

    if (!lobby) return res.status(404).json({ error: 'Lobby not found' });

    const cleanGuess = (guessedWord || '').trim().toLowerCase();
    const actual = lobby.secretWord.toLowerCase().trim();

    // Check match or substring match
    const isCorrect = cleanGuess === actual || (cleanGuess.length >= 3 && actual.includes(cleanGuess));

    lobby.guessedWord = guessedWord;
    lobby.guessCorrect = isCorrect;
    lobby.state = 'REVEAL';

    if (isCorrect) {
      lobby.winner = 'IMPOSTERS';
      lobby.players.forEach((p) => {
        if (lobby.imposterIds.includes(p.id)) p.score += 2;
      });
    } else {
      lobby.winner = 'INNOCENTS';
      lobby.players.forEach((p) => {
        if (!lobby.imposterIds.includes(p.id)) p.score += 1;
      });
    }

    lobby.updatedAt = Date.now();
    res.json(sanitizeLobbyForPlayer(lobby, playerId));
  });

  app.post('/api/lobby/:code/skip-guess', (req: Request, res: Response) => {
    const code = req.params.code.toUpperCase();
    const { playerId } = req.body;
    const lobby = lobbies.get(code);

    if (!lobby) return res.status(404).json({ error: 'Lobby not found' });

    lobby.guessCorrect = false;
    lobby.winner = 'INNOCENTS';
    lobby.state = 'REVEAL';
    lobby.players.forEach((p) => {
      if (!lobby.imposterIds.includes(p.id)) p.score += 1;
    });

    lobby.updatedAt = Date.now();
    res.json(sanitizeLobbyForPlayer(lobby, playerId));
  });

  app.post('/api/lobby/:code/next-round', (req: Request, res: Response) => {
    const code = req.params.code.toUpperCase();
    const { playerId } = req.body;
    const lobby = lobbies.get(code);

    if (!lobby || lobby.hostId !== playerId) {
      return res.status(403).json({ error: 'Only host can start next round' });
    }

    lobby.round += 1;
    lobby.state = 'LOBBY';
    lobby.players.forEach((p) => {
      delete p.votedForId;
    });
    delete lobby.guessedWord;
    delete lobby.guessCorrect;
    delete lobby.winner;
    delete lobby.accusedPlayerId;
    lobby.updatedAt = Date.now();

    res.json(sanitizeLobbyForPlayer(lobby, playerId));
  });

  app.post('/api/lobby/:code/leave', (req: Request, res: Response) => {
    const code = req.params.code.toUpperCase();
    const { playerId } = req.body;
    const lobby = lobbies.get(code);

    if (lobby) {
      lobby.players = lobby.players.filter((p) => p.id !== playerId);
      if (lobby.players.length === 0) {
        lobbies.delete(code);
      } else if (lobby.hostId === playerId) {
        // Pass host to next player
        lobby.hostId = lobby.players[0].id;
        lobby.players[0].isHost = true;
      }
      lobby.updatedAt = Date.now();
    }

    res.json({ success: true });
  });

  // Robots.txt
  app.get('/robots.txt', (req: Request, res: Response) => {
    const protocol = req.protocol;
    const host = req.get('host') || 'localhost:8080';
    const baseUrl = `${protocol}://${host}`;
    res.type('text/plain').send(generateRobotsTxt(baseUrl));
  });

  // Sitemap.xml
  app.get('/sitemap.xml', (req: Request, res: Response) => {
    const protocol = req.protocol;
    const host = req.get('host') || 'localhost:8080';
    const baseUrl = `${protocol}://${host}`;
    res.type('application/xml').send(generateSitemapXml(baseUrl));
  });

  // Vite server instance for development
  let vite: any = null;
  if (process.env.NODE_ENV !== 'production') {
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
  }

  // Prerendered HTML response handler
  const renderHtmlResponse = async (req: Request, res: Response) => {
    try {
      const protocol = req.protocol;
      const host = req.get('host') || 'localhost:8080';
      const baseUrl = `${protocol}://${host}`;

      let template = '';
      if (process.env.NODE_ENV === 'production') {
        const distIndex = path.resolve('dist/index.html');
        if (fs.existsSync(distIndex)) {
          template = fs.readFileSync(distIndex, 'utf-8');
        } else {
          template = fs.readFileSync(path.resolve('index.html'), 'utf-8');
        }
      } else {
        template = fs.readFileSync(path.resolve('index.html'), 'utf-8');
        if (vite) {
          template = await vite.transformIndexHtml(req.originalUrl, template);
        }
      }

      // 1. Localized how-to-play guide: /:lang/how-to-play
      const howToPlayMatch = req.path.match(/^\/([a-z]{2})\/how-to-play\/?$/i);
      if (howToPlayMatch && LANGUAGES[howToPlayMatch[1].toLowerCase()]) {
        const langCode = howToPlayMatch[1].toLowerCase();
        if (langCode === 'en') {
          return redirectPreservingQuery(req, res, '/how-to-play-imposter');
        }
        const finalHtml = injectLocalizedSeoIntoHtml(template, langCode, true, baseUrl);
        return res.status(200).set({ 'Content-Type': 'text/html' }).send(finalHtml);
      }

      // 2. Generic /how-to-play redirect
      if (req.path === '/how-to-play' || req.path === '/how-to-play/') {
        return redirectPreservingQuery(req, res, '/how-to-play-imposter');
      }

      // 3. Localized root: /:lang
      const langRootMatch = req.path.match(/^\/([a-z]{2})\/?$/i);
      if (langRootMatch && LANGUAGES[langRootMatch[1].toLowerCase()]) {
        const langCode = langRootMatch[1].toLowerCase();
        if (langCode === 'en') {
          return redirectPreservingQuery(req, res, '/');
        }
        const finalHtml = injectLocalizedSeoIntoHtml(template, langCode, false, baseUrl);
        return res.status(200).set({ 'Content-Type': 'text/html' }).send(finalHtml);
      }

      // 4. English & standard SEO articles
      const rawPath = req.path.replace(/^\/(?:blog\/)?/, '').replace(/\/$/, '');
      const article = SEO_ARTICLES[rawPath];
      const finalHtml = injectSeoIntoHtml(template, article, baseUrl);
      res.status(200).set({ 'Content-Type': 'text/html' }).send(finalHtml);
    } catch (e: any) {
      if (vite) {
        vite.ssrFixStacktrace(e);
      }
      res.status(500).send(e.message);
    }
  };

  // Explicit handlers for all SEO slugs so crawlers and direct visits get static prerendered HTML
  ALL_SEO_SLUGS.forEach((slug) => {
    app.get([`/${slug}`, `/blog/${slug}`], renderHtmlResponse);
  });
  app.get(['/how-to-play', '/how-to-play/'], (req: Request, res: Response) => {
    redirectPreservingQuery(req, res, '/how-to-play-imposter');
  });

  // Explicit handlers for all 29 localized roots and localized how-to-play guides
  Object.keys(LANGUAGES).forEach((langCode) => {
    app.get([`/${langCode}`, `/${langCode}/`, `/${langCode}/how-to-play`, `/${langCode}/how-to-play/`], renderHtmlResponse);
  });

  // Vite & static middleware setup
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static('dist'));
    app.get('*', renderHtmlResponse);
  } else {
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Imposter Charades server listening on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
