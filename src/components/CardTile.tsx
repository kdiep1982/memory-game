import React, { useEffect, useRef, useState } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  Image,
} from "react-native";
import { Card } from "../game/types";

// Image mapping for all cards
const imageMap: Record<string, any> = {
  // Animals
  animals_lion: require("../assets/cards/animals/animals_lion.png"),
  animals_tiger: require("../assets/cards/animals/animals_tiger.png"),
  animals_elephant: require("../assets/cards/animals/animals_elephant.png"),
  animals_giraffe: require("../assets/cards/animals/animals_giraffe.png"),
  animals_zebra: require("../assets/cards/animals/animals_zebra.png"),
  animals_panda: require("../assets/cards/animals/animals_panda.png"),
  animals_koala: require("../assets/cards/animals/animals_koala.png"),
  animals_monkey: require("../assets/cards/animals/animals_monkey.png"),
  animals_fox: require("../assets/cards/animals/animals_fox.png"),
  animals_rabbit: require("../assets/cards/animals/animals_rabbit.png"),
  animals_bear: require("../assets/cards/animals/animals_bear.png"),
  animals_deer: require("../assets/cards/animals/animals_deer.png"),
  animals_wolf: require("../assets/cards/animals/animals_wolf.png"),
  animals_penguin: require("../assets/cards/animals/animals_penguin.png"),
  animals_dolphin: require("../assets/cards/animals/animals_dolphin.png"),
  animals_whale: require("../assets/cards/animals/animals_whale.png"),
  animals_turtle: require("../assets/cards/animals/animals_turtle.png"),
  animals_crocodile: require("../assets/cards/animals/animals_crocodile.png"),
  animals_owl: require("../assets/cards/animals/animals_owl.png"),
  animals_parrot: require("../assets/cards/animals/animals_parrot.png"),
  // Vehicles
  vehicles_car: require("../assets/cards/vehicles/vehicles_car.png"),
  vehicles_bus: require("../assets/cards/vehicles/vehicles_bus.png"),
  vehicles_truck: require("../assets/cards/vehicles/vehicles_truck.png"),
  vehicles_motorcycle: require("../assets/cards/vehicles/vehicles_motorcycle.png"),
  vehicles_bicycle: require("../assets/cards/vehicles/vehicles_bicycle.png"),
  vehicles_train: require("../assets/cards/vehicles/vehicles_train.png"),
  vehicles_tram: require("../assets/cards/vehicles/vehicles_tram.png"),
  vehicles_helicopter: require("../assets/cards/vehicles/vehicles_helicopter.png"),
  vehicles_airplane: require("../assets/cards/vehicles/vehicles_airplane.png"),
  vehicles_rocket: require("../assets/cards/vehicles/vehicles_rocker.png"), // Note: file is "rocker" but catalog says "rocket"
  vehicles_boat: require("../assets/cards/vehicles/vehicles_boat.png"),
  vehicles_ship: require("../assets/cards/vehicles/vehicles_ship.jpg"),
  vehicles_submarine: require("../assets/cards/vehicles/vehicles_submarine.png"),
  vehicles_ambulance: require("../assets/cards/vehicles/vehicles_ambulance.png"),
  vehicles_firetruck: require("../assets/cards/vehicles/vehicles_firetruck.png"),
  vehicles_policecar: require("../assets/cards/vehicles/vehicles_policecar.png"),
  vehicles_tractor: require("../assets/cards/vehicles/vehicles_tractor.png"),
  vehicles_bulldozer: require("../assets/cards/vehicles/vehicles_tractor.png"), // Using tractor as fallback
  vehicles_scooter: require("../assets/cards/vehicles/vehicles_scooter.png"),
  vehicles_hotairballoon: require("../assets/cards/vehicles/vehicles_hotairballon.png"), // Note: file is "hotairballon"
};

interface CardTileProps {
  card: Card;
  onPress: (cardId: string) => void;
  disabled: boolean;
  gridSize: number; // Number of columns in the grid
}

export const CardTile: React.FC<CardTileProps> = ({
  card,
  onPress,
  disabled,
  gridSize,
}) => {
  const screenWidth = Dimensions.get("window").width;
  // Increased padding and spacing for larger cards
  const cardSize = (screenWidth - 30 - (gridSize - 1) * 8) / gridSize;

  // Animation value for flip (0 = face down, 1 = face up)
  const flipAnimation = useRef(new Animated.Value(0)).current;
  const [imageError, setImageError] = useState(false);

  // Check if image exists for this card
  const imageSource = imageMap[card.imageKey];
  const hasImage = !!imageSource && !imageError;

  // Animate when card flips
  useEffect(() => {
    Animated.spring(flipAnimation, {
      toValue: card.isFlipped || card.isMatched ? 1 : 0,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
  }, [card.isFlipped, card.isMatched]);

  const handlePress = () => {
    if (!disabled && !card.isFlipped && !card.isMatched) {
      onPress(card.id);
    }
  };

  // Interpolate rotation for front and back
  const frontRotation = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["180deg", "360deg"],
  });

  const backRotation = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const frontOpacity = flipAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
  });

  const backOpacity = flipAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0, 0],
  });

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled || card.isFlipped || card.isMatched}
      style={[styles.container, { width: cardSize, height: cardSize }]}
      activeOpacity={0.7}
    >
      <View style={styles.cardContainer}>
        {/* Card Back (face down) */}
        <Animated.View
          style={[
            styles.card,
            styles.cardFace,
            styles.faceDown,
            {
              transform: [{ rotateY: backRotation }],
              opacity: backOpacity,
            },
          ]}
        >
          <View style={styles.cardBack}>
            <Text style={styles.cardBackText}>?</Text>
          </View>
        </Animated.View>

        {/* Card Front (face up) */}
        <Animated.View
          style={[
            styles.card,
            styles.cardFace,
            styles.flipped,
            card.isMatched && styles.matched,
            {
              transform: [{ rotateY: frontRotation }],
              opacity: frontOpacity,
            },
          ]}
        >
          <View style={styles.cardFront}>
            {hasImage ? (
              <Image
                source={imageSource}
                style={[
                  styles.cardImage,
                  {
                    width: cardSize * 0.85,
                    height: cardSize * 0.85,
                  },
                ]}
                resizeMode="contain"
                onError={(error) => {
                  console.error(
                    `❌ Image load error for ${card.imageKey}:`,
                    error.nativeEvent,
                  );
                  setImageError(true);
                }}
              />
            ) : (
              <>
                <Text style={styles.placeholderText}>{card.imageKey}</Text>
                <Text style={styles.emojiPlaceholder}>
                  {card.pairId.includes("animal") ? "🦁" : "🚗"}
                </Text>
              </>
            )}
          </View>
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 4,
  },
  cardContainer: {
    flex: 1,
    position: "relative",
  },
  card: {
    flex: 1,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    backfaceVisibility: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  cardFace: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  faceDown: {
    backgroundColor: "#7C4DFF",
    borderColor: "#5E35B1",
  },
  flipped: {
    backgroundColor: "#FFFFFF",
    borderColor: "#FFD54F",
  },
  matched: {
    backgroundColor: "#C8E6C9",
    borderColor: "#4CAF50",
    opacity: 0.8,
  },
  cardBack: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cardBackText: {
    fontSize: 40,
    fontWeight: "900",
    color: "#FFFFFF",
  },
  cardFront: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
  },
  cardImage: {
    // Dimensions set inline based on cardSize
  },
  placeholderText: {
    fontSize: 8,
    color: "#7C4DFF",
    textAlign: "center",
    marginBottom: 4,
    fontWeight: "800",
  },
  emojiPlaceholder: {
    fontSize: 40,
  },
});
