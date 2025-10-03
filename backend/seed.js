// backend/seed.js
const { sequelize } = require("./models");
const path = require("path");

// 🚨 CRITICAL: Add the filename here!
const seedFiles = ["20251002143755-complete-initial-data.js"];

module.exports.runSeeds = async () => {
  const queryInterface = sequelize.getQueryInterface();
  console.log("--- Running database seeds... ---");

  for (const filename of seedFiles) {
    // ... (rest of the runSeeds logic remains the same)
    try {
      const filePath = path.join(__dirname, "seeders", filename);
      const seeder = require(filePath);

      await seeder.up(queryInterface, sequelize.constructor);
      console.log(`Seeded: ${filename}`);
    } catch (error) {
      console.error(`SEEDING FAILED for ${filename}:`, error);
      process.exit(1);
    }
  }
  console.log("Seeding complete.");
};
