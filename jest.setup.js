// Jest setup file
// import "@testing-library/jest-native/extend-expect"; // Optional - commented out as not installed

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
}));

// Mock Haptic Feedback
jest.mock("react-native-haptic-feedback", () => ({
  trigger: jest.fn(),
}));
