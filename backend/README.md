# VIT Team 3 – To-Do App | Backend API

Robust, modular RESTful API built with **Node.js** and **Express.js** for the VIT Team 3 To-Do Application.

## Team Details

- **Project:** VIT Team 3 To-Do Application
- **Backend Developers:**
  - **Kaligotla Venkata Vasistha Ramana Rao (Vasistha)** — GitHub: [@VasisthaVirtusa](https://github.com/VasisthaVirtusa)
  - **Krish Gupta**

---

## Architecture & Directory Structure

```
backend/
├── .env.example              # Environment variables template
├── .gitignore                # Excludes node_modules, local logs, and secrets
├── package.json              # Backend dependencies and execution scripts
├── README.md                 # Complete API documentation and integration guide
├── src/
│   ├── app.js                # Express application configuration, CORS, middleware
│   ├── server.js             # HTTP server listener and graceful shutdown handling
│   ├── config/
│   │   └── env.js            # Environment configuration with safe defaults
│   ├── controllers/
│   │   └── todoController.js # Business logic for CRUD operations & metrics
│   ├── middleware/
│   │   ├── errorHandler.js   # Centralized error handler (prevents info leakage)
│   │   ├── notFoundHandler.js# 404 handler for unrecognized routes
│   │   └── validate.js       # Higher-order request validation middleware
│   ├── models/
│   │   └── todoModel.js      # Task data store, seed data, filtering, and metrics
│   ├── routes/
│   │   └── todoRoutes.js     # REST API route declarations and validator bindings
│   └── validators/
│       └── todoValidator.js  # Field validation (title, priority, date, status, ID)
└── tests/
    └── todo.test.js          # Automated end-to-end endpoint test suite
```

---

## Features

- **RESTful Architecture:** Follows standard HTTP verbs (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`) and proper HTTP status codes (`200`, `201`, `400`, `404`, `500`).
- **Full CRUD Operations:** Create, retrieve all, retrieve single, update, toggle/change status, and delete tasks.
- **Advanced Query Support:** Built-in search (by title/description), filtering by status (`pending`, `completed`), filtering by priority (`Low`, `Medium`, `High`), and customizable sorting.
- **Dashboard Summary Endpoint:** Dedicated `/api/todos/summary` providing real-time counts for `total`, `pending`, and `completed` tasks.
- **Strict Request Validation:** Checks for required fields, empty or whitespace-only titles, valid priority enums, date format (`YYYY-MM-DD`), and parameter formatting.
- **Centralized Error Handling:** Safely returns structured JSON errors while suppressing internal stack traces in production.
- **CORS Configured:** Pre-configured for Next.js frontend development origins (`http://localhost:3000`).
- **Zero-Friction In-Memory Model:** Pre-seeded with initial tasks so evaluators can test immediately without setting up external database servers.
- **Comprehensive Automated Tests:** 23 automated tests covering health checks, positive and negative CRUD flows, validation rejections, and malformed JSON payloads.

---

## Installation & Setup

### Prerequisites

- **Node.js:** v18.0.0 or later (v20+ recommended)
- **npm:** v9.0.0 or later

### 1. Install Dependencies

Navigate into the `backend/` directory and install the required npm packages:

```bash
cd backend
npm install
```

### 2. Environment Configuration

Copy the example environment file:

```bash
cp .env.example .env
```

Default `.env` configuration:

```env
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000,http://127.0.0.1:3000
```

### 3. Start the Backend

**Development mode (with auto-reload using Node 18+ watch mode):**
```bash
npm run dev
```

**Production / standard mode:**
```bash
npm start
```

The server will start at: `http://localhost:5000`

---

## Running Automated Tests

The backend includes a comprehensive test suite using Node.js's built-in test runner (`node:test` and `node:assert/strict`):

```bash
npm test
```

All 23 test suites verify:
- Health and status endpoints
- Task creation with valid & invalid inputs
- Retrieve all tasks, pagination/filtering/search queries
- Single task retrieval and 404 handling
- Full updates and partial status toggles
- Deletion and cascading 404 verification
- Error handling for malformed JSON

---

## API Endpoints Reference

Base URL: `http://localhost:5000`

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | API status and metadata |
| `GET` | `/api/health` | Health check endpoint |
| `GET` | `/api/todos` | Retrieve tasks (supports `search`, `status`, `priority`, `sortBy`, `order`) |
| `GET` | `/api/todos/summary` | Retrieve summary statistics (`total`, `pending`, `completed`) |
| `GET` | `/api/todos/:id` | Retrieve an individual task by ID |
| `POST` | `/api/todos` | Create a new task |
| `PUT` | `/api/todos/:id` | Update an existing task |
| `PATCH` | `/api/todos/:id/status` | Update task completion status (or toggle if body empty) |
| `PATCH` | `/api/todos/:id` | Partial update of task attributes |
| `DELETE` | `/api/todos/:id` | Delete a task |

---

## Request & Response Samples

### 1. Get All Tasks
- **Request:** `GET /api/todos?search=Virtusa&status=pending`
- **Response:** `200 OK`
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": "1",
      "title": "Complete Virtusa Backend API",
      "description": "Implement modular Express.js REST API with full CRUD operations and validation.",
      "priority": "High",
      "dueDate": "2026-11-20",
      "completed": false,
      "createdAt": "2026-11-15T16:00:00.000Z",
      "updatedAt": "2026-11-15T16:00:00.000Z"
    }
  ]
}
```

### 2. Get Task Summary
- **Request:** `GET /api/todos/summary`
- **Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "total": 3,
    "pending": 2,
    "completed": 1
  }
}
```

### 3. Create a New Task
- **Request:** `POST /api/todos`
- **Headers:** `Content-Type: application/json`
- **Body:**
```json
{
  "title": "Build Presentation Slides",
  "description": "Prepare architecture diagrams and demo walkthrough for project evaluation.",
  "priority": "High",
  "dueDate": "2026-11-25",
  "completed": false
}
```
- **Response:** `201 Created`
```json
{
  "success": true,
  "message": "Task created successfully.",
  "data": {
    "id": "c1f7f502-39f2-45e6-993d-d60fdfb5eb7b",
    "title": "Build Presentation Slides",
    "description": "Prepare architecture diagrams and demo walkthrough for project evaluation.",
    "priority": "High",
    "dueDate": "2026-11-25",
    "completed": false,
    "createdAt": "2026-11-16T16:50:00.000Z",
    "updatedAt": "2026-11-16T16:50:00.000Z"
  }
}
```

### 4. Update Task Status
- **Request:** `PATCH /api/todos/1/status`
- **Body:**
```json
{
  "completed": true
}
```
- **Response:** `200 OK`
```json
{
  "success": true,
  "message": "Task marked as Completed.",
  "data": {
    "id": "1",
    "title": "Complete Virtusa Backend API",
    "completed": true,
    "updatedAt": "2026-11-16T16:52:00.000Z"
  }
}
```

### 5. Validation Error (Example)
- **Request:** `POST /api/todos`
- **Body:** `{ "title": "   ", "priority": "InvalidPriority" }`
- **Response:** `400 Bad Request`
```json
{
  "success": false,
  "message": "Validation Error",
  "errors": [
    "Task title cannot be empty or contain only whitespace.",
    "Field 'priority' must be one of: 'Low', 'Medium', 'High'."
  ]
}
```

### 6. Resource Not Found (Example)
- **Request:** `GET /api/todos/99999`
- **Response:** `404 Not Found`
```json
{
  "success": false,
  "message": "Task with ID '99999' was not found."
}
```

---

## Example cURL Commands

```bash
# Health Check
curl -X GET http://localhost:5000/api/health

# Get All Tasks
curl -X GET http://localhost:5000/api/todos

# Filter Pending High Priority Tasks
curl -X GET "http://localhost:5000/api/todos?status=pending&priority=high"

# Get Task Metrics
curl -X GET http://localhost:5000/api/todos/summary

# Create a Task
curl -X POST http://localhost:5000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Virtusa Endpoint","description":"Testing via curl","priority":"Medium","dueDate":"2026-11-30"}'

# Update a Task
curl -X PUT http://localhost:5000/api/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Task Title","priority":"Low"}'

# Toggle Status
curl -X PATCH http://localhost:5000/api/todos/1/status \
  -H "Content-Type: application/json" \
  -d '{"completed":true}'

# Delete a Task
curl -X DELETE http://localhost:5000/api/todos/1
```

---

## Frontend Integration Guide

The Next.js frontend can connect to this backend by creating an API client service or setting `NEXT_PUBLIC_API_URL=http://localhost:5000/api`.

### Connecting Next.js:

1. In the frontend root, configure `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

2. Replace direct `localStorage` calls in `app/page.js` with API calls:
   - Initial load: `fetch(`${API_URL}/todos`).then(res => res.json())`
   - Add task: `fetch(`${API_URL}/todos`, { method: "POST", body: JSON.stringify(newTask) })`
   - Update task: `fetch(`${API_URL}/todos/${id}`, { method: "PUT", body: JSON.stringify(updatedTask) })`
   - Toggle status: `fetch(`${API_URL}/todos/${id}/status`, { method: "PATCH", body: JSON.stringify({ completed: !task.completed }) })`
   - Delete task: `fetch(`${API_URL}/todos/${id}`, { method: "DELETE" })`
