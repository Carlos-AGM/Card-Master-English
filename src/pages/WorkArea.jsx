import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AssistantIA } from '../components/AssistantIA'
import { NavBar } from '../components/NavBar';
import { Flashcard } from '../components/Flashcard';
import '../css/workArea.css';

export function WorkArea() {
    const [userAnswer, setUserAnswer] = useState(''); // Nombre del mazo
    const [showFlashcard, setShowFlashcard] = useState(false); // Muestra el componente Flashcard
    const [flashcardDecks, setFlashcardDecks] = useState({});
    const navigate = useNavigate();
    
    const location = useLocation();
    // Desestructurar las propiedades que necesitas de location.state
    const { creatingNewCard, deckKey } = location.state || {};

    useEffect(() => {
        // Cargar mazos desde localStorage
        const storedDecks = localStorage.getItem('flashcardDecks');
        if (storedDecks) {
            setFlashcardDecks(JSON.parse(storedDecks));
        }

        // Verifica si viene de un redireccionamiento para crear una nueva flashcard
        if (creatingNewCard) {
            setUserAnswer(deckKey); // Configura el nombre del mazo
            setShowFlashcard(true); // Mostrar el componente Flashcard
        }
    }, [creatingNewCard, deckKey]); 

    const handleInputChange = (e) => {
        setUserAnswer(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (userAnswer.trim() !== '') {
            setFlashcardDecks(prevDecks => {
                // Si el mazo ya existe, no lo sobrescribas
                const updatedDecks = { ...prevDecks, [userAnswer]: prevDecks[userAnswer] || [] };
                // Guardar los mazos en localStorage
                localStorage.setItem('flashcardDecks', JSON.stringify(updatedDecks));
                return updatedDecks;
            });
            setShowFlashcard(true);
        }
    };

    const handleCreateNewDeck = () => {
        setUserAnswer(''); // Limpiar el input para el nombre del nuevo deck
        setShowFlashcard(false); // Volver a mostrar la entrada del nombre del deck
        setFlashcardDecks(prevDecks => {
            return prevDecks; // Simplemente retorna el estado sin cambios
        });
    };

    const handleButtonClick = () => {
        console.log('Navigating to review cards with decks:', flashcardDecks);
        navigate('/reviewCards', { state: { flashcardDecks: flashcardDecks } });
    }

    return (
        <div>
            <NavBar />
            <div className='mainContainer'>
                <aside className='assistantIA'>
                    <AssistantIA />
                </aside>
                {!showFlashcard && (
                    <div className='firstDeck'>
                        <p className='firstDeckNameQuery'>Choose the name of your deck</p>
                        <form className='answerArea' onSubmit={handleSubmit}>
                            <input
                                className='inputText'
                                type="text"
                                value={userAnswer}
                                onChange={handleInputChange}
                                placeholder='Type your answer here...'
                            />
                        </form>
                        <div className="lineWithText">
                            <span>Or</span>
                        </div>
                        <button 
                            className='reviewButton'
                            onClick={handleButtonClick}
                        >
                            Review Decks
                        </button>
                    </div>
                )}
                {showFlashcard && (
                    <Flashcard
                        flashcardDecks={flashcardDecks}
                        setFlashcardDecks={setFlashcardDecks}
                        userAnswer={userAnswer}
                        handleCreateNewDeck={handleCreateNewDeck}
                    />
                )}
            </div>
        </div>
    );
}