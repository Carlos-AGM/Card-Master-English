import { useState } from 'react';
import { useLocation, useNavigate, Link} from 'react-router-dom';
import { NavBar } from '../components/NavBar';
import PropTypes from 'prop-types';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import '../css/reviewCard.css';

export function ReviewCards() {
    const location = useLocation();
    const navigate = useNavigate();
    const flashcardDecks = location.state?.flashcardDecks || {};
    const deckKeys = Object.keys(flashcardDecks);

    // Estados para manejar el mazo, flashcard actual, etc.
    const [currentDeckIndex, setCurrentDeckIndex] = useState(0);
    const [currentCardIndex, setCurrentCardIndex] = useState(null); // null indica que estamos viendo los mazos
    const [isFront, setIsFront] = useState(true); // Estado para determinar si estamos en front o back
    const [showDeleteDeckPopup, setShowDeleteDeckPopup] = useState(false); // Estado para controlar el popup

    // Si no hay mazos disponibles, mostramos un mensaje
    if (deckKeys.length === 0) {
        return (
            <>
                <NavBar />
                <div className="noDecksAvailableContainer">
                    <h2>No decks available</h2>
                    <Link to='/workArea' className='noDecksAvailable deckButton'>Return to work area</Link>
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

    // Boton en la card del mazo para mostrar las flashcards
    const handleDeckClick = () => {
        setCurrentCardIndex(0); // Empezamos en la primera flashcard del mazo
        setIsFront(true); // Aseguramos que se muestra la parte "Front"
    };

    // Funcion para hacer flip a la card
    const handleFlipCard = () => {
        setIsFront(!isFront); // Cambiamos entre front y back
    };

    // Funcion para volver a la vista anterior
    const handleGoBack = () => {
        navigate('/workArea'); // Ajusta esta ruta a la ruta de la que proviene el usuario
    };

    const handleDeleteDeck = (deckKey) => {
        const updatedDecks = { ...flashcardDecks };
        delete updatedDecks[deckKey]; // Elimina el mazo del objeto
        
        // Actualizar localStorage después de eliminar un mazo
        localStorage.setItem('flashcardDecks', JSON.stringify(updatedDecks));
        
        navigate('/reviewCards', { state: { flashcardDecks: updatedDecks } }); // Redirige a 'reviewCards' con los mazos actualizados
    };

    const handleDeleteFlashcard = (cardIndex) => {
        const currentDeck = [...flashcardDecks[deckKeys[currentDeckIndex]]];
        currentDeck.splice(cardIndex, 1); // Eliminar la flashcard
        const updatedDecks = { ...flashcardDecks, [deckKeys[currentDeckIndex]]: currentDeck };
        
        // Actualizar localStorage después de eliminar una flashcard
        localStorage.setItem('flashcardDecks', JSON.stringify(updatedDecks));

        if (currentDeck.length === 0) {
            setShowDeleteDeckPopup(true);  // Mostrar popup
        } else {
            navigate('/reviewCards', { state: { flashcardDecks: updatedDecks } });
        }
    };

    const handleCreateNewFlashcard = (deckKey) => {
        navigate('/workArea', {
            state: { flashcardDecks: flashcardDecks, deckKey, creatingNewCard: true },
        });
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
                    />
                )}

                {/* Botones de navegación de flashcards */}
                {currentCardIndex !== null && (
                    <>
                        <ChevronLeftIcon
                            className="previousButton"
                            onClick={handlePreviousCard}
                            disabled={currentCardIndex === 0}
                        />
                    </>
                )}

                <div className="cardWrapper">
                    <div className="cardContent">
                        {currentCardIndex === null ? (
                            // Muestra el nombre del mazo si estamos en modo de navegación de mazos
                            <>  
                                <ArrowBackIcon
                                    className='backButton'
                                    onClick={handleGoBack}
                                />
                                {currentCardIndex === null && (
                                    <button
                                        className="deleteDeck"
                                        onClick={() => handleDeleteDeck(deckKeys[currentDeckIndex])}
                                    >
                                        &#10006; {/* X para eliminar el mazo */}
                                    </button>
                                )}
                                <h2 className='reviewCardTitle'>Deck {currentDeckIndex + 1} of {deckKeys.length}</h2>
                                <p className='flashcardText' >{deckKeys[currentDeckIndex]}</p>
                                <button className="deckButton" onClick={handleDeckClick}>
                                    View flashcards
                                </button>
                            </>
                        ) : (
                            // Muestra las flashcards del mazo actual
                            <>
                                {/* Si estamos viendo flashcards, muestra el botón de volver a los mazos */}
                                {currentCardIndex !== null && (
                                    <ArrowBackIcon
                                        className="backButton"
                                        onClick={() => setCurrentCardIndex(null)} // Regresa a la lista de mazos
                                    />
                                )}
                                {currentCardIndex !== null && (
                                    <button
                                        className="deleteFlashcard"
                                        onClick={() => handleDeleteFlashcard(currentCardIndex)}
                                    >
                                        &#10006; {/* X para eliminar la flashcard */}
                                    </button>
                                )}
                                <h2 className='reviewCardTitle'>Flashcard {currentDeck.length === 0 ? 0 : currentCardIndex + 1} of {currentDeck.length}</h2>
                                <p className='flashcardText' >{(isFront ? currentCard?.front : currentCard?.back) || 'No content available'}</p>
                                {showDeleteDeckPopup && (
                                    <div className='popoverReviewCard'>
                                        <h4>You removed the last flashcard from this deck </h4>
                                        <p>What would you like to do?</p>
                                        <button 
                                            className='popoverButton' 
                                            onClick={() => handleDeleteDeck(deckKeys[currentDeckIndex])}
                                        >Delete deck</button>
                                        <button 
                                            className='popoverButton' 
                                            onClick={() => handleCreateNewFlashcard(deckKeys[currentDeckIndex])}
                                        >Create a new flashcard</button>
                                    </div>
                                )}
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
                    />
                )}

                {/* Botones de navegación de flashcards */}
                {currentCardIndex !== null && (
                    <>
                        <ChevronRightIcon
                            className="nextButton"
                            onClick={handleNextCard}
                            disabled={currentCardIndex === currentDeck.length - 1}
                        />
                    </>
                )}
            </div>
        </>
    );
}

ReviewCards.propTypes = {
    flashcardDecks: PropTypes.object, // Asegurando que sea un objeto, puede estar vacío
};