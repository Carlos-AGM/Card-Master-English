import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import '../css/flashcard.css';

export function Flashcard({ setFlashcardDecks, userAnswer, handleCreateNewDeck }) {
  const [isFront, setIsFront] = useState(true);
  const [frontText, setFrontText] = useState('');
  const [backText, setBackText] = useState('');
  const [currentCardIndex, setCurrentCardIndex] = useState(null);
  const [showPopover, setShowPopover] = useState(false);
  const cardTextRef = useRef(null);
  const navigate = useNavigate()

  useEffect(() => {
    const element = cardTextRef.current;
    if (element && element.innerText.trim() === '') {
      element.innerHTML = '&nbsp;';
    }

    if (element) {
      element.focus();
    }
  }, [isFront]);

  useEffect(() => {
    if (showPopover) {
      // Aquí puedes añadir cualquier logica adicional que dependa de showPopover
    }
  }, [showPopover]);

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
        if (currentCardIndex === null) {
          updatedDeck.push({ front: frontText, back: '' });
          setCurrentCardIndex(updatedDeck.length - 1);
        } else {
          updatedDeck[currentCardIndex].front = frontText;
        }
        console.log('Flashcard Front Saved:', frontText);
      } else {
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
        deck[currentCardIndex] = { front: frontText, back: backText };
      } else {
        const newCard = { front: frontText, back: backText };
        deck.push(newCard);
        setCurrentCardIndex(deck.length - 1);
        console.log('New Card Added:', newCard);
      }
  
      const updatedDecks = { ...prevDecks, [userAnswer]: deck };
      console.log('Updated Deck after Save:', updatedDecks);
      return updatedDecks;
    });
  
    setFrontText('');
    setBackText('');
    cardTextRef.current.innerText = '';
    setShowPopover(true); // Mostrar el popover al guardar la tarjeta
  };
  
  const handlePopoverButtonClick = (action) => {
    if (action === 'reviewCards') {
        setFlashcardDecks(prevDecks => {
            console.log('Navigating to review cards with decks:', prevDecks);
            navigate('/reviewCards', { state: { flashcardDecks: prevDecks } });
            return prevDecks;
        });
    } else if (action === 'createCard') {
        setFlashcardDecks(prevDecks => {
            const deck = prevDecks[userAnswer] || [];
            const newCard = { front: '', back: '' };
  
            const updatedDeck = [...deck, newCard];
            console.log('New Flashcard Created:', newCard);
            console.log('Updated Deck:', updatedDeck);
  
            const updatedDecks = { ...prevDecks, [userAnswer]: updatedDeck };
            console.log('Updated Decks after Create Card:', updatedDecks);
            setCurrentCardIndex(updatedDeck.length - 1); // Apuntar al índice de la nueva tarjeta
            return updatedDecks;
        });
  
        // Restablecer el estado de la tarjeta
        setFrontText('');  // Limpiar el texto del frente
        setBackText('');   // Limpiar el texto de la parte trasera
        cardTextRef.current.innerText = ''; // Limpiar el contenido del área de texto
        setIsFront(true);  // Restablecer el estado a "Flip to Front"
    } else if (action === 'createDeck') {
        handleCreateNewDeck(); // Llama a la función en WorkArea para manejar la creación de un nuevo deck
    }

    setShowPopover(false); // Ocultar el popover después de seleccionar una acción
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

      {showPopover && (
        <div className='popover'>
          <p className='popoverCombinedText'>
            <span className='popoverText'>Card created. </span>
            <span className='popoverTitle'>What would you like to do next?</span>
          </p>  
          <button 
            className='popoverButton' 
            onClick={() => handlePopoverButtonClick('createCard')}
          >
            Create a new flashcard
          </button>
          <button 
            className='popoverButton' 
            onClick={() => handlePopoverButtonClick('createDeck')}
          >
            Create a new deck
          </button>
          <button 
            className='popoverButton' 
            onClick={() => handlePopoverButtonClick('reviewCards')}
          >
            Review Cards
          </button>
        </div>
      )}
    </main>
  );
}

Flashcard.propTypes = {
  setFlashcardDecks: PropTypes.func.isRequired,
  userAnswer: PropTypes.string.isRequired,
  handleCreateNewDeck: PropTypes.func.isRequired, // Añadido PropTypes para la nueva prop
};
