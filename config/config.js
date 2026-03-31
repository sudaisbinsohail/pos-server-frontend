
// const path = require('path');

// // console.log('Database path:', dbPath)

// module.exports = {
//   dialect: 'sqlite',
//   // storage: dbPath, // persistent location
//    storage: path.join(__dirname, '../posss.db'),
//   username: null,
//   password: null,
//   database: null,
//   host: null,
// }




// const path = require('path');
const { app } = require('electron');

// const dbPath = path.join(app.getPath('userData'), 'pos.db');

module.exports = {
  dialect: 'postgresql',
  // storage: dbPath, // persistent and writable location
  username: "admin",
  password: "admin",
  database: "pos_db",
  host: "localhost",
};
