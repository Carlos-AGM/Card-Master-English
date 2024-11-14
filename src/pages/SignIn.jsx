import { NavBar } from '../components/NavBar';
import { ErrorModal } from '../components/ErrorModal';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db} from '../firebase/firebaseConfig'; // Importa el servicio de Firebase
import { doc, setDoc } from 'firebase/firestore';
import { FaEye, FaEyeSlash } from 'react-icons/fa';


import '../css/signIn.css'

export function SignIn () {
  const [name, setName] = useState(''); 
  const [studentID, setStudentID] = useState('');
  const [degree, setDegree] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
  
    // Validaciones básicas
    if (!email || !password || !name || !studentID || !degree) {
      setErrorMessage('Please, fill out all the fields');
      return;
    }

    if (studentID.length !== 9 || !/^\d{9}$/.test(studentID)) {
      setErrorMessage('Student ID must be exactly 9 digits');
      return;
    }
  
    if (password.length < 6) {
      setErrorMessage('Password must contain at least 6 characters');
      return;
    }
  
    // Validar que el correo termine con @alumnos.udg.mx
    const emailRegex = /^[a-zA-Z0-9._%+-]+@alumnos\.udg\.mx$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('The email must be of the form usuario@alumnos.udg.mx');
      return;
    }
  
    try {
      // Crear usuario con email y contraseña
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        name: name,
        studentID: studentID,
        degree: degree,
        email: email,
        createdAt: new Date(),
      });
      
      console.log('Usuario creado:', user);
      navigate('/workArea');
    } catch (error) {
      // Detecta si el correo ya está registrado
      if (error.code === 'auth/email-already-in-use') {
        setErrorMessage('El correo electrónico ya está registrado. Intenta con otro o inicia sesión.');
      } else {
        console.error('Error al crear la cuenta:', error);
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
      <NavBar/>
      <div className='mainContainerC'>
        <h2 className='mainText'>Create account</h2>
        <div className='formContainer'>
          <form className='form' onSubmit={handleSignUp}>
            <p>Name</p>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Type your full name..."
            />
            <p>Student ID</p>
            <input
              type="text" 
              value={studentID}
              maxLength={9}
              onKeyDown={(e) => {
                // Solo permitir números y teclas de control como Backspace, flechas, etc.
                if (!/[0-9]/.test(e.key) && 
                  e.key !== 'Backspace' && 
                  e.key !== 'ArrowLeft' && 
                  e.key !== 'ArrowRight' && 
                  e.key !== 'Delete' &&
                  e.key != 'Enter' &&
                  !e.ctrlKey 
                ) {
                  e.preventDefault();
                  setErrorMessage("Solamente se admiten números enteros.");
                }
              }}
              onChange={(e) => setStudentID(e.target.value)}
              placeholder="Type your student ID..."
            />
            <p>Degree</p>
            <input
              type="text"
              value={degree}
              onChange={(e) => setDegree(e.target.value)}
              placeholder="Type the degree you are studying..."
            />
            <p>Email</p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Type your email..."
            />
            <p>Password</p>
            <div className="passwordInputContainer">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password..."
              />
              <span onClick={togglePasswordVisibility} className="togglePasswordIcon">
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <div className='createButtonContainer'>
              <button className='createAccount' type="submit">Create Account</button>
            </div>
          </form>
        </div>
      </div>
      {/* Renderiza el ErrorModal solo si errorMessage tiene un valor */}
      {errorMessage && <ErrorModal message={errorMessage} onClose={closeErrorModal} />}
    </>
  );
}