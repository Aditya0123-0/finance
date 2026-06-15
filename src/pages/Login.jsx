import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaEnvelope, FaLock, FaGoogle, FaArrowLeft } from 'react-icons/fa';
import SEO from '../components/common/SEO.jsx';
import { loginSchema } from '../schemas/loginSchema.js';
import { useAuth } from '../hooks/useAuth.js';
import { ROUTES } from '../constants/routes.js';

function FieldError({ message }) {
  if (!message) return null;
  return <p className="mt-1.5 text-xs text-red-600 font-semibold">{message}</p>;
}

function Login() {
  const { login, loginWithGoogle } = useAuth();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const pageDescription =
    'Sign in to access TaxFiler Global secure tax and refund status portal for clients and partners.';

  const loginJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Login',
    description: pageDescription,
    url: `${window.location.origin}/#/login`,
  };

  // Redirect to the page they tried to access, or Home
  const from = location.state?.from?.pathname || ROUTES.HOME;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    setError(null);
    setLoading(true);
    const { error: loginError } = await login(data.email, data.password);
    setLoading(false);

    if (loginError) {
      setError(loginError.message);
    } else {
      navigate(from, { replace: true });
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    const { error: googleError } = await loginWithGoogle();
    setLoading(false);

    if (googleError) {
      setError(googleError.message);
    } else {
      navigate(from, { replace: true });
    }
  };

  return (
    <>
      <SEO
        title="Login | TaxFiler Global"
        description={pageDescription}
        keywords="login, secure portal, tax account, refund status"
        ogImage="/og-image.jpg"
        jsonLd={loginJsonLd}
        noIndex={true}
      />
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-navy via-brand-blue to-brand-ink px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md shadow-soft sm:p-10 text-white">
        
        {/* Back Link */}
        <div className="flex justify-start">
          <Link
            to={ROUTES.HOME}
            className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-brand-gold transition-colors duration-200"
          >
            <FaArrowLeft className="h-3 w-3" />
            Back to Home
          </Link>
        </div>

        {/* Title */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-slate-300">
            Sign in to access your secure tax portal
          </p>
        </div>

        {/* Error alert */}
        {error && (
          <div className="rounded-lg bg-red-950/50 border border-red-500/50 p-4 text-sm text-red-200" role="alert">
            <span className="font-bold">Error:</span> {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="space-y-4">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-200">
                Email Address
              </label>
              <div className="relative mt-2">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <FaEnvelope className="h-4 w-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  disabled={loading}
                  className="block w-full rounded-lg border border-white/15 bg-white/5 py-3 pl-10 pr-4 text-white placeholder-slate-400 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold disabled:opacity-55 transition-all"
                  placeholder="name@example.com"
                  {...register('email')}
                />
              </div>
              <FieldError message={errors.email?.message} />
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-semibold text-slate-200">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-brand-gold hover:text-amber-400 transition"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative mt-2">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <FaLock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  disabled={loading}
                  className="block w-full rounded-lg border border-white/15 bg-white/5 py-3 pl-10 pr-4 text-white placeholder-slate-400 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold disabled:opacity-55 transition-all"
                  placeholder="••••••••"
                  {...register('password')}
                />
              </div>
              <FieldError message={errors.password?.message} />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-lg bg-brand-gold px-4 py-3 text-sm font-bold text-brand-ink transition hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2 focus:ring-offset-brand-navy disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#1c2e42] px-2 text-slate-400 font-semibold">Or continue with</span>
          </div>
        </div>

        {/* Google Sign In */}
        <div>
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-brand-gold disabled:cursor-not-allowed disabled:opacity-75 transition-colors duration-200"
          >
            <FaGoogle className="h-4 w-4 text-[#EA4335]" />
            Google
          </button>
        </div>

        {/* Sign up redirect */}
        <p className="mt-6 text-center text-sm text-slate-300">
          New to TaxFiler Global?{' '}
          <Link to={ROUTES.REGISTER} className="font-semibold text-brand-gold hover:text-amber-400 transition">
            Create an account
          </Link>
        </p>
      </div>
    </div>
    </>
  );
}

export default Login;
