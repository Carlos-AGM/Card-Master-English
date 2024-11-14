import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import '../css/navBar.css';

export function NavBar() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsAuthenticated(!!user);
        });
        return () => unsubscribe();
    }, []);

    const handleLogOut = async () => {
        try {
            await signOut(auth);
            console.log('Usuario deslogueado');
            navigate('/'); 
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    return (
        <div className='navBar'>
            <Link to='/' className='navAnchor'>Card Master English</Link>
            <div className='authMenu'>
                {isAuthenticated ? (
                    <button onClick={handleLogOut} className='navLogOut'>Log Out</button>
                ) : (
                    <Link to='/LogIn' className='navLogIn'>Log In</Link>
                )}
                <Link
                    to='/SignIn'
                    className={`navSignIn ${isAuthenticated ? 'disabledLink' : ''}`}
                    onClick={(e) => isAuthenticated && e.preventDefault()}
                >
                    Sign In
                </Link>
            </div>
        </div>
    );
}