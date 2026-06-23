const API_BASE_URL = "http://localhost:3000/api";

async function apiRequest(path, { method = "GET", body } = {}) {
  const options = {
    method,
    headers: { "Content-Type": "application/json" },
  };

  if (body !== undefined) {
    options.body = JSON.stringify(body);
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, options);
  } catch (erroDeRede) {
    console.error("Falha de rede ao chamar a API:", erroDeRede);
    throw new Error(
      `Não foi possível conectar à API em ${API_BASE_URL}. O backend está rodando? (npm run dev)`,
    );
  }

  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const mensagem = data?.erro || `Erro ${response.status}`;
    throw new Error(mensagem);
  }

  return data;
}

const api = {
  register: (dados) =>
    apiRequest("/users/register", { method: "POST", body: dados }),
  login: (dados) => apiRequest("/users/login", { method: "POST", body: dados }),
  listUsers: () => apiRequest("/users"),

  listTasks: (status) =>
    apiRequest(status ? `/tasks?status=${status}` : "/tasks"),
  createTask: (dados) => apiRequest("/tasks", { method: "POST", body: dados }),
  updateTask: (id, dados) =>
    apiRequest(`/tasks/${id}`, { method: "PUT", body: dados }),
  updateTaskStatus: (id, status) =>
    apiRequest(`/tasks/${id}/status`, { method: "PATCH", body: { status } }),
  deleteTask: (id) => apiRequest(`/tasks/${id}`, { method: "DELETE" }),
};
