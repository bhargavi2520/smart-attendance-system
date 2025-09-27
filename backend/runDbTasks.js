// backend/runDbTasks.js
const { Umzug, SequelizeStorage } = require("umzug");
const db = require("./models");
const sequelize = db.sequelize;

console.log("Starting programmatic database tasks...");

const migrator = new Umzug({
  migrations: { glob: "migrations/*.js" },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
});

const seeder = new Umzug({
  migrations: { glob: "seeders/*.js" },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({
    sequelize,
    modelName: "SequelizeData-seeds",
  }),
  logger: console,
});

const runTasks = async () => {
  try {
    console.log("Running database migrations...");
    await migrator.up();
    console.log("Migrations completed successfully.");

    console.log("Running database seeders...");
    await seeder.up();
    console.log("Seeders completed successfully.");

    console.log("Database tasks finished.");
    process.exit(0);
  } catch (error) {
    console.error("Failed to complete database tasks:", error);
    process.exit(1);
  }
};

runTasks();
