document.addEventListener("DOMContentLoaded", () => {
  const STORAGE_KEY = "jira_lite_user";
  const COLUNAS = [
    { status: "todo", titulo: "To Do" },
    { status: "in_progress", titulo: "In Progress" },
    { status: "done", titulo: "Done" },
  ];

  const usuarioAtual = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");

  if (!usuarioAtual) {
    window.location.href = "index.html";
    return;
  }

  let usuarios = [];
  let tarefas = [];
  let tarefaEmEdicao = null;

  const elNomeUsuario = document.getElementById("nome-usuario");
  const elBtnLogout = document.getElementById("btn-logout");
  const elBtnNovaTarefa = document.getElementById("btn-nova-tarefa");
  const elColunas = {
    todo: document.querySelector('[data-coluna="todo"] .coluna__cards'),
    in_progress: document.querySelector(
      '[data-coluna="in_progress"] .coluna__cards',
    ),
    done: document.querySelector('[data-coluna="done"] .coluna__cards'),
  };
  const elContadores = {
    todo: document.querySelector('[data-coluna="todo"] .coluna__contador'),
    in_progress: document.querySelector(
      '[data-coluna="in_progress"] .coluna__contador',
    ),
    done: document.querySelector('[data-coluna="done"] .coluna__contador'),
  };

  const elModal = document.getElementById("modal-tarefa");
  const elFormTarefa = document.getElementById("form-tarefa");
  const elModalTitulo = document.getElementById("modal-titulo");
  const elInputTitulo = document.getElementById("input-titulo");
  const elInputDescricao = document.getElementById("input-descricao");
  const elInputStatus = document.getElementById("input-status");
  const elInputResponsavel = document.getElementById("input-responsavel");
  const elBtnCancelar = document.getElementById("btn-cancelar");
  const elBtnExcluir = document.getElementById("btn-excluir");
  const elErroModal = document.getElementById("erro-modal");

  const elementosEssenciais = [
    elNomeUsuario,
    elBtnLogout,
    elBtnNovaTarefa,
    elModal,
    elFormTarefa,
    elModalTitulo,
    elInputTitulo,
    elInputDescricao,
    elInputStatus,
    elInputResponsavel,
    elBtnCancelar,
    elBtnExcluir,
    elErroModal,
  ];

  if (
    elementosEssenciais.some((el) => !el) ||
    !elColunas.todo ||
    !elColunas.in_progress ||
    !elColunas.done
  ) {
    console.error(
      "board.js: algum elemento esperado não foi encontrado no HTML. Confira os IDs/data-coluna do board.html.",
    );
    return;
  }

  elNomeUsuario.textContent = usuarioAtual.nome;

  elBtnLogout.addEventListener("click", () => {
    localStorage.removeItem(STORAGE_KEY);
    window.location.href = "index.html";
  });

  elBtnNovaTarefa.addEventListener("click", () => abrirModal());
  elBtnCancelar.addEventListener("click", fecharModal);
  elModal.addEventListener("click", (e) => {
    if (e.target === elModal) fecharModal();
  });

  elFormTarefa.addEventListener("submit", salvarTarefa);
  elBtnExcluir.addEventListener("click", excluirTarefa);

  carregarTudo();

  async function carregarTudo() {
    try {
      [usuarios, tarefas] = await Promise.all([
        api.listUsers(),
        api.listTasks(),
      ]);
      preencherSelectResponsavel();
      renderizarColunas();
    } catch (error) {
      console.error("Erro ao carregar o board:", error);
      alert(`Erro ao carregar o board: ${error.message}`);
    }
  }

  function preencherSelectResponsavel() {
    elInputResponsavel.innerHTML = '<option value="">Sem responsável</option>';
    usuarios.forEach((u) => {
      const option = document.createElement("option");
      option.value = u.id;
      option.textContent = u.nome;
      elInputResponsavel.appendChild(option);
    });
  }

  function ticketCode(id) {
    return `TASK-${String(id).padStart(3, "0")}`;
  }

  function nomeResponsavel(userId) {
    if (!userId) return null;
    const usuario = usuarios.find((u) => u.id === userId);
    return usuario ? usuario.nome : null;
  }

  function renderizarColunas() {
    COLUNAS.forEach(({ status }) => {
      const lista = tarefas.filter((t) => t.status === status);
      elContadores[status].textContent = lista.length;

      const container = elColunas[status];
      container.innerHTML = "";

      if (lista.length === 0) {
        const vazio = document.createElement("p");
        vazio.className = "coluna__vazio";
        vazio.textContent = "Nenhuma tarefa aqui ainda.";
        container.appendChild(vazio);
        return;
      }

      lista.forEach((tarefa) => container.appendChild(criarCard(tarefa)));
    });
  }

  function criarCard(tarefa) {
    const card = document.createElement("article");
    card.className = `card card--${tarefa.status}`;
    card.draggable = true;
    card.dataset.id = tarefa.id;

    const responsavel = nomeResponsavel(tarefa.user_id);

    card.innerHTML = `
      <div class="card__topo">
        <span class="card__ticket">${ticketCode(tarefa.id)}</span>
      </div>
      <h3 class="card__titulo"></h3>
      <p class="card__descricao"></p>
      <div class="card__rodape">
        ${responsavel ? `<span class="card__responsavel">${iniciais(responsavel)}</span>` : ""}
      </div>
    `;

    card.querySelector(".card__titulo").textContent = tarefa.titulo;
    card.querySelector(".card__descricao").textContent = tarefa.descricao || "";

    card.addEventListener("click", () => abrirModal(tarefa));
    card.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", tarefa.id);
      card.classList.add("card--arrastando");
    });
    card.addEventListener("dragend", () =>
      card.classList.remove("card--arrastando"),
    );

    return card;
  }

  function iniciais(nome) {
    return nome
      .split(" ")
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }

  document.querySelectorAll(".coluna").forEach((coluna) => {
    coluna.addEventListener("dragover", (e) => {
      e.preventDefault();
      coluna.classList.add("coluna--alvo");
    });

    coluna.addEventListener("dragleave", () =>
      coluna.classList.remove("coluna--alvo"),
    );

    coluna.addEventListener("drop", async (e) => {
      e.preventDefault();
      coluna.classList.remove("coluna--alvo");

      const id = e.dataTransfer.getData("text/plain");
      const novoStatus = coluna.dataset.coluna;
      const tarefa = tarefas.find((t) => String(t.id) === id);

      if (!tarefa || tarefa.status === novoStatus) return;

      try {
        const atualizada = await api.updateTaskStatus(id, novoStatus);
        tarefa.status = atualizada.status;
        renderizarColunas();
      } catch (error) {
        console.error("Erro ao mover tarefa:", error);
        alert(`Não foi possível mover a tarefa: ${error.message}`);
      }
    });
  });

  function abrirModal(tarefa = null) {
    tarefaEmEdicao = tarefa;
    elErroModal.hidden = true;
    elFormTarefa.reset();

    if (tarefa) {
      elModalTitulo.textContent = ticketCode(tarefa.id);
      elInputTitulo.value = tarefa.titulo;
      elInputDescricao.value = tarefa.descricao || "";
      elInputStatus.value = tarefa.status;
      elInputResponsavel.value = tarefa.user_id || "";
      elBtnExcluir.hidden = false;
    } else {
      elModalTitulo.textContent = "Nova tarefa";
      elInputStatus.value = "todo";
      elBtnExcluir.hidden = true;
    }

    elModal.showModal();
  }

  function fecharModal() {
    elModal.close();
    tarefaEmEdicao = null;
  }

  async function salvarTarefa(event) {
    event.preventDefault();
    elErroModal.hidden = true;

    const dados = {
      titulo: elInputTitulo.value.trim(),
      descricao: elInputDescricao.value.trim(),
      status: elInputStatus.value,
      user_id: elInputResponsavel.value
        ? Number(elInputResponsavel.value)
        : null,
    };

    try {
      if (tarefaEmEdicao) {
        const atualizada = await api.updateTask(tarefaEmEdicao.id, dados);
        tarefas = tarefas.map((t) => (t.id === atualizada.id ? atualizada : t));
      } else {
        const criada = await api.createTask(dados);
        tarefas.push(criada);
      }

      renderizarColunas();
      fecharModal();
    } catch (error) {
      console.error("Erro ao salvar tarefa:", error);
      elErroModal.textContent = error.message;
      elErroModal.hidden = false;
    }
  }

  async function excluirTarefa() {
    if (!tarefaEmEdicao) return;
    if (
      !confirm(
        `Excluir ${ticketCode(tarefaEmEdicao.id)}? Essa ação não pode ser desfeita.`,
      )
    )
      return;

    try {
      await api.deleteTask(tarefaEmEdicao.id);
      tarefas = tarefas.filter((t) => t.id !== tarefaEmEdicao.id);
      renderizarColunas();
      fecharModal();
    } catch (error) {
      console.error("Erro ao excluir tarefa:", error);
      elErroModal.textContent = error.message;
      elErroModal.hidden = false;
    }
  }
});
