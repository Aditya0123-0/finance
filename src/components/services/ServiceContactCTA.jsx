import { FaArrowRight } from 'react-icons/fa';
import { siteConfig } from '../../config/siteConfig.js';

/**
 * ServiceContactCTA
 * Full-width navy CTA banner encouraging the user to get in touch.
 * Props:
 *   serviceTitle – displayed in the heading ("Ready to start …?")
 *   ctaHref      – scroll target (default #service-inquiry)
 *   ctaLabel     – button label
 *   tagline      – optional supporting sentence below the heading
 */
function ServiceContactCTA({
  serviceTitle,
  ctaHref = '#service-inquiry',
  ctaLabel = 'Send Inquiry',
  tagline,
}) {
  const defaultTagline =
    'Send your inquiry and TaxFiler Global will review the service, required documents, and share the next steps.';

  return (
    <section className="relative overflow-hidden bg-brand-navy py-16 text-white sm:py-20">
      {/* Decorative glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-brand-gold opacity-10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-10 top-0 h-48 w-48 rounded-full bg-blue-400 opacity-10 blur-3xl"
      />

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-brand-gold">
          Ready to Get Started?
        </p>

        <h2 className="text-3xl font-extrabold sm:text-4xl">
          {serviceTitle ? `Start ${serviceTitle} Today` : 'Let\'s Work Together'}
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-blue-100">
          {tagline || defaultTagline}
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <a
            href={ctaHref}
            className="inline-flex items-center gap-2 rounded-full bg-brand-gold px-7 py-3.5 text-sm font-bold text-brand-ink shadow-lg transition hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2 focus:ring-offset-brand-navy"
          >
            {ctaLabel}
            <FaArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
          <a
            href={siteConfig.whatsappNumber ? `https://wa.me/${String(siteConfig.whatsappNumber).replace(/[^\d]/g, '')}?text=${encodeURIComponent('Hello TaxFiler Global, I need help with tax filing services.')}` : 'https://wa.me/'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-brand-navy"
          >
            WhatsApp Us
          </a>
        </div>
      </div>
    </section>
  );
}

export default ServiceContactCTA;
