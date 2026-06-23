const TaskService = require("../services/TaskService");

const taskService = new TaskService();

class TaskController {
  async create(req, res) {
    try {
      const task = await taskService.create(req.body);
      res.status(201).json(task);
    } catch (error) {
      res.status(400).json({ erro: error.message });
    }
  }

  async listAll(req, res) {
    try {
      const { status } = req.query;
      const tasks = await taskService.listAll({ status });
      res.status(200).json(tasks);
    } catch (error) {
      res.status(400).json({ erro: error.message });
    }
  }

  async getById(req, res) {
    try {
      const task = await taskService.getById(req.params.id);
      res.status(200).json(task);
    } catch (error) {
      res.status(404).json({ erro: error.message });
    }
  }

  async update(req, res) {
    try {
      const task = await taskService.update(req.params.id, req.body);
      res.status(200).json(task);
    } catch (error) {
      res.status(400).json({ erro: error.message });
    }
  }

  async updateStatus(req, res) {
    try {
      const task = await taskService.updateStatus(req.params.id, req.body.status);
      res.status(200).json(task);
    } catch (error) {
      res.status(400).json({ erro: error.message });
    }
  }

  async delete(req, res) {
    try {
      await taskService.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(404).json({ erro: error.message });
    }
  }
}

module.exports = new TaskController();
