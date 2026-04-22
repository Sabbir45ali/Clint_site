import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Sparkles } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { loginWithEmail, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      await loginWithEmail(email, password);
      navigate('/');
    } catch (err) {
      setError('Failed to log in. Please check credentials.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError('');
      await loginWithGoogle();
      navigate('/');
    } catch (err) {
      setError('Google sign-in failed.');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] w-full max-w-md p-8 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-pink-100 rounded-full blur-3xl opacity-60 -mr-10 -mt-10"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-200 rounded-full blur-3xl opacity-60 -ml-10 -mb-10"></div>

        <div className="relative z-10">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-pink-50 text-[var(--color-primary)] mb-4">
              <Sparkles className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2 font-serif">Welcome Back, Gorgeous</h1>
            <p className="text-gray-500">Sign in to book your next glow up!</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-xl mb-6 text-sm text-center transform transition-all duration-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border-transparent rounded-2xl text-gray-900 placeholder-gray-400 focus:bg-white focus:border-[var(--color-primary)] focus:ring-2 focus:ring-pink-200 transition-all outline-none"
                  placeholder="Email address"
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border-transparent rounded-2xl text-gray-900 placeholder-gray-400 focus:bg-white focus:border-[var(--color-primary)] focus:ring-2 focus:ring-pink-200 transition-all outline-none"
                  placeholder="Password"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#FF69B4] to-[#FF1493] hover:from-[#FF1493] hover:to-[#FF69B4] text-white rounded-2xl py-3.5 font-semibold text-lg shadow-lg shadow-pink-200 hover:shadow-pink-300 transition-all transform hover:-translate-y-0.5 active:scale-95"
            >
              Sign In
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold text-[var(--color-primary)] hover:underline">
              Sign up
            </Link>
          </p>

          <div className="mt-8 flex items-center justify-between">
            <span className="w-1/5 border-b border-gray-200"></span>
            <span className="text-xs text-center text-gray-400 uppercase font-medium">Or continue with</span>
            <span className="w-1/5 border-b border-gray-200"></span>
          </div>

          <button
            onClick={handleGoogleLogin}
            type="button"
            className="mt-6 w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-100 rounded-2xl py-3.5 text-gray-700 font-medium hover:bg-gray-50 transition-colors hover:border-gray-200 active:scale-95 transform"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5 relative -top-px" />
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
};
