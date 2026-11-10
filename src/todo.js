export const createTodo = (title, description, dueDate, priority) => ({
  title,
  description,
  dueDate,
  priority,
  done: false,
});

export const toggleDone = (todo) => {
  todo.done = !todo.done;
};

export const setPriority = (todo, priority) => {
  todo.priority = priority;
};
export const editTodo = (todo, changes) => {
  Object.assign(todo, changes);
};