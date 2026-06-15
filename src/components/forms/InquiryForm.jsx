import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth } from '../../hooks/useAuth.js';
import { contactSchema } from '../../schemas/contactSchema.js';
import { submitInquiry } from '../../firebase';
import { FaSpinner, FaCheckCircle, FaEnvelope, FaUser, FaPhone } from 'react-icons/fa';

const DEFAULT_SERVICES = [
  'Tax Planning Advisory',
  'Tax Return Services',
  'Tax Consultant & Tax Advisory',
  'ITIN Processing',
  'FBAR/FATCA Processing',
  'Extension Filing',
  'Tax Preparation Services',
  'Business Incorporation Consulting',
  'Accounting Bookkeeping',
  'Payroll Processing',
  'Tax Return Planning Preparation',
  'Bookkeeping and Accounting',
  'Audit Support',
  'Tax Support',
  'Backoffice Support',
  'Other',
];

function FieldError({ message }) {
  if (!message) return null;
  return <p className="mt-1.5 text-xs text-red-600 font-semibold">{message}</p>;
}

function InquiryForm({
  services = DEFAULT_SERVICES,
  defaultService = '',
  onSubmitSuccess,
  submitLabel = 'Submit Inquiry',
}) {
  const { currentUser } = useAuth();
  const [submitStatus, setSubmitStatus] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(contactSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      serviceInterest: defaultService,
      customServiceDescription: '',
      subject: defaultService ? `Inquiry for ${defaultService}` : 'Service Inquiry',
      message: '',
    },
  });

  const selectedService = watch('serviceInterest');

  const onSubmit = async (data) => {
    setSubmitStatus(null);
    try {
      const { error } = await submitInquiry(
        {
          ...data,
          source: 'service-page',
        },
        currentUser?.uid || null
      );

      if (error) throw error;

      setSubmitStatus({
        type: 'success',
        message: 'Thank you. Your service inquiry has been submitted successfully. A specialist will contact you shortly.',
      });
      reset({
        fullName: '',
        email: '',
        phone: '',
        serviceInterest: defaultService,
        customServiceDescription: '',
        subject: defaultService ? `Inquiry for ${defaultService}` : 'Service Inquiry',
        message: '',
      });

      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    } catch (err) {
      console.error('[InquiryForm] Submission error:', err);
      setSubmitStatus({
        type: 'error',
        message: 'Something went wrong. Please check your network connection and try again.',
      });
    }
  };

  return (
    <div className="space-y-4">
      {submitStatus?.type === 'success' ? (
        <div className="rounded-xl bg-green-50 border border-green-200 p-6 text-center space-y-3" role="status">
          <FaCheckCircle className="mx-auto h-12 w-12 text-green-500" />
          <h4 className="text-lg font-bold text-green-900">Inquiry Received</h4>
          <p className="text-sm text-green-700 leading-relaxed">
            {submitStatus.message}
          </p>
          <button
            type="button"
            onClick={() => setSubmitStatus(null)}
            className="mt-4 inline-flex items-center justify-center rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 transition"
          >
            Submit Another Inquiry
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          {submitStatus?.type === 'error' && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-800" role="alert">
              <strong>Error:</strong> {submitStatus.message}
            </div>
          )}

          {/* Name */}
          <div>
            <label htmlFor="inquiry-fullName" className="block text-sm font-semibold text-brand-navy">
              Full Name
            </label>
            <div className="relative mt-2">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <FaUser className="h-4 w-4" />
              </div>
              <input
                id="inquiry-fullName"
                type="text"
                autoComplete="name"
                disabled={isSubmitting}
                className="block w-full rounded-lg border border-slate-300 py-3 pl-10 pr-4 text-brand-ink placeholder-slate-400 focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-gold disabled:opacity-60 transition"
                placeholder="John Doe"
                {...register('fullName')}
              />
            </div>
            <FieldError message={errors.fullName?.message} />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {/* Email */}
            <div>
              <label htmlFor="inquiry-email" className="block text-sm font-semibold text-brand-navy">
                Email Address
              </label>
              <div className="relative mt-2">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <FaEnvelope className="h-4 w-4" />
                </div>
                <input
                  id="inquiry-email"
                  type="email"
                  autoComplete="email"
                  disabled={isSubmitting}
                  className="block w-full rounded-lg border border-slate-300 py-3 pl-10 pr-4 text-brand-ink placeholder-slate-400 focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-gold disabled:opacity-60 transition"
                  placeholder="john@example.com"
                  {...register('email')}
                />
              </div>
              <FieldError message={errors.email?.message} />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="inquiry-phone" className="block text-sm font-semibold text-brand-navy">
                Phone Number
              </label>
              <div className="relative mt-2">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <FaPhone className="h-4 w-4" />
                </div>
                <input
                  id="inquiry-phone"
                  type="tel"
                  autoComplete="tel"
                  disabled={isSubmitting}
                  className="block w-full rounded-lg border border-slate-300 py-3 pl-10 pr-4 text-brand-ink placeholder-slate-400 focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-gold disabled:opacity-60 transition"
                  placeholder="+1 (555) 000-0000"
                  {...register('phone')}
                />
              </div>
              <FieldError message={errors.phone?.message} />
            </div>
          </div>

          {/* Service dropdown */}
          <div>
            <label htmlFor="inquiry-serviceInterest" className="block text-sm font-semibold text-brand-navy">
              Service Interest
            </label>
            <select
              id="inquiry-serviceInterest"
              disabled={isSubmitting}
              className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm text-brand-ink focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-gold disabled:opacity-60 transition"
              {...register('serviceInterest')}
            >
              <option value="">Select a service</option>
              {services.map((service) => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </select>
            <FieldError message={errors.serviceInterest?.message} />
          </div>

          {/* Custom service input if 'Other' is selected */}
          {selectedService === 'Other' && (
            <div>
              <label htmlFor="inquiry-customDesc" className="block text-sm font-semibold text-brand-navy">
                Describe the Service
              </label>
              <input
                id="inquiry-customDesc"
                type="text"
                disabled={isSubmitting}
                className="mt-2 block w-full rounded-lg border border-slate-300 px-4 py-3 text-sm focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-gold"
                placeholder="E.g. Custom Corporate Tax Audits"
                {...register('customServiceDescription')}
              />
              <FieldError message={errors.customServiceDescription?.message} />
            </div>
          )}

          {/* Message */}
          <div>
            <label htmlFor="inquiry-message" className="block text-sm font-semibold text-brand-navy">
              Inquiry details
            </label>
            <textarea
              id="inquiry-message"
              rows="4"
              disabled={isSubmitting}
              className="mt-2 block w-full rounded-lg border border-slate-300 px-4 py-3 text-sm focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-gold resize-y"
              placeholder="What details can we check for you? Mention your specific needs or timeline..."
              {...register('message')}
            />
            <FieldError message={errors.message?.message} />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full justify-center items-center gap-2 rounded-full bg-brand-gold px-6 py-3 font-semibold text-brand-ink transition hover:bg-brand-navy hover:text-white disabled:opacity-50 sm:w-auto"
          >
            {isSubmitting ? (
              <>
                <FaSpinner className="h-4 w-4 animate-spin" /> Submitting...
              </>
            ) : (
              submitLabel
            )}
          </button>
        </form>
      )}
    </div>
  );
}

export default InquiryForm;
