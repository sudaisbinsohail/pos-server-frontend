'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const config = require(__dirname + '/../config/config.js');
const db = {};
// const sequelize = new Sequelize(config.database, config.username, config.password, config);
const sequelize = new Sequelize(config.database, config.username, config.password, {
  ...config,
  hooks: {
    afterConnect: async (connection) => {
      await connection.run('PRAGMA foreign_keys = OFF')
    }
  }
});
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
       file !== 'associations.js' &&
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    console.log("Model console value",model)
    db[model.name] = model;
    //  if (model && model.name) {
    //   db[model.name] = model;
    // } else {
    //   console.warn('Skipped file (not a model):', file);
    // }
  });



require('./associations')(db); 


db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
