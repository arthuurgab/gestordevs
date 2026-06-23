const Database = require("../config/database");

class TaskRepository {
  constructor() {
    this.db = Database.getInstance();
  }

  async findAll() {
    const result = await this.db.query(
      `SELECT t.*, u.nome AS responsavel
       FROM tasks t
       LEFT JOIN users u ON u.id = t.user_id
       ORDER BY t.id`
    );
    return result.rows;
  }

  async findById(id) {
    const result = await this.db.query("SELECT * FROM tasks WHERE id = $1", [
      id,
    ]);
    return result.rows[0] || null;
  }

  async findByStatus(status) {
    const result = await this.db.query(
      "SELECT * FROM tasks WHERE status = $1 ORDER BY id",
      [status]
    );
    return result.rows;
  }

  async findByUserId(userId) {
    const result = await this.db.query(
      "SELECT * FROM tasks WHERE user_id = $1 ORDER BY id",
      [userId]
    );
    return result.rows;
  }

  async create({ titulo, descricao, status, user_id }) {
    const result = await this.db.query(
      `INSERT INTO tasks (titulo, descricao, status, user_id)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [titulo, descricao, status, user_id]
    );
    return result.rows[0];
  }

  async update(id, { titulo, descricao, status, user_id }) {
    const result = await this.db.query(
      `UPDATE tasks SET titulo = $1, descricao = $2, status = $3, user_id = $4
       WHERE id = $5
       RETURNING *`,
      [titulo, descricao, status, user_id, id]
    );
    return result.rows[0] || null;
  }

  async updateStatus(id, status) {
    const result = await this.db.query(
      "UPDATE tasks SET status = $1 WHERE id = $2 RETURNING *",
      [status, id]
    );
    return result.rows[0] || null;
  }

  async delete(id) {
    const result = await this.db.query(
      "DELETE FROM tasks WHERE id = $1 RETURNING id",
      [id]
    );
    return result.rowCount > 0;
  }
}

module.exports = TaskRepository;
