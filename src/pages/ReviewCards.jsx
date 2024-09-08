import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { NavBar } from '../components/NavBar';
import PropTypes from 'prop-types';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import '../css/reviewCard.css';


export function ReviewCards() {
    const location = useLocation();
    const flashcardDecks = location.state?.flashcardDecks || {};
    const deckKeys = Object.keys(flashcardDecks);

    // Estados para manejar el mazo, flashcard actual y si está viendo el front o el back
    const [currentDeckIndex, setCurrentDeckIndex] = useState(0);
    const [currentCardIndex, setCurrentCardIndex] = useState(null); // null indica que estamos viendo los mazos
    const [isFront, setIsFront] = useState(true); // Estado para determinar si estamos en front o back

    // Si no hay mazos disponibles, mostramos un mensaje
    if (deckKeys.length === 0) {
        return (
            <>
                <NavBar />
                <div className="reviewCardContainer">
                    <h2>No flashcards available</h2>
                </div>
            </>
        );
    }

    // Funciones para la navegación de mazos
    const handlePreviousDeck = () => {
        if (currentDeckIndex > 0) {
            setCurrentDeckIndex(prevIndex => prevIndex - 1);
            setCurrentCardIndex(null); // Resetea la navegación de las flashcards al cambiar de mazo
        }
    };

    const handleNextDeck = () => {
        if (currentDeckIndex < deckKeys.length - 1) {
            setCurrentDeckIndex(prevIndex => prevIndex + 1);
            setCurrentCardIndex(null); // Resetea la navegación de las flashcards al cambiar de mazo
        }
    };

    // Funciones para la navegación de flashcards
    const handlePreviousCard = () => {
        if (currentCardIndex > 0) {
            setCurrentCardIndex(prevIndex => prevIndex - 1);
            setIsFront(true); // Restablece a "Front" al cambiar de tarjeta
        }
    };

    const handleNextCard = () => {
        const currentDeck = flashcardDecks[deckKeys[currentDeckIndex]];
        if (currentCardIndex < currentDeck.length - 1) {
            setCurrentCardIndex(prevIndex => prevIndex + 1);
            setIsFront(true); // Restablece a "Front" al cambiar de tarjeta
        }
    };

    // Click en la card del mazo para mostrar las flashcards
    const handleDeckClick = () => {
        setCurrentCardIndex(0); // Empezamos en la primera flashcard del mazo
        setIsFront(true); // Aseguramos que se muestra la parte "Front"
    };

    // Función para hacer flip a la card
    const handleFlipCard = () => {
        setIsFront(!isFront); // Cambiamos entre front y back
    };

    // Obtenemos el mazo y las flashcards actuales
    const currentDeck = flashcardDecks[deckKeys[currentDeckIndex]];
    const currentCard = currentCardIndex !== null ? currentDeck[currentCardIndex] : null;

    return (
        <>
            <NavBar />
            <div className="reviewCardContainer">
                {/* Botones de navegación de mazos */}
                {currentCardIndex === null && (
                    <ChevronLeftIcon
                        className="previousButton"
                        onClick={handlePreviousDeck}
                        disabled={currentDeckIndex === 0}
                    >
                        Previous Deck
                    </ChevronLeftIcon>
                )}
                {/* Botones de navegación de flashcards */}
                {currentCardIndex !== null && (
                    <>
                        <ChevronLeftIcon
                            className="previousButton"
                            onClick={handlePreviousCard}
                            disabled={currentCardIndex === 0}
                        >
                            Previous Card
                        </ChevronLeftIcon>
                    </>
                    )}
                <div className="cardWrapper">
                    <div className="cardContent">
                        {currentCardIndex === null ? (
                            // Muestra el nombre del mazo si estamos en modo de navegación de mazos
                            <>
                                <h2 className='reviewCardTitle'>{deckKeys[currentDeckIndex]}</h2>
                                <p>Click to view flashcards</p>
                                <button className="deckButton" onClick={handleDeckClick}>
                                    View flashcards
                                </button>
                            </>
                        ) : (
                            // Muestra las flashcards del mazo actual
                            <>
                                <h2 className='reviewCardTitle'>Flashcard {currentCardIndex + 1} of {currentDeck.length}</h2>
                                <p>{isFront ? currentCard?.front : currentCard?.back || 'No content available'}</p>
                            </>
                        )}
                    </div>

                    {/* Botón para hacer flip a la card */}
                    {currentCardIndex !== null && (
                        <button className="flipButton" onClick={handleFlipCard}>
                            {isFront ? 'Flip to Back' : 'Flip to Front'}
                        </button>
                    )}

                    

                    
                </div>
                {/* Botones de navegación de mazos */}
                {currentCardIndex === null && (
                    <ChevronRightIcon
                    className="nextButton"
                    onClick={handleNextDeck}
                    disabled={currentDeckIndex === deckKeys.length - 1}
                    >
                        Next Deck
                    </ChevronRightIcon>
                )}
                {/* Botones de navegación de flashcards */}
                {currentCardIndex !== null && (
                    <>
                        <ChevronRightIcon
                            className="nextButton"
                            onClick={handleNextCard}
                            disabled={currentCardIndex === currentDeck.length - 1}
                        >
                            Next Card
                        </ChevronRightIcon>
                    </>
                )}
            </div>
        </>
    );
}

ReviewCards.propTypes = {
    flashcardDecks: PropTypes.object, // Asegurando que sea un objeto, puede estar vacío
};