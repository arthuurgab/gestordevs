const UserService = require("../services/UserService");

const userService = new UserService();

class UserController {
  async register(req, res) {
    try {
      const user = await userService.register(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ erro: error.message });
    }
  }

  async login(req, res) {
    try {
      const user = await userService.login(req.body);
      res.status(200).json(user);
    } catch (error) {
      res.status(401).json({ erro: error.message });
    }
  }

  async listAll(req, res) {
    try {
      const users = await userService.listAll();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ erro: "Erro ao listar usuários" });
    }
  }

  async getById(req, res) {
    try {
      const user = await userService.getById(req.params.id);
      res.status(200).json(user);
    } catch (error) {
      res.status(404).json({ erro: error.message });
    }
  }

  async update(req, res) {
    try {
      const user = await userService.update(req.params.id, req.body);
      res.status(200).json(user);
    } catch (error) {
      res.status(400).json({ erro: error.message });
    }
  }

  async delete(req, res) {
    try {
      await userService.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(404).json({ erro: error.message });
    }
  }
}

module.exports = new UserController();
