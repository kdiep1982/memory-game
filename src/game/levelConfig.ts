import { LevelConfig } from "./types";

/**
 * Generate level configuration based on linear difficulty scaling.
 * Level 1: 2 cards (1 pair)
 * Level n: 2 + (n-1) * 2 cards (adds 1 pair per level)
 */
export function getLevelConfig(level: number): LevelConfig {
  if (level < 1) {
    throw new Error("Level must be >= 1");
  }

  // Linear progression: 2, 4, 6, 8, 10, 12, 14, 16, etc.
  const cardCount = 2 + (level - 1) * 2;
  const pairCount = cardCount / 2;

  // Timer scales with pair count: base 30 seconds + 5 seconds per pair
  // This ensures higher levels remain challenging but playable
  const timeLimit = 30 + pairCount * 5;

  // Lives scale slowly: 3 base lives + 1 per 2 levels
  const maxLives = 3 + Math.floor((level - 1) / 2);

  return {
    level,
    cardCount,
    pairCount,
    timeLimit,
    maxLives,
  };
}

/**
 * Validate that a level configuration meets expected constraints
 */
export function validateLevelConfig(config: LevelConfig): boolean {
  return (
    config.level >= 1 &&
    config.cardCount === config.pairCount * 2 &&
    config.cardCount >= 4 &&
    config.timeLimit > 0 &&
    config.maxLives > 0
  );
}

/**
 * Get max level that can be supported with available card pairs
 */
export function getMaxSupportedLevel(totalAvailablePairs: number): number {
  let level = 1;
  while (true) {
    const config = getLevelConfig(level);
    if (config.pairCount > totalAvailablePairs) {
      return level - 1;
    }
    level++;
  }
}
