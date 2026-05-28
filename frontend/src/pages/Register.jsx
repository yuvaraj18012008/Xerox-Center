import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiPhone, FiLock, FiArrowRight, FiAlertCircle } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const navigate = useNavigate();
  const { register, loginWithGoogle, loading } = useAuth();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Phone number must be 10 digits';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and numbers';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!agreeTerms) {
      newErrors.terms = 'Please agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;

    // Format phone number
    if (name === 'phone') {
      processedValue = value.replace(/\D/g, '').slice(0, 10);
    }

    setFormData(prev => ({
      ...prev,
      [name]: processedValue
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
      const userData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formData.phone,
        password: formData.password
      };

      await register(userData);
      navigate('/');
    } catch (error) {
      console.error('Register error:', error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      navigate('/');
    } catch (error) {
      console.error('Google registration error:', error);
    }
  };

  const getPasswordStrength = () => {
    let strength = 0;
    const password = formData.password;

    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;

    return strength;
  };

  const passwordStrength = getPasswordStrength();
  const strengthLabel = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'][passwordStrength];
  const strengthColor = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500', 'bg-green-600'][passwordStrength];

  return (
    <div className="h-[calc(100vh-4rem)] overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-3">
          <div className="text-2xl font-bold text-blue-600 mb-1">🖨️</div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-0.5">
            Join Smart Xerox Center
          </h1>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Create an account to get started
          </p>
        </div>

        {/* Registration Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-5 space-y-3"
        >
          {/* Name Fields Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* First Name */}
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                First Name
              </label>
              <div className="relative">
                <FiUser className="absolute left-3 top-2 text-gray-400" size={16} />
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  className={`w-full pl-9 pr-4 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                    errors.firstName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.firstName && (
                <div className="flex items-center gap-1 mt-0.5 text-red-500 text-xs">
                  <FiAlertCircle size={12} />
                  {errors.firstName}
                </div>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Last Name
              </label>
              <div className="relative">
                <FiUser className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                    errors.lastName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.lastName && (
                <div className="flex items-center gap-2 mt-1 text-red-500 text-sm">
                  <FiAlertCircle size={16} />
                  {errors.lastName}
                </div>
              )}
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <FiMail className="absolute left-3 top-2 text-gray-400" size={16} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className={`w-full pl-9 pr-4 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>
            {errors.email && (
              <div className="flex items-center gap-1 mt-0.5 text-red-500 text-xs">
                <FiAlertCircle size={12} />
                {errors.email}
              </div>
            )}
          </div>

          {/* Phone Field */}
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Phone Number
            </label>
            <div className="relative">
              <FiPhone className="absolute left-3 top-2 text-gray-400" size={16} />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="9876543210"
                maxLength="10"
                className={`w-full pl-9 pr-4 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>
            {errors.phone && (
              <div className="flex items-center gap-1 mt-0.5 text-red-500 text-xs">
                <FiAlertCircle size={12} />
                {errors.phone}
              </div>
            )}
          </div>

          {/* Password Fields Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-2 text-gray-400" size={16} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full pl-9 pr-10 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-sm"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {errors.password && (
                <div className="flex items-center gap-1 mt-0.5 text-red-500 text-xs">
                  <FiAlertCircle size={12} />
                  {errors.password}
                </div>
              )}
              {formData.password && (
                <div className="mt-1">
                  <div className="flex gap-1 mb-1">
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full ${
                          i < passwordStrength ? strengthColor : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      ></div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Strength: <span className="font-semibold">{strengthLabel}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {errors.confirmPassword && (
                <div className="flex items-center gap-1 mt-0.5 text-red-500 text-xs">
                  <FiAlertCircle size={12} />
                  {errors.confirmPassword}
                </div>
              )}
            </div>
          </div>

          {/* Terms Checkbox */}
          <div>
            <label className="flex items-start">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => {
                  setAgreeTerms(e.target.checked);
                  if (e.target.checked && errors.terms) {
                    setErrors(prev => {
                      const newErrors = { ...prev };
                      delete newErrors.terms;
                      return newErrors;
                    });
                  }
                }}
                className="w-4 h-4 text-blue-600 rounded cursor-pointer mt-1"
              />
              <span className="ml-2 text-xs text-gray-600 dark:text-gray-400">
                I agree to the{' '}
                <Link to="#" className="text-blue-600 hover:underline">
                  Terms of Service
                </Link>
                {' '}and{' '}
                <Link to="#" className="text-blue-600 hover:underline">
                  Privacy Policy
                </Link>
              </span>
            </label>
            {errors.terms && (
              <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
                <FiAlertCircle size={12} />
                {errors.terms}
              </div>
            )}
          </div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-1.5 px-4 rounded-lg transition duration-300 flex items-center justify-center gap-2 text-sm"
          >
            {loading ? (
              <>
                <span className="w-5 h-5 border-2 border-white rounded-full animate-spin border-t-transparent"></span>
                Creating Account...
              </>
            ) : (
              <>
                Create Account
                <FiArrowRight size={18} />
              </>
            )}
          </button>

          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold py-1.5 px-4 rounded-lg transition duration-300 flex items-center justify-center gap-2 text-sm"
          >
            <FcGoogle size={20} />
            Sign up with Google
          </button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                Already have an account?
              </span>
            </div>
          </div>

          {/* Login Link */}
          <Link
            to="/login"
            className="block w-full text-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold py-1.5 px-4 rounded-lg transition duration-300 text-sm"
          >
            Sign In
          </Link>
        </form>
      </div>
    </div>
  );
}

