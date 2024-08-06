import { NavBar } from '../components/NavBar';
import { Flashcard } from '../components/Flashcard';
import { useState } from 'react';
import '../css/workArea.css';

export function WorkArea () {
    const [userAnswer, setUserAnswer] = useState('');
    const [showFlashcard, setShowFlashcard] = useState(false);

    const handleInputChange = (e) => {
        setUserAnswer(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (userAnswer.trim() !== '') {
            setShowFlashcard(true); 
        }
    };
    return (
        <div>
            <NavBar/>
            <div className='mainContainer'>
                <aside className='assistantIA'>
                    <p> Aqui va la IA .</p>
                </aside>
                {!showFlashcard && (
                    <div className='firstDeck'>
                        <p className='firstDeckNameQuery'>Which is the name of your first deck?</p>
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
                {showFlashcard && <Flashcard />}
            </div>
        </div>
    );
}