const express = require("express");
const router = express.Router();
const todoController = require("../controllers/todoController");
const validate = require("../middleware/validate");
const {
  validateCreateTodo,
  validateUpdateTodo,
  validateStatusUpdate,
  validateIdParam,
} = require("../validators/todoValidator");

// Summary endpoint - placed before /:id parameter route
router.get("/summary", (req, res, next) => todoController.getSummary(req, res, next));

// Main CRUD endpoints
router.get("/", (req, res, next) => todoController.getTodos(req, res, next));

router.get("/:id", validate(validateIdParam), (req, res, next) =>
  todoController.getTodoById(req, res, next)
);

router.post("/", validate(validateCreateTodo), (req, res, next) =>
  todoController.createTodo(req, res, next)
);

router.put("/:id", validate(validateIdParam, validateUpdateTodo), (req, res, next) =>
  todoController.updateTodo(req, res, next)
);

router.patch("/:id/status", validate(validateIdParam, validateStatusUpdate), (req, res, next) =>
  todoController.updateStatus(req, res, next)
);

router.patch("/:id", validate(validateIdParam, validateUpdateTodo), (req, res, next) =>
  todoController.updateTodo(req, res, next)
);

router.delete("/:id", validate(validateIdParam), (req, res, next) =>
  todoController.deleteTodo(req, res, next)
);

module.exports = router;
