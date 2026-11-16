const crypto = require("crypto");

class TodoModel {
  constructor() {
    this.todos = [];
    this.seedInitialData();
  }

  /**
   * Populate initial demo tasks for development & evaluation
   */
  seedInitialData() {
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + 3);
    const dueDateStr = futureDate.toISOString().split("T")[0];

    this.todos = [
      {
        id: "1",
        title: "Complete Virtusa Backend API",
        description: "Implement modular Express.js REST API with full CRUD operations and validation.",
        priority: "High",
        dueDate: dueDateStr,
        completed: false,
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      },
      {
        id: "2",
        title: "Verify Frontend Integration",
        description: "Connect Next.js task management components to backend endpoints.",
        priority: "Medium",
        dueDate: dueDateStr,
        completed: false,
        createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      },
      {
        id: "3",
        title: "Initial Team Setup & Repository Structure",
        description: "Setup project repo, Next.js frontend shell, and backend skeleton.",
        priority: "Low",
        dueDate: today.toISOString().split("T")[0],
        completed: true,
        createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
    ];
  }

  /**
   * Reset store to initial seed data (useful for test isolation)
   */
  reset() {
    this.seedInitialData();
    return this.todos;
  }

  /**
   * Clear all tasks
   */
  clear() {
    this.todos = [];
  }

  /**
   * Retrieve all tasks with optional search, filtering, and sorting
   * @param {Object} options
   * @param {string} [options.search] - Search text for title/description
   * @param {string} [options.status] - 'all' | 'pending' | 'completed'
   * @param {string} [options.priority] - 'all' | 'low' | 'medium' | 'high'
   * @param {string} [options.sortBy] - 'createdAt' | 'dueDate' | 'priority' | 'title'
   * @param {string} [options.order] - 'asc' | 'desc'
   */
  async findAll({ search, status, priority, sortBy = "createdAt", order = "desc" } = {}) {
    let result = [...this.todos];

    // Search query filter (matches title or description)
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (t) =>
          (t.title && t.title.toLowerCase().includes(q)) ||
          (t.description && t.description.toLowerCase().includes(q))
      );
    }

    // Status filter
    if (status && status.toLowerCase() !== "all") {
      const s = status.toLowerCase();
      if (s === "completed") {
        result = result.filter((t) => t.completed === true);
      } else if (s === "pending") {
        result = result.filter((t) => t.completed === false);
      }
    }

    // Priority filter
    if (priority && priority.toLowerCase() !== "all") {
      const p = priority.toLowerCase();
      result = result.filter((t) => t.priority.toLowerCase() === p);
    }

    // Sorting
    const priorityWeight = { High: 3, Medium: 2, Low: 1 };
    result.sort((a, b) => {
      let comparison = 0;
      if (sortBy === "priority") {
        comparison = (priorityWeight[b.priority] || 0) - (priorityWeight[a.priority] || 0);
      } else if (sortBy === "dueDate") {
        const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
        const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
        comparison = dateA - dateB;
      } else if (sortBy === "title") {
        comparison = a.title.localeCompare(b.title);
      } else {
        // Default: createdAt
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        comparison = dateB - dateA; // newest first by default
      }

      return order.toLowerCase() === "asc" ? -comparison : comparison;
    });

    return result;
  }

  /**
   * Retrieve a single task by ID
   * @param {string|number} id
   */
  async findById(id) {
    if (!id) return null;
    const task = this.todos.find((t) => t.id.toString() === id.toString());
    return task ? { ...task } : null;
  }

  /**
   * Create a new task
   * @param {Object} taskData
   */
  async create({ title, description = "", priority = "Medium", dueDate = "", completed = false }) {
    const now = new Date().toISOString();
    const newTask = {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      title: title.trim(),
      description: (description || "").trim(),
      priority: priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase(),
      dueDate: dueDate || "",
      completed: Boolean(completed),
      createdAt: now,
      updatedAt: now,
    };

    this.todos.push(newTask);
    return { ...newTask };
  }

  /**
   * Update an existing task
   * @param {string|number} id
   * @param {Object} updates
   */
  async update(id, updates) {
    const index = this.todos.findIndex((t) => t.id.toString() === id.toString());
    if (index === -1) return null;

    const current = this.todos[index];
    const updated = {
      ...current,
      ...(updates.title !== undefined && { title: updates.title.trim() }),
      ...(updates.description !== undefined && { description: (updates.description || "").trim() }),
      ...(updates.priority !== undefined && {
        priority: updates.priority.charAt(0).toUpperCase() + updates.priority.slice(1).toLowerCase(),
      }),
      ...(updates.dueDate !== undefined && { dueDate: updates.dueDate || "" }),
      ...(updates.completed !== undefined && { completed: Boolean(updates.completed) }),
      updatedAt: new Date().toISOString(),
    };

    this.todos[index] = updated;
    return { ...updated };
  }

  /**
   * Update only the completion status
   * @param {string|number} id
   * @param {boolean} completed
   */
  async updateStatus(id, completed) {
    return this.update(id, { completed });
  }

  /**
   * Delete a task by ID
   * @param {string|number} id
   */
  async delete(id) {
    const index = this.todos.findIndex((t) => t.id.toString() === id.toString());
    if (index === -1) return null;

    const [deleted] = this.todos.splice(index, 1);
    return deleted;
  }

  /**
   * Calculate summary statistics (total, pending, completed)
   */
  async getSummary() {
    const total = this.todos.length;
    const completed = this.todos.filter((t) => t.completed).length;
    const pending = total - completed;
    return { total, pending, completed };
  }
}

// Export singleton instance
module.exports = new TodoModel();
