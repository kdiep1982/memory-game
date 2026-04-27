import { Card, CardId, GameState, GameStatus, PairId } from "./types";
import { getLevelConfig } from "./levelConfig";
import { selectRandomPairs } from "../data/cardCatalog";
import { shuffle } from "../utils/shuffle";

/**
 * Initialize a new game at level 1
 */
export function initializeGame(highScore: number = 0): GameState {
  return createLevelState(1, 0, highScore);
}

/**
 * Create game state for a specific level
 */
export function createLevelState(
  level: number,
  currentScore: number,
  highScore: number,
): GameState {
  const config = getLevelConfig(level);
  const selectedPairs = selectRandomPairs(config.pairCount);

  // Create two cards for each pair
  const cards: Card[] = [];
  selectedPairs.forEach((pairDef, index) => {
    const card1: Card = {
      id: `${pairDef.pairId}_1`,
      pairId: pairDef.pairId,
      imageKey: pairDef.imageKey,
      isFlipped: false,
      isMatched: false,
    };
    const card2: Card = {
      id: `${pairDef.pairId}_2`,
      pairId: pairDef.pairId,
      imageKey: pairDef.imageKey,
      isFlipped: false,
      isMatched: false,
    };
    cards.push(card1, card2);
  });

  // Shuffle the cards
  const shuffledCards = shuffle(cards);

  return {
    level,
    score: currentScore,
    lives: config.maxLives,
    moves: 0,
    cards: shuffledCards,
    flippedCards: [],
    matchedPairs: new Set<PairId>(),
    status: GameStatus.Playing,
    timeRemaining: config.timeLimit,
    highScore,
  };
}

/**
 * Handle flipping a card
 */
export function flipCard(state: GameState, cardId: CardId): GameState {
  // Cannot flip during evaluation or if game is not in playing state
  if (state.status !== GameStatus.Playing) {
    return state;
  }

  // Cannot flip more than 2 cards at once
  if (state.flippedCards.length >= 2) {
    return state;
  }

  const card = state.cards.find((c) => c.id === cardId);
  if (!card || card.isFlipped || card.isMatched) {
    return state;
  }

  const newFlippedCards = [...state.flippedCards, cardId];
  const newCards = state.cards.map((c) =>
    c.id === cardId ? { ...c, isFlipped: true } : c,
  );

  const newState: GameState = {
    ...state,
    cards: newCards,
    flippedCards: newFlippedCards,
  };

  // If two cards are flipped, move to evaluating status
  if (newFlippedCards.length === 2) {
    return { ...newState, status: GameStatus.Evaluating };
  }

  return newState;
}

/**
 * Evaluate the two flipped cards for a match
 */
export function evaluateMatch(state: GameState): {
  state: GameState;
  isMatch: boolean;
} {
  if (state.flippedCards.length !== 2) {
    return { state, isMatch: false };
  }

  const [cardId1, cardId2] = state.flippedCards;
  const card1 = state.cards.find((c) => c.id === cardId1);
  const card2 = state.cards.find((c) => c.id === cardId2);

  if (!card1 || !card2) {
    return { state, isMatch: false };
  }

  const isMatch = card1.pairId === card2.pairId;
  const newMoves = state.moves + 1;

  if (isMatch) {
    // Match found - mark cards as matched and increase score
    const newMatchedPairs = new Set(state.matchedPairs);
    newMatchedPairs.add(card1.pairId);

    const newCards = state.cards.map((c) =>
      c.id === cardId1 || c.id === cardId2 ? { ...c, isMatched: true } : c,
    );

    const newScore = state.score + 1;
    const newHighScore = Math.max(state.highScore, newScore);

    const newState: GameState = {
      ...state,
      cards: newCards,
      flippedCards: [],
      matchedPairs: newMatchedPairs,
      score: newScore,
      moves: newMoves,
      highScore: newHighScore,
      status: GameStatus.Playing,
    };

    // Check if level is complete
    const config = getLevelConfig(state.level);
    if (newMatchedPairs.size === config.pairCount) {
      return {
        state: { ...newState, status: GameStatus.LevelComplete },
        isMatch: true,
      };
    }

    return { state: newState, isMatch: true };
  } else {
    // No match - deduct a life
    const newLives = state.lives - 1;

    const newState: GameState = {
      ...state,
      lives: newLives,
      moves: newMoves,
      // Keep flippedCards so unflipMismatchedCards can use them
      flippedCards: state.flippedCards,
      status: newLives <= 0 ? GameStatus.GameOver : GameStatus.Playing,
    };

    return { state: newState, isMatch: false };
  }
}

/**
 * Unflip mismatched cards after a delay
 */
export function unflipMismatchedCards(state: GameState): GameState {
  if (state.flippedCards.length !== 2) {
    return state;
  }

  const newCards = state.cards.map((c) =>
    state.flippedCards.includes(c.id) && !c.isMatched
      ? { ...c, isFlipped: false }
      : c,
  );

  return {
    ...state,
    cards: newCards,
    flippedCards: [],
  };
}

/**
 * Advance to the next level
 */
export function advanceToNextLevel(state: GameState): GameState {
  if (state.status !== GameStatus.LevelComplete) {
    return state;
  }

  return createLevelState(state.level + 1, state.score, state.highScore);
}

/**
 * Restart current level
 */
export function restartLevel(state: GameState): GameState {
  return createLevelState(state.level, state.score, state.highScore);
}

/**
 * Start a specific level (level select)
 */
export function startLevel(level: number, highScore: number): GameState {
  return createLevelState(level, 0, highScore);
}

/**
 * Update timer (called every second)
 */
export function updateTimer(state: GameState): GameState {
  if (state.status !== GameStatus.Playing) {
    return state;
  }

  const newTimeRemaining = Math.max(0, state.timeRemaining - 1);

  if (newTimeRemaining === 0) {
    return {
      ...state,
      timeRemaining: 0,
      status: GameStatus.GameOver,
    };
  }

  return {
    ...state,
    timeRemaining: newTimeRemaining,
  };
}

/**
 * Restart game from level 1
 */
export function restartGame(highScore: number): GameState {
  return initializeGame(highScore);
}
