import { NavBar } from '../components/NavBar';
import { Flashcard } from '../components/Flashcard';
import { useState } from 'react';
import { AssistantIA } from '../components/AssistantIA';
import '../css/workArea.css';

export function WorkArea () {
    const [userAnswer, setUserAnswer] = useState('');
    const [showFlashcard, setShowFlashcard] = useState(false);
    const [flashcardDecks, setFlashcardDecks] = useState({});

    const handleInputChange = (e) => {
        setUserAnswer(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (userAnswer.trim() !== '') {
            setShowFlashcard(true); 
        }
    };

    // Nueva función para manejar la creación de un nuevo deck
    const handleCreateNewDeck = () => {
        setUserAnswer('');  // Limpiar el input para el nombre del nuevo deck
        setShowFlashcard(false);  // Volver a mostrar la entrada del nombre del deck
        setFlashcardDecks(prevDecks => {
          console.log('All Decks:', prevDecks);  // Imprimir todos los mazos en consola
          return prevDecks;  // Simplemente retorna el estado sin cambios
        });
    };

    return (
        <div>
            <NavBar/>
            <div className='mainContainer'>
                <aside className='assistantIA'>
                    <AssistantIA/>
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