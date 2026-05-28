import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiArrowRight, FiAlertCircle } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const navigate = useNavigate();
  const { login, loginWithGoogle, loading } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await login(formData.email, formData.password);

      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
        localStorage.setItem('rememberedEmail', formData.email);
      } else {
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('rememberedEmail');
      }

      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      navigate('/');
    } catch (error) {
      console.error('Google login error:', error);
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-4">
          <div className="text-3xl font-bold text-blue-600 mb-1">🖨️</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            Welcome Back
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Sign in to your Smart Xerox Center account
          </p>
        </div>

        {/* Login Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 space-y-4"
        >
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <FiMail className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={`w-full pl-10 pr-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>
            {errors.email && (
              <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
                <FiAlertCircle size={14} />
                {errors.email}
              </div>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className={`w-full pl-10 pr-10 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.password && (
              <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
                <FiAlertCircle size={14} />
                {errors.password}
              </div>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded cursor-pointer"
              />
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
                Remember me
              </span>
            </label>
            <Link
              to="/forgot-password"
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-5 h-5 border-2 border-white rounded-full animate-spin border-t-transparent"></span>
                Logging in...
              </>
            ) : (
              <>
                Sign In
                <FiArrowRight size={18} />
              </>
            )}
          </button>

          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center gap-2"
          >
            <FcGoogle size={20} />
            Sign in with Google
          </button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                New to Xerox Center?
              </span>
            </div>
          </div>

          {/* Register Link */}
          <Link
            to="/register"
            className="block w-full text-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
          >
            Create an Account
          </Link>
        </form>

        {/* Footer */}
        <p className="text-center text-gray-600 dark:text-gray-400 text-xs mt-3">
          By signing in, you agree to our{' '}
          <Link to="#" className="text-blue-600 hover:underline">
            Terms of Service
          </Link>
        </p>
      </div>
    </div>
  );
}
