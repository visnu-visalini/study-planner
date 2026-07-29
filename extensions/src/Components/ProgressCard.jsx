function ProgressCard({ stats }) {
    const pct = stats.total === 0 ? 0 : Math.round((stats.completed / stats.total) * 100);

    return (
        <div className="card">
            <h3>📊 Progress</h3>
            <br />
            <div className="progressBar">
                <div className="progressFill" style={{ width: `${pct}%` }} />
            </div>
            <p style={{ marginTop: 8 }}>{pct}% complete</p>
            <br />
            <p>✅ Completed: {stats.completed}</p>
            <p>⏳ Pending: {stats.pending}</p>
            <p>📚 Study Hours: {stats.studyHours} hrs</p>
        </div>
    );
}

export default ProgressCard;
