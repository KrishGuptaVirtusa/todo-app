const todoModel = require("../models/todoModel");

/**
 * Controller handling To-Do CRUD business logic
 */
class TodoController {
  /**
   * GET /api/todos
   * Retrieve all tasks with optional search, status filtering, and sorting
   */
  async getTodos(req, res, next) {
    try {
      const { search, filter, status, priority, sortBy, order } = req.query;
      const effectiveStatus = status || filter;

      const todos = await todoModel.findAll({
        search,
        status: effectiveStatus,
        priority,
        sortBy,
        order,
      });

      return res.status(200).json({
        success: true,
        count: todos.length,
        data: todos,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/todos/summary
   * Get task counts (total, pending, completed) for dashboard metrics
   */
  async getSummary(req, res, next) {
    try {
      const summary = await todoModel.getSummary();
      return res.status(200).json({
        success: true,
        data: summary,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/todos/:id
   * Retrieve an individual task by its ID
   */
  async getTodoById(req, res, next) {
    try {
      const { id } = req.params;
      const todo = await todoModel.findById(id);

      if (!todo) {
        return res.status(404).json({
          success: false,
          message: `Task with ID '${id}' was not found.`,
        });
      }

      return res.status(200).json({
        success: true,
        data: todo,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/todos
   * Create a new task
   */
  async createTodo(req, res, next) {
    try {
      const { title, description, priority, dueDate, completed } = req.body;

      const newTask = await todoModel.create({
        title,
        description,
        priority,
        dueDate,
        completed,
      });

      return res.status(201).json({
        success: true,
        message: "Task created successfully.",
        data: newTask,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * PUT /api/todos/:id or PATCH /api/todos/:id
   * Update an existing task
   */
  async updateTodo(req, res, next) {
    try {
      const { id } = req.params;
      const updatedTask = await todoModel.update(id, req.body);

      if (!updatedTask) {
        return res.status(404).json({
          success: false,
          message: `Task with ID '${id}' was not found.`,
        });
      }

      return res.status(200).json({
        success: true,
        message: "Task updated successfully.",
        data: updatedTask,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * PATCH /api/todos/:id/status
   * Mark a task as completed or pending, or toggle current status
   */
  async updateStatus(req, res, next) {
    try {
      const { id } = req.params;
      const existing = await todoModel.findById(id);

      if (!existing) {
        return res.status(404).json({
          success: false,
          message: `Task with ID '${id}' was not found.`,
        });
      }

      let newStatus;
      if (req.body.completed !== undefined) {
        newStatus = Boolean(req.body.completed);
      } else if (req.body.status !== undefined) {
        newStatus = req.body.status.toLowerCase() === "completed";
      } else {
        // Toggle if no explicit status is passed
        newStatus = !existing.completed;
      }

      const updatedTask = await todoModel.updateStatus(id, newStatus);

      return res.status(200).json({
        success: true,
        message: `Task marked as ${newStatus ? "Completed" : "Pending"}.`,
        data: updatedTask,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * DELETE /api/todos/:id
   * Delete a task by ID
   */
  async deleteTodo(req, res, next) {
    try {
      const { id } = req.params;
      const deletedTask = await todoModel.delete(id);

      if (!deletedTask) {
        return res.status(404).json({
          success: false,
          message: `Task with ID '${id}' was not found.`,
        });
      }

      return res.status(200).json({
        success: true,
        message: "Task deleted successfully.",
        data: deletedTask,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new TodoController();
