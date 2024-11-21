import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
const firebaseConfig = {
    apiKey: "AIzaSyBYIX7-da0oyfwuK2UQ-JmQGgmy6ylp6fs",
    authDomain: "card-master-english.firebaseapp.com",
    projectId: "card-master-english",
    storageBucket: "card-master-english.appspot.com",
    messagingSenderId: "109407570408",
    appId: "1:109407570408:web:831fd3b618da506ddbbc5d"
};
// Inicializa Firebase
const app = initializeApp(firebaseConfig);
// Inicializar y exportar los servicios que necesitas (por ejemplo, Auth)
export const auth = getAuth(app);
export const db = getFirestore(app);