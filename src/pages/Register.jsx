import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaArrowLeft } from 'react-icons/fa';
import SEO from '../components/common/SEO.jsx';
import { registerSchema } from '../schemas/registerSchema.js';
import { useAuth } from '../hooks/useAuth.js';
import { ROUTES } from '../constants/routes.js';

function FieldError({ message }) {
  if (!message) return null;
  return <p className="mt-1.5 text-xs text-red-600 font-semibold">{message}</p>;
}

function Register() {
  const { register: signUp } = useAuth();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const pageDescription =
    'Create a secure TaxFiler Global account to manage tax filings, inquiries, and refund status tracking.';

  const registerJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Register',
    description: pageDescription,
    url: `${window.location.origin}/#/register`,
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    setError(null);
    setLoading(true);

    const { error: signUpError } = await signUp(data.email, data.password, {
      displayName: data.fullName,
      phone: data.phone,
    });
    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
    } else {
      navigate(ROUTES.HOME, { replace: true });
    }
  };

  return (
    <>
      <SEO
        title="Register | TaxFiler Global"
        description={pageDescription}
        keywords="register, create account, secure portal, tax services account"
        ogImage="/og-image.jpg"
        jsonLd={registerJsonLd}
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
            Create Account
          </h2>
          <p className="mt-2 text-sm text-slate-300">
            Sign up to manage your tax filings securely
          </p>
        </div>

        {/* Error alert */}
        {error && (
          <div className="rounded-lg bg-red-950/50 border border-red-500/50 p-4 text-sm text-red-200" role="alert">
            <span className="font-bold">Error:</span> {error}
          </div>
        )}

        <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="space-y-4">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-semibold text-slate-200">
                Full Name
              </label>
              <div className="relative mt-2">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <FaUser className="h-4 w-4" />
                </div>
                <input
                  id="fullName"
                  type="text"
                  autoComplete="name"
                  disabled={loading}
                  className="block w-full rounded-lg border border-white/15 bg-white/5 py-3 pl-10 pr-4 text-white placeholder-slate-400 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold disabled:opacity-55 transition-all"
                  placeholder="John Doe"
                  {...register('fullName')}
                />
              </div>
              <FieldError message={errors.fullName?.message} />
            </div>

            {/* Email Address */}
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
                  placeholder="john@example.com"
                  {...register('email')}
                />
              </div>
              <FieldError message={errors.email?.message} />
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-slate-200">
                Phone Number
              </label>
              <div className="relative mt-2">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <FaPhone className="h-4 w-4" />
                </div>
                <input
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  disabled={loading}
                  className="block w-full rounded-lg border border-white/15 bg-white/5 py-3 pl-10 pr-4 text-white placeholder-slate-400 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold disabled:opacity-55 transition-all"
                  placeholder="+1 (555) 000-0000"
                  {...register('phone')}
                />
              </div>
              <FieldError message={errors.phone?.message} />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-200">
                Password
              </label>
              <div className="relative mt-2">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <FaLock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  disabled={loading}
                  className="block w-full rounded-lg border border-white/15 bg-white/5 py-3 pl-10 pr-4 text-white placeholder-slate-400 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold disabled:opacity-55 transition-all"
                  placeholder="•••••••• (Min 8 chars)"
                  {...register('password')}
                />
              </div>
              <FieldError message={errors.password?.message} />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-lg bg-brand-gold px-4 py-3 text-sm font-bold text-brand-ink transition hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2 focus:ring-offset-brand-navy disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </div>
        </form>

        {/* Sign in redirect */}
        <p className="mt-6 text-center text-sm text-slate-300">
          Already have an account?{' '}
          <Link to={ROUTES.LOGIN} className="font-semibold text-brand-gold hover:text-amber-400 transition">
            Sign in
          </Link>
        </p>
      </div>
    </div>
    </>
  );
}

export default Register;
