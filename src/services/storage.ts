import AsyncStorage from "@react-native-async-storage/async-storage";

const HIGH_SCORE_KEY = "@MemoryGame:highScore";

/**
 * Storage service for persisting game data locally
 */
export const StorageService = {
  /**
   * Get the stored high score
   */
  async getHighScore(): Promise<number> {
    try {
      const value = await AsyncStorage.getItem(HIGH_SCORE_KEY);
      return value !== null ? parseInt(value, 10) : 0;
    } catch (error) {
      console.error("Error reading high score:", error);
      return 0;
    }
  },

  /**
   * Save a new high score
   */
  async saveHighScore(score: number): Promise<void> {
    try {
      await AsyncStorage.setItem(HIGH_SCORE_KEY, score.toString());
    } catch (error) {
      console.error("Error saving high score:", error);
    }
  },

  /**
   * Update high score if new score is higher
   */
  async updateHighScore(newScore: number): Promise<number> {
    try {
      const currentHighScore = await this.getHighScore();
      if (newScore > currentHighScore) {
        await this.saveHighScore(newScore);
        return newScore;
      }
      return currentHighScore;
    } catch (error) {
      console.error("Error updating high score:", error);
      return 0;
    }
  },

  /**
   * Clear all stored data
   */
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error("Error clearing storage:", error);
    }
  },
};
