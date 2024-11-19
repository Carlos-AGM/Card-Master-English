import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { NavBar } from '../components/NavBar';
import { ErrorModal } from '../components/ErrorModal'
import '../css/quizMode.css';

export function QuizMode() {
    const location = useLocation();
    const navigate = useNavigate();
    const deck = location.state?.deck || []; // Recibe el deck desde la navegación
    const deckName = location.state?.deckName || 'Unknown Deck';

    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [isCorrect, setIsCorrect] = useState(null); // Estado para respuesta correcta/incorrecta
    const [modalMessage, setModalMessage] = useState('');

    const currentCard = deck[currentCardIndex];

    const handleCheckAnswer = () => {
        // Normalizamos ambas cadenas para evitar discrepancias
        const normalizedUserAnswer = userAnswer.trim().toLowerCase();
        const normalizedCardBack = currentCard?.back.trim().toLowerCase();

        if (normalizedUserAnswer === normalizedCardBack) {
            setIsCorrect(true); // Respuesta correcta
        } else {
            setIsCorrect(false); // Respuesta incorrecta
        }
    };

    const handleNextCard = () => {
        setUserAnswer('');
        setIsCorrect(null);
        if (currentCardIndex < deck.length - 1) {
            setCurrentCardIndex(currentCardIndex + 1);
        } else {
            setModalMessage('Quiz Completed! You have finished the quiz.');
        }
    };

    const handleInputChange = (e) => {
        // Sanitize input in real-time (remove double spaces)
        setUserAnswer(e.target.value.replace(/\s+/g, ' '));
    };

    // Función para cerrar el ErrorModal
    const closeErrorModal = () => {
        setModalMessage('');
        navigate('/reviewCards'); // Redirige al terminar el quiz
    };

    return (
        <>
            <NavBar />
            <div className="quizContainer">
                <article className='quizFlashcard'>
                    <header className='deckName'>{deckName}</header>
                    <div className="quizCard">
                        <p className="quizQuestion">{currentCard?.front}</p>
                        <input
                            type="text"
                            value={userAnswer}
                            onChange={handleInputChange} 
                            placeholder="Type the flashcard's back content..."
                            className="quizInput"
                        />
                        <div className="feedbackContainer">
                            {isCorrect !== null && (
                                <p className={`quizFeedback ${isCorrect ? 'correct' : 'incorrect'}`}>
                                    {isCorrect ? 'Correct!' : `Incorrect. Correct answer: ${currentCard?.back}`}
                                </p>
                            )}
                        </div>
                        <button className="checkButton" onClick={handleCheckAnswer}>
                            Check Answer
                        </button>
                        {isCorrect !== null && (
                            <button className="nextCard" onClick={handleNextCard}>
                                {currentCardIndex < deck.length - 1 ? 'Next Card' : 'Finish Quiz'}
                            </button>
                        )}
                    </div>
                </article>
            </div>
            {/* Renderiza el ErrorModal solo si errorMessage tiene un valor */}
            {modalMessage && <ErrorModal message={modalMessage} onClose={closeErrorModal} />}
        </>
    );
}