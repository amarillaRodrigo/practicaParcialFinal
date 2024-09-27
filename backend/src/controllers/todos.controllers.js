import { database } from "../db/database.js";

// Obtener todas las tareas
export const getAllTodosCtrl = (req, res) => {
  const userId = req.user.id;
  const todos = database.todos.filter((todo) => todo.owner === userId);
  res.json({ todos });
};

// Crear una nueva tarea
export const createTodoCtrl = (req, res) => {
  const { title, completed } = req.body;
  const newTodo = {
    id: new Date().getTime(),
    title,
    completed,
    owner: req.user.id,
  };
  database.todos.push(newTodo);
  res
    .status(201)
    .json({ message: "Tarea creada correctamente", todo: newTodo });
};

// Actualizar una tarea existente
export const updateTodoCtrl = (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;
  const todoIndex = database.todos.findIndex(
    (todo) => todo.id === parseInt(id) && todo.owner === req.user.id
  );

  if (todoIndex === -1) {
    return res.status(404).json({ message: "Tarea no encontrada" });
  }

  database.todos[todoIndex] = {
    ...database.todos[todoIndex],
    title,
    completed,
  };
  res.json({
    message: "Tarea actualizada correctamente",
    todo: database.todos[todoIndex],
  });
};

// Eliminar una tarea existente
export const deleteTodoCtrl = (req, res) => {
  const { id } = req.params;
  const todoIndex = database.todos.findIndex(
    (todo) => todo.id === parseInt(id) && todo.owner === req.user.id
  );

  if (todoIndex === -1) {
    return res.status(404).json({ message: "Tarea no encontrada" });
  }

  database.todos.splice(todoIndex, 1);
  res.json({ message: "Tarea eliminada correctamente" });
};
