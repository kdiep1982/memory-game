import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";

interface ToastMessageProps {
  message: string;
  type: "success" | "error";
  visible: boolean;
  onHide: () => void;
}

export const ToastMessage: React.FC<ToastMessageProps> = ({
  message,
  type,
  visible,
  onHide,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-50)).current;

  useEffect(() => {
    if (visible) {
      // Show animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto-hide after 1.5 seconds
      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: -50,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => {
          onHide();
        });
      }, 1500);

      return () => clearTimeout(timer);
    } else {
      fadeAnim.setValue(0);
      translateY.setValue(-50);
    }
  }, [visible, message]);

  if (!visible && fadeAnim._value === 0) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        type === "success" ? styles.success : styles.error,
        {
          opacity: fadeAnim,
          transform: [{ translateY }],
        },
      ]}
    >
      <Text style={styles.icon}>{type === "success" ? "✓" : "✗"}</Text>
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 100,
    left: 20,
    right: 20,
    zIndex: 1000,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 25,
    borderWidth: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  success: {
    backgroundColor: "#4CAF50",
    borderColor: "#388E3C",
  },
  error: {
    backgroundColor: "#FF6B9D",
    borderColor: "#E91E63",
  },
  icon: {
    fontSize: 28,
    fontWeight: "900",
    color: "#FFFFFF",
    marginRight: 12,
  },
  message: {
    flex: 1,
    fontSize: 18,
    fontWeight: "900",
    color: "#FFFFFF",
  },
});
