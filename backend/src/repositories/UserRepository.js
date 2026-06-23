const Database = require("../config/database");

class UserRepository {
  constructor() {
    this.db = Database.getInstance();
  }

  async findAll() {
    const result = await this.db.query(
      "SELECT id, nome, email FROM users ORDER BY id",
    );
    return result.rows;
  }

  async findById(id) {
    const result = await this.db.query(
      "SELECT id, nome, email FROM users WHERE id = $1",
      [id],
    );
    return result.rows[0] || null;
  }

  async findByEmail(email) {
    const result = await this.db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    return result.rows[0] || null;
  }

  async create({ nome, email, senha }) {
    const result = await this.db.query(
      `INSERT INTO users (nome, email, senha)
       VALUES ($1, $2, $3)
       RETURNING id, nome, email`,
      [nome, email, senha],
    );
    return result.rows[0];
  }

  async update(id, { nome, email }) {
    const result = await this.db.query(
      `UPDATE users SET nome = $1, email = $2
       WHERE id = $3
       RETURNING id, nome, email`,
      [nome, email, id],
    );
    return result.rows[0] || null;
  }

  async delete(id) {
    const result = await this.db.query(
      "DELETE FROM users WHERE id = $1 RETURNING id",
      [id],
    );
    return result.rowCount > 0;
  }
}

module.exports = UserRepository;
