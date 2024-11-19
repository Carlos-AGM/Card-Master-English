import PropTypes from 'prop-types';
import '../css/errorModal.css';

export function ErrorModal({ title, message, onClose }) {
  if (!message) return null; // Si no hay mensaje, no se muestra el modal

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalContent" onClick={(e) => e.stopPropagation()}>
        {title && <h2>{title}</h2>} {/* Solo muestra el título si se proporciona */}
        <p>{message}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

// Definir PropTypes para validar las props
ErrorModal.propTypes = {
    title: PropTypes.string,
    message: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
  };
