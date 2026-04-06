
// const { app } = require('electron');



// module.exports = {
//   dialect: 'sqlite',
//   database: "pos",
//   host: "localhost",
// };

//========================not in folder

// const path = require('path')
// const { app } = require('electron')

// const dbPath = path.join(app.getPath('userData'), 'pos.db')

// console.log('📁 SQLite DB Path:', dbPath)

// module.exports = {
//   dialect: 'sqlite',
//   storage: dbPath,
// }


//=======================in folder

const path = require('path')

const dbPath = path.join(__dirname, '../pos.db')

console.log('📁 Dev DB Path:', dbPath)

module.exports = {
  dialect: 'sqlite',
  storage: dbPath,
}