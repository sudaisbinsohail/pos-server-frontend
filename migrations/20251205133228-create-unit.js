// 'use strict';

// module.exports = {
//   async up(queryInterface, Sequelize) {
//     await queryInterface.createTable('Units', {
//       id: {
//         allowNull: false,
//         autoIncrement: true,
//         primaryKey: true,
//         type: Sequelize.INTEGER
//       },
//       uuid: {
//         type: Sequelize.UUID,
//         defaultValue: Sequelize.UUIDV4,
//         allowNull: false,
//         unique: true
//       },
//       unit_name: {
//         type: Sequelize.STRING,
//         allowNull: false,
//         unique: true
//       },
//       base_unit_id: {
//         type: Sequelize.INTEGER,
//         allowNull: true,
//         references: {
//           model: 'Units', // self-reference for base unit
//           key: 'id'
//         },
//         onUpdate: 'CASCADE',
//         onDelete: 'SET NULL'
//       },
//       universal_conversion: {
//         type: Sequelize.FLOAT,
//         allowNull: true
//       },
//       abbreviation: {
//         type: Sequelize.STRING,
//         allowNull: true,
//         unique: true
//       },
//       notes: {
//         type: Sequelize.STRING,
//         allowNull: true
//       },
//       sortOrder: {
//         type: Sequelize.INTEGER,
//         defaultValue: 0
//       },
//       createdAt: {
//         allowNull: false,
//         type: Sequelize.DATE,
//       },
//       updatedAt: {
//         allowNull: false,
//         type: Sequelize.DATE,
//       },
//       deletedAt: {
//         allowNull: true,
//         type: Sequelize.DATE
//       }
//     });
//   },

//   async down(queryInterface, Sequelize) {
//     await queryInterface.dropTable('Units');
//   }
// };


'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Units', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        unique: true
      },
      unit_name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      base_unit_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'Units', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      universal_conversion: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      abbreviation: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      notes: {
        type: Sequelize.STRING,
        allowNull: true
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'Users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      created_by: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'system'
      },
      sortOrder: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Units');
  }
};

