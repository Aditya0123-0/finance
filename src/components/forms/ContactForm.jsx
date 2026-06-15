import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { contactSchema } from '../../schemas/contactSchema.js';
import { useAuth } from '../../hooks/useAuth.js';
import { submitInquiry } from '../../firebase';

const defaultServices = [
  'US Individual Tax Filing',
  'US Business Tax Filing',
  'ITIN Processing',
  'FBAR/FATCA Processing',
  'Bookkeeping and Accounting',
  'Payroll Processing',
  'For Accountants / CPAs',
  'Other',
];

function FieldError({ message }) {
  if (!message) return null;
  return <p className="mt-2 text-sm text-red-600">{message}</p>;
}

function ContactForm({
  services = defaultServices,
  onSubmit,
  submitLabel = 'Submit Inquiry',
  defaultValues,
}) {
  const [submitStatus, setSubmitStatus] = useState(null);
  const { currentUser } = useAuth();
  
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
      serviceInterest: '',
      customServiceDescription: '',
      subject: '',
      message: '',
      ...defaultValues,
    },
  });

  const selectedService = watch('serviceInterest');

  async function handleFormSubmit(values) {
    setSubmitStatus(null);
    try {
      if (onSubmit) {
        await onSubmit(values);
      } else {
        const source = values.serviceInterest ? 'service-page' : 'contact-page';
        const { error } = await submitInquiry(
          {
            ...values,
            source,
          },
          currentUser?.uid || null
        );
        if (error) throw error;
      }
      setSubmitStatus({ type: 'success', message: 'Thank you. Your inquiry has been submitted.' });
      reset();
    } catch (err) {
      console.error('[ContactForm] Submit error:', err);
      setSubmitStatus({ type: 'error', message: 'Something went wrong. Please try again.' });
    }
  }


  return (
    <form className="space-y-5" onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="fullName" className="block text-sm font-semibold text-brand-navy">Full Name</label>
          <input
            id="fullName"
            type="text"
            autoComplete="name"
            className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-gold"
            {...register('fullName')}
          />
          <FieldError message={errors.fullName?.message} />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-brand-navy">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-gold"
            {...register('email')}
          />
          <FieldError message={errors.email?.message} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="phone" className="block text-sm font-semibold text-brand-navy">Phone</label>
          <input
            id="phone"
            type="tel"
            autoComplete="tel"
            className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-gold"
            {...register('phone')}
          />
          <FieldError message={errors.phone?.message} />
        </div>
        <div>
          <label htmlFor="serviceInterest" className="block text-sm font-semibold text-brand-navy">Service Interest</label>
          <select
            id="serviceInterest"
            className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-gold"
            {...register('serviceInterest')}
          >
            <option value="">Select a service</option>
            {services.map((service) => (
              <option key={service} value={service}>{service}</option>
            ))}
          </select>
          <FieldError message={errors.serviceInterest?.message} />
        </div>
      </div>

      {selectedService === 'Other' ? (
        <div>
          <label htmlFor="customServiceDescription" className="block text-sm font-semibold text-brand-navy">Describe the Service</label>
          <input
            id="customServiceDescription"
            type="text"
            className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-gold"
            {...register('customServiceDescription')}
          />
          <FieldError message={errors.customServiceDescription?.message} />
        </div>
      ) : null}

      <div>
        <label htmlFor="subject" className="block text-sm font-semibold text-brand-navy">Subject</label>
        <input
          id="subject"
          type="text"
          className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-gold"
          {...register('subject')}
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-semibold text-brand-navy">Message</label>
        <textarea
          id="message"
          rows="5"
          className="mt-2 w-full resize-y rounded-lg border border-slate-300 px-4 py-3 focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-gold"
          {...register('message')}
        />
        <FieldError message={errors.message?.message} />
      </div>

      {submitStatus ? (
        <div
          className={`rounded-lg px-4 py-3 text-sm ${
            submitStatus.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}
          role="status"
        >
          {submitStatus.message}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-full justify-center rounded-full bg-brand-gold px-6 py-3 font-semibold text-brand-ink transition hover:bg-brand-navy hover:text-white focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
      >
        {isSubmitting ? 'Submitting...' : submitLabel}
      </button>
    </form>
  );
}

export default ContactForm;
