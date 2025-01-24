function FinishScreen({ points, maxPoints, dispatch }) {
    const percentage = (points / maxPoints) * 100;

    let emoji;
    if (percentage === 100) emoji = '🥇'
    if (percentage >= 80 && percentage < 100) emoji = '🥈'
    if (percentage >= 60 && percentage < 80) emoji = '🥉';
    if (percentage < 60) emoji = "🗑️"

    return (
        <>
            <p className="result">
                {emoji} You scored <strong>{points}</strong> out of {maxPoints} ({Math.ceil(percentage)}%)
            </p>
            <button className="btn btn-ui" onClick={() => dispatch({ type: 'restart' })}>
                Restart
            </button>
        </>
    )
}

export default FinishScreen
