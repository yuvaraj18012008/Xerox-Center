import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiArrowLeft, FiCheckCircle, FiLock, FiSend } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error('Please enter your email address');
      return;
    }

    setIsLoading(true);

    // Simulate a short delay for UX
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      toast.success('Password reset link sent successfully!');
    }, 1500);
  };

  return (
    <div className="h-[calc(100vh-4rem)] overflow-hidden bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4 transition-colors duration-300">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/10 dark:bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-violet-400/10 dark:bg-violet-500/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative">
        {/* Back to Login Link */}
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-8 group"
        >
          <FiArrowLeft
            size={16}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Back to Login
        </Link>

        {/* Card */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-gray-900/50 p-6 sm:p-8">
          {!isSubmitted ? (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 mb-5 shadow-lg shadow-blue-500/25">
                  <FiLock className="text-white" size={28} />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  Forgot Password?
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm sm:text-base">
                  No worries! Enter your email address and we&apos;ll send you a
                  link to reset your password.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <FiMail
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/25 hover:shadow-blue-500/30 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 active:scale-[0.98]"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Sending Reset Link...
                    </>
                  ) : (
                    <>
                      <FiSend size={16} />
                      Send Reset Link
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            /* Success State */
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 mb-6">
                <FiCheckCircle
                  className="text-emerald-600 dark:text-emerald-400"
                  size={40}
                />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Check Your Email
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base mb-2">
                We&apos;ve sent a password reset link to:
              </p>
              <p className="text-blue-600 dark:text-blue-400 font-semibold text-sm mb-6">
                {email}
              </p>
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-6">
                <p className="text-amber-700 dark:text-amber-400 text-xs sm:text-sm">
                  💡 Didn&apos;t receive the email? Check your spam folder or
                  wait a few minutes before trying again.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setEmail('');
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  Try Another Email
                </button>
                <Link
                  to="/login"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/25 transition-all duration-200"
                >
                  <FiArrowLeft size={16} />
                  Back to Login
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 dark:text-gray-600 mt-6">
          Remember your password?{' '}
          <Link
            to="/login"
            className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
