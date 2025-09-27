// backend/runDbTasks.js

const { execSync } = require("child_process");

console.log("Starting database tasks...");

try {
  console.log("Running database migrations...");
  // The { stdio: 'inherit' } option pipes the output to the console in real-time
  execSync("npx sequelize-cli db:migrate", { stdio: "inherit" });
  console.log("Migrations completed successfully.");

  console.log("Running database seeders...");
  execSync("npx sequelize-cli db:seed:all", { stdio: "inherit" });
  console.log("Seeders completed successfully.");

  console.log("Database tasks finished.");
  process.exit(0);
} catch (error) {
  console.error("Failed to complete database tasks:", error);
  process.exit(1);
}
