import { Router } from "express";
import { getAllTodosCtrl, createTodoCtrl, updateTodoCtrl, deleteTodoCtrl } from "../controllers/todos.controllers.js";
import { validateJWT } from "../middlewares/validar-jwt.js";

const todosRouter = Router();

todosRouter.get("/", validateJWT, getAllTodosCtrl);
todosRouter.post("/", validateJWT, createTodoCtrl);
todosRouter.put("/:id", validateJWT, updateTodoCtrl);
todosRouter.delete("/:id", validateJWT, deleteTodoCtrl);

export { todosRouter };
