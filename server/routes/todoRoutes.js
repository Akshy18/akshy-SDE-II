const express = require('express');
const {
  createTodo,
  getAllTodos,
  getTodoById,
  updateTodo,
  deleteTodo
} = require('../controllers/todoController');
const authMiddleware = require('../middlewares/authMiddleware');

const todoRouter = express.Router();

// Protect all todo routes with authentication
todoRouter.use(authMiddleware);

// Todo CRUD endpoints
todoRouter.post('/', createTodo); // Create new todo
todoRouter.get('/', getAllTodos); // Get all todos for user
todoRouter.get('/:id', getTodoById); // Get single todo by ID
todoRouter.put('/:id', updateTodo); // Update todo by ID
todoRouter.delete('/:id', deleteTodo); // Delete todo by ID

module.exports = todoRouter;