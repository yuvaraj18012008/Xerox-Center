import { createContext, useState, useContext, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail, 
  onAuthStateChanged,
  updatePassword,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { authService } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

/**
 * Helper: Build a fallback user object from a Firebase user
 * when the backend is unreachable (e.g. GitHub Pages deployment).
 */
const buildFirebaseFallbackUser = (firebaseUser) => {
  const nameParts = (firebaseUser.displayName || '').split(' ');
  return {
    id: firebaseUser.uid,
    firstName: nameParts[0] || firebaseUser.email?.split('@')[0] || 'User',
    lastName: nameParts.slice(1).join(' ') || 'User',
    email: firebaseUser.email,
    phone: firebaseUser.phoneNumber || '',
    role: 'customer',
    isVerified: firebaseUser.emailVerified
  };
};

/**
 * Helper: Try to sync with the backend. Returns { token, user } on success,
 * or null if the backend is unreachable.
 */
const tryBackendSync = async (syncPayload) => {
  try {
    const response = await authService.firebaseSync(syncPayload);
    if (response.data.success) {
      return response.data.data; // { token, user }
    }
  } catch (error) {
    // 405 = GitHub Pages, ERR_NETWORK = backend offline, 500 = server error
    console.warn('Backend sync unavailable, using Firebase-only mode:', error.message);
  }
  return null;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /**
   * Sets the authenticated state from either backend data or Firebase fallback.
   */
  const setAuthState = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    setIsAuthenticated(true);
    if (jwtToken) localStorage.setItem('token', jwtToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const clearAuthState = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // Sync auth state with backend after Firebase state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const idToken = await firebaseUser.getIdToken();
          
          // Try backend sync
          const backendData = await tryBackendSync({
            token: idToken,
            email: firebaseUser.email,
            uid: firebaseUser.uid
          });

          if (backendData) {
            setAuthState(backendData.user, backendData.token);
          } else {
            // Fallback: use saved data or Firebase user directly
            const savedToken = localStorage.getItem('token');
            const savedUser = localStorage.getItem('user');
            if (savedToken && savedUser) {
              setAuthState(JSON.parse(savedUser), savedToken);
            } else {
              // Use Firebase user data as fallback
              const fallbackUser = buildFirebaseFallbackUser(firebaseUser);
              setAuthState(fallbackUser, idToken);
            }
          }
        } catch (error) {
          console.error("Auth state sync error:", error);
          // Last resort fallback
          const fallbackUser = buildFirebaseFallbackUser(firebaseUser);
          setAuthState(fallbackUser, null);
        }
      } else {
        clearAuthState();
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Register function
  const register = async (userData) => {
    try {
      setLoading(true);
      const { email, password, firstName, lastName, phone } = userData;

      // 1. Register with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      const idToken = await firebaseUser.getIdToken();

      // 2. Try to sync with backend (optional - may not be available)
      const backendData = await tryBackendSync({
        token: idToken,
        uid: firebaseUser.uid,
        email,
        firstName,
        lastName,
        phone,
        isRegistering: true
      });

      if (backendData) {
        setAuthState(backendData.user, backendData.token);
      } else {
        // Fallback to Firebase user data
        const fallbackUser = {
          id: firebaseUser.uid,
          firstName: firstName || email.split('@')[0],
          lastName: lastName || 'User',
          email,
          phone: phone || '',
          role: 'customer',
          isVerified: firebaseUser.emailVerified
        };
        setAuthState(fallbackUser, idToken);
      }

      toast.success('Registration successful!');
      return { success: true };
    } catch (error) {
      let message = 'Registration failed';
      if (error.code === 'auth/email-already-in-use') {
        message = 'This email is already registered';
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.message) {
        message = error.message;
      }
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      setLoading(true);
      
      // 1. Authenticate with Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      const idToken = await firebaseUser.getIdToken();

      // 2. Try to sync with backend (optional - may not be available)
      const backendData = await tryBackendSync({
        token: idToken,
        uid: firebaseUser.uid,
        email: firebaseUser.email
      });

      if (backendData) {
        setAuthState(backendData.user, backendData.token);
      } else {
        // Fallback to Firebase user data
        const fallbackUser = buildFirebaseFallbackUser(firebaseUser);
        setAuthState(fallbackUser, idToken);
      }

      toast.success('Login successful!');
      return { success: true };
    } catch (error) {
      let message = 'Login failed';
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        message = 'Invalid email or password';
      } else if (error.code === 'auth/too-many-requests') {
        message = 'Too many failed attempts. Please try again later.';
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.code === 'ERR_NETWORK') {
        message = 'Cannot connect to the server. Please check if the backend is running.';
      } else if (error.message) {
        message = error.message;
      }
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Google Login function
  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const userCredential = await signInWithPopup(auth, provider);
      const firebaseUser = userCredential.user;
      const idToken = await firebaseUser.getIdToken();

      // Extract name parts
      let firstName = '';
      let lastName = '';
      if (firebaseUser.displayName) {
        const parts = firebaseUser.displayName.split(' ');
        firstName = parts[0];
        lastName = parts.slice(1).join(' ') || 'User';
      } else {
        firstName = firebaseUser.email.split('@')[0];
        lastName = 'User';
      }

      // Try to sync with backend (optional)
      const backendData = await tryBackendSync({
        token: idToken,
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        firstName,
        lastName,
        phone: firebaseUser.phoneNumber || '9876543210',
        isRegistering: true
      });

      if (backendData) {
        setAuthState(backendData.user, backendData.token);
      } else {
        // Fallback to Firebase user data
        const fallbackUser = {
          id: firebaseUser.uid,
          firstName,
          lastName,
          email: firebaseUser.email,
          phone: firebaseUser.phoneNumber || '',
          role: 'customer',
          isVerified: firebaseUser.emailVerified
        };
        setAuthState(fallbackUser, idToken);
      }

      toast.success('Logged in with Google successfully!');
      return { success: true };
    } catch (error) {
      console.error('Google login error:', error);
      let message = 'Google sign-in failed';
      if (error.code === 'auth/popup-closed-by-user') {
        message = 'Login popup was closed before completing';
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.message) {
        message = error.message;
      }
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setLoading(true);
      await signOut(auth);
      clearAuthState();
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed');
    } finally {
      setLoading(false);
    }
  };

  // Forgot password
  const forgotPassword = async (email) => {
    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset link sent to your email');
    } catch (error) {
      let message = 'Error sending reset link';
      if (error.code === 'auth/user-not-found') {
        message = 'No user found with this email';
      } else if (error.message) {
        message = error.message;
      }
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (token, password, confirmPassword) => {
    // Note: Firebase handles reset password via its standard email action link flow.
    // However, to keep compatibility with any mock UI reset page, we provide a placeholder.
    toast.error('Please use the link sent to your email to reset your password.');
  };

  // Change password
  const changePassword = async (currentPassword, newPassword, confirmPassword) => {
    try {
      setLoading(true);
      if (newPassword !== confirmPassword) {
        throw new Error("New passwords do not match");
      }
      
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error("No user is currently logged in");
      }

      await updatePassword(currentUser, newPassword);
      toast.success('Password changed successfully');
    } catch (error) {
      toast.error(error.message || 'Error changing password');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    register,
    login,
    loginWithGoogle,
    logout,
    forgotPassword,
    resetPassword,
    changePassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
