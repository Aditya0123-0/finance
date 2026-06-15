import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import SEO from '../components/common/SEO.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { ROUTES } from '../constants/routes.js';

const forgotPasswordSchema = yup.object({
  email: yup.string().trim().email('Enter a valid email').required('Email is required'),
});

function FieldError({ message }) {
  if (!message) return null;
  return <p className="mt-1.5 text-xs text-red-600 font-semibold">{message}</p>;
}

function ForgotPassword() {
  const { resetPasswordEmail } = useAuth();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const pageDescription =
    'Request a password reset link for your TaxFiler Global account to regain secure access.';

  const forgotPasswordJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Forgot Password',
    description: pageDescription,
    url: `${window.location.origin}/#/forgot-password`,
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data) => {
    setError(null);
    setSuccess(false);
    setLoading(true);

    const { error: resetError } = await resetPasswordEmail(data.email);
    setLoading(false);

    if (resetError) {
      setError(resetError.message);
    } else {
      setSuccess(true);
    }
  };

  return (
    <>
      <SEO
        title="Forgot Password | TaxFiler Global"
        description={pageDescription}
        keywords="forgot password, reset password, account recovery, secure portal"
        ogImage="/og-image.jpg"
        jsonLd={forgotPasswordJsonLd}
        noIndex={true}
      />
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-navy via-brand-blue to-brand-ink px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md shadow-soft sm:p-10 text-white">
        
        {/* Back Link */}
        <div className="flex justify-start">
          <Link
            to={ROUTES.LOGIN}
            className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-brand-gold transition-colors duration-200"
          >
            <FaArrowLeft className="h-3 w-3" />
            Back to Login
          </Link>
        </div>

        {/* Title */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Reset Password
          </h2>
          <p className="mt-2 text-sm text-slate-300">
            Enter your email to receive a password reset link
          </p>
        </div>

        {/* Success message */}
        {success ? (
          <div className="rounded-lg bg-green-950/50 border border-green-500/50 p-6 text-center space-y-4" role="status">
            <FaCheckCircle className="mx-auto h-12 w-12 text-green-400" />
            <h3 className="text-lg font-bold text-white">Reset Link Sent!</h3>
            <p className="text-sm text-green-200">
              Please check your inbox for instructions on how to reset your password.
            </p>
            <Link
              to={ROUTES.LOGIN}
              className="mt-4 inline-flex items-center justify-center rounded-lg bg-brand-gold px-4 py-2.5 text-sm font-semibold text-brand-ink hover:bg-amber-400 transition"
            >
              Return to Sign In
            </Link>
          </div>
        ) : (
          <>
            {/* Error alert */}
            {error && (
              <div className="rounded-lg bg-red-950/50 border border-red-500/50 p-4 text-sm text-red-200" role="alert">
                <span className="font-bold">Error:</span> {error}
              </div>
            )}

            <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
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

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative flex w-full justify-center rounded-lg bg-brand-gold px-4 py-3 text-sm font-bold text-brand-ink transition hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2 focus:ring-offset-brand-navy disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? 'Sending link...' : 'Send Reset Link'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
    </>
  );
}

export default ForgotPassword;
