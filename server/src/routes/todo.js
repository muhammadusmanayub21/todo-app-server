const express = require('express');
const { body, param } = require('express-validator');
const todoController = require('../controllers/todos');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const router = express.Router();

// Apply authentication middleware to all todo routes
router.use(authenticate);

// Get all todos
router.get('/', todoController.getTodos);

// Get a specific todo
router.get(
  '/:id',
  [
    param('id').isUUID().withMessage('Invalid todo ID'),
    validate,
  ],
  todoController.getTodo
);

// Create a new todo
router.post(
  '/',
  [
    body('text').notEmpty().withMessage('Text is required'),
    body('priority')
      .optional()
      .isIn(['low', 'medium', 'high'])
      .withMessage('Priority must be low, medium, or high'),
    body('category')
      .optional()
      .isIn(['personal', 'work', 'health', 'education', 'social'])
      .withMessage('Category must be personal, work, health, education, or social'),
    body('dueDate')
      .optional()
      .isISO8601()
      .withMessage('Due date must be a valid date'),
    body('completed')
      .optional()
      .isBoolean()
      .withMessage('Completed must be a boolean'),
    validate,
  ],
  todoController.createTodo
);

// Update a todo
router.put(
  '/:id',
  [
    param('id').isUUID().withMessage('Invalid todo ID'),
    body('text').optional().notEmpty().withMessage('Text cannot be empty'),
    body('priority')
      .optional()
      .isIn(['low', 'medium', 'high'])
      .withMessage('Priority must be low, medium, or high'),
    body('category')
      .optional()
      .isIn(['personal', 'work', 'health', 'education', 'social'])
      .withMessage('Category must be personal, work, health, education, or social'),
    body('dueDate')
      .optional({ nullable: true })
      .isISO8601()
      .withMessage('Due date must be a valid date'),
    body('completed')
      .optional()
      .isBoolean()
      .withMessage('Completed must be a boolean'),
    validate,
  ],
  todoController.updateTodo
);

// Delete a todo
router.delete(
  '/:id',
  [
    param('id').isUUID().withMessage('Invalid todo ID'),
    validate,
  ],
  todoController.deleteTodo
);

module.exports = router;