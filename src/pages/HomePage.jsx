import { Link } from 'react-router-dom'
import homePageImage from '../assets/images/homepage.webp';
import '../css/homePage.css'

export function HomePage () {
    return (
        <div className={'app'}>
            <aside className='sideBarInfo'>
                <p>hola</p>
            </aside>
            <div className={'navBar'}> {/*quitar navBar*/}
                <Link to='#' className='navAnchor'>Card Master English</Link>
                <div className='authMenu'>
                    <Link to='/LogIn' className='navLogIn'>Log In</Link>
                    <Link to='/SignIn' className='navSignIn'>Sign In</Link>
                </div>
            </div>
            <main className='mainContent'>
                <section className='imageContainer'>
                    <img className='homePageImage' src={homePageImage} alt='A men thinking about what is the best teaching resource to study english. Photo by Icons8 Team on Unsplash' loading='lazy'/>
                    <div className='imageTextQuestion'>
                        <p> Which is one of the best tools to learn vocabulary?</p>
                    </div>
                    <div className='imageTextAnswer'>
                        <p>- Clearly, Card Master English!</p>
                    </div>
                </section>
            </main>
        </div>
    )
} 