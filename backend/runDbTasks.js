// backend/runDbTasks.js

// This imports your database connection from models/index.js
const { sequelize } = require("./models");

async function syncDatabase() {
  console.log("Starting database synchronization...");
  try {
    // This command reads your models and creates the tables.
    // { force: true } drops tables if they exist, ensuring a clean start.
    await sequelize.sync({ force: true });
    console.log("Database synchronized successfully.");
    process.exit(0); // Exit successfully
  } catch (error) {
    console.error("Failed to synchronize database:", error);
    process.exit(1); // Exit with an error to fail the build
  }
}

// Run the function
syncDatabase();
