import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Sparkles } from 'lucide-react';
import bgImage from '../assets/images/bg.jpeg';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [isResetting, setIsResetting] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { currentUser, loginWithEmail, loginWithGoogle, resetPassword } = useAuth();
  const navigate = useNavigate();

  // Auto-redirect if already logged in (token-based auto-login)
  useEffect(() => {
    if (currentUser) {
      navigate('/', { replace: true });
    }
  }, [currentUser, navigate]);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (isResetting) {
      if (!email) {
        setError('Please enter your email to reset password.');
        return;
      }
      try {
        setLoading(true);
        setError('');
        await resetPassword(email);
        setResetEmailSent(true);
      } catch (err) {
        setError('Failed to send reset email. Ensure email is correct.');
      } finally {
        setLoading(false);
      }
      return;
    }

    try {
      setLoading(true);
      setError('');
      await loginWithEmail(email, password);
      navigate('/');
    } catch (err) {
      setError('Failed to log in. Please check credentials or verify email.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      await loginWithGoogle();
      navigate('/');
    } catch (err) {
      setError('Google sign-in failed.');
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col lg:flex-row overflow-hidden bg-white">
      <div className="flex-1 lg:flex-none lg:w-1/2 relative bg-cover bg-center flex flex-col items-center justify-center">
        <img src={bgImage} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover pointer-events-none" />
        <div className="absolute inset-0 bg-pink-400/30"></div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-serif italic tracking-[0.15em] text-transparent uppercase mb-2 leading-tight title-stroke hero-text-glow">
            Welcome Back
          </h1>
          <div className="relative inline-block mt-2">
            <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-[6rem] font-serif italic text-white relative z-10 hero-text-glow">
              Gorgeous!
            </h2>
            <Sparkles className="absolute -top-2 -right-8 w-6 h-6 text-white animate-pulse z-0 sparkle-glow" />
          </div>
        </div>
      </div>

      <div className="shrink-0 lg:flex-1 lg:w-1/2 flex items-start lg:items-center justify-center px-4 bg-pink-100 -mt-10 lg:mt-0 rounded-t-[2rem] lg:rounded-none relative z-10 overflow-y-auto pt-6 lg:pt-0 pb-6 shadow-[0_-8px_30px_rgba(0,0,0,0.04)] font-poppins">
        <div className="w-full max-w-md px-4 relative">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-pink-200 text-[var(--color-primary)] mb-3">
              <Sparkles className="w-6 h-6" />
            </div>
            <p className="text-gray-600 text-sm font-medium">Sign in to book your next glow up!</p>
          </div>

          {error && <div className="bg-red-50 text-red-500 p-2 rounded-xl mb-3 text-xs text-center">{error}</div>}
          {resetEmailSent && <div className="bg-green-50 text-green-600 p-2 rounded-xl mb-3 text-xs text-center">Password reset email sent! Please check your inbox.</div>}

          <form onSubmit={handleEmailSubmit} className="space-y-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Mail className="h-4 w-4 text-gray-400" /></div>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="block w-full pl-10 pr-4 py-2.5 bg-white border border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-300 outline-none text-sm" placeholder="Email address" />
            </div>

            {!isResetting && (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Lock className="h-4 w-4 text-gray-400" /></div>
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="block w-full pl-10 pr-4 py-2.5 bg-white border border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-300 outline-none text-sm" placeholder="Password" />
              </div>
            )}

            <button type="submit" disabled={loading} className="w-full bg-[#E77291] text-white rounded-xl py-2.5 font-semibold text-sm shadow-md hover:bg-[#d66581] transition-all disabled:opacity-70">
              {loading ? 'Processing...' : isResetting ? 'Send Reset Link' : 'Sign In'}
            </button>

            <div className="text-right mt-1 !mb-3">
              <button type="button" onClick={() => { setIsResetting(!isResetting); setError(''); setResetEmailSent(false); }} className="text-xs text-pink-600 hover:underline font-medium">
                {isResetting ? 'Back to sign in' : 'Forgot Password?'}
              </button>
            </div>
          </form>

          <p className="mt-4 text-center text-xs text-gray-500">
            Don't have an account? <Link to="/signup" className="font-semibold text-[var(--color-primary)] hover:underline">Sign up</Link>
          </p>

          <div className="mt-4 flex items-center justify-between">
            <span className="w-1/5 border-b border-gray-200"></span>
            <span className="text-[10px] text-center text-gray-400 uppercase font-bold">Or</span>
            <span className="w-1/5 border-b border-gray-200"></span>
          </div>

          <button onClick={handleGoogleLogin} disabled={loading} type="button" className="mt-4 w-full flex items-center justify-center gap-2 border border-pink-300 rounded-xl py-2.5 text-gray-700 text-sm font-medium hover:bg-pink-50 transition-colors bg-transparent disabled:opacity-70">
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-4 h-4" />
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
};
