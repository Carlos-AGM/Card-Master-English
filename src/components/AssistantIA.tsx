import { useState, useRef, useEffect } from 'react';
import {
  CreateWebWorkerMLCEngine,
  WebWorkerMLCEngine,
  ChatCompletionMessageParam,
  ChatCompletionContentPart,
  ChatCompletionUserMessageParam,
  ChatCompletionAssistantMessageParam
} from "@mlc-ai/web-llm";
import '../css/assistentIA.css';

export function AssistantIA() {
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<ChatCompletionMessageParam[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const engineRef = useRef<WebWorkerMLCEngine | null>(null);
  const initializedRef = useRef(false);
  const latestMessageRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const SELECTED_MODEL = 'gemma-2-2b-it-q4f16_1-MLC';

    const initializeEngine = async () => {
      if (initializedRef.current) return;

      const engine = await CreateWebWorkerMLCEngine(
        new Worker(new URL('../workers/worker.js', import.meta.url), { type: 'module' }),
        SELECTED_MODEL,
        {
          initProgressCallback: (info) => {
            if (infoRef.current) {
              infoRef.current.textContent = info.text;
            }
            if (info.progress === 1 && !initializedRef.current) {
              initializedRef.current = true;
              // Eliminar la información de carga cuando finalice
              if (loadingRef.current) {
                loadingRef.current.style.display = 'none';
              }
              if (infoRef.current) {
                infoRef.current.style.display = 'none';
              }
              if (buttonRef.current) {
                buttonRef.current.removeAttribute('disabled');
              }
              addMessage("¡Hola! Soy un ChatGPT que se ejecuta completamente en tu navegador. ¿En qué puedo ayudarte hoy?", 'assistant');
            }
          }
        }
      );

      engineRef.current = engine;
    };

    initializeEngine();
  }, []);

  const scrollToLatestMessage = () => {
    setTimeout(() => {
      if (latestMessageRef.current) {
        latestMessageRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 0);
  };

  const addMessage = (content: string | ChatCompletionContentPart[], role: 'user' | 'assistant', visible: boolean = true) => {
    const newMessage: ChatCompletionUserMessageParam | ChatCompletionAssistantMessageParam = {
      role,
      content: visible ? (typeof content === 'string' ? content : content.map(part => (part as any).text).join('')) : '',
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    scrollToLatestMessage(); // Desplaza la pantalla al último mensaje
    return newMessage;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedMessageText = messageText.trim();

    if (trimmedMessageText !== '') {
      setMessageText('');

      const userMessage: ChatCompletionUserMessageParam = { role: 'user', content: trimmedMessageText };
      addMessage(trimmedMessageText, 'user');

      if (buttonRef.current) {
        buttonRef.current.setAttribute('disabled', '');
      }

      try {
        if (!engineRef.current) {
          throw new Error("Engine is not initialized yet");
        }

        // Añade un mensaje vacío para la IA, pero sin mostrar el contenido inicialmente
        const botMessage = addMessage('', 'assistant', false);

        const chunks = await engineRef.current.chat.completions.create({
          messages: [...messages, userMessage],
          stream: true
        });

        let reply = '';

        for await (const chunk of chunks) {
          const content = chunk.choices[0]?.delta?.content;
          if (typeof content === 'string') {
            reply += content;

            // Actualiza el mensaje de la IA con el contenido recibido
            setMessages((prevMessages) =>
              prevMessages.map((msg, idx) =>
                idx === prevMessages.length - 1 ? { ...msg, content: reply } : msg
              )
            );
            scrollToLatestMessage(); // Desplaza la pantalla conforme se reciben chunks
          }
        }
      } catch (error) {
        console.error("Error processing chunks:", error);
      } finally {
        if (buttonRef.current) {
          buttonRef.current.removeAttribute('disabled');
        }
      }
    }
  };

  const renderContent = (content: string | ChatCompletionContentPart[] | null | undefined) => {
    if (typeof content === 'string' && content.trim() !== '') {
      return content;
    }
    return null;
  };

  return (
    <div className="x">
      <main className="mainContentAssistantIA" ref={containerRef}>
        <ul>
          {messages.map((msg, index) => (
            <li key={index} ref={index === messages.length - 1 ? latestMessageRef : null} className={`message ${msg.role === 'user' ? 'user' : 'assistant'}`}>
              <span>{msg.role === 'assistant' ? 'IA' : 'Tú'}</span>
              {/* El contenido del mensaje sólo se renderiza si no está vacío */}
              {renderContent(msg.content) && <p>{renderContent(msg.content)}</p>}
            </li>
          ))}
        </ul>
        <small ref={infoRef}></small>
        <div className="loading" ref={loadingRef}></div>
      </main>

      <form className="request" onSubmit={handleSubmit}>
        <input
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder="Pregúntame lo que necesites..."
        />
        <button type="submit" ref={buttonRef} disabled>
          Enviar
        </button>
      </form>
    </div>
  );
}