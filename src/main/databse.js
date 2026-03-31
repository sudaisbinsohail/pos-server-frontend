const db = require("../../models");
const { Sequelize } = require("sequelize");

// Import your seeders
const seedAdminRole = require("../../seeders/20260207104639-seed-admin-role-and-user");
const seedDefaultPermissions = require("../../seeders/20260207124850-seed-default-user-permission");
const seedAssignPermissions = require("../../seeders/20260216095534-assign-permissions");
const seedUnits = require("../../seeders/20260216095816-default-units");

// Unique names for tracking
const seeders = [
  { name: "20260216-seed-admin-role", seeder: seedAdminRole },
  { name: "20260216-seed-default-permissions", seeder: seedDefaultPermissions },
  { name: "20260216-seed-assign-permissions", seeder: seedAssignPermissions },
  { name: "20260216-seed-units", seeder: seedUnits },
];

export async function initializeDatabase() {
  try {
    await db.sequelize.sync();
    console.log("Database synced");

    const queryInterface = db.sequelize.getQueryInterface();

    // Ensure SeederMeta table exists
    await queryInterface.createTable('SeederMeta', {
      name: { type: Sequelize.STRING, primaryKey: true },
      executedAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
    }).catch(() => {}); // ignore if exists

    // Already executed seeders
    const executedSeeders = (await db.sequelize.query(
      'SELECT name FROM "SeederMeta";',
      { type: Sequelize.QueryTypes.SELECT }
    )).map(s => s.name);

    // Run seeders
    for (const s of seeders) {
      if (!executedSeeders.includes(s.name)) {
        console.log(`Running seeder: ${s.name}`);
        try {
          if (s.seeder.up.length === 2) {
            await s.seeder.up(queryInterface, db.Sequelize);
          } else {
            await s.seeder.up();
          }

          // Mark seeder as executed
          await db.sequelize.query(
            `INSERT INTO "SeederMeta" (name, executedAt) VALUES (:name, :executedAt)`,
            { replacements: { name: s.name, executedAt: new Date() } }
          );

        } catch (err) {
          console.error(`❌ Seeder failed: ${s.name}`, err);
          throw err; // stop if seeder fails
        }
      } else {
        console.log(`Seeder already executed: ${s.name}`);
      }
    }

    console.log("✅ All seeders applied successfully");

  } catch (err) {
    console.error("DB Sync or Seeder error:", err);
  }
}

export default db;
