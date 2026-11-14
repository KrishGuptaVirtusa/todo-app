
export default function TaskCard({ task, onEdit, onDelete, onToggle }) {
  return (
    <article className="task-card">
      <div className="task-content">
        <div className="task-title-row">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggle(task.id)}
          />

          <h3 className={task.completed ? "completed" : ""}>
            {task.title}
          </h3>
        </div>

        {task.description && (
          <p className="task-description">{task.description}</p>
        )}

        <div className="task-details">
          <span className={`priority ${task.priority.toLowerCase()}`}>
            {task.priority} Priority
          </span>

          <span>
            {task.dueDate ? `Due: ${task.dueDate}` : "No due date"}
          </span>

          <span>{task.completed ? "Completed" : "Pending"}</span>
        </div>
      </div>

      <div className="task-actions">
        <button className="edit-btn" onClick={() => onEdit(task)}>
          Edit
        </button>

        <button className="delete-btn" onClick={() => onDelete(task.id)}>
          Delete
        </button>
      </div>
    </article>
  );
}
