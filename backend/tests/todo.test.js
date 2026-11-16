const { test, describe, before, after, beforeEach } = require("node:test");
const assert = require("node:assert/strict");
const http = require("http");
const app = require("../src/app");
const todoModel = require("../src/models/todoModel");

describe("VIT Team 3 - To-Do Backend API Test Suite", () => {
  let server;
  let baseUrl;

  before(async () => {
    process.env.NODE_ENV = "test";
    // Listen on random available port
    server = http.createServer(app);
    await new Promise((resolve) => server.listen(0, resolve));
    const port = server.address().port;
    baseUrl = `http://127.0.0.1:${port}`;
  });

  after(async () => {
    await new Promise((resolve) => server.close(resolve));
  });

  beforeEach(() => {
    // Reset seed data between tests
    todoModel.reset();
  });

  // Helper function to make JSON HTTP requests
  async function apiRequest(endpoint, { method = "GET", body = null, headers = {} } = {}) {
    const reqHeaders = { "Content-Type": "application/json", ...headers };
    const options = {
      method,
      headers: reqHeaders,
    };
    if (body !== null) {
      options.body = typeof body === "string" ? body : JSON.stringify(body);
    }
    const response = await fetch(`${baseUrl}${endpoint}`, options);
    let data;
    try {
      data = await response.json();
    } catch {
      data = null;
    }
    return { status: response.status, data };
  }

  // ============================================
  // System & Health Endpoints
  // ============================================
  test("GET / - returns API information", async () => {
    const { status, data } = await apiRequest("/");
    assert.strictEqual(status, 200);
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.name, "VIT Team 3 To-Do Application API");
  });

  test("GET /api/health - returns healthy status", async () => {
    const { status, data } = await apiRequest("/api/health");
    assert.strictEqual(status, 200);
    assert.strictEqual(data.status, "healthy");
    assert.ok(data.timestamp);
  });

  test("GET /api/unknown-route - returns 404 structured response", async () => {
    const { status, data } = await apiRequest("/api/non-existent-endpoint");
    assert.strictEqual(status, 404);
    assert.strictEqual(data.success, false);
    assert.ok(data.message.includes("Resource not found"));
  });

  // ============================================
  // GET /api/todos & Filters
  // ============================================
  test("GET /api/todos - returns all tasks and count", async () => {
    const { status, data } = await apiRequest("/api/todos");
    assert.strictEqual(status, 200);
    assert.strictEqual(data.success, true);
    assert.strictEqual(Array.isArray(data.data), true);
    assert.strictEqual(data.count, 3);
  });

  test("GET /api/todos?search=Backend - filters tasks by search term", async () => {
    const { status, data } = await apiRequest("/api/todos?search=Backend");
    assert.strictEqual(status, 200);
    assert.strictEqual(data.success, true);
    assert.ok(data.count >= 1);
    const allMatch = data.data.every(
      (t) =>
        t.title.toLowerCase().includes("backend") ||
        (t.description && t.description.toLowerCase().includes("backend"))
    );
    assert.strictEqual(allMatch, true);
  });

  test("GET /api/todos?status=completed - returns only completed tasks", async () => {
    const { status, data } = await apiRequest("/api/todos?status=completed");
    assert.strictEqual(status, 200);
    assert.strictEqual(data.success, true);
    for (const t of data.data) {
      assert.strictEqual(t.completed, true);
    }
  });

  test("GET /api/todos?status=pending - returns only pending tasks", async () => {
    const { status, data } = await apiRequest("/api/todos?status=pending");
    assert.strictEqual(status, 200);
    assert.strictEqual(data.success, true);
    for (const t of data.data) {
      assert.strictEqual(t.completed, false);
    }
  });

  test("GET /api/todos?priority=high - returns only high priority tasks", async () => {
    const { status, data } = await apiRequest("/api/todos?priority=high");
    assert.strictEqual(status, 200);
    assert.strictEqual(data.success, true);
    for (const t of data.data) {
      assert.strictEqual(t.priority, "High");
    }
  });

  // ============================================
  // GET /api/todos/summary
  // ============================================
  test("GET /api/todos/summary - returns correct task metrics", async () => {
    const { status, data } = await apiRequest("/api/todos/summary");
    assert.strictEqual(status, 200);
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.data.total, 3);
    assert.strictEqual(data.data.completed, 1);
    assert.strictEqual(data.data.pending, 2);
  });

  // ============================================
  // GET /api/todos/:id
  // ============================================
  test("GET /api/todos/:id - returns task for existing ID", async () => {
    const { status, data } = await apiRequest("/api/todos/1");
    assert.strictEqual(status, 200);
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.data.id, "1");
    assert.strictEqual(data.data.title, "Complete Virtusa Backend API");
  });

  test("GET /api/todos/:id - returns 404 for non-existent ID", async () => {
    const { status, data } = await apiRequest("/api/todos/nonexistent-999");
    assert.strictEqual(status, 404);
    assert.strictEqual(data.success, false);
    assert.ok(data.message.includes("was not found"));
  });

  // ============================================
  // POST /api/todos (Create Task)
  // ============================================
  test("POST /api/todos - creates a new task with valid data", async () => {
    const newTask = {
      title: "Write End-to-End API Documentation",
      description: "Document all endpoints, sample payloads, and curl commands",
      priority: "High",
      dueDate: "2026-11-25",
      completed: false,
    };

    const { status, data } = await apiRequest("/api/todos", {
      method: "POST",
      body: newTask,
    });

    assert.strictEqual(status, 201);
    assert.strictEqual(data.success, true);
    assert.ok(data.data.id);
    assert.strictEqual(data.data.title, newTask.title);
    assert.strictEqual(data.data.priority, "High");
    assert.strictEqual(data.data.completed, false);
    assert.ok(data.data.createdAt);
  });

  test("POST /api/todos - rejects missing title", async () => {
    const { status, data } = await apiRequest("/api/todos", {
      method: "POST",
      body: { description: "Missing title", priority: "Low" },
    });

    assert.strictEqual(status, 400);
    assert.strictEqual(data.success, false);
    assert.ok(data.errors.some((e) => e.includes("title")));
  });

  test("POST /api/todos - rejects empty/whitespace title", async () => {
    const { status, data } = await apiRequest("/api/todos", {
      method: "POST",
      body: { title: "   ", priority: "Medium" },
    });

    assert.strictEqual(status, 400);
    assert.strictEqual(data.success, false);
    assert.ok(data.errors.some((e) => e.includes("empty")));
  });

  test("POST /api/todos - rejects invalid priority value", async () => {
    const { status, data } = await apiRequest("/api/todos", {
      method: "POST",
      body: { title: "Valid Title", priority: "UrgentNotAllowed" },
    });

    assert.strictEqual(status, 400);
    assert.strictEqual(data.success, false);
    assert.ok(data.errors.some((e) => e.includes("priority")));
  });

  test("POST /api/todos - rejects invalid dueDate format", async () => {
    const { status, data } = await apiRequest("/api/todos", {
      method: "POST",
      body: { title: "Valid Title", dueDate: "invalid-date-string" },
    });

    assert.strictEqual(status, 400);
    assert.strictEqual(data.success, false);
    assert.ok(data.errors.some((e) => e.includes("dueDate")));
  });

  // ============================================
  // PUT /api/todos/:id (Update Task)
  // ============================================
  test("PUT /api/todos/:id - successfully updates existing task", async () => {
    const updates = {
      title: "Updated Virtusa Task Title",
      priority: "Low",
      completed: true,
    };

    const { status, data } = await apiRequest("/api/todos/1", {
      method: "PUT",
      body: updates,
    });

    assert.strictEqual(status, 200);
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.data.title, updates.title);
    assert.strictEqual(data.data.priority, "Low");
    assert.strictEqual(data.data.completed, true);
  });

  test("PUT /api/todos/:id - rejects empty body with no fields", async () => {
    const { status, data } = await apiRequest("/api/todos/1", {
      method: "PUT",
      body: {},
    });

    assert.strictEqual(status, 400);
    assert.strictEqual(data.success, false);
    assert.ok(data.errors.some((e) => e.includes("At least one valid field")));
  });

  test("PUT /api/todos/:id - returns 404 for non-existent ID", async () => {
    const { status, data } = await apiRequest("/api/todos/missing-id-404", {
      method: "PUT",
      body: { title: "Something" },
    });

    assert.strictEqual(status, 404);
    assert.strictEqual(data.success, false);
  });

  // ============================================
  // PATCH /api/todos/:id/status (Toggle & Set Status)
  // ============================================
  test("PATCH /api/todos/:id/status - toggles status when body is empty", async () => {
    const initial = await todoModel.findById("1");
    const wasCompleted = initial.completed;

    const { status, data } = await apiRequest("/api/todos/1/status", {
      method: "PATCH",
      body: {},
    });

    assert.strictEqual(status, 200);
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.data.completed, !wasCompleted);
  });

  test("PATCH /api/todos/:id/status - sets completed status explicitly", async () => {
    const { status, data } = await apiRequest("/api/todos/1/status", {
      method: "PATCH",
      body: { completed: true },
    });

    assert.strictEqual(status, 200);
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.data.completed, true);
  });

  test("PATCH /api/todos/:id/status - supports status='Pending' string", async () => {
    const { status, data } = await apiRequest("/api/todos/3/status", {
      method: "PATCH",
      body: { status: "Pending" },
    });

    assert.strictEqual(status, 200);
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.data.completed, false);
  });

  test("PATCH /api/todos/:id/status - rejects invalid status value", async () => {
    const { status, data } = await apiRequest("/api/todos/1/status", {
      method: "PATCH",
      body: { status: "NotAValidStatus" },
    });

    assert.strictEqual(status, 400);
    assert.strictEqual(data.success, false);
  });

  // ============================================
  // DELETE /api/todos/:id (Delete Task)
  // ============================================
  test("DELETE /api/todos/:id - deletes existing task", async () => {
    const { status, data } = await apiRequest("/api/todos/1", {
      method: "DELETE",
    });

    assert.strictEqual(status, 200);
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.data.id, "1");

    // Verify it is gone
    const fetchAfter = await apiRequest("/api/todos/1");
    assert.strictEqual(fetchAfter.status, 404);
  });

  test("DELETE /api/todos/:id - returns 404 for non-existent ID", async () => {
    const { status, data } = await apiRequest("/api/todos/unknown-delete-id", {
      method: "DELETE",
    });

    assert.strictEqual(status, 404);
    assert.strictEqual(data.success, false);
  });

  // ============================================
  // Malformed Request Body
  // ============================================
  test("POST /api/todos - returns 400 for malformed JSON", async () => {
    const { status, data } = await apiRequest("/api/todos", {
      method: "POST",
      body: "{ malformed json string:",
      headers: { "Content-Type": "application/json" },
    });

    assert.strictEqual(status, 400);
    assert.strictEqual(data.success, false);
    assert.ok(data.message.includes("Malformed JSON"));
  });
});
