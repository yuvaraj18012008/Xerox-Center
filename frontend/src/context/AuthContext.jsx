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

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Sync auth state with backend after Firebase state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Fetch the Firebase ID Token
          const idToken = await firebaseUser.getIdToken();
          
          // Exchange/Sync with Backend MongoDB
          const response = await authService.firebaseSync({
            token: idToken,
            email: firebaseUser.email,
            uid: firebaseUser.uid
          });

          if (response.data.success) {
            const { token: jwtToken, user: dbUser } = response.data.data;
            setToken(jwtToken);
            setUser(dbUser);
            setIsAuthenticated(true);
            localStorage.setItem('token', jwtToken);
            localStorage.setItem('user', JSON.stringify(dbUser));
          }
        } catch (error) {
          console.error("Backend sync failed after Firebase auth change:", error);
          // If backend sync fails (e.g. backend offline or not seeded), fallback to local token/user if exists
          const savedToken = localStorage.getItem('token');
          const savedUser = localStorage.getItem('user');
          if (savedToken && savedUser) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
            setIsAuthenticated(true);
          } else {
            // Otherwise force logout
            await signOut(auth);
            setUser(null);
            setToken(null);
            setIsAuthenticated(false);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        }
      } else {
        setUser(null);
        setToken(null);
        setIsAuthenticated(false);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
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

      // 2. Synchronize details with the backend database
      const response = await authService.firebaseSync({
        token: idToken,
        uid: firebaseUser.uid,
        email,
        firstName,
        lastName,
        phone,
        isRegistering: true
      });

      if (response.data.success) {
        const { token: jwtToken, user: dbUser } = response.data.data;
        setToken(jwtToken);
        setUser(dbUser);
        setIsAuthenticated(true);

        localStorage.setItem('token', jwtToken);
        localStorage.setItem('user', JSON.stringify(dbUser));

        toast.success('Registration successful!');
        return response.data;
      }
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

      // 2. Exchange for backend JWT and load user data from MongoDB
      const response = await authService.firebaseSync({
        token: idToken,
        uid: firebaseUser.uid,
        email: firebaseUser.email
      });

      if (response.data.success) {
        const { token: jwtToken, user: dbUser } = response.data.data;
        setToken(jwtToken);
        setUser(dbUser);
        setIsAuthenticated(true);

        localStorage.setItem('token', jwtToken);
        localStorage.setItem('user', JSON.stringify(dbUser));

        toast.success('Login successful!');
        return response.data;
      }
    } catch (error) {
      let message = 'Login failed';
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        message = 'Invalid email or password';
      } else if (error.code === 'auth/too-many-requests') {
        message = 'Too many failed attempts. Please try again later.';
      } else if (error.response?.status === 500) {
        message = error.response?.data?.message || 'Server error. Please make sure the backend server is running.';
        console.error('Backend 500 error details:', error.response?.data);
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
      // Configure custom parameters if needed
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

      // Synchronize session with backend MongoDB
      const response = await authService.firebaseSync({
        token: idToken,
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        firstName,
        lastName,
        phone: firebaseUser.phoneNumber || '9876543210',
        isRegistering: true
      });

      if (response.data.success) {
        const { token: jwtToken, user: dbUser } = response.data.data;
        setToken(jwtToken);
        setUser(dbUser);
        setIsAuthenticated(true);

        localStorage.setItem('token', jwtToken);
        localStorage.setItem('user', JSON.stringify(dbUser));

        toast.success('Logged in with Google successfully!');
        return response.data;
      }
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
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
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
