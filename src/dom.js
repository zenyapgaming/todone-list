import { format, parseISO, isValid, isPast, isToday } from "date-fns";
import { save } from "./storage.js";
import { projects, addProject, addTodoToProject, deleteTodo } from "./projects.js";
import { createTodo, toggleDone, editTodo } from "./todo.js";

const formatDate = (d) => {
  const parsed = parseISO(d);
  return isValid(parsed) ? format(parsed, "d MMM yyyy") : "No date";
};

let selected = projects[0];
let expanded = null;

const renderProjects = () => {
  const container = document.querySelector("#projects");
  container.textContent = "";
  projects.forEach((project) => {
    const btn = document.createElement("button");
    btn.textContent = project.name;
    if (project === selected) btn.classList.add("active");
    btn.addEventListener("click", () => {
      selected = project;
      render();
    });
    container.appendChild(btn);
  });
};

const renderTodos = () => {
  const container = document.querySelector("#todos");
  container.textContent = "";

  selected.todos.forEach((todo) => {
    const item = document.createElement("div");
    item.classList.add(`priority-${todo.priority}`);

    const due = parseISO(todo.dueDate);
    if (isValid(due) && isPast(due) && !isToday(due) && !todo.done) {
      item.classList.add("overdue");
    }

    const header = document.createElement("span");
    header.textContent = `${todo.title} - ${formatDate(todo.dueDate)}`;
    if (todo.done) header.style.textDecoration = "line-through";
    header.addEventListener("click", () => {
      expanded = expanded === todo ? null : todo;
      render();
    });

    const del = document.createElement("button");
    del.textContent = "Delete";
    del.addEventListener("click", () => {
      deleteTodo(selected, todo);
      save();
      render();
    });

    item.append(header, del);

    if (expanded === todo) {
      const desc = document.createElement("input");
      desc.value = todo.description;

      const date = document.createElement("input");
      date.type = "date";
      date.value = todo.dueDate;

      const priority = document.createElement("select");
      ["low", "high"].forEach((p) => {
        const opt = document.createElement("option");
        opt.value = p;
        opt.textContent = p;
        priority.appendChild(opt);
      });
      priority.value = todo.priority;

      const done = document.createElement("input");
      done.type = "checkbox";
      done.checked = todo.done;

      const saveBtn = document.createElement("button");
      saveBtn.textContent = "Save";
      saveBtn.addEventListener("click", () => {
        editTodo(todo, {
          description: desc.value,
          dueDate: date.value,
          priority: priority.value,
        });
        if (done.checked !== todo.done) toggleDone(todo);
        save();
        render();
      });

      const details = document.createElement("div");
      details.append(desc, date, priority, done, saveBtn);
      item.appendChild(details);
    }

    container.appendChild(item);
  });
};

export const render = () => {
  if (!projects.includes(selected)) selected = projects[0];
  renderProjects();
  renderTodos();
};

document.querySelector("#add-project").addEventListener("click", () => {
  const input = document.querySelector("#project-name");
  const name = input.value.trim();
  if (!name) return;
  selected = addProject(name);
  input.value = "";
  save();
  render();
});

document.querySelector("#add-todo").addEventListener("click", () => {
  const title = document.querySelector("#todo-title");
  const desc = document.querySelector("#todo-desc");
  const date = document.querySelector("#todo-date");
  const priority = document.querySelector("#todo-priority");

  if (!title.value.trim()) return;

  addTodoToProject(
    selected,
    createTodo(title.value.trim(), desc.value, date.value, priority.value)
  );

  title.value = "";
  desc.value = "";
  date.value = "";
  save();
  render();
});