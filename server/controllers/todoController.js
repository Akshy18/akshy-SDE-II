const TodoModel = require('../models/todoModel'); 
const mongoose = require('mongoose');
const { ErrorResponse } = require('../middlewares/errorHandler'); 

// Create a new todo
const createTodo = async (req, res, next) => {
  try {

    const { title, description, status, dueDate } = req.body;
    // Create the todo item with owner being the logged in user
    const todo = new TodoModel({
      title,
      description,
      status: status || 'pending',
      dueDate,
      owner: req.user._id // Assuming req.user is set by your auth middleware
    });
    
    const savedTodo = await todo.save();
    
    res.status(201).json({
      success: true,
      data: savedTodo
    });
  } catch (error) {
    next(error);
  }
};

// Get all todos for the logged in user
const getAllTodos = async (req, res, next) => {
  try {
    const todos = await TodoModel.find({ owner: req.user._id });

    if(!todos || todos.length === 0) {
      return next(new ErrorResponse('No todos found for this user', 404));
    } 
    
    res.status(200).json({
      success: true,
      count: todos.length,
      data: todos
    });
  } catch (error) {
    next(error);
  }
};

// Get a single todo by ID
const getTodoById = async (req, res, next) => {
  try {
    const todoId = req.params.id;
    
    // Validate if id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(todoId)) {
      return next(new ErrorResponse('Invalid todo ID', 400));
    }
    
    const todo = await TodoModel.findById(todoId);
    
    if (!todo) {
      return next(new ErrorResponse('Todo not found', 404));
    }
    
    // Check if the todo belongs to the logged in user
    if (todo.owner.toString() !== req.user._id.toString()) {
      return next(new ErrorResponse('Not authorized to access this todo', 403));
    }
    
    res.status(200).json({
      success: true,
      data: todo
    });
  } catch (error) {
    next(error);
  }
};

// Update a todo
const updateTodo = async (req, res, next) => {
  try {
    const todoId = req.params.id;
    const { title, description, status, dueDate } = req.body;
    
    // Validate if id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(todoId)) {
      return next(new ErrorResponse('Invalid todo ID', 400));
    }
    
    let todo = await TodoModel.findById(todoId);
    
    if (!todo) {
      return next(new ErrorResponse('Todo not found', 404));
    }
    
    // Check if the todo belongs to the logged in user
    if (todo.owner.toString() !== req.user._id.toString()) {
      return next(new ErrorResponse('Not authorized to update this todo', 403));
    }
    
    // Validate status enum if provided
    if (status && !['pending', 'completed'].includes(status)) {
      return next(new ErrorResponse('Status must be either pending or completed', 400));
    }
    
    todo = await TodoModel.findByIdAndUpdate(
      todoId, 
      { title, description, status, dueDate },
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      data: todo
    });
  } catch (error) {
    next(error);
  }
};

// Delete a todo
const deleteTodo = async (req, res, next) => {
  try {
    const todoId = req.params.id;

    // Validate if id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(todoId)) {
      return next(new ErrorResponse('Invalid todo ID', 400));
    }
    
    const todo = await TodoModel.findById(todoId);
    
    if (!todo) {
      return next(new ErrorResponse('Todo not found', 404));
    }
    
    // Check if the todo belongs to the logged in user
    if (todo.owner.toString() !== req.user._id.toString()) {
      return next(new ErrorResponse('Not authorized to delete this todo', 403));
    }
    
    await todo.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
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
  deleteTodo
};