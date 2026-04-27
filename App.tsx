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
import { StorageService } from "./src/services/storage";
import { FeedbackService } from "./src/services/feedback";
import { CardTile } from "./src/components/CardTile";
import { GameHeader } from "./src/components/GameHeader";
import { ResultModal } from "./src/components/ResultModal";
import { ToastMessage } from "./src/components/ToastMessage";

function App(): React.JSX.Element {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    type: "success" | "error";
  }>({ visible: false, message: "", type: "success" });
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize game on mount
  useEffect(() => {
    const initGame = async () => {
      const highScore = await StorageService.getHighScore();
      setGameState(initializeGame(highScore));
    };
    initGame();
  }, []);

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
            message: "Perfect Match! 🎉",
            type: "success",
          });

          // Check for level complete
          if (evaluatedState.status === GameStatus.LevelComplete) {
            FeedbackService.levelComplete();
            StorageService.updateHighScore(evaluatedState.score);
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
            StorageService.updateHighScore(evaluatedState.score);
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
    FeedbackService.buttonPress();
    const highScore = await StorageService.getHighScore();
    const newState = startLevel(level, highScore);
    setGameState(newState);
  };

  // Handle restart game
  const handleRestartGame = async () => {
    FeedbackService.buttonPress();
    const highScore = await StorageService.getHighScore();
    const newState = restartGame(highScore);
    setGameState(newState);
  };

  if (!gameState) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  const config = getLevelConfig(gameState.level);
  const gridSize = Math.ceil(Math.sqrt(config.cardCount));

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

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
    backgroundColor: "#F5F5F5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  loadingText: {
    fontSize: 20,
    color: "#757575",
  },
  gameArea: {
    flex: 1,
    paddingVertical: 20,
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
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  controlButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: "#2196F3",
    borderRadius: 8,
  },
  controlButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default App;
