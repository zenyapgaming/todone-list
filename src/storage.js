import { projects } from "./projects.js";

const KEY = "todone-projects";

export const save = () => {
  localStorage.setItem(KEY, JSON.stringify(projects));
};

export const load = () => {
  try {
    const data = JSON.parse(localStorage.getItem(KEY));
    if (Array.isArray(data) && data.length) {
      projects.splice(0, projects.length, ...data);
    }
  } catch {
    // bad or missing data, keep the default project
  }
};