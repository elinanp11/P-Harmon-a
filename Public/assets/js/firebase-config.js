// Firebase Configuration for P-Harmonia
// Configuración para GitHub Pages

// Importar las funciones necesarias de Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js';
import { 
  getAuth, 
  onAuthStateChanged, 
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-storage.js';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC1lVQ4K4F7X9X9X9X9X9X9X9X9X9X",
  authDomain: "p-harmonia.firebaseapp.com",
  projectId: "p-harmonia",
  storageBucket: "p-harmonia.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:1234567890abcdef12345"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar servicios de Firebase
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Exportar las instancias
export { 
  app, 
  auth, 
  db, 
  storage, 
  onAuthStateChanged, 
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
};

// Log para confirmar inicialización
console.log('🔥 Firebase inicializado correctamente para P-Harmonia');