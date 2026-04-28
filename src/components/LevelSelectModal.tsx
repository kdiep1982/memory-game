import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
} from "react-native";

interface LevelSelectModalProps {
  visible: boolean;
  maxLevel: number;
  currentLevel: number;
  onSelectLevel: (level: number) => void;
  onClose: () => void;
}

export const LevelSelectModal: React.FC<LevelSelectModalProps> = ({
  visible,
  maxLevel,
  currentLevel,
  onSelectLevel,
  onClose,
}) => {
  const levels = Array.from({ length: maxLevel }, (_, i) => i + 1);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Select Level</Text>
          <Text style={styles.subtitle}>Choose from levels you've cleared</Text>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.levelsContainer}
          >
            {levels.map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.levelButton,
                  level === currentLevel && styles.currentLevelButton,
                ]}
                onPress={() => {
                  onSelectLevel(level);
                  // Don't call onClose() here - let the game state change handle modal closing
                }}
              >
                <Text
                  style={[
                    styles.levelButtonText,
                    level === currentLevel && styles.currentLevelButtonText,
                  ]}
                >
                  {level}
                </Text>
                {level === currentLevel && (
                  <Text style={styles.currentLabel}>Current</Text>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Cancel</Text>
          </TouchableOpacity>
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
    maxHeight: Dimensions.get("window").height - 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
    color: "#212121",
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
    color: "#757575",
  },
  scrollView: {
    maxHeight: 300,
  },
  levelsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
    paddingBottom: 12,
  },
  levelButton: {
    width: 70,
    height: 70,
    borderRadius: 12,
    backgroundColor: "#2196F3",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  currentLevelButton: {
    backgroundColor: "#4CAF50",
    borderWidth: 3,
    borderColor: "#2E7D32",
  },
  levelButtonText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  currentLevelButtonText: {
    color: "#FFFFFF",
  },
  currentLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "#FFFFFF",
    marginTop: 2,
  },
  closeButton: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: "#757575",
    alignItems: "center",
  },
  closeButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
