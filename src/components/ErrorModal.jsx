import PropTypes from 'prop-types';
import '../css/errorModal.css';

export function ErrorModal({ message, onClose }) {
  if (!message) return null; // Si no hay mensaje, no se muestra el modal

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalContent" onClick={(e) => e.stopPropagation()}>
        <h2>Error</h2>
        <p>{message}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

// Definir PropTypes para validar las props
ErrorModal.propTypes = {
    message: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
  };