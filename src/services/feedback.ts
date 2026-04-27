import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import { Platform } from "react-native";

/**
 * Feedback service for haptic and sound feedback
 */
export const FeedbackService = {
  /**
   * Provide haptic feedback for card flip
   */
  cardFlip(): void {
    if (Platform.OS === "ios" || Platform.OS === "android") {
      ReactNativeHapticFeedback.trigger("impactLight", {
        enableVibrateFallback: true,
        ignoreAndroidSystemSettings: false,
      });
    }
  },

  /**
   * Provide haptic feedback for successful match
   */
  matchSuccess(): void {
    if (Platform.OS === "ios" || Platform.OS === "android") {
      ReactNativeHapticFeedback.trigger("notificationSuccess", {
        enableVibrateFallback: true,
        ignoreAndroidSystemSettings: false,
      });
    }
  },

  /**
   * Provide haptic feedback for mismatch
   */
  matchFailure(): void {
    if (Platform.OS === "ios" || Platform.OS === "android") {
      ReactNativeHapticFeedback.trigger("notificationError", {
        enableVibrateFallback: true,
        ignoreAndroidSystemSettings: false,
      });
    }
  },

  /**
   * Provide haptic feedback for level complete
   */
  levelComplete(): void {
    if (Platform.OS === "ios" || Platform.OS === "android") {
      ReactNativeHapticFeedback.trigger("notificationSuccess", {
        enableVibrateFallback: true,
        ignoreAndroidSystemSettings: false,
      });
      // Double success vibration for extra celebration
      setTimeout(() => {
        ReactNativeHapticFeedback.trigger("notificationSuccess", {
          enableVibrateFallback: true,
          ignoreAndroidSystemSettings: false,
        });
      }, 150);
    }
  },

  /**
   * Provide haptic feedback for game over
   */
  gameOver(): void {
    if (Platform.OS === "ios" || Platform.OS === "android") {
      ReactNativeHapticFeedback.trigger("notificationWarning", {
        enableVibrateFallback: true,
        ignoreAndroidSystemSettings: false,
      });
    }
  },

  /**
   * Provide haptic feedback for button press
   */
  buttonPress(): void {
    if (Platform.OS === "ios" || Platform.OS === "android") {
      ReactNativeHapticFeedback.trigger("impactMedium", {
        enableVibrateFallback: true,
        ignoreAndroidSystemSettings: false,
      });
    }
  },
};
