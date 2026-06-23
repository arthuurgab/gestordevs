const bcrypt = require("bcryptjs");
const UserRepository = require("../repositories/UserRepository");

class UserService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async register({ nome, email, senha }) {
    if (!nome || !email || !senha) {
      throw new Error("nome, email e senha são obrigatórios");
    }

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error("Já existe um usuário com esse email");
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    return this.userRepository.create({
      nome,
      email,
      senha: senhaCriptografada,
    });
  }

  async login({ email, senha }) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error("Email ou senha inválidos");
    }

    const senhaValida = await bcrypt.compare(senha, user.senha);
    if (!senhaValida) {
      throw new Error("Email ou senha inválidos");
    }

    const { senha: _senha, ...userSemSenha } = user;
    return userSemSenha;
  }

  async listAll() {
    return this.userRepository.findAll();
  }

  async getById(id) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error("Usuário não encontrado");
    }
    return user;
  }

  async update(id, dados) {
    const user = await this.userRepository.update(id, dados);
    if (!user) {
      throw new Error("Usuário não encontrado");
    }
    return user;
  }

  async delete(id) {
    const deleted = await this.userRepository.delete(id);
    if (!deleted) {
      throw new Error("Usuário não encontrado");
    }
    return true;
  }
}

module.exports = UserService;
