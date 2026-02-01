import { useState } from 'react';
import PropTypes from 'prop-types';
import './FlashCard.css';

export default function FlashCard({ question, answer, isLearned = false }) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = () => {
    setIsFlipped(!isFlipped);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsFlipped(!isFlipped);
    }
  };

  return (
    <div 
      className={`flashcard ${isFlipped ? 'flipped' : ''} ${isLearned ? 'learned' : ''}`}
      onClick={handleClick}
      onKeyPress={handleKeyPress}
      role="button"
      tabIndex={0}
      aria-label={`Flashcard: ${isFlipped ? 'showing answer' : 'showing question'}. Press to flip.`}
    >
      <div className="flashcard-inner">
        <div className="flashcard-front">
          <h3>Question</h3>
          <p>{question}</p>
          <span className="flip-hint">👆 Click to reveal answer</span>
        </div>
        <div className="flashcard-back">
          <h3>Answer</h3>
          <p>{answer}</p>
          <span className="flip-hint">👆 Click to see question</span>
        </div>
      </div>
    </div>
  );
}

FlashCard.propTypes = {
  question: PropTypes.string.isRequired,
  answer: PropTypes.string.isRequired,
  isLearned: PropTypes.bool
};
