
"use client";

import { useState } from "react";

export default function TaskForm({
  title,
  setTitle,
  description,
  setDescription,
  priority,
  setPriority,
  dueDate,
  setDueDate,
  editingId,
  onSave,
  onCancel,
}) {
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (!title.trim()) {
      setError("Please enter a task title.");
      return;
    }

    if (dueDate) {
      const selectedDate = new Date(dueDate + "T00:00:00");
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        setError("Due date cannot be in the past.");
        return;
      }
    }

    setError("");
    onSave(e);
  }

  return (
    <section className="form-section">
      <h2>{editingId ? "Edit Task" : "Add a New Task"}</h2>

      <form onSubmit={handleSubmit}>
        <label>Task Title *</label>
        <input
          type="text"
          placeholder="Enter task title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setError("");
          }}
        />

        {error && <p className="error-message">{error}</p>}

        <label>Description</label>
        <textarea
          placeholder="Add details..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="form-row">
          <div>
            <label>Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>

          <div>
            <label>Due Date</label>
            <input
                type="date"
                value={dueDate}
                onChange={(e) => {
                    setDueDate(e.target.value);
                    setError("");
               }}
            />
          </div>
        </div>

        <div className="form-buttons">
          <button className="primary-btn" type="submit">
            {editingId ? "Update Task" : "Add Task"}
          </button>

          {editingId && (
            <button
              type="button"
              className="cancel-btn"
              onClick={onCancel}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
