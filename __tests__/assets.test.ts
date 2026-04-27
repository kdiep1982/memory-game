import {
  CARD_CATALOG,
  getCardsByCategory,
  selectRandomPairs,
  validateCatalog,
} from "../src/data/cardCatalog";

describe("Card Catalog", () => {
  describe("Catalog integrity", () => {
    it("should have exactly 40 pairs", () => {
      expect(CARD_CATALOG.length).toBe(40);
    });

    it("should have exactly 20 animals", () => {
      const animals = getCardsByCategory("animal");
      expect(animals.length).toBe(20);
    });

    it("should have exactly 20 vehicles", () => {
      const vehicles = getCardsByCategory("vehicle");
      expect(vehicles.length).toBe(20);
    });

    it("should pass validation", () => {
      const result = validateCatalog();
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should have unique pairIds", () => {
      const pairIds = CARD_CATALOG.map((card) => card.pairId);
      const uniquePairIds = new Set(pairIds);
      expect(uniquePairIds.size).toBe(40);
    });

    it("should have unique imageKeys", () => {
      const imageKeys = CARD_CATALOG.map((card) => card.imageKey);
      const uniqueImageKeys = new Set(imageKeys);
      expect(uniqueImageKeys.size).toBe(40);
    });

    it("should have properly formatted pairIds", () => {
      CARD_CATALOG.forEach((card) => {
        expect(card.pairId).toMatch(/^(animal|vehicle)_[a-z]+$/);
      });
    });

    it("should have properly formatted imageKeys", () => {
      CARD_CATALOG.forEach((card) => {
        expect(card.imageKey).toMatch(/^(animals|vehicles)_[a-z]+$/);
      });
    });

    it("should have non-empty subjects", () => {
      CARD_CATALOG.forEach((card) => {
        expect(card.subject).toBeTruthy();
        expect(card.subject.length).toBeGreaterThan(0);
      });
    });

    it("should have non-empty altText", () => {
      CARD_CATALOG.forEach((card) => {
        expect(card.altText).toBeTruthy();
        expect(card.altText.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Category filtering", () => {
    it("should return only animals when filtering by animal", () => {
      const animals = getCardsByCategory("animal");
      animals.forEach((card) => {
        expect(card.category).toBe("animal");
      });
    });

    it("should return only vehicles when filtering by vehicle", () => {
      const vehicles = getCardsByCategory("vehicle");
      vehicles.forEach((card) => {
        expect(card.category).toBe("vehicle");
      });
    });
  });

  describe("selectRandomPairs", () => {
    it("should return requested number of pairs", () => {
      const pairs = selectRandomPairs(5);
      expect(pairs.length).toBe(5);
    });

    it("should throw error if requesting more pairs than available", () => {
      expect(() => selectRandomPairs(50)).toThrow();
    });

    it("should return unique pairs", () => {
      const pairs = selectRandomPairs(10);
      const pairIds = pairs.map((p) => p.pairId);
      const uniqueIds = new Set(pairIds);
      expect(uniqueIds.size).toBe(10);
    });

    it("should support selecting all pairs", () => {
      const pairs = selectRandomPairs(40);
      expect(pairs.length).toBe(40);
    });
  });

  describe("Locked subject list compliance", () => {
    const expectedAnimals = [
      "lion",
      "tiger",
      "elephant",
      "giraffe",
      "zebra",
      "panda",
      "koala",
      "monkey",
      "fox",
      "rabbit",
      "bear",
      "deer",
      "wolf",
      "penguin",
      "dolphin",
      "whale",
      "turtle",
      "crocodile",
      "owl",
      "parrot",
    ];

    const expectedVehicles = [
      "car",
      "bus",
      "truck",
      "motorcycle",
      "bicycle",
      "train",
      "tram",
      "helicopter",
      "airplane",
      "rocket",
      "boat",
      "ship",
      "submarine",
      "ambulance",
      "fire truck",
      "police car",
      "tractor",
      "bulldozer",
      "scooter",
      "hot air balloon",
    ];

    it("should have all expected animals", () => {
      const animals = getCardsByCategory("animal");
      const animalSubjects = animals.map((a) => a.subject);

      expectedAnimals.forEach((expectedAnimal) => {
        expect(animalSubjects).toContain(expectedAnimal);
      });
    });

    it("should have all expected vehicles", () => {
      const vehicles = getCardsByCategory("vehicle");
      const vehicleSubjects = vehicles.map((v) => v.subject);

      expectedVehicles.forEach((expectedVehicle) => {
        expect(vehicleSubjects).toContain(expectedVehicle);
      });
    });

    it("should not have any extra animals", () => {
      const animals = getCardsByCategory("animal");
      expect(animals.length).toBe(expectedAnimals.length);
    });

    it("should not have any extra vehicles", () => {
      const vehicles = getCardsByCategory("vehicle");
      expect(vehicles.length).toBe(expectedVehicles.length);
    });
  });

  describe("Image key naming convention", () => {
    it("should follow category_subject naming for animals", () => {
      const animals = getCardsByCategory("animal");
      animals.forEach((animal) => {
        expect(animal.imageKey).toMatch(/^animals_[a-z]+$/);
      });
    });

    it("should follow category_subject naming for vehicles", () => {
      const vehicles = getCardsByCategory("vehicle");
      vehicles.forEach((vehicle) => {
        expect(vehicle.imageKey).toMatch(/^vehicles_[a-z]+$/);
      });
    });
  });
});
