const { Pool } = require("pg");

class Database {
  static #instance = null;

  constructor() {
    if (Database.#instance) {
      throw new Error("Use Database.getInstance() em vez de 'new Database()'");
    }

    this.pool = new Pool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

    Database.#instance = this;
  }

  static getInstance() {
    if (!Database.#instance) {
      Database.#instance = new Database();
    }
    return Database.#instance;
  }

  async query(text, params) {
    return this.pool.query(text, params);
  }
}

module.exports = Database;
