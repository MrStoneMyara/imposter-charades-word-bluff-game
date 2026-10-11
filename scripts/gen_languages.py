import json
import os

languages_data = {
    "en": {
        "code": "en", "name": "English", "nativeName": "English", "shortLabel": "EN", "menuLabel": "Language", "dir": "ltr", "flag": "🇺🇸",
        "defaultPlayerNames": ["Emma", "Liam", "Noah"],
        "strings": {
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
            "startDebate": "Start Clue Round", "round": "Round", "suspect": "Suspect", "score": "Score"
        },
        "categories": {
            "objects": "Everyday Objects", "food": "Food", "countries": "Countries", "professions": "Professions",
            "sports": "Sports", "animals": "Animals", "logos": "Logos & Brands", "transport": "Transport",
            "nature": "Nature & Weather", "music": "Music", "hobbies": "Hobbies"
        }
    }
}
