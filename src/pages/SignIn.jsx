import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db} from '../firebase/firebaseConfig'; // Importa el servicio de Firebase
import { doc, setDoc } from 'firebase/firestore';
import { NavBar } from '../components/NavBar';
import { useNavigate } from 'react-router-dom';

import '../css/signIn.css'

export function SignIn () {
  const [name, setName] = useState(''); 
  const [studentID, setStudentID] = useState('');
  const [degree, setDegree] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
  
    // Validaciones básicas
    if (!email || !password || !name || !studentID || !degree) {
      alert('Por favor, llena todos los campos');
      return;
    }
  
    if (password.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres');
      return;
    }
  
    // Validar que el correo termine con @alumnos.udg.mx
    const emailRegex = /^[a-zA-Z0-9._%+-]+@alumnos\.udg\.mx$/;
    if (!emailRegex.test(email)) {
      alert('El correo debe ser de la forma usuario@alumnos.udg.mx');
      return;
    }
  
    try {
      // Crear usuario con email y contraseña
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      //SI NO FUNCIONA BORRA TODO ESTE AWAIT
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
        alert('El correo electrónico ya está registrado. Intenta con otro o inicia sesión.');
      } else {
        console.error('Error al crear la cuenta:', error);
      }
    }
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
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password..."
            />
            <div className='createButtonContainer'>
              <button className='createAccount' type="submit">Create Account</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}