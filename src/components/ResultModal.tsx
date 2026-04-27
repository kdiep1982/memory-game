import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { GameStatus } from "../game/types";

interface ResultModalProps {
  visible: boolean;
  status: GameStatus;
  level: number;
  score: number;
  highScore: number;
  onNextLevel: () => void;
  onRestart: () => void;
  onLevelSelect: (level: number) => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({
  visible,
  status,
  level,
  score,
  highScore,
  onNextLevel,
  onRestart,
  onLevelSelect,
}) => {
  const isLevelComplete = status === GameStatus.LevelComplete;
  const isGameOver = status === GameStatus.GameOver;

  if (!visible || (!isLevelComplete && !isGameOver)) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onRestart}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>
            {isLevelComplete ? "Level Complete!" : "Game Over"}
          </Text>

          <View style={styles.statsContainer}>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Level:</Text>
              <Text style={styles.statValue}>{level}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Score:</Text>
              <Text style={styles.statValue}>{score}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>High Score:</Text>
              <Text style={styles.statValue}>{highScore}</Text>
            </View>
            {score === highScore && score > 0 && (
              <Text style={styles.newHighScore}>New High Score!</Text>
            )}
          </View>

          <View style={styles.buttonContainer}>
            {isLevelComplete && (
              <TouchableOpacity
                style={[styles.button, styles.primaryButton]}
                onPress={onNextLevel}
              >
                <Text style={styles.primaryButtonText}>Next Level</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={onRestart}
            >
              <Text style={styles.secondaryButtonText}>
                {isLevelComplete ? "Restart Level" : "Try Again"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={() => onLevelSelect(1)}
            >
              <Text style={styles.secondaryButtonText}>Level Select</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    width: Dimensions.get("window").width - 60,
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 24,
    color: "#212121",
  },
  statsContainer: {
    marginBottom: 24,
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 16,
    color: "#757575",
    fontWeight: "600",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#212121",
  },
  newHighScore: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF9800",
    textAlign: "center",
    marginTop: 8,
  },
  buttonContainer: {
    gap: 12,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: "#4CAF50",
  },
  secondaryButton: {
    backgroundColor: "#2196F3",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  secondaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
