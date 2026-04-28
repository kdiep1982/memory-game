import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { GameStatus } from "../game/types";
import { LevelSelectModal } from "./LevelSelectModal";

interface ResultModalProps {
  visible: boolean;
  status: GameStatus;
  level: number;
  score: number;
  highScore: number;
  maxLevel: number;
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
  maxLevel,
  onNextLevel,
  onRestart,
  onLevelSelect,
}) => {
  const [showLevelSelect, setShowLevelSelect] = useState(false);
  const isLevelComplete = status === GameStatus.LevelComplete;
  const isGameOver = status === GameStatus.GameOver;

  // Reset level select state when modal is closed
  useEffect(() => {
    if (!visible) {
      setShowLevelSelect(false);
    }
  }, [visible]);

  if (!visible || (!isLevelComplete && !isGameOver)) {
    return null;
  }

  // Hide ResultModal when LevelSelectModal is shown
  const resultModalVisible = visible && !showLevelSelect;

  return (
    <>
      <Modal
        visible={resultModalVisible}
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
                onPress={() => setShowLevelSelect(true)}
              >
                <Text style={styles.secondaryButtonText}>Level Select</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <LevelSelectModal
        visible={showLevelSelect}
        maxLevel={maxLevel}
        currentLevel={level}
        onSelectLevel={onLevelSelect}
        onClose={() => setShowLevelSelect(false)}
      />
    </>
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
    borderRadius: 30,
    padding: 24,
    width: Dimensions.get("window").width - 60,
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 4,
    borderColor: "#FFD54F",
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 24,
    color: "#FF6B9D",
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  statsContainer: {
    marginBottom: 24,
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: "#FFF9C4",
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "#FFD54F",
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 16,
    color: "#7C4DFF",
    fontWeight: "800",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "900",
    color: "#FF6B9D",
  },
  newHighScore: {
    fontSize: 18,
    fontWeight: "900",
    color: "#FF6B9D",
    textAlign: "center",
    marginTop: 8,
  },
  buttonContainer: {
    gap: 12,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: "center",
    borderWidth: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  primaryButton: {
    backgroundColor: "#4CAF50",
    borderColor: "#388E3C",
  },
  secondaryButton: {
    backgroundColor: "#7C4DFF",
    borderColor: "#5E35B1",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
  },
  secondaryButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
  },
});
