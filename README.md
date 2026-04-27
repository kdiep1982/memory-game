# Memory Matching Game

A React Native mobile memory matching game with exponential difficulty scaling, featuring 40 unique AI-generated card pairs (20 animals + 20 vehicles).

## 🎮 Game Features

### Core Gameplay

- **Exponential Difficulty**: Each level doubles the number of cards
  - Level 1: 4 cards (2 pairs)
  - Level 2: 8 cards (4 pairs)
  - Level 3: 16 cards (8 pairs)
  - Level 4: 32 cards (16 pairs)
  - And so on...

- **Scoring System**: +1 point for each successfully matched pair
- **Progression**: Advance to next level only after matching all pairs
- **Lives System**: Limited mistakes per level (scales with difficulty)
- **Timer**: Per-level countdown that scales with pair count
- **Move Counter**: Track your efficiency

### Additional Features

- Local high score persistence
- Haptic and sound feedback
- Level restart and selection
- New game option
- Responsive grid layout for all screen sizes

## 📋 Prerequisites

- Node.js >= 18
- React Native CLI environment set up
- iOS: Xcode and CocoaPods
- Android: Android Studio and SDK

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
# or
yarn install
```

### 2. iOS Setup

```bash
cd ios
pod install
cd ..
```

### 3. Run the App

**iOS:**

```bash
npm run ios
# or
npx react-native run-ios
```

**Android:**

```bash
npm run android
# or
npx react-native run-android
```

### 4. Run Tests

```bash
npm test
# or
yarn test
```

## 🎨 Asset Generation

The game uses 40 cartoon-style card images (20 animals + 20 vehicles). Images are generated using AI tools following strict quality guidelines.

### Asset Requirements

- **Format**: PNG
- **Master Resolution**: 1024x1024 pixels
- **Optimized Resolution**: 512x512 pixels (for app use)
- **Style**: Child-friendly cartoon illustrations
- **Background**: Plain light neutral (white/light gray/cream)
- **Subject Positioning**: Centered, ~70% frame height

### Generation Workflow

Complete generation instructions are in:

```
src/assets/cards/manifests/prompt-pack.md
```

#### Quick Start for Asset Generation:

1. Review the locked prompt templates in `prompt-pack.md`
2. For each subject in the locked list:
   - Generate 4 candidates using the exact prompt
   - Score each against the 10-point acceptance checklist
   - Select the candidate with 10/10 score
   - If none pass, regenerate 4 new candidates
3. Export selected images at 1024x1024
4. Optimize to 512x512 for app use
5. Save with canonical filename: `{category}_{subject}.png`
   - Examples: `animals_lion.png`, `vehicles_car.png`
6. Place in appropriate directory:
   - Animals: `src/assets/cards/animals/`
   - Vehicles: `src/assets/cards/vehicles/`
7. Update `src/assets/cards/manifests/assets.json` metadata

### Acceptance Checklist (All Required)

Each asset must score 10/10 on these criteria:

1. ✅ Identity clarity (recognizable within 2 seconds)
2. ✅ Category clarity (animal vs vehicle)
3. ✅ Single-subject rule (one object only)
4. ✅ Silhouette completeness (no clipping)
5. ✅ Style consistency (matches pack aesthetic)
6. ✅ Legibility at small size (96x96 pixels)
7. ✅ No forbidden artifacts (text/logos/watermarks)
8. ✅ Distinctiveness (unique from other cards)
9. ✅ Technical quality (no compression artifacts)
10. ✅ Naming compliance (matches ID schema)

### Recommended Generation Tools

- Stable Diffusion (SDXL or SD 1.5)
- Midjourney
- DALL-E 3
- Leonardo.ai

**Important**: Use consistent model and settings across all 40 images to ensure style consistency.

## 📁 Project Structure

```
Memory/
├── src/
│   ├── assets/
│   │   └── cards/
│   │       ├── animals/          # Animal card images (20)
│   │       ├── vehicles/         # Vehicle card images (20)
│   │       └── manifests/
│   │           ├── prompt-pack.md    # AI generation instructions
│   │           └── assets.json       # Asset metadata catalog
│   ├── components/
│   │   ├── CardTile.tsx          # Individual card component
│   │   ├── GameHeader.tsx        # Status display (score, lives, timer)
│   │   └── ResultModal.tsx       # Level complete/game over UI
│   ├── data/
│   │   └── cardCatalog.ts        # 40 card pair definitions
│   ├── game/
│   │   ├── types.ts              # Game state types
│   │   ├── levelConfig.ts        # Level scaling formulas
│   │   └── engine.ts             # Core game logic
│   ├── services/
│   │   ├── storage.ts            # Async storage for high scores
│   │   └── feedback.ts           # Haptic/sound feedback
│   └── utils/
│       └── shuffle.ts            # Fisher-Yates shuffle algorithm
├── __tests__/
│   ├── engine.test.ts            # Game logic tests
│   └── assets.test.ts            # Asset catalog validation
├── App.tsx                       # Main app component
├── package.json
├── tsconfig.json
└── README.md
```

## 🎯 Game Rules

### Objective

Match all pairs of cards at each level to advance. Clear as many levels as possible with the highest score.

### How to Play

1. **Start**: Tap any face-down card to flip it
2. **Match**: Tap a second card to find its matching pair
3. **Success**: Matched pairs stay face-up (+1 score)
4. **Mismatch**: Non-matching pairs flip back face-down (-1 life)
5. **Level Complete**: Match all pairs to unlock the next level
6. **Game Over**: Run out of lives or time

### Winning Conditions

- Match all pairs in the current level
- Time remaining > 0
- Lives remaining > 0

### Losing Conditions

- Lives reach 0
- Timer reaches 0

### Scoring

- +1 point per successfully matched pair
- No score for mismatches
- Total score persists across levels
- High score saved locally

### Difficulty Scaling

| Level | Cards | Pairs | Base Time | Lives |
| ----- | ----- | ----- | --------- | ----- |
| 1     | 4     | 2     | 40s       | 3     |
| 2     | 8     | 4     | 50s       | 3     |
| 3     | 16    | 8     | 70s       | 4     |
| 4     | 32    | 16    | 110s      | 4     |
| 5     | 64    | 32    | 190s      | 5     |

**Formula:**

- Cards: `4 × 2^(level-1)`
- Pairs: `cards ÷ 2`
- Time: `30 + (pairs × 5)` seconds
- Lives: `3 + floor((level-1) ÷ 2)`

## 🧪 Testing

### Run All Tests

```bash
npm test
```

### Run Specific Test Suite

```bash
npm test engine.test
npm test assets.test
```

### Test Coverage

```bash
npm test -- --coverage
```

### What's Tested

- ✅ Level growth formula (exponential scaling)
- ✅ Scoring rules (+1 per match, no score on mismatch)
- ✅ Progression gates (advance only after full clear)
- ✅ Timer and lives fail states
- ✅ Card catalog integrity (40 pairs, 20/20 split)
- ✅ Asset naming conventions
- ✅ Subject list compliance

## 🔧 Development

### Available Scripts

- `npm start` - Start Metro bundler
- `npm run ios` - Run on iOS simulator
- `npm run android` - Run on Android emulator
- `npm test` - Run Jest tests
- `npm run lint` - Run ESLint

### Hot Reload

During development, enable hot reload by pressing `R` in the Metro console or shaking your device and selecting "Reload".

## 📝 TODO: Asset Generation

Before the game can be fully played with images, complete these steps:

1. ✅ Review prompt templates in `src/assets/cards/manifests/prompt-pack.md`
2. ⏳ Generate 20 animal card images
3. ⏳ Generate 20 vehicle card images
4. ⏳ Validate each image against acceptance checklist
5. ⏳ Place images in appropriate directories
6. ⏳ Update asset manifest status fields to "accepted"
7. ⏳ Update `CardTile.tsx` to load actual images instead of placeholders

### Placeholder Cards

Currently, cards display emoji placeholders (🦁 for animals, 🚗 for vehicles) and image keys until actual assets are generated.

## 🐛 Troubleshooting

### Metro Bundler Issues

```bash
npm start -- --reset-cache
```

### iOS Build Failures

```bash
cd ios
pod install --repo-update
cd ..
```

### Android Build Failures

```bash
cd android
./gradlew clean
cd ..
```

## 📄 License

This project is for educational purposes.

## 🤝 Contributing

1. Follow the existing code style
2. Add tests for new features
3. Ensure all tests pass before submitting
4. Update documentation as needed

## 📞 Support

For issues or questions:

1. Check existing documentation
2. Review test files for examples
3. Verify asset generation workflow compliance

---

**Note**: This game requires 40 AI-generated card images to be fully functional. Follow the asset generation workflow in `src/assets/cards/manifests/prompt-pack.md` to complete the image set.
