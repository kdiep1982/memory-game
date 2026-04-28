import AsyncStorage from "@react-native-async-storage/async-storage";

const HIGH_SCORE_KEY = "@MemoryGame:highScore";
const MAX_LEVEL_KEY = "@MemoryGame:maxLevel";
const CURRENT_USER_KEY = "@MemoryGame:currentUser";
const USERS_KEY = "@MemoryGame:users";

export interface UserProfile {
  username: string;
  highScore: number;
  maxLevel: number;
  avatar: string;
  createdAt: string;
}

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
   * Get the highest level reached
   */
  async getMaxLevel(): Promise<number> {
    try {
      const value = await AsyncStorage.getItem(MAX_LEVEL_KEY);
      return value !== null ? parseInt(value, 10) : 1;
    } catch (error) {
      console.error("Error reading max level:", error);
      return 1;
    }
  },

  /**
   * Save the highest level reached
   */
  async saveMaxLevel(level: number): Promise<void> {
    try {
      await AsyncStorage.setItem(MAX_LEVEL_KEY, level.toString());
    } catch (error) {
      console.error("Error saving max level:", error);
    }
  },

  /**
   * Update max level if new level is higher
   */
  async updateMaxLevel(newLevel: number): Promise<number> {
    try {
      const currentMaxLevel = await this.getMaxLevel();
      if (newLevel > currentMaxLevel) {
        await this.saveMaxLevel(newLevel);
        return newLevel;
      }
      return currentMaxLevel;
    } catch (error) {
      console.error("Error updating max level:", error);
      return 1;
    }
  },

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<UserProfile | null> {
    try {
      const username = await AsyncStorage.getItem(CURRENT_USER_KEY);
      if (!username) return null;

      const users = await this.getAllUsers();
      return users.find((u) => u.username === username) || null;
    } catch (error) {
      console.error("Error getting current user:", error);
      return null;
    }
  },

  /**
   * Set current user
   */
  async setCurrentUser(username: string): Promise<void> {
    try {
      await AsyncStorage.setItem(CURRENT_USER_KEY, username);
    } catch (error) {
      console.error("Error setting current user:", error);
    }
  },

  /**
   * Get all user profiles
   */
  async getAllUsers(): Promise<UserProfile[]> {
    try {
      const value = await AsyncStorage.getItem(USERS_KEY);
      return value ? JSON.parse(value) : [];
    } catch (error) {
      console.error("Error getting users:", error);
      return [];
    }
  },

  /**
   * Create a new user profile
   */
  async createUser(username: string, avatar: string): Promise<UserProfile> {
    try {
      const users = await this.getAllUsers();
      const newUser: UserProfile = {
        username,
        highScore: 0,
        maxLevel: 1,
        avatar,
        createdAt: new Date().toISOString(),
      };
      users.push(newUser);
      await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
      await this.setCurrentUser(username);
      return newUser;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  },

  /**
   * Update user profile
   */
  async updateUser(
    username: string,
    updates: Partial<UserProfile>,
  ): Promise<void> {
    try {
      const users = await this.getAllUsers();
      const userIndex = users.findIndex((u) => u.username === username);
      if (userIndex >= 0) {
        users[userIndex] = { ...users[userIndex], ...updates };
        await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  },

  /**
   * Update current user's stats
   */
  async updateCurrentUserStats(
    highScore: number,
    maxLevel: number,
  ): Promise<void> {
    try {
      const currentUser = await this.getCurrentUser();
      if (currentUser) {
        await this.updateUser(currentUser.username, {
          highScore: Math.max(currentUser.highScore, highScore),
          maxLevel: Math.max(currentUser.maxLevel, maxLevel),
        });
      }
    } catch (error) {
      console.error("Error updating current user stats:", error);
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
