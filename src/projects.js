export const createProject = (name) => ({ name, todos: [] });

export const projects = [createProject("Default")];

export const addProject = (name) => {
  const project = createProject(name);
  projects.push(project);
  return project;
};

export const addTodoToProject = (project, todo) => {
  project.todos.push(todo);
};

export const deleteTodo = (project, todo) => {
  const i = project.todos.indexOf(todo);
  if (i !== -1) project.todos.splice(i, 1);
};