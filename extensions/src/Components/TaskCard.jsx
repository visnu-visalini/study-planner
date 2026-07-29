function TaskCard({ tasks, onRefresh }) {
    const visible = tasks.slice(0, 5);

    return (
        <div className="card">
            <h3>✅ Tasks</h3>
            <br />
            {visible.length === 0 && <p style={{ color: "#888" }}>No tasks yet. Ask AI to create some!</p>}
            {visible.map(t => (
                <div key={t.id} className="task">
                    <span>{t.completed ? "✔" : "⬜"} {t.task}</span>
                </div>
            ))}
            {tasks.length > 5 && (
                <p style={{ marginTop: 8, color: "#888", fontSize: 12 }}>+{tasks.length - 5} more tasks</p>
            )}
        </div>
    );
}

export default TaskCard;
