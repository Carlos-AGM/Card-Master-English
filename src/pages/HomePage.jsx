import { Link, useNavigate } from 'react-router-dom';
import { NavBar } from '../components/NavBar';
import homePageImage from '../assets/images/homepage.webp';
import '../css/homePage.css';
import '../css/navBar.css';

export function HomePage() {
    const navigate = useNavigate();

    // Funciones para manejar la navegación a los mazos A1 y A2
    const handleNavigateToPredefinedDecks = (level) => {
        navigate(`/reviewPredefinedDecks`, { state: { level } }); // Enviar el nivel seleccionado (A1 o A2)
    };

    return (
        <div className={'app'}>
            <aside className='sideBarInfo'>
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
                    <img className='homePageImage' src={homePageImage} alt='A man thinking about what is the best teaching resource to study English.' loading='lazy' />
                    <div className='imageTextQuestion'>
                        <p> Which is one of the best tools to learn vocabulary?</p>
                    </div>
                    <div className='imageTextAnswer'>
                        <p>- Clearly, Card Master English!</p>
                    </div>
                    <Link to='/workArea' className='imageTextButton'>Start Now!</Link>
                </section>
            </main>
        </div>
    );
}