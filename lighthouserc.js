module.exports = {
  ci: {
    collect: {
      startServerCommand: "npm run start",
      url: ["http://localhost:3000"],
      numberOfRuns: 3,
    },
    upload: {
      target: "temporary-public-storage",
    },
    assert: {
      preset: "lighthouse:recommended",
      assertions: {
        "first-contentful-paint": ["error", { minScore: 0.8 }],
        interactive: ["error", { minScore: 0.8 }],
        "performance-budget": ["error", { minScore: 0.9 }],
        "uses-responsive-images": ["error", { minScore: 0.9 }],
        "uses-rel-preconnect": ["error", { minScore: 0.9 }],
        "uses-text-compression": ["error", { minScore: 1 }],
        "uses-optimized-images": ["error", { minScore: 0.9 }],
      },
    },
  },
};
