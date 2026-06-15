import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes.js';

/**
 * ServiceDetailHero
 * Full-width hero for a service detail page.
 * Props:
 *   eyebrow      – category label (e.g. "US Individual Tax")
 *   title        – heroTitle from service data
 *   description  – short description sentence
 *   ctaText      – primary button label
 *   ctaHref      – anchor target (default #service-inquiry)
 */
function ServiceDetailHero({
  eyebrow,
  title,
  description,
  ctaText = 'Get Started',
  ctaHref = '#service-inquiry',
}) {
  return (
    <header className="relative overflow-hidden bg-brand-navy text-white">
      {/* Decorative gradient blob */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-40 h-[420px] w-[420px] rounded-full bg-brand-gold opacity-10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-blue-400 opacity-10 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-sm text-blue-200">
          <Link to={ROUTES.HOME} className="hover:text-brand-gold transition-colors">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <Link to={ROUTES.SERVICES} className="hover:text-brand-gold transition-colors">
            Services
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-white">{title}</span>
        </nav>

        <div className="max-w-3xl">
          {eyebrow ? (
            <p className="mb-4 inline-block rounded-full border border-brand-gold/40 bg-brand-gold/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-brand-gold">
              {eyebrow}
            </p>
          ) : null}

          <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">{title}</h1>

          {description ? (
            <p className="mt-5 max-w-xl text-lg leading-8 text-blue-100">{description}</p>
          ) : null}

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href={ctaHref}
              className="rounded-full bg-brand-gold px-7 py-3.5 text-sm font-bold text-brand-ink shadow-lg transition hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2 focus:ring-offset-brand-navy"
            >
              {ctaText}
            </a>
            <Link
              to={ROUTES.CONTACT}
              className="rounded-full border border-white/30 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-brand-navy"
            >
              Talk to an Advisor
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default ServiceDetailHero;
