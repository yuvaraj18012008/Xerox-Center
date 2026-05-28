import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Services from './pages/Services';
import OrderManagement from './pages/OrderManagement';
import TrackOrder from './pages/TrackOrder';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import Contact from './pages/Contact';
import ForgotPassword from './pages/ForgotPassword';

const authRoutes = ['/login', '/register', '/forgot-password'];

function AppContent({ isDarkMode, setIsDarkMode }) {
  const location = useLocation();
  const isAuthPage = authRoutes.includes(location.pathname);

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className={`bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 ${isAuthPage ? 'h-screen overflow-hidden' : 'min-h-screen'}`}>
        <Navbar
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
        />

        <main className="pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/order" element={<OrderManagement />} />
            <Route path="/track-order" element={<TrackOrder />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>

        {!isAuthPage && <Footer />}
      </div>
    </div>
  );
}

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check dark mode preference
    const darkModePreference = localStorage.getItem('darkMode');
    if (darkModePreference) {
      setIsDarkMode(JSON.parse(darkModePreference));
    }
  }, []);

  return (
    <Router>
      <AppContent isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
    </Router>
  );
}

export default App;
