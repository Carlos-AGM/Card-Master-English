import { NavBar } from '../components/NavBar';
import { ErrorModal } from '../components/ErrorModal';
import { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

import '../css/logIn.css';

export function LogIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    // Verificar si el usuario ya está autenticado al cargar el componente
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log('Usuario ya autenticado en useEffect:', user.uid);
                navigate('/workArea'); // Redirigir al área de trabajo si el usuario ya está autenticado
            } else {
                console.log('No hay usuario autenticado en useEffect.');
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    const handleLogIn = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setErrorMessage('Por favor, llena todos los campos');
            console.log('Error: campos vacíos');
            return;
        }

        try {
            console.log('Intentando iniciar sesión con:', email);

            // Iniciar sesión con el correo electrónico y la contraseña proporcionados
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log('Usuario autenticado en signInWithEmailAndPassword:', user.uid);

            // Verificar el documento del usuario en Firestore
            const userDocRef = doc(db, 'users', user.uid);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
                console.log('Documento de usuario encontrado en Firestore:', userDocSnap.data());
                navigate('/workArea'); // Redirigir después de autenticación exitosa
            } else {
                console.log('No existe un documento para este usuario en Firestore.');
                setErrorMessage('No se encontró el usuario en Firestore.');
            }

        } catch (error) {
            console.log('Código de error:', error.code);

            if (error.code === 'auth/invalid-credential') {
                setErrorMessage('Invalid email or password.');
            } else {
                setErrorMessage('Error al iniciar sesión:', error);
            }
        }
    };
    // Maneja la visibilidad de la contraseña
    const togglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    // Función para cerrar el ErrorModal
    const closeErrorModal = () => {
        setErrorMessage('');
    };

    return (
        <>
            <NavBar />
            <div className='mainContainerL'>
                <div className='headerContainerL' >
                    <h2>Verify your account</h2>
                </div>
                <div className='formContainerLogIn'>
                    <form className='form' onSubmit={handleLogIn}>
                        <p>Email</p>
                        <input
                            className='inputEmail'
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Type your email..."
                        />
                        <p>Password</p>
                        <div className="passwordInputContainer">
                        <input
                            className='inputPassword'
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Create a password..."
                        />
                        <span onClick={togglePasswordVisibility} className="togglePasswordIcon">
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                        </div>
                        <div className='ButtonContainerL'>
                            <button className='verifyAccount' type="submit">Verify Account</button>
                        </div>
                    </form>
                </div>
                <Link to='/SignIn' className='unsubscribedPeople'>
                    Aren&apos;t you subscribed? Subscribe to Card Master English Here!
                </Link>
            </div>
            {/* Renderiza el ErrorModal solo si errorMessage tiene un valor */}
            {errorMessage && <ErrorModal message={errorMessage} onClose={closeErrorModal} />}
        </>
    );
}