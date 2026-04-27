// Game state types for the memory matching game

export type CardId = string;
export type PairId = string;

export interface Card {
  id: CardId;
  pairId: PairId;
  imageKey: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export interface LevelConfig {
  level: number;
  cardCount: number;
  pairCount: number;
  timeLimit: number; // seconds
  maxLives: number;
}

export interface GameState {
  level: number;
  score: number;
  lives: number;
  moves: number;
  cards: Card[];
  flippedCards: CardId[];
  matchedPairs: Set<PairId>;
  status: GameStatus;
  timeRemaining: number; // seconds
  highScore: number;
}

export enum GameStatus {
  NotStarted = "not_started",
  Playing = "playing",
  Evaluating = "evaluating", // Locked while checking match
  LevelComplete = "level_complete",
  GameOver = "game_over",
}

export interface CardPairDefinition {
  pairId: PairId;
  category: "animal" | "vehicle";
  subject: string;
  imageKey: string;
  altText: string;
}
