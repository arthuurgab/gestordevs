require("dotenv").config();

const app = require("./app");
const Database = require("./config/database");

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    const db = Database.getInstance();
    await db.query("SELECT NOW()");

    console.log("✅ PostgreSQL conectado");

    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Erro ao conectar no banco");
    console.error(error);
  }
}

startServer();
