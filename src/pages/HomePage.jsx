import { Link } from 'react-router-dom'
import { NavBar } from '../components/NavBar';
import homePageImage from '../assets/images/homepage.webp';
import '../css/homePage.css'
import '../css/navBar.css'

export function HomePage () {
    return (
        <div className={'app'}>
            <aside className='sideBarInfo'>
                <p>hola</p>
            </aside>
            <NavBar/>
            <main className='mainContent'>
                <section className='imageContainer'>
                    <img className='homePageImage' src={homePageImage} alt='A men thinking about what is the best teaching resource to study english. Photo by Icons8 Team on Unsplash' loading='lazy'/>
                    <div className='imageTextQuestion'>
                        <p> Which is one of the best tools to learn vocabulary?</p>
                    </div>
                    <div className='imageTextAnswer'>
                        <p>- Clearly, Card Master English!</p>
                    </div>
                    <Link to='/SignIn' className='imageTextButton'>Start Now!</Link>
                </section>
            </main>
        </div>
    )
} 