import { Link } from 'react-router-dom'
import './css/navBar.css'
import './css/app.css'

export function HomePage () {
    return (
        <div className={'app'}>
            <div className={'navBar'}>
                <Link to='#' className='navAnchor'>Card Master English</Link>
                <Link to='/LogIn' className='navLogIn navAnchor'>Log In</Link>
            </div>
            <div>
                <h3>
                    {/* Hola */ }
                </h3>
            </div>
        </div>
    )
}