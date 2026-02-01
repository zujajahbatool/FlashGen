import PropTypes from 'prop-types';
import './ProgressCounter.css';

export default function ProgressCounter({ learned, total }) {
  const percentage = total > 0 ? Math.round((learned / total) * 100) : 0;

  return (
    <div className="progress-counter">
      <div className="counter-label">Cards Learned</div>
      <div className="counter-display">
        <span className="digit-display">{learned}</span>
        <span className="separator">/</span>
        <span className="digit-display">{total}</span>
      </div>
      {total > 0 && (
        <div className="progress-percentage">
          {percentage}% Complete
        </div>
      )}
    </div>
  );
}

ProgressCounter.propTypes = {
  learned: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired
};
