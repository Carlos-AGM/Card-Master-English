import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from '../firebase/firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { NavBar } from '../components/NavBar';

import '../css/logIn.css'

export function LogIn () {
    const [studentID, setStudentID] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleLogIn = async (e) => {

        e.preventDefault();
    
        if (!studentID || !password) {
            alert('Por favor, llena todos los campos');
            return;
        }
    
        try {
        // Buscar el correo electrónico asociado al studentID en Firestore
            const usersRef = collection(db, 'users');
            const q = query(usersRef, where('studentCode', '==', studentID));
            const querySnapshot = await getDocs(q);
    
            if (querySnapshot.empty) {
                alert('El Student ID no está registrado');
                return;
            }
        
            // Obtener el correo electrónico del primer documento que coincida con el Student ID
            const userDoc = querySnapshot.docs[0];
            const userEmail = userDoc.data().email;
        
            // Iniciar sesión con el correo electrónico obtenido y la contraseña
            const userCredential = await signInWithEmailAndPassword(auth, userEmail, password);
            console.log('Usuario autenticado:', userCredential.user);
            navigate('/workArea');
        
            // Aquí puedes redirigir al usuario a otra página o mostrar un mensaje de éxito
            } catch (error) {
            if (error.code === 'auth/wrong-password') {
                alert('La contraseña es incorrecta');
            } else if (error.code === 'auth/user-not-found') {
                alert('No se encontró el usuario');
            } else {
                console.error('Error al iniciar sesión:', error);
            }
        }
    };

    return (
        <>
        <NavBar/>
        <div className='mainContainerL'>
            <h2 className='mainTextL'>Verify your account</h2>
            <div className='formContainer'>
                <form className='form' onSubmit={handleLogIn}>
                    <p>Student ID</p>
                    <input
                    type="text"
                    value={studentID}
                    onChange={(e) => setStudentID(e.target.value)}
                    placeholder="Type your student ID..."
                    />
                    <p>Password</p>
                    <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Type your password..."
                    />
                    <div className='ButtonContainerL'>
                        <button className='verifyAccount' type="submit">Verify Account</button>
                    </div>
                </form>
            </div>
        </div>
        </>
    );
}