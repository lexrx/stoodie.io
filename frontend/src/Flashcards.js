import "./Flashcards.css";

function Flashcards() {
    return (
        <div className="flashcard-page">
            <div className="flashcard-card">
                <div className="flashcard-icon">🧠</div>
                <h1 className="flashcard-title">Flashcards</h1>
                <p className="flashcard-sub">Coming soon</p>
                <p className="flashcard-desc">
                    Spaced repetition flashcards to help you revise smarter and retain more.
                </p>
                <div className="flashcard-features">
                    <div className="flashcard-feature">
                        <span>✦</span> Create decks by subject
                    </div>
                    <div className="flashcard-feature">
                        <span>✦</span> Spaced repetition scheduling
                    </div>
                    <div className="flashcard-feature">
                        <span>✦</span> Track your progress
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Flashcards;