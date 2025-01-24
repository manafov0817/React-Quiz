function Progress({ questionCount, index, answer, points, maxPoints }) {
    return (
        <header className="progress">
            <progress max={questionCount} value={index + Number(answer ? 1 : 0)} />
            <p>Question <strong>{index + 1}</strong>/{questionCount}</p>
            <p><strong>{points}</strong>/{maxPoints} points</p>
        </header>
    )
}

export default Progress
