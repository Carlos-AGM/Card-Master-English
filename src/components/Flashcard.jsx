import { useEffect, useRef } from 'react';
import '../css/flashcard.css'

export function Flashcard () {
    const flashcardTextAreaRef = useRef(null);

    useEffect(() => {
        const element = flashcardTextAreaRef.current;
        if (element && element.innerText.trim() === '') {
            element.innerHTML = '&nbsp;';
        }
    }, []);

    const handleInput = () => {
        const element = flashcardTextAreaRef.current;
        if (element.innerText.trim() === '') {
            element.innerHTML = '&nbsp;';
            setTimeout(() => {
                const range = document.createRange();
                const sel = window.getSelection();
                range.setStart(element.childNodes[0], 0);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
            }, 0);
        }
    };

    return (
        <main className='flashcardSection'>
            <article className='flashcard'>
                <header className='title'>
                    <h2>Title</h2>
                </header>
                <p
                    className='flashcardTextArea'
                    contentEditable="true"
                    onInput={handleInput}
                    ref={flashcardTextAreaRef}
                ></p>
            </article>
            <div className='flipCard'></div>
            <div className='saveCard'></div>
            <section className='createdCards'></section>
        </main>
    )
}