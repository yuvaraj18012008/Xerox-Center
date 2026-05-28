import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiX, FiMoon, FiSun, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ isDarkMode, setIsDarkMode }) {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('darkMode', JSON.stringify(!isDarkMode));
  };

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="fixed top-0 w-full bg-white dark:bg-gray-800 shadow-md z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-blue-600">🖨️</span>
            <span className="text-xl font-bold text-gray-900 dark:text-white hidden sm:inline">
              Xerox Center
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 dark:text-gray-300 hover:text-blue-600">
              Home
            </Link>
            <Link
              to="/services"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600"
            >
              Services
            </Link>
            <Link
              to="/order"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600"
            >
              Place Order
            </Link>
            <Link
              to="/track-order"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600"
            >
              Track Order
            </Link>
            <Link
              to="/contact"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600"
            >
              Contact
            </Link>
          </div>

          {/* Right Menu */}
          <div className="flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {isDarkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>

            {/* User Menu */}
            {isAuthenticated && user ? (
              <div className="hidden md:flex items-center space-x-4">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {user.firstName}
                </span>
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg"
                >
                  <FiLogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-4">
                <Link
                  to="/login"
                  className="px-4 py-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link
              to="/"
              onClick={closeMenu}
              className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              Home
            </Link>
            <Link
              to="/services"
              onClick={closeMenu}
              className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              Services
            </Link>
            <Link
              to="/order"
              onClick={closeMenu}
              className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              Place Order
            </Link>
            <Link
              to="/track-order"
              onClick={closeMenu}
              className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              Track Order
            </Link>
            <Link
              to="/contact"
              onClick={closeMenu}
              className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              Contact
            </Link>
            {isAuthenticated && user ? (
              <>
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={closeMenu}
                    className="block px-4 py-2 bg-blue-600 text-white rounded-lg"
                  >
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="block px-4 py-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={closeMenu}
                  className="block px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
