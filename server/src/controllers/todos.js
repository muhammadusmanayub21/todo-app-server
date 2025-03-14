const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * Get all todos for the authenticated user
 * @route GET /api/todos
 */
exports.getTodos = async (req, res, next) => {
  try {
    const todos = await prisma.todo.findMany({
      where: {
        userId: req.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.status(200).json(todos);
  } catch (error) {
    next(error);
  }
};

/**
 * Get a specific todo
 * @route GET /api/todos/:id
 */
exports.getTodo = async (req, res, next) => {
  try {
    const { id } = req.params;

    const todo = await prisma.todo.findUnique({
      where: {
        id,
      },
    });

    // Check if todo exists
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    // Check if todo belongs to the user
    if (todo.userId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to access this todo' });
    }

    res.status(200).json(todo);
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new todo
 * @route POST /api/todos
 */
exports.createTodo = async (req, res, next) => {
  try {
    const { text, priority, category, dueDate, completed } = req.body;

    // Validate input
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    // Validate priority
    const validPriorities = ['low', 'medium', 'high'];
    if (priority && !validPriorities.includes(priority)) {
      return res.status(400).json({ error: 'Invalid priority' });
    }

    // Validate category
    const validCategories = ['personal', 'work', 'health', 'education', 'social'];
    if (category && !validCategories.includes(category)) {
      return res.status(400).json({ error: 'Invalid category' });
    }

    // Create todo
    const todo = await prisma.todo.create({
      data: {
        text,
        priority: priority || 'medium',
        category: category || 'personal',
        dueDate: dueDate ? new Date(dueDate) : null,
        completed: completed || false,
        userId: req.user.id,
      },
    });

    res.status(201).json(todo);
  } catch (error) {
    next(error);
  }
};

/**
 * Update a todo
 * @route PUT /api/todos/:id
 */
exports.updateTodo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { text, priority, category, dueDate, completed } = req.body;

    // Find todo
    const existingTodo = await prisma.todo.findUnique({
      where: {
        id,
      },
    });

    // Check if todo exists
    if (!existingTodo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    // Check if todo belongs to user
    if (existingTodo.userId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to update this todo' });
    }

    // Validate priority
    const validPriorities = ['low', 'medium', 'high'];
    if (priority && !validPriorities.includes(priority)) {
      return res.status(400).json({ error: 'Invalid priority' });
    }

    // Validate category
    const validCategories = ['personal', 'work', 'health', 'education', 'social'];
    if (category && !validCategories.includes(category)) {
      return res.status(400).json({ error: 'Invalid category' });
    }

    // Update todo
    const updatedTodo = await prisma.todo.update({
      where: {
        id,
      },
      data: {
        text: text !== undefined ? text : existingTodo.text,
        priority: priority !== undefined ? priority : existingTodo.priority,
        category: category !== undefined ? category : existingTodo.category,
        dueDate: dueDate !== undefined ? (dueDate ? new Date(dueDate) : null) : existingTodo.dueDate,
        completed: completed !== undefined ? completed : existingTodo.completed,
      },
    });

    res.status(200).json(updatedTodo);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a todo
 * @route DELETE /api/todos/:id
 */
exports.deleteTodo = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find todo
    const todo = await prisma.todo.findUnique({
      where: {
        id,
      },
    });

    // Check if todo exists
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    // Check if todo belongs to user
    if (todo.userId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this todo' });
    }

    // Delete todo
    await prisma.todo.delete({
      where: {
        id,
      },
    });

    res.status(200).json({ id });
  } catch (error) {
    next(error);
  }
};