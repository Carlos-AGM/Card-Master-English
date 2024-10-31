import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { NavBar } from '../components/NavBar';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import predefinedDecksA1 from '../assets/data/deckA1.json';  // Archivo JSON para A1
import predefinedDecksA2 from '../assets/data/deckA2.json';  // Archivo JSON para A2
import '../css/reviewPredefinedDecks.css';

export function ReviewPredefinedDecks() {
    const navigate = useNavigate();
    const location = useLocation();
    const level = location.state?.level || 'A1'; // Obtener el nivel (A1 o A2) de la navegación

    const [predefinedDecks, setPredefinedDecks] = useState([]);
    const [deckKeys, setDeckKeys] = useState([]);
    const [currentDeckIndex, setCurrentDeckIndex] = useState(0);
    const [currentCardIndex, setCurrentCardIndex] = useState(null); // null indica que estamos viendo los mazos
    const [isFront, setIsFront] = useState(true); // Estado para determinar si estamos en front o back

    // Cargar los mazos prefabricados de acuerdo al nivel seleccionado
    useEffect(() => {
        if (level === 'A1') {
            setPredefinedDecks(predefinedDecksA1.decks);
            setDeckKeys(predefinedDecksA1.decks.map(deck => deck.deckName));
        } else if (level === 'A2') {
            setPredefinedDecks(predefinedDecksA2.decks);
            setDeckKeys(predefinedDecksA2.decks.map(deck => deck.deckName));
        }
    }, [level]);

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
        const currentDeck = predefinedDecks[currentDeckIndex].cards;
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

    // Función para volver a la vista anterior
    const handleGoBack = () => {
        navigate('/'); // Ajusta esta ruta a la página de inicio
    };

    if (!predefinedDecks.length) {
        return <p>Loading predefined decks...</p>; // Añadido mientras carga los mazos
    }

    const currentDeck = predefinedDecks[currentDeckIndex];
    const currentCard = currentCardIndex !== null ? currentDeck.cards[currentCardIndex] : null;

    return (
        <>
            <NavBar />
            <div className="reviewCardContainerP">
                {/* Botones de navegación de mazos */}
                {currentCardIndex === null && (
                    <ChevronLeftIcon
                        className="previousButtonP"
                        onClick={handlePreviousDeck}
                        disabled={currentDeckIndex === 0}
                    />
                )}

                {/* Botones de navegación de flashcards */}
                {currentCardIndex !== null && (
                    <ChevronLeftIcon
                        className="previousButtonP"
                        onClick={handlePreviousCard}
                        disabled={currentCardIndex === 0}
                    />
                )}

                <div className="cardWrapperP">
                    <div className="cardContentP">
                        {currentCardIndex === null ? (
                            // Muestra el nombre del mazo si estamos en modo de navegación de mazos
                            <>  
                                <ArrowBackIcon
                                    className='backButtonP'
                                    onClick={handleGoBack}
                                />
                                <h2 className='reviewCardTitleP'>Deck {currentDeckIndex + 1} of {deckKeys.length}</h2>
                                <p className='flashcardText' >{deckKeys[currentDeckIndex]}</p>
                                <button className="deckButtonP" onClick={handleDeckClick}>
                                    View flashcards
                                </button>
                            </>
                        ) : (
                            // Muestra las flashcards del mazo actual
                            <>
                                <ArrowBackIcon
                                    className="backButtonP"
                                    onClick={() => setCurrentCardIndex(null)} // Regresa a la lista de mazos
                                />
                                <h2 className='reviewCardTitleP'>Flashcard {currentCardIndex + 1} of {currentDeck.cards.length}</h2>
                                <p className='flashcardText' >{isFront ? currentCard?.front : currentCard?.back}</p>
                            </>
                        )}
                    </div>

                    {/* Botón para hacer flip a la card */}
                    {currentCardIndex !== null && (
                        <button className="flipButtonP" onClick={handleFlipCard}>
                            {isFront ? 'Flip to Back' : 'Flip to Front'}
                        </button>
                    )}
                </div>

                {/* Botones de navegación de mazos */}
                {currentCardIndex === null && (
                    <ChevronRightIcon
                        className="nextButtonP"
                        onClick={handleNextDeck}
                        disabled={currentDeckIndex === deckKeys.length - 1}
                    />
                )}

                {/* Botones de navegación de flashcards */}
                {currentCardIndex !== null && (
                    <ChevronRightIcon
                        className="nextButtonP"
                        onClick={handleNextCard}
                        disabled={currentCardIndex === currentDeck.cards.length - 1}
                    />
                )}
            </div>
        </>
    );
}