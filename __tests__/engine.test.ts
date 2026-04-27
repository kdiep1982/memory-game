import {
  initializeGame,
  flipCard,
  evaluateMatch,
  advanceToNextLevel,
  restartLevel,
  updateTimer,
} from "../src/game/engine";
import { getLevelConfig } from "../src/game/levelConfig";
import { GameStatus } from "../src/game/types";

describe("Game Engine", () => {
  describe("initializeGame", () => {
    it("should initialize game at level 1", () => {
      const state = initializeGame(0);

      expect(state.level).toBe(1);
      expect(state.score).toBe(0);
      expect(state.cards.length).toBe(2); // Level 1 has 2 cards (1 pair)
      expect(state.status).toBe(GameStatus.Playing);
      expect(state.flippedCards.length).toBe(0);
      expect(state.matchedPairs.size).toBe(0);
    });

    it("should preserve high score", () => {
      const state = initializeGame(100);
      expect(state.highScore).toBe(100);
    });
  });

  describe("Level configuration", () => {
    it("should follow linear scaling formula", () => {
      const level1 = getLevelConfig(1);
      expect(level1.cardCount).toBe(2);
      expect(level1.pairCount).toBe(1);

      const level2 = getLevelConfig(2);
      expect(level2.cardCount).toBe(4);
      expect(level2.pairCount).toBe(2);

      const level3 = getLevelConfig(3);
      expect(level3.cardCount).toBe(6);
      expect(level3.pairCount).toBe(3);

      const level4 = getLevelConfig(4);
      expect(level4.cardCount).toBe(8);
      expect(level4.pairCount).toBe(4);
    });

    it("should scale timer and lives appropriately", () => {
      const level1 = getLevelConfig(1);
      expect(level1.timeLimit).toBeGreaterThan(0);
      expect(level1.maxLives).toBeGreaterThan(0);

      const level5 = getLevelConfig(5);
      expect(level5.timeLimit).toBeGreaterThan(level1.timeLimit);
      expect(level5.maxLives).toBeGreaterThanOrEqual(level1.maxLives);
    });
  });

  describe("flipCard", () => {
    it("should flip a card when valid", () => {
      const state = initializeGame(0);
      const cardId = state.cards[0].id;

      const newState = flipCard(state, cardId);

      expect(newState.flippedCards).toContain(cardId);
      const flippedCard = newState.cards.find((c) => c.id === cardId);
      expect(flippedCard?.isFlipped).toBe(true);
    });

    it("should not flip more than 2 cards", () => {
      // Use level 2 which has 4 cards
      const state = {
        ...initializeGame(0),
        status: GameStatus.LevelComplete,
      };
      const level2State = advanceToNextLevel(state);
      
      const card1 = level2State.cards[0].id;
      const card2 = level2State.cards[1].id;
      const card3 = level2State.cards[2].id;

      let newState = flipCard(level2State, card1);
      newState = flipCard(newState, card2);
      newState = flipCard(newState, card3);

      expect(newState.flippedCards.length).toBe(2);
    });

    it("should not flip already matched cards", () => {
      const state = initializeGame(0);
      const card = { ...state.cards[0], isMatched: true };
      const stateWithMatched = {
        ...state,
        cards: [card, ...state.cards.slice(1)],
      };

      const newState = flipCard(stateWithMatched, card.id);
      expect(newState.flippedCards).not.toContain(card.id);
    });
  });

  describe("evaluateMatch", () => {
    it("should recognize matching pairs", () => {
      const state = initializeGame(0);

      // Find two cards with the same pairId
      const pairId = state.cards[0].pairId;
      const card1 = state.cards.find((c) => c.pairId === pairId);
      const card2 = state.cards.find(
        (c) => c.pairId === pairId && c.id !== card1?.id,
      );

      if (!card1 || !card2) {
        throw new Error("Could not find matching pair");
      }

      let newState = flipCard(state, card1.id);
      newState = flipCard(newState, card2.id);

      const { state: evaluatedState, isMatch } = evaluateMatch(newState);

      expect(isMatch).toBe(true);
      expect(evaluatedState.score).toBe(state.score + 1);
      expect(evaluatedState.matchedPairs.has(pairId)).toBe(true);
      expect(evaluatedState.flippedCards.length).toBe(0);
    });

    it("should handle mismatches and deduct lives", () => {
      // Use level 2 which has 2 pairs, so we can test mismatches
      const state = {
        ...initializeGame(0),
        status: GameStatus.LevelComplete,
      };
      const level2State = advanceToNextLevel(state);

      // Find two cards with different pairIds
      const card1 = level2State.cards[0];
      const card2 = level2State.cards.find((c) => c.pairId !== card1.pairId);

      if (!card2) {
        throw new Error("Could not find non-matching card");
      }

      let newState = flipCard(level2State, card1.id);
      newState = flipCard(newState, card2.id);

      const initialLives = newState.lives;
      const { state: evaluatedState, isMatch } = evaluateMatch(newState);

      expect(isMatch).toBe(false);
      expect(evaluatedState.lives).toBe(initialLives - 1);
      expect(evaluatedState.score).toBe(level2State.score);
    });

    it("should increment moves counter on evaluation", () => {
      const state = initializeGame(0);
      const card1 = state.cards[0];
      const card2 = state.cards[1];

      let newState = flipCard(state, card1.id);
      newState = flipCard(newState, card2.id);

      const { state: evaluatedState } = evaluateMatch(newState);
      expect(evaluatedState.moves).toBe(1);
    });

    it("should trigger level complete when all pairs matched", () => {
      const state = initializeGame(0);
      const config = getLevelConfig(1);

      // Manually match all pairs except one
      const allPairIds = Array.from(new Set(state.cards.map((c) => c.pairId)));
      const matchedPairs = new Set(allPairIds.slice(0, -1));

      const stateNearComplete = {
        ...state,
        matchedPairs,
        score: matchedPairs.size,
      };

      // Find and flip the last pair
      const lastPairId = allPairIds[allPairIds.length - 1];
      const lastPair = state.cards.filter((c) => c.pairId === lastPairId);

      let newState = flipCard(stateNearComplete, lastPair[0].id);
      newState = flipCard(newState, lastPair[1].id);

      const { state: evaluatedState } = evaluateMatch(newState);

      expect(evaluatedState.matchedPairs.size).toBe(config.pairCount);
      expect(evaluatedState.status).toBe(GameStatus.LevelComplete);
    });

    it("should trigger game over when lives reach zero", () => {
      // Use level 2 which has 2 pairs, so we can test mismatches
      const state = {
        ...initializeGame(0),
        status: GameStatus.LevelComplete,
      };
      const level2State = { ...advanceToNextLevel(state), lives: 1 };

      const card1 = level2State.cards[0];
      const card2 = level2State.cards.find((c) => c.pairId !== card1.pairId);

      if (!card2) {
        throw new Error("Could not find non-matching card");
      }

      let newState = flipCard(level2State, card1.id);
      newState = flipCard(newState, card2.id);

      const { state: evaluatedState } = evaluateMatch(newState);

      expect(evaluatedState.lives).toBe(0);
      expect(evaluatedState.status).toBe(GameStatus.GameOver);
    });
  });

  describe("advanceToNextLevel", () => {
    it("should advance to next level and increase difficulty", () => {
      const state = {
        ...initializeGame(0),
        status: GameStatus.LevelComplete,
        score: 10,
      };

      const newState = advanceToNextLevel(state);

      expect(newState.level).toBe(2);
      expect(newState.score).toBe(10); // Score persists
      expect(newState.cards.length).toBe(4); // Level 2 has 4 cards (2 pairs)
      expect(newState.status).toBe(GameStatus.Playing);
    });

    it("should not advance if level not complete", () => {
      const state = initializeGame(0);
      const newState = advanceToNextLevel(state);

      expect(newState.level).toBe(state.level);
    });
  });

  describe("restartLevel", () => {
    it("should restart current level preserving score", () => {
      const state = {
        ...initializeGame(0),
        level: 3,
        score: 25,
        moves: 15,
      };

      const newState = restartLevel(state);

      expect(newState.level).toBe(3);
      expect(newState.score).toBe(25);
      expect(newState.moves).toBe(0);
      expect(newState.matchedPairs.size).toBe(0);
    });
  });

  describe("updateTimer", () => {
    it("should decrement time remaining", () => {
      const state = initializeGame(0);
      const initialTime = state.timeRemaining;

      const newState = updateTimer(state);

      expect(newState.timeRemaining).toBe(initialTime - 1);
    });

    it("should trigger game over when time reaches zero", () => {
      const state = { ...initializeGame(0), timeRemaining: 1 };

      const newState = updateTimer(state);

      expect(newState.timeRemaining).toBe(0);
      expect(newState.status).toBe(GameStatus.GameOver);
    });

    it("should not decrement when not playing", () => {
      const state = {
        ...initializeGame(0),
        status: GameStatus.LevelComplete,
        timeRemaining: 50,
      };

      const newState = updateTimer(state);

      expect(newState.timeRemaining).toBe(50);
    });
  });

  describe("Scoring rules", () => {
    it("should increment score by exactly 1 per matched pair", () => {
      const state = initializeGame(0);
      const pairId = state.cards[0].pairId;
      const [card1, card2] = state.cards.filter((c) => c.pairId === pairId);

      let newState = flipCard(state, card1.id);
      newState = flipCard(newState, card2.id);

      const { state: evaluatedState } = evaluateMatch(newState);

      expect(evaluatedState.score).toBe(1);
      expect(evaluatedState.score - state.score).toBe(1);
    });

    it("should not increase score on mismatch", () => {
      // Use level 2 which has 2 pairs, so we can test mismatches
      const state = {
        ...initializeGame(0),
        status: GameStatus.LevelComplete,
      };
      const level2State = advanceToNextLevel(state);
      
      const card1 = level2State.cards[0];
      const card2 = level2State.cards.find((c) => c.pairId !== card1.pairId);

      if (!card2) {
        throw new Error("Could not find non-matching card");
      }

      let newState = flipCard(level2State, card1.id);
      newState = flipCard(newState, card2.id);

      const { state: evaluatedState } = evaluateMatch(newState);

      expect(evaluatedState.score).toBe(level2State.score);
    });
  });
});
