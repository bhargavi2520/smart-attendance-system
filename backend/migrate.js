// backend/migrate.js
const { Umzug, SequelizeStorage } = require("umzug");
const path = require("path");
const { sequelize } = require("./models");

const umzug = new Umzug({
  storage: new SequelizeStorage({ sequelize }),

  migrations: {
    glob: path.join(__dirname, "migrations", "*.js"),
  },

  context: sequelize.getQueryInterface(),
  logger: console,
});

module.exports.runMigrations = async () => {
  console.log("--- Running pending database migrations... ---");
  try {
    const pendingMigrations = await umzug.pending();
    console.log("Pending migrations:", pendingMigrations.map(m => m.name));
    const executedMigrations = await umzug.up();
    console.log(
      `Migrations complete. Executed: ${executedMigrations.length} files.`
    );
  } catch (error) {
    console.error("DATABASE MIGRATION FAILED:", error);
    process.exit(1);
  }
};
