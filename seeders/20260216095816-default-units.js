// 'use strict';

// const { v4: uuidv4 } = require('uuid');

// module.exports = {
//   async up(queryInterface, Sequelize) {
//     try {
//       console.log("Seeding basic units...");

//       const defaultUnits = [
//         { unit_name: "Pieces", abbreviation: "pcs" },
//         { unit_name: "Box", abbreviation: "box" },
//         { unit_name: "Carton", abbreviation: "ctn" }
//       ];

//       // Add timestamps and UUID
//       const unitsToInsert = defaultUnits.map(unit => ({
//         ...unit,
//         id: uuidv4(),
//         createdAt: new Date(),
//         updatedAt: new Date()
//       }));

//       await queryInterface.bulkInsert('Units', unitsToInsert, {});

//       console.log("Units seeded successfully ✅");
//     } catch (error) {
//       console.error("Seed Units Error:", error);
//       throw error;
//     }
//   },

//   async down(queryInterface, Sequelize) {
//     try {
//       await queryInterface.bulkDelete('Units', {
//         unit_name: ["Pieces", "Box", "Carton"]
//       }, {});

//       console.log("Seeded units removed successfully ✅");
//     } catch (error) {
//       console.error("Delete Units Seed Error:", error);
//       throw error;
//     }
//   }
// };
