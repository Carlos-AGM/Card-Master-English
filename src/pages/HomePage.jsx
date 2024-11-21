import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import { NavBar } from '../components/NavBar';
import '../css/homePage.css';
import '../css/navBar.css';

export function HomePage() {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Verifica el estado de autenticación al cargar la página
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsAuthenticated(!!user); // Si hay usuario, está autenticado
        });
        return () => unsubscribe();
    }, []);

    // Funciones para manejar la navegación a los mazos A1 y A2
    const handleNavigateToPredefinedDecks = (level) => {
        navigate('/reviewPredefinedDecks', { state: { level } }); // Enviar el nivel seleccionado (A1 o A2)
    };

    return (
        <div className={'app'}>
            <aside className='sideBarInfo'>
                <h2 className='asideTitle'>Predefined Decks</h2>
                <div className='predefinedDeckCard' onClick={() => handleNavigateToPredefinedDecks('A1')}>
                    <p>A1</p>
                </div>
                <div className='predefinedDeckCard' onClick={() => handleNavigateToPredefinedDecks('A2')}>
                    <p>A2</p>
                </div>
            </aside>
            <NavBar />
            <main className='mainContent'>
                <section className='imageContainer'>
                    <img className='homePageImage' src={'https://i.postimg.cc/vBQT8MvD/homepage.webp'} alt='A man thinking about what is the best teaching resource to study English.' loading='lazy' />
                    <div className='imageTextQuestion'>
                        <p> Which is one of the best tools to learn vocabulary in English?</p>
                    </div>
                    <div className='imageTextAnswer'>
                        <p>- Clearly, Card Master English!</p>
                    </div>
                    <Link
                        to={isAuthenticated ? '/workArea' : '/SignIn'}
                        className='imageTextButton'
                    >
                        {isAuthenticated ? 'Go to Work Area' : 'Start Now!'}
                    </Link>
                </section>
            </main>
        </div>
    );
}