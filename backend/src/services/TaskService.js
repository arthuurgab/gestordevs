const TaskRepository = require("../repositories/TaskRepository");
const UserRepository = require("../repositories/UserRepository");

const STATUS_VALIDOS = ["todo", "in_progress", "done"];

class TaskService {
  constructor() {
    this.taskRepository = new TaskRepository();
    this.userRepository = new UserRepository();
  }

  #validarStatus(status) {
    if (!STATUS_VALIDOS.includes(status)) {
      throw new Error(
        `Status inválido. Use um de: ${STATUS_VALIDOS.join(", ")}`,
      );
    }
  }

  async create({ titulo, descricao, status = "todo", user_id }) {
    if (!titulo) {
      throw new Error("O título da tarefa é obrigatório");
    }

    this.#validarStatus(status);

    if (user_id) {
      const usuario = await this.userRepository.findById(user_id);
      if (!usuario) {
        throw new Error("Usuário responsável não encontrado");
      }
    }

    return this.taskRepository.create({ titulo, descricao, status, user_id });
  }

  async listAll({ status } = {}) {
    if (status) {
      this.#validarStatus(status);
      return this.taskRepository.findByStatus(status);
    }
    return this.taskRepository.findAll();
  }

  async getById(id) {
    const task = await this.taskRepository.findById(id);
    if (!task) {
      throw new Error("Tarefa não encontrada");
    }
    return task;
  }

  async update(id, dados) {
    if (dados.status) {
      this.#validarStatus(dados.status);
    }

    const task = await this.taskRepository.update(id, dados);
    if (!task) {
      throw new Error("Tarefa não encontrada");
    }
    return task;
  }

  async updateStatus(id, status) {
    this.#validarStatus(status);

    const task = await this.taskRepository.updateStatus(id, status);
    if (!task) {
      throw new Error("Tarefa não encontrada");
    }
    return task;
  }

  async delete(id) {
    const deleted = await this.taskRepository.delete(id);
    if (!deleted) {
      throw new Error("Tarefa não encontrada");
    }
    return true;
  }
}

module.exports = TaskService;
