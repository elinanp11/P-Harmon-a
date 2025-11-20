// Auth Service for P-Harmonia
// Handles user authentication and session management

import { 
  auth, 
  onAuthStateChanged, 
  signOut as firebaseSignOut,
  signInWithEmailAndPassword as firebaseSignIn,
  createUserWithEmailAndPassword as firebaseSignUp
} from './firebase-config.js';

class AuthService {
  constructor() {
    this.user = null;
    this.authStateChangedCallbacks = [];
    
    // Listen for auth state changes
    onAuthStateChanged(auth, (user) => {
      this.user = user;
      this.notifyAuthStateChanged();
      
      // Update UI based on auth state
      this.updateAuthUI();
    });
  }
  
  // Register a callback for auth state changes
  onAuthStateChanged(callback) {
    this.authStateChangedCallbacks.push(callback);
    // Call immediately with current user
    if (this.user) {
      callback(this.user);
    }
    
    // Return unsubscribe function
    return () => {
      this.authStateChangedCallbacks = this.authStateChangedCallbacks.filter(cb => cb !== callback);
    };
  }
  
  // Notify all registered callbacks of auth state change
  notifyAuthStateChanged() {
    this.authStateChangedCallbacks.forEach(callback => callback(this.user));
  }
  
  // Sign in with email and password
  async signIn(email, password) {
    try {
      const userCredential = await firebaseSignIn(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error) {
      console.error('Error signing in:', error);
      return { success: false, error: this.getAuthErrorMessage(error.code) };
    }
  }
  
  // Sign up with email and password
  async signUp(email, password, userData = {}) {
    try {
      const userCredential = await firebaseSignUp(auth, email, password);
      
      // Here you would typically save additional user data to Firestore
      // await saveUserData(userCredential.user.uid, userData);
      
      return { success: true, user: userCredential.user };
    } catch (error) {
      console.error('Error signing up:', error);
      return { success: false, error: this.getAuthErrorMessage(error.code) };
    }
  }
  
  // Sign out
  async signOut() {
    try {
      await firebaseSignOut(auth);
      return { success: true };
    } catch (error) {
      console.error('Error signing out:', error);
      return { success: false, error: 'Error al cerrar sesión' };
    }
  }
  
  // Get current user
  getCurrentUser() {
    return this.user;
  }
  
  // Check if user is authenticated
  isAuthenticated() {
    return this.user !== null;
  }
  
  // Update UI based on authentication state
  updateAuthUI() {
    const user = this.user;
    const userMenu = document.querySelector('.user-menu');
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const userDropdown = document.querySelector('.user-dropdown');
    const userNameElement = document.querySelector('.user-name');
    
    if (user) {
      // User is signed in
      if (userMenu) userMenu.style.display = 'block';
      if (loginBtn) loginBtn.style.display = 'none';
      if (registerBtn) registerBtn.style.display = 'none';
      
      // Update user name in dropdown
      if (userNameElement) {
        userNameElement.textContent = user.displayName || user.email || 'Usuario';
      }
      
      // Store user data in localStorage for persistence
      localStorage.setItem('userLoggedIn', 'true');
      localStorage.setItem('userName', user.displayName || user.email || 'Usuario');
      
    } else {
      // User is signed out
      if (userMenu) userMenu.style.display = 'none';
      if (loginBtn) loginBtn.style.display = 'inline-block';
      if (registerBtn) registerBtn.style.display = 'inline-block';
      
      // Clear user data from localStorage
      localStorage.removeItem('userLoggedIn');
      localStorage.removeItem('userName');
    }
  }
  
  // Helper to get user-friendly error messages
  getAuthErrorMessage(errorCode) {
    const messages = {
      'auth/email-already-in-use': 'El correo electrónico ya está en uso',
      'auth/invalid-email': 'El correo electrónico no es válido',
      'auth/operation-not-allowed': 'Operación no permitida',
      'auth/weak-password': 'La contraseña es demasiado débil',
      'auth/user-disabled': 'La cuenta ha sido deshabilitada',
      'auth/user-not-found': 'No se encontró una cuenta con este correo',
      'auth/wrong-password': 'Contraseña incorrecta',
      'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde.',
      'default': 'Ocurrió un error. Por favor, inténtalo de nuevo.'
    };
    
    return messages[errorCode] || messages['default'];
  }
}

// Create and export a singleton instance
export const authService = new AuthService();

// Initialize auth UI when DOM is loaded
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    authService.updateAuthUI();
    
    // Add event listeners for logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        const result = await authService.signOut();
        if (result.success) {
          // Redirect to home page after logout
          window.location.href = '/P-Harmon-a/Public/home.html';
        } else {
          alert(result.error || 'Error al cerrar sesión');
        }
      });
    }
  });
}

// Export the auth service by default for easier imports
export default authService;
