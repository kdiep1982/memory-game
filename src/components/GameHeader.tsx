import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface GameHeaderProps {
  level: number;
  score: number;
  highScore: number;
  lives: number;
  moves: number;
  timeRemaining: number;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  level,
  score,
  highScore,
  lives,
  moves,
  timeRemaining,
}) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getTimeColor = (seconds: number): string => {
    if (seconds <= 10) return "#E53935";
    if (seconds <= 30) return "#FB8C00";
    return "#43A047";
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Level</Text>
          <Text style={styles.statValue}>{level}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Score</Text>
          <Text style={styles.statValue}>{score}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>High Score</Text>
          <Text style={styles.statValue}>{highScore}</Text>
        </View>
      </View>
      <View style={styles.bottomRow}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Lives</Text>
          <Text style={[styles.statValue, lives <= 1 && styles.warningValue]}>
            {"♥".repeat(lives)}
          </Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Time</Text>
          <Text
            style={[styles.statValue, { color: getTimeColor(timeRemaining) }]}
          >
            {formatTime(timeRemaining)}
          </Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Moves</Text>
          <Text style={styles.statValue}>{moves}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 4,
    borderBottomColor: "#FFD54F",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 12,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  stat: {
    alignItems: "center",
    flex: 1,
  },
  statLabel: {
    fontSize: 13,
    color: "#7C4DFF",
    fontWeight: "800",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "900",
    color: "#FF6B9D",
  },
  warningValue: {
    color: "#E53935",
  },
});
