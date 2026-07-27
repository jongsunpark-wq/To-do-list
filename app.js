const STORAGE_KEY = "todo-list-items";

const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const todoListEl = document.getElementById("todo-list");
const filtersEl = document.getElementById("filters");
const itemsLeftEl = document.getElementById("items-left");
const clearCompletedBtn = document.getElementById("clear-completed");
const todayEl = document.getElementById("today");

let todos = loadTodos();
let currentFilter = "all";

function loadTodos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function addTodo(text) {
  const trimmed = text.trim();
  if (!trimmed) return;
  todos.unshift({ id: createId(), text: trimmed, completed: false });
  saveTodos();
  render();
}

function toggleTodo(id) {
  const todo = todos.find((t) => t.id === id);
  if (todo) {
    todo.completed = !todo.completed;
    saveTodos();
    render();
  }
}

function deleteTodo(id) {
  todos = todos.filter((t) => t.id !== id);
  saveTodos();
  render();
}

function editTodo(id, newText) {
  const trimmed = newText.trim();
  const todo = todos.find((t) => t.id === id);
  if (!todo) return;
  if (!trimmed) {
    deleteTodo(id);
    return;
  }
  todo.text = trimmed;
  saveTodos();
  render();
}

function clearCompleted() {
  todos = todos.filter((t) => !t.completed);
  saveTodos();
  render();
}

function getFilteredTodos() {
  if (currentFilter === "active") return todos.filter((t) => !t.completed);
  if (currentFilter === "completed") return todos.filter((t) => t.completed);
  return todos;
}

function render() {
  const filtered = getFilteredTodos();
  todoListEl.innerHTML = "";

  if (filtered.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty-state";
    empty.textContent =
      currentFilter === "all" ? "할 일이 없습니다." : "해당 항목이 없습니다.";
    todoListEl.appendChild(empty);
  } else {
    for (const todo of filtered) {
      todoListEl.appendChild(buildTodoItem(todo));
    }
  }

  const remaining = todos.filter((t) => !t.completed).length;
  itemsLeftEl.textContent = `${remaining}개 남음`;
}

function buildTodoItem(todo) {
  const li = document.createElement("li");
  li.className = "todo-item" + (todo.completed ? " completed" : "");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = todo.completed;
  checkbox.addEventListener("change", () => toggleTodo(todo.id));

  const text = document.createElement("span");
  text.className = "text";
  text.textContent = todo.text;
  text.title = "클릭하여 수정";
  text.addEventListener("click", () => startEditing(li, todo));

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "delete-btn";
  deleteBtn.textContent = "✕";
  deleteBtn.setAttribute("aria-label", "삭제");
  deleteBtn.addEventListener("click", () => deleteTodo(todo.id));

  li.appendChild(checkbox);
  li.appendChild(text);
  li.appendChild(deleteBtn);
  return li;
}

function startEditing(li, todo) {
  const input = document.createElement("input");
  input.type = "text";
  input.value = todo.text;
  input.className = "edit-input";
  input.style.flex = "1";
  input.style.padding = "6px 8px";
  input.style.border = "1px solid var(--border)";
  input.style.borderRadius = "8px";
  input.style.background = "var(--bg)";
  input.style.color = "var(--text)";

  const textEl = li.querySelector(".text");
  li.replaceChild(input, textEl);
  input.focus();
  input.select();

  const finish = () => editTodo(todo.id, input.value);
  input.addEventListener("blur", finish);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") input.blur();
    if (e.key === "Escape") {
      input.removeEventListener("blur", finish);
      render();
    }
  });
}

todoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  addTodo(todoInput.value);
  todoInput.value = "";
  todoInput.focus();
});

filtersEl.addEventListener("click", (e) => {
  const btn = e.target.closest(".filter-btn");
  if (!btn) return;
  currentFilter = btn.dataset.filter;
  document
    .querySelectorAll(".filter-btn")
    .forEach((b) => b.classList.toggle("active", b === btn));
  render();
});

clearCompletedBtn.addEventListener("click", clearCompleted);

todayEl.textContent = new Date().toLocaleDateString("ko-KR", {
  year: "numeric",
  month: "long",
  day: "numeric",
  weekday: "long",
});

render();
