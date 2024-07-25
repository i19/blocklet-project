const Database = require('better-sqlite3');

let dbInstance = null;

module.exports = {
  init: (dbPath) => {
    if (!dbInstance) {
      dbInstance = new Database(dbPath, { verbose: console.log });
    }
  },
  get: () => {
    if (dbInstance) {
      return dbInstance;
    } else {
      throw new Error('Database not initialized');
    }
  },
};
