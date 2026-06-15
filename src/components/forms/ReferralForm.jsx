import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { referralSchema } from '../../schemas/referralSchema.js';
import { submitReferral } from '../../firebase';
import { ROUTES } from '../../constants/routes.js';
import { FaSpinner, FaCheckCircle, FaLock, FaUser, FaEnvelope, FaPhone, FaArrowRight } from 'react-icons/fa';

const SERVICE_OPTIONS = [
  'US Individual Tax Filing',
  'US Business Tax Filing',
  'Bookkeeping & Accounting',
  'Payroll Processing',
  'ITIN / Tax Consultation',
  'Other Services',
];

function FieldError({ message }) {
  if (!message) return null;
  return <p className="mt-1.5 text-xs text-red-600 font-semibold">{message}</p>;
}

function ReferralForm() {
  const { currentUser, userProfile } = useAuth();
  const [submitStatus, setSubmitStatus] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(referralSchema),
    defaultValues: {
      referrerName: '',
      referrerEmail: '',
      friendName: '',
      friendEmail: '',
      friendPhone: '',
      serviceInterest: '',
      note: '',
    },
  });

  // Pre-fill referrer information when logged in
  useEffect(() => {
    if (currentUser) {
      setValue('referrerName', userProfile?.displayName || currentUser.displayName || '');
      setValue('referrerEmail', currentUser.email || '');
    }
  }, [currentUser, userProfile, setValue]);

  const onSubmit = async (data) => {
    if (!currentUser) {
      setSubmitStatus({
        type: 'error',
        message: 'You must be logged in to submit a referral.',
      });
      return;
    }

    setSubmitStatus(null);
    try {
      const formattedData = {
        referrerName: data.referrerName,
        referrerEmail: data.referrerEmail,
        refereeName: data.friendName,
        refereeEmail: data.friendEmail,
        refereePhone: data.friendPhone || '',
        serviceInterest: data.serviceInterest || '',
        note: data.note || '',
      };

      const { error } = await submitReferral(currentUser.uid, formattedData);
      if (error) throw error;

      setSubmitStatus({
        type: 'success',
        message: 'Awesome! Your referral has been logged. We will contact your friend soon. If they sign up, your cash reward will be issued!',
      });

      reset({
        referrerName: userProfile?.displayName || currentUser.displayName || '',
        referrerEmail: currentUser.email || '',
        friendName: '',
        friendEmail: '',
        friendPhone: '',
        serviceInterest: '',
        note: '',
      });
    } catch (err) {
      console.error('[ReferralForm] Submit error:', err);
      setSubmitStatus({
        type: 'error',
        message: 'Failed to submit referral. Please try again later.',
      });
    }
  };

  if (!currentUser) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-soft max-w-xl mx-auto space-y-5">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-surface border border-slate-100 text-brand-navy shadow-sm">
          <FaLock className="h-6 w-6 text-brand-navy" />
        </div>
        <div>
          <h4 className="text-xl font-bold text-brand-navy">Sign In to Refer Leads</h4>
          <p className="mt-2 text-sm text-brand-muted leading-relaxed">
            Submit referrals, track lead conversion statuses, and earn cashback payouts by joining our secure client reward portal.
          </p>
        </div>
        <div className="pt-2 flex justify-center gap-3">
          <Link
            to={ROUTES.LOGIN}
            className="inline-flex items-center gap-2 rounded-full bg-brand-navy px-6 py-2.5 text-sm font-bold text-white hover:bg-brand-blue transition"
          >
            Sign In Now <FaArrowRight className="h-3 w-3" />
          </Link>
          <Link
            to={ROUTES.REGISTER}
            className="rounded-full bg-brand-gold px-6 py-2.5 text-sm font-bold text-brand-ink hover:bg-amber-400 transition"
          >
            Create Account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-xl mx-auto">
      {submitStatus?.type === 'success' ? (
        <div className="rounded-xl bg-green-50 border border-green-200 p-6 text-center space-y-3" role="status">
          <FaCheckCircle className="mx-auto h-12 w-12 text-green-500" />
          <h4 className="text-lg font-bold text-green-900">Referral Logged!</h4>
          <p className="text-sm text-green-700 leading-relaxed">
            {submitStatus.message}
          </p>
          <button
            type="button"
            onClick={() => setSubmitStatus(null)}
            className="mt-4 inline-flex items-center justify-center rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 transition"
          >
            Refer Someone Else
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          {submitStatus?.type === 'error' && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-800" role="alert">
              <strong>Error:</strong> {submitStatus.message}
            </div>
          )}

          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-lg font-bold text-brand-navy">Your Contact Details</h3>
            <p className="text-xs text-brand-muted mt-1">Pre-filled from your client profile info.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Referrer Name */}
            <div>
              <label htmlFor="ref-referrerName" className="block text-xs font-bold text-brand-navy uppercase tracking-wider">Your Name</label>
              <input
                id="ref-referrerName"
                type="text"
                disabled
                className="mt-2 block w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500"
                {...register('referrerName')}
              />
              <FieldError message={errors.referrerName?.message} />
            </div>

            {/* Referrer Email */}
            <div>
              <label htmlFor="ref-referrerEmail" className="block text-xs font-bold text-brand-navy uppercase tracking-wider">Your Email</label>
              <input
                id="ref-referrerEmail"
                type="email"
                disabled
                className="mt-2 block w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500"
                {...register('referrerEmail')}
              />
              <FieldError message={errors.referrerEmail?.message} />
            </div>
          </div>

          <div className="border-b border-slate-100 pb-3 pt-2">
            <h3 className="text-lg font-bold text-brand-navy">Friend's Details</h3>
            <p className="text-xs text-brand-muted mt-1">Enter details of the person you are referring.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Referee Name */}
            <div>
              <label htmlFor="ref-friendName" className="block text-xs font-bold text-brand-navy uppercase tracking-wider">Friend's Name</label>
              <div className="relative mt-2">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <FaUser className="h-3.5 w-3.5" />
                </div>
                <input
                  id="ref-friendName"
                  type="text"
                  disabled={isSubmitting}
                  placeholder="Friend's Full Name"
                  className="block w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-gold disabled:opacity-60"
                  {...register('friendName')}
                />
              </div>
              <FieldError message={errors.friendName?.message} />
            </div>

            {/* Referee Email */}
            <div>
              <label htmlFor="ref-friendEmail" className="block text-xs font-bold text-brand-navy uppercase tracking-wider">Friend's Email</label>
              <div className="relative mt-2">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <FaEnvelope className="h-3.5 w-3.5" />
                </div>
                <input
                  id="ref-friendEmail"
                  type="email"
                  disabled={isSubmitting}
                  placeholder="friend@example.com"
                  className="block w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-gold disabled:opacity-60"
                  {...register('friendEmail')}
                />
              </div>
              <FieldError message={errors.friendEmail?.message} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Referee Phone */}
            <div>
              <label htmlFor="ref-friendPhone" className="block text-xs font-bold text-brand-navy uppercase tracking-wider">Friend's Phone (Optional)</label>
              <div className="relative mt-2">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <FaPhone className="h-3.5 w-3.5" />
                </div>
                <input
                  id="ref-friendPhone"
                  type="tel"
                  disabled={isSubmitting}
                  placeholder="+1 (555) 000-0000"
                  className="block w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-gold disabled:opacity-60"
                  {...register('friendPhone')}
                />
              </div>
            </div>

            {/* Service Interest */}
            <div>
              <label htmlFor="ref-serviceInterest" className="block text-xs font-bold text-brand-navy uppercase tracking-wider">Service Needed</label>
              <select
                id="ref-serviceInterest"
                disabled={isSubmitting}
                className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-gold disabled:opacity-60"
                {...register('serviceInterest')}
              >
                <option value="">Select service type</option>
                {SERVICE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="ref-note" className="block text-xs font-bold text-brand-navy uppercase tracking-wider">Note for our team (Optional)</label>
            <textarea
              id="ref-note"
              rows="3"
              disabled={isSubmitting}
              placeholder="Provide context like 'He just started a startup' or 'Prefers email contacts'..."
              className="mt-2 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-gold resize-y disabled:opacity-60"
              {...register('note')}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full inline-flex justify-center items-center gap-2 rounded-full bg-brand-gold px-6 py-3 font-semibold text-brand-ink transition hover:bg-brand-navy hover:text-white disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <FaSpinner className="h-4 w-4 animate-spin" /> Submitting Referral...
              </>
            ) : (
              'Submit Referral'
            )}
          </button>
        </form>
      )}
    </div>
  );
}

export default ReferralForm;
