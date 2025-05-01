const mongoose = require('mongoose');
const TodoModel = require('../models/todoModel');
const { ErrorResponse } = require('../middlewares/errorHandler');

/**
 * Create a new todo item for the authenticated user
 */
const createTodo = async (req, res, next) => {
  try {
    const { title, description, status, dueDate } = req.body;

    const todo = new TodoModel({
      title,
      description,
      status: status || 'pending', // Default to 'pending' if status not provided
      dueDate,
      owner: req.user._id, // Associate todo with the authenticated user
    });

    const savedTodo = await todo.save();

    res.status(201).json({
      success: true,
      data: savedTodo,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all todo items for the authenticated user
 */
const getAllTodos = async (req, res, next) => {
  try {
    const todos = await TodoModel.find({ owner: req.user._id });

    if (!todos || todos.length === 0) {
      return next(new ErrorResponse('No todos found for this user', 404));
    }

    res.status(200).json({
      success: true,
      count: todos.length,
      data: todos,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a single todo item by ID (with ownership validation)
 */
const getTodoById = async (req, res, next) => {
  try {
    const todoId = req.params.id;

    // Validate MongoDB ID format
    if (!mongoose.Types.ObjectId.isValid(todoId)) {
      return next(new ErrorResponse('Invalid todo ID', 400));
    }

    const todo = await TodoModel.findById(todoId);

    if (!todo) {
      return next(new ErrorResponse('Todo not found', 404));
    }

    // Verify the requesting user owns the todo
    if (todo.owner.toString() !== req.user._id.toString()) {
      return next(new ErrorResponse('Not authorized to access this todo', 403));
    }

    res.status(200).json({
      success: true,
      data: todo,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update an existing todo item (with ownership validation)
 */
const updateTodo = async (req, res, next) => {
  try {
    const todoId = req.params.id;
    const { title, description, status, dueDate } = req.body;

    if (!mongoose.Types.ObjectId.isValid(todoId)) {
      return next(new ErrorResponse('Invalid todo ID', 400));
    }

    let todo = await TodoModel.findById(todoId);

    if (!todo) {
      return next(new ErrorResponse('Todo not found', 404));
    }

    // Verify the requesting user owns the todo
    if (todo.owner.toString() !== req.user._id.toString()) {
      return next(new ErrorResponse('Not authorized to update this todo', 403));
    }

    // Update and return the modified document
    todo = await TodoModel.findByIdAndUpdate(
      todoId,
      { title, description, status, dueDate },
      { new: true, runValidators: true } // Return updated doc and run schema validators
    );

    res.status(200).json({
      success: true,
      data: todo,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a todo item (with ownership validation)
 */
const deleteTodo = async (req, res, next) => {
  try {
    const todoId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(todoId)) {
      return next(new ErrorResponse('Invalid todo ID', 400));
    }

    const todo = await TodoModel.findById(todoId);

    if (!todo) {
      return next(new ErrorResponse('Todo not found', 404));
    }

    // Verify the requesting user owns the todo
    if (todo.owner.toString() !== req.user._id.toString()) {
      return next(new ErrorResponse('Not authorized to delete this todo', 403));
    }

    await todo.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTodo,
  getAllTodos,
  getTodoById,
  updateTodo,
  deleteTodo,
};