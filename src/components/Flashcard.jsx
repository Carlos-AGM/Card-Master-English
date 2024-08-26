import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../css/flashcard.css';

export function Flashcard({ setFlashcardDecks, userAnswer }) {
    const [isFront, setIsFront] = useState(true);
    const [frontText, setFrontText] = useState('');
    const [backText, setBackText] = useState('');
    const [currentCardIndex, setCurrentCardIndex] = useState(null);
    const cardTextRef = useRef(null);

    useEffect(() => {
        const element = cardTextRef.current;
        if (element && element.innerText.trim() === '') {
            element.innerHTML = '&nbsp;';
        }

        if(element) {
            element.focus();
        }
    }, [isFront]);

    const handleInput = () => {
        const element = cardTextRef.current;
        let text = element.innerText.replace(/\n/g, '');

        text = text.replace(/^(.)(\s)/, '$1');

        if (text.length > 304) {
            text = text.slice(0, 304);
        }

        const formattedText = text.match(/.{1,56}/g)?.join('\n') || text;
        element.innerText = formattedText;

        if (isFront) {
            setFrontText(text);
        } else {
            setBackText(text);
        }

        setTimeout(() => {
            const range = document.createRange();
            const sel = window.getSelection();
            range.selectNodeContents(element);
            range.collapse(false);
            sel.removeAllRanges();
            sel.addRange(range);
        }, 0);
    };

    const handleFlip = () => {
        setFlashcardDecks(prevDecks => {
            const deck = prevDecks[userAnswer] || [];
            const updatedDeck = [...deck];

            if (isFront) {
                // Guardar en la parte 'front'
                if (currentCardIndex === null) {
                    updatedDeck.push({ front: frontText, back: '' });
                    setCurrentCardIndex(updatedDeck.length - 1);
                } else {
                    updatedDeck[currentCardIndex].front = frontText;
                }
                console.log('Flashcard Front Saved:', frontText);
            } else {
                // Guardar en la parte 'back'
                if (currentCardIndex !== null) {
                    updatedDeck[currentCardIndex].back = backText;
                }
                console.log('Flashcard Back Saved:', backText);
            }

            console.log('Updated Deck:', { [userAnswer]: updatedDeck });
            return { ...prevDecks, [userAnswer]: updatedDeck };
        });

        setIsFront(!isFront);
        cardTextRef.current.innerText = isFront ? backText : frontText;
    };

    const handleSave = () => {
        setFlashcardDecks(prevDecks => {
            const deck = prevDecks[userAnswer] || [];

            if (currentCardIndex !== null) {
                // Actualizar tarjeta existente
                deck[currentCardIndex] = { front: frontText, back: backText };
            } else {
                // Crear nueva tarjeta
                const newCard = { front: frontText, back: backText };
                deck.push(newCard);
                setCurrentCardIndex(deck.length - 1);
                console.log('New Card Added:', newCard);
            }

            console.log('Updated Deck after Save:', { [userAnswer]: deck });
            return { ...prevDecks, [userAnswer]: deck };
        });

        setFrontText('');
        setBackText('');
        cardTextRef.current.innerText = '';
    };

    const isSaveDisabled = !frontText || !backText;

    return (
        <main className='flashcardSection'>
            <article className='flashcard'>
                <header className='title'>
                    <h2>{userAnswer}</h2>
                </header>
                <p
                    className='flashcardTextArea'
                    contentEditable="true"
                    onInput={handleInput}
                    ref={cardTextRef}
                    onClick={() => cardTextRef.current.focus()}
                    placeholder={isFront ? 'Escribe en el frente...' : 'Escribe en el reverso...'}
                ></p>
            </article>
            <div className='buttonContainer'>
                <button className='flipCard' onClick={handleFlip}>
                    {isFront ? 'Flip to Back' : 'Flip to Front'}
                </button>
                <button 
                    className='saveCard' 
                    onClick={handleSave} 
                    disabled={isSaveDisabled}
                >
                    Save Card
                </button>
            </div>
            <section className='createdCards'></section>
        </main>
    );
}

Flashcard.propTypes = {
    flashcardDecks: PropTypes.object.isRequired,
    setFlashcardDecks: PropTypes.func.isRequired,
    userAnswer: PropTypes.string.isRequired,
};