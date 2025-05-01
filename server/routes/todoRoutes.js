const express = require('express');
const {createTodo,getAllTodos,getTodoById,updateTodo,deleteTodo} = require('../controllers/todoController');
const authMiddleware = require('../middlewares/authMiddleware');

const todoRouter = express.Router();

// Apply auth middleware to all todo routes
todoRouter.use(authMiddleware);

// CRUD operations
todoRouter.post('/', createTodo);

todoRouter.get('/', getAllTodos);
todoRouter.get('/:id', getTodoById);

todoRouter.put('/:id', updateTodo);

todoRouter.delete('/:id', deleteTodo);

// Filter todos by status
//todoRouter.get('/filter/status/:status', todoController.getTodosByStatus);

module.exports = todoRouter;