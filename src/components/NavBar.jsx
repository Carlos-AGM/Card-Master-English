import { Link } from 'react-router-dom'

export function NavBar () {
    return (
        <div className={'navBar'}>
            <Link to='/' className='navAnchor'>Card Master English</Link>
            <div className='authMenu'>
                <Link to='/LogIn' className='navLogIn'>Log In</Link>
                <Link to='/SignIn' className='navSignIn'>Sign In</Link>
            </div>
        </div>
    )
}