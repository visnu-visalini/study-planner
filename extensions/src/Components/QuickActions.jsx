function QuickActions({ askAI, loading }) {
    const actions = [
        { label: "📅 Plan Today", prompt: "Create a study plan for today" },
        { label: "❓ Tutor", prompt: "Explain Operating Systems concepts" },
        { label: "📊 Progress", prompt: "Show my progress and focus stats" },
        { label: "✅ Tasks", prompt: "Show all my tasks" },
        { label: "🎵 Spotify", prompt: "Play a lo-fi study playlist on Spotify" },
        { label: "📝 Notion", prompt: "Save a note to Notion: Study session summary" },
    ];

    return (
        <div className="card">
            <h3>⚡ Quick Actions</h3>
            <br />
            <div className="actionGrid">
                {actions.map((a, i) => (
                    <button key={i} onClick={() => askAI(a.prompt)} disabled={loading}>
                        {a.label}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default QuickActions;
