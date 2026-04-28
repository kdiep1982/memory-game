import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Animated,
  Image,
} from "react-native";
import { StorageService, UserProfile } from "../services/storage";

const AVATARS = [
  { id: "lion", label: "🦁", name: "Lion", color: "#FFB74D" },
  { id: "panda", label: "🐼", name: "Panda", color: "#A1887F" },
  { id: "tiger", label: "🐯", name: "Tiger", color: "#FF9800" },
  { id: "frog", label: "🐸", name: "Frog", color: "#66BB6A" },
  { id: "fox", label: "🦊", name: "Fox", color: "#FF7043" },
  { id: "rabbit", label: "🐰", name: "Rabbit", color: "#F48FB1" },
  { id: "koala", label: "🐨", name: "Koala", color: "#90A4AE" },
  { id: "pig", label: "🐷", name: "Pig", color: "#F48FB1" },
];

interface LoginScreenProps {
  onLogin: (user: UserProfile) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0].id);
  const [existingUsers, setExistingUsers] = useState<UserProfile[]>([]);
  const [showNewUser, setShowNewUser] = useState(false);
  const bounceAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    loadUsers();
    startBounceAnimation();
  }, []);

  const startBounceAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -10,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  };

  const loadUsers = async () => {
    const users = await StorageService.getAllUsers();
    console.log("📱 Loaded users:", users);
    console.log("🎨 Available avatars:", AVATARS);
    setExistingUsers(users);
    if (users.length === 0) {
      setShowNewUser(true);
    }
  };

  const handleCreateUser = async () => {
    if (username.trim().length < 2) {
      return;
    }

    const user = await StorageService.createUser(
      username.trim(),
      selectedAvatar,
    );
    onLogin(user);
  };

  const handleSelectUser = async (user: UserProfile) => {
    await StorageService.setCurrentUser(user.username);
    onLogin(user);
  };

  if (showNewUser || existingUsers.length === 0) {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Animated.View
            style={[
              styles.titleContainer,
              { transform: [{ translateY: bounceAnim }] },
            ]}
          >
            <View style={styles.logoContainer}>
              <Image
                source={require("../assets/images/logo.png")}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.title}>Memory Game!</Text>
            <Text style={styles.subtitle}>Let's Play and Have Fun!</Text>
          </Animated.View>

          <View style={styles.formContainer}>
            <Text style={styles.label}>What's your name?</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your name..."
              placeholderTextColor="#B0BEC5"
              value={username}
              onChangeText={setUsername}
              maxLength={15}
              autoCapitalize="words"
            />

            <Text style={styles.label}>Pick your avatar!</Text>
            <View style={styles.avatarGrid}>
              {AVATARS.map((avatar) => (
                <TouchableOpacity
                  key={avatar.id}
                  style={[
                    styles.avatarButton,
                    { backgroundColor: avatar.color },
                    selectedAvatar === avatar.id && styles.avatarButtonSelected,
                  ]}
                  onPress={() => setSelectedAvatar(avatar.id)}
                >
                  <Text style={styles.avatarName}>{avatar.name}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={[
                styles.playButton,
                username.trim().length < 2 && styles.playButtonDisabled,
              ]}
              onPress={handleCreateUser}
              disabled={username.trim().length < 2}
            >
              <Text style={styles.playButtonText}>★ Start Playing! ★</Text>
            </TouchableOpacity>

            {existingUsers.length > 0 && (
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => setShowNewUser(false)}
              >
                <Text style={styles.backButtonText}>← Back to Players</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View
          style={[
            styles.titleContainer,
            { transform: [{ translateY: bounceAnim }] },
          ]}
        >
          <View style={styles.logoContainer}>
            <Image
              source={require("../assets/images/logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.subtitle}>Choose your player ↓</Text>
        </Animated.View>

        <View style={styles.usersContainer}>
          {existingUsers.map((user) => {
            const avatar =
              AVATARS.find((a) => a.id === user.avatar) || AVATARS[0];
            return (
              <TouchableOpacity
                key={user.username}
                style={styles.userCard}
                onPress={() => handleSelectUser(user)}
              >
                <View
                  style={[
                    styles.userAvatarCircle,
                    { backgroundColor: avatar.color },
                  ]}
                >
                  <Text style={styles.userAvatarText}>{avatar.name[0]}</Text>
                </View>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{user.username}</Text>
                  <View style={styles.userStats}>
                    <Text style={styles.userStatText}>★ {user.highScore}</Text>
                    <Text style={styles.userStatText}>
                      ▸ Level {user.maxLevel}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}

          <TouchableOpacity
            style={styles.newPlayerButton}
            onPress={() => setShowNewUser(true)}
          >
            <Text style={styles.newPlayerEmoji}>+</Text>
            <Text style={styles.newPlayerText}>New Player</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF9C4",
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logo: {
    width: 120,
    height: 120,
  },
  title: {
    fontSize: 42,
    fontWeight: "900",
    color: "#FF6B9D",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#7C4DFF",
    marginTop: 10,
    textAlign: "center",
  },
  formContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 4,
    borderColor: "#FFD54F",
  },
  label: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FF6B9D",
    marginBottom: 12,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#F5F5F5",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 24,
    borderWidth: 3,
    borderColor: "#E0E0E0",
    color: "#212121",
  },
  avatarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
    marginBottom: 24,
  },
  avatarButton: {
    width: 70,
    height: 70,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#E0E0E0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarButtonSelected: {
    borderColor: "#FF6B9D",
    borderWidth: 5,
    transform: [{ scale: 1.05 }],
  },
  avatarName: {
    fontSize: 12,
    fontWeight: "900",
    color: "#FFFFFF",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  playButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 25,
    paddingVertical: 18,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 3,
    borderColor: "#388E3C",
  },
  playButtonDisabled: {
    backgroundColor: "#BDBDBD",
    borderColor: "#9E9E9E",
  },
  playButtonText: {
    fontSize: 22,
    fontWeight: "900",
    color: "#FFFFFF",
  },
  backButton: {
    marginTop: 16,
    paddingVertical: 12,
    alignItems: "center",
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#7C4DFF",
  },
  usersContainer: {
    gap: 16,
  },
  userCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 3,
    borderColor: "#FFD54F",
  },
  userAvatar: {
    fontSize: 48,
    marginRight: 16,
    textAlign: "center",
  },
  userAvatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    borderWidth: 3,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  userAvatarText: {
    fontSize: 28,
    fontWeight: "900",
    color: "#FFFFFF",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: "900",
    color: "#FF6B9D",
    marginBottom: 8,
  },
  userStats: {
    flexDirection: "row",
    gap: 16,
  },
  userStatText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#7C4DFF",
  },
  newPlayerButton: {
    backgroundColor: "#7C4DFF",
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 3,
    borderColor: "#5E35B1",
    gap: 12,
  },
  newPlayerEmoji: {
    fontSize: 32,
  },
  newPlayerText: {
    fontSize: 22,
    fontWeight: "900",
    color: "#FFFFFF",
  },
});
