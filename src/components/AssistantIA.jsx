import { useState, useRef, useEffect } from 'react';
import { CreateWebWorkerMLCEngine } from "https://cdn.jsdelivr.net/npm/@mlc-ai/web-llm@0.2.46/+esm";
import '../css/assistentIA.css';

const workerUrl = new URL('../workers/worker.js', import.meta.url);

export function AssistantIA() {
    const [messageText, setMessageText] = useState('');
    const [messages, setMessages] = useState([]);
    const containerRef = useRef(null);
    const infoRef = useRef(null);
    const loadingRef = useRef(null);
    const buttonRef = useRef(null);
    const engineRef = useRef(null);

    useEffect(() => {
        const SELECTED_MODEL = 'Phi-3-mini-4k-instruct-q4f16_1-MLC';

        const initializeEngine = async () => {
            const engine = await CreateWebWorkerMLCEngine(
                new Worker(workerUrl, { type: 'module' }),
                SELECTED_MODEL,
                {
                    initProgressCallback: (info) => {
                        if (infoRef.current) {
                            infoRef.current.textContent = info.text;
                        }
                        if (info.progress === 1) {
                            if (loadingRef.current) {
                                loadingRef.current.style.display = 'none';
                            }
                            if (buttonRef.current) {
                                buttonRef.current.removeAttribute('disabled');
                            }
                            addMessage("¡Hola! Soy un ChatGPT que se ejecuta completamente en tu navegador. ¿En qué puedo ayudarte hoy?", 'bot');
                            setMessageText('');
                        }
                    }
                }
            );

            engineRef.current = engine;
        };

        initializeEngine();

        return () => {
            // Cleanup if necessary
        };
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const trimmedMessageText = messageText.trim();

        if (trimmedMessageText !== '') {
            setMessageText('');
            addMessage(trimmedMessageText, 'user');
            if (buttonRef.current) {
                buttonRef.current.setAttribute('disabled', '');
            }

            const userMessage = {
                role: 'user',
                content: trimmedMessageText
            };

            const updatedMessages = [...messages, userMessage];
            setMessages(updatedMessages);

            if (!engineRef.current) {
                console.error("Engine is not initialized yet");
                return;
            }

            const chunks = await engineRef.current.chat.completions.create({
                messages: updatedMessages,
                stream: true
            });

            let reply = '';
            const $botMessage = addMessage('', 'bot');

            for await (const chunk of chunks) {
                const choice = chunk.choices[0];
                const content = choice?.delta?.content ?? '';
                reply += content;
                $botMessage.textContent = reply;
            }

            if (buttonRef.current) {
                buttonRef.current.removeAttribute('disabled');
            }

            setMessages([...updatedMessages, { role: 'assistant', content: reply }]);

            if (containerRef.current) {
                containerRef.current.scrollTop = containerRef.current.scrollHeight;
            }
        }
    };

    function addMessage(text, sender) {
        setMessages((prevMessages) => [
            ...prevMessages,
            { text, sender }
        ]);

        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }

        return { textContent: '' }; // Para poder actualizar el contenido durante la generación
    }

    return (
        <div className='x'>
            <main className='mainContentAssistantIA' ref={containerRef}>
                <ul>
                    {messages.map((msg, index) => (
                        <li key={index} className={`message ${msg.sender}`}>
                            <span>{msg.sender === 'bot' ? 'IA' : 'Tú'}</span>
                            <p>{msg.text}</p>
                        </li>
                    ))}
                </ul>
                <small ref={infoRef}></small>
                <div className="loading" ref={loadingRef}></div>
            </main>

            <form className='request' onSubmit={handleSubmit}>
                <input
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder='Pregúntame lo que necesites...'
                />
                <button type="submit" ref={buttonRef}>Enviar</button>
            </form>
        </div>
    );
}