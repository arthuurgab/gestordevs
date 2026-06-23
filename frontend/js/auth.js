document.addEventListener("DOMContentLoaded", () => {
  const STORAGE_KEY = "jira_lite_user";

  if (localStorage.getItem(STORAGE_KEY)) {
    window.location.href = "board.html";
    return;
  }

  const tabLogin = document.getElementById("tab-login");
  const tabRegister = document.getElementById("tab-register");
  const formLogin = document.getElementById("form-login");
  const formRegister = document.getElementById("form-register");
  const feedback = document.getElementById("feedback");

  if (!tabLogin || !tabRegister || !formLogin || !formRegister || !feedback) {
    console.error(
      "auth.js: não encontrei algum elemento esperado no HTML. Confira os IDs: tab-login, tab-register, form-login, form-register, feedback.",
    );
    return;
  }

  function mostrarFeedback(mensagem, tipo = "erro") {
    feedback.textContent = mensagem;
    feedback.className = `feedback feedback--${tipo}`;
    feedback.hidden = false;
  }

  function limparFeedback() {
    feedback.hidden = true;
  }

  function alternarAba(aba) {
    limparFeedback();
    const ehLogin = aba === "login";
    tabLogin.classList.toggle("tab--ativa", ehLogin);
    tabRegister.classList.toggle("tab--ativa", !ehLogin);
    formLogin.hidden = !ehLogin;
    formRegister.hidden = ehLogin;
  }

  tabLogin.addEventListener("click", () => alternarAba("login"));
  tabRegister.addEventListener("click", () => alternarAba("register"));

  formLogin.addEventListener("submit", async (event) => {
    event.preventDefault();
    limparFeedback();

    const email = document.getElementById("login-email").value.trim();
    const senha = document.getElementById("login-senha").value;

    try {
      const usuario = await api.login({ email, senha });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(usuario));
      window.location.href = "board.html";
    } catch (error) {
      console.error("Erro no login:", error);
      mostrarFeedback(error.message);
    }
  });

  formRegister.addEventListener("submit", async (event) => {
    event.preventDefault();
    limparFeedback();

    const nome = document.getElementById("register-nome").value.trim();
    const email = document.getElementById("register-email").value.trim();
    const senha = document.getElementById("register-senha").value;

    try {
      await api.register({ nome, email, senha });
      mostrarFeedback("Conta criada! Faça login pra continuar.", "sucesso");
      formRegister.reset();
      alternarAba("login");
    } catch (error) {
      console.error("Erro no registro:", error);
      mostrarFeedback(error.message);
    }
  });
});
