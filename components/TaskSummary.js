
export default function TaskSummary({ total, pending, completed }) {
  return (
    <section className="stats">
      <div className="stat-card">
        <span>Total Tasks</span>
        <h2>{total}</h2>
      </div>

      <div className="stat-card">
        <span>Pending</span>
        <h2>{pending}</h2>
      </div>

      <div className="stat-card">
        <span>Completed</span>
        <h2>{completed}</h2>
      </div>
    </section>
  );
}
