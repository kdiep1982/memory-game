import React, { useState, useEffect, useRef } from "react";
import {
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  StatusBar,
  Text,
  TouchableOpacity,
} from "react-native";
import { GameState, GameStatus } from "./src/game/types";
import {
  initializeGame,
  flipCard,
  evaluateMatch,
  unflipMismatchedCards,
  advanceToNextLevel,
  restartLevel,
  startLevel,
  updateTimer,
  restartGame,
} from "./src/game/engine";
import { getLevelConfig } from "./src/game/levelConfig";
import { StorageService, UserProfile } from "./src/services/storage";
import { FeedbackService } from "./src/services/feedback";
import { CardTile } from "./src/components/CardTile";
import { GameHeader } from "./src/components/GameHeader";
import { ResultModal } from "./src/components/ResultModal";
import { ToastMessage } from "./src/components/ToastMessage";
import { LoginScreen } from "./src/components/LoginScreen";

// Avatar mapping for display
const AVATAR_COLORS: Record<string, string> = {
  lion: "#FFB74D",
  panda: "#A1887F",
  tiger: "#FF9800",
  frog: "#66BB6A",
  fox: "#FF7043",
  rabbit: "#F48FB1",
  koala: "#90A4AE",
  pig: "#F48FB1",
};

const AVATAR_NAMES: Record<string, string> = {
  lion: "Lion",
  panda: "Panda",
  tiger: "Tiger",
  frog: "Frog",
  fox: "Fox",
  rabbit: "Rabbit",
  koala: "Koala",
  pig: "Pig",
};

function App(): React.JSX.Element {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    type: "success" | "error";
  }>({ visible: false, message: "", type: "success" });
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Check for current user on mount
  useEffect(() => {
    const checkUser = async () => {
      const user = await StorageService.getCurrentUser();
      if (user) {
        setCurrentUser(user);
      }
    };
    checkUser();
  }, []);

  // Initialize game when user logs in
  useEffect(() => {
    if (currentUser) {
      setGameState(initializeGame(currentUser.highScore, currentUser.maxLevel));
    }
  }, [currentUser]);

  // Timer effect
  useEffect(() => {
    if (gameState && gameState.status === GameStatus.Playing) {
      timerRef.current = setInterval(() => {
        setGameState((prevState) => {
          if (!prevState) return prevState;
          const newState = updateTimer(prevState);
          if (newState.status === GameStatus.GameOver) {
            FeedbackService.gameOver();
            StorageService.updateHighScore(newState.score);
          }
          return newState;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameState?.status]);

  // Handle card flip
  const handleCardFlip = async (cardId: string) => {
    if (!gameState || isEvaluating) return;

    FeedbackService.cardFlip();
    const newState = flipCard(gameState, cardId);
    setGameState(newState);

    // If two cards are flipped, evaluate after a short delay
    if (newState.flippedCards.length === 2) {
      setIsEvaluating(true);

      setTimeout(() => {
        const { state: evaluatedState, isMatch } = evaluateMatch(newState);

        if (isMatch) {
          FeedbackService.matchSuccess();
          setGameState(evaluatedState);

          // Show success message
          setToast({
            visible: true,
            message: "Perfect Match! ★★★",
            type: "success",
          });

          // Check for level complete
          if (evaluatedState.status === GameStatus.LevelComplete) {
            FeedbackService.levelComplete();
            if (currentUser) {
              StorageService.updateCurrentUserStats(
                evaluatedState.score,
                evaluatedState.level,
              );
            }
          }

          setIsEvaluating(false);
        } else {
          FeedbackService.matchFailure();

          // Show error message
          setToast({
            visible: true,
            message: "Not a Match! Try Again",
            type: "error",
          });

          // Check for game over
          if (evaluatedState.status === GameStatus.GameOver) {
            FeedbackService.gameOver();
            if (currentUser) {
              StorageService.updateCurrentUserStats(
                evaluatedState.score,
                evaluatedState.level,
              );
            }
            setGameState(evaluatedState);
            setIsEvaluating(false);
          } else {
            // Unflip mismatched cards after delay
            setTimeout(() => {
              const unflippedState = unflipMismatchedCards(evaluatedState);
              setGameState(unflippedState);
              setIsEvaluating(false);
            }, 800);
          }
        }
      }, 600);
    }
  };

  // Handle next level
  const handleNextLevel = () => {
    if (!gameState) return;
    FeedbackService.buttonPress();
    const newState = advanceToNextLevel(gameState);
    if (currentUser) {
      StorageService.updateCurrentUserStats(newState.score, newState.level);
    }
    setGameState(newState);
  };

  // Handle restart level
  const handleRestartLevel = () => {
    if (!gameState) return;
    FeedbackService.buttonPress();
    const newState = restartLevel(gameState);
    setGameState(newState);
  };

  // Handle level select
  const handleLevelSelect = async (level: number) => {
    if (!currentUser) return;
    FeedbackService.buttonPress();
    const newState = startLevel(
      level,
      currentUser.highScore,
      currentUser.maxLevel,
    );
    setGameState(newState);
  };

  // Handle restart game
  const handleRestartGame = async () => {
    if (!currentUser) return;
    FeedbackService.buttonPress();
    const newState = restartGame(currentUser.highScore, currentUser.maxLevel);
    setGameState(newState);
  };

  // Handle user login
  const handleLogin = (user: UserProfile) => {
    setCurrentUser(user);
  };

  // Show login screen if no user
  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  if (!gameState) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading Game...</Text>
      </SafeAreaView>
    );
  }

  const config = getLevelConfig(gameState.level);
  const gridSize = Math.ceil(Math.sqrt(config.cardCount));

  const handleLogout = () => {
    setCurrentUser(null);
    setGameState(null);
  };

  const avatarName = AVATAR_NAMES[currentUser.avatar] || "Player";
  const avatarColor = AVATAR_COLORS[currentUser.avatar] || "#7C4DFF";

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF9C4" />

      {/* User Profile Bar */}
      <View style={styles.userBar}>
        <View style={styles.userInfoContainer}>
          <View
            style={[styles.userAvatarCircle, { backgroundColor: avatarColor }]}
          >
            <Text style={styles.userAvatarText}>{avatarName[0]}</Text>
          </View>
          <Text style={styles.userName}>{currentUser.username}</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>← Logout</Text>
        </TouchableOpacity>
      </View>

      <GameHeader
        level={gameState.level}
        score={gameState.score}
        highScore={gameState.highScore}
        lives={gameState.lives}
        moves={gameState.moves}
        timeRemaining={gameState.timeRemaining}
      />

      <View style={styles.gameArea}>
        <FlatList
          data={gameState.cards}
          keyExtractor={(item) => item.id}
          numColumns={gridSize}
          key={gridSize} // Force re-render when grid size changes
          contentContainerStyle={styles.grid}
          renderItem={({ item }) => (
            <CardTile
              card={item}
              onPress={handleCardFlip}
              disabled={isEvaluating || gameState.status !== GameStatus.Playing}
              gridSize={gridSize}
            />
          )}
        />
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={handleRestartGame}
        >
          <Text style={styles.controlButtonText}>New Game</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={handleRestartLevel}
        >
          <Text style={styles.controlButtonText}>Restart Level</Text>
        </TouchableOpacity>
      </View>

      <ResultModal
        visible={
          gameState.status === GameStatus.LevelComplete ||
          gameState.status === GameStatus.GameOver
        }
        status={gameState.status}
        level={gameState.level}
        score={gameState.score}
        highScore={gameState.highScore}
        maxLevel={gameState.maxLevel}
        onNextLevel={handleNextLevel}
        onRestart={handleRestartLevel}
        onLevelSelect={handleLevelSelect}
      />

      <ToastMessage
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onHide={() => setToast({ ...toast, visible: false })}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF9C4",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF9C4",
  },
  loadingText: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FF6B9D",
  },
  userBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 4,
    borderBottomColor: "#FFD54F",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  userAvatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  userAvatarText: {
    fontSize: 20,
    fontWeight: "900",
    color: "#FFFFFF",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  userAvatar: {
    fontSize: 32,
    textAlign: "center",
  },
  userName: {
    fontSize: 20,
    fontWeight: "900",
    color: "#FF6B9D",
  },
  logoutButton: {
    backgroundColor: "#7C4DFF",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#5E35B1",
  },
  logoutButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
  gameArea: {
    flex: 1,
    paddingVertical: 20,
    backgroundColor: "#FFF9C4",
  },
  grid: {
    paddingHorizontal: 20,
    alignItems: "center",
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 4,
    borderTopColor: "#FFD54F",
    gap: 12,
  },
  controlButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: "#4CAF50",
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "#388E3C",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  controlButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
    textAlign: "center",
  },
});

export default App;
