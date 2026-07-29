function PlannerCard({ sessions = [] }) {
    const recent = sessions.slice(-4).reverse();

    return (
        <div className="card">
            <h3>📅 Recent Sessions</h3>
            <br />
            {recent.length === 0 && <p style={{ color: "#888" }}>No sessions yet. Start a focus timer!</p>}
            {recent.map((s, i) => (
                <p key={i}>
                    🕐 {s.subject} — {s.minutes} min
                    <span style={{ color: "#888", fontSize: 11, marginLeft: 6 }}>
                        {new Date(s.startTime).toLocaleDateString()}
                    </span>
                </p>
            ))}
        </div>
    );
}

export default PlannerCard;
