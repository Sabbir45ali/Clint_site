import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Sparkles } from 'lucide-react';
import bgImage from '../assets/images/bg.jpeg';

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
    <div className="h-screen flex flex-col lg:flex-row overflow-hidden bg-white">
      {/* Left/Upper section - Background image with pink overlay */}
      <div className="flex-1 lg:flex-none lg:w-1/2 relative bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center" style={{ backgroundImage: `url(${bgImage})` }}>
        <div className="absolute inset-0 bg-pink-400/30"></div>
        <div className="relative z-10 text-center px-4">
          {/* Welcome Back - Neon Outline Style */}
          <h1 
            className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-serif italic tracking-[0.15em] text-transparent uppercase mb-2 lg:mb-4 leading-tight"
            style={{ 
              WebkitTextStroke: '1.5px white',
              textShadow: '0 0 10px #ff69b4, 0 0 20px #ff69b4, 0 0 30px #ff1493'
            }}
          >
            Welcome Back
          </h1>
          {/* Gorgeous - Elegant Serif Style */}
          <div className="relative inline-block mt-2">
            <h2 
              className="text-5xl sm:text-6xl md:text-7xl lg:text-[6rem] font-serif italic text-white tracking-wide relative z-10"
              style={{
                textShadow: '0 2px 15px rgba(255, 20, 147, 0.8)'
              }}
            >
              Gorgeous!
            </h2>
            {/* Sparkle effects */}
            <Sparkles className="absolute -top-2 -right-8 lg:-top-6 lg:-right-12 w-6 h-6 lg:w-10 lg:h-10 text-white animate-pulse z-0" style={{ filter: 'drop-shadow(0 0 10px #ff69b4)' }} />
            <Sparkles className="absolute -bottom-2 -left-6 lg:-bottom-2 lg:-left-10 w-4 h-4 lg:w-7 lg:h-7 text-pink-200 animate-pulse z-0" style={{ filter: 'drop-shadow(0 0 8px #ff69b4)', animationDelay: '1s' }} />
          </div>
        </div>
      </div>

      {/* Right/Lower section - Login card */}
      <div className="shrink-0 lg:flex-1 lg:w-1/2 flex items-start lg:items-center justify-center px-4 md:px-8 bg-pink-100 -mt-10 lg:mt-0 rounded-t-[2rem] lg:rounded-none relative z-10 overflow-y-auto pt-6 md:pt-10 lg:pt-0 pb-6 md:pb-10 lg:pb-0 shadow-[0_-8px_30px_rgba(0,0,0,0.04)] lg:shadow-[-8px_0_30px_rgba(0,0,0,0.04)] font-poppins">
        <div className="w-full max-w-md px-4 md:px-6 relative">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-pink-100 rounded-full blur-3xl opacity-60 -mr-10 -mt-10"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-200 rounded-full blur-3xl opacity-60 -ml-10 -mb-10"></div>

          <div className="relative z-10">
            <div className="text-center mb-4 md:mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full bg-pink-200 text-[var(--color-primary)] mb-3 md:mb-4">
                <Sparkles className="w-6 h-6 md:w-8 md:h-8" />
              </div>
              <p className="text-gray-600 text-sm sm:text-base md:text-lg font-medium">Sign in to book your next glow up!</p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-500 p-1.5 md:p-3 rounded-xl mb-2 md:mb-4 text-xs md:text-sm text-center transform transition-all duration-300">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-2.5 md:space-y-4">
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
                    className="block w-full pl-11 pr-4 py-2.5 md:py-3.5 bg-transparent border border-pink-300 rounded-2xl text-gray-900 text-sm md:text-base placeholder-gray-400 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-pink-200 transition-all outline-none"
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
                    className="block w-full pl-11 pr-4 py-2.5 md:py-3.5 bg-transparent border border-pink-300 rounded-2xl text-gray-900 text-sm md:text-base placeholder-gray-400 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-pink-200 transition-all outline-none"
                    placeholder="Password"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#E77291]   text-white rounded-xl py-2.5 md:py-3.5 font-semibold text-sm sm:text-base md:text-lg shadow-lg shadow-pink-200 hover:shadow-pink-300 transition-all transform hover:-translate-y-0.5 active:scale-95"
              >
                Sign In
              </button>
            </form>

            <p className="mt-2 md:mt-4 text-center text-xs sm:text-sm md:text-base text-gray-500">
              Don't have an account?{' '}
              <Link to="/signup" className="font-semibold text-[var(--color-primary)] hover:underline">
                Sign up
              </Link>
            </p>

            <div className="mt-2 md:mt-4 flex items-center justify-between">
              <span className="w-1/5 border-b border-gray-200"></span>
              <span className="text-xs text-center text-gray-400 uppercase font-medium">Or</span>
              <span className="w-1/5 border-b border-gray-200"></span>
            </div>

            <button
              onClick={handleGoogleLogin}
              type="button"
              className="mt-2 md:mt-4 w-full flex items-center justify-center gap-2 md:gap-3 bg-transparent border border-pink-300 rounded-2xl py-2.5 md:py-3.5 text-gray-700 text-sm md:text-base font-medium hover:bg-pink-100/50 hover:border-pink-400 transition-colors active:scale-95 transform"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5 relative -top-px" />
              Sign in with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
