import SEO from '../components/common/SEO.jsx';
import { Link, useParams } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { FAQSection, ServiceGrid } from '../components/index.js';
import ServiceBenefits from '../components/services/ServiceBenefits.jsx';
import ServiceContactCTA from '../components/services/ServiceContactCTA.jsx';
import ServiceDetailHero from '../components/services/ServiceDetailHero.jsx';
import ServiceInquiryForm from '../components/services/ServiceInquiryForm.jsx';
import ServiceProcess from '../components/services/ServiceProcess.jsx';
import ServiceSidebar from '../components/services/ServiceSidebar.jsx';
import { ROUTES } from '../constants/routes.js';
import { fallbackServices, getServiceBySlug } from '../data/fallbackServices.js';

/* ─── Not Found fallback ─────────────────────────────────────── */
function ServiceNotFound() {
  return (
    <main>
      <header className="bg-brand-navy py-16 text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <p className="mb-2 text-sm font-semibold uppercase text-brand-gold">Service Not Found</p>
          <h1 className="text-4xl font-bold">We couldn&apos;t find that service</h1>
          <p className="mt-4 text-blue-100">
            The page may have moved or the link may be incorrect.
          </p>
          <Link
            to={ROUTES.SERVICES}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-gold px-6 py-3 text-sm font-semibold text-brand-ink transition hover:bg-amber-400"
          >
            <FaArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            Back to all services
          </Link>
        </div>
      </header>
    </main>
  );
}

/* ─── Main page ───────────────────────────────────────────────── */
function ServiceDetails() {
  const { serviceSlug } = useParams();
  const service = getServiceBySlug(serviceSlug);

  if (!service) return <ServiceNotFound />;

  const pageDescription = service.longDescription || service.description;

  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: pageDescription,
    provider: {
      '@type': 'Organization',
      name: 'TaxFiler Global',
      url: `${window.location.origin}/#/services/${service.slug}`,
    },
    serviceType: service.categoryLabel,
    audience: {
      '@type': 'Audience',
      audienceType: service.categoryLabel,
    },
    offers: {
      '@type': 'Offer',
      url: `${window.location.origin}/#/services/${service.slug}`,
      availability: 'https://schema.org/InStock',
    },
  };

  /* Related services: same category, excluding self, max 3 */
  const relatedServices = fallbackServices
    .filter((item) => item.category === service.category && item.slug !== service.slug)
    .slice(0, 3)
    .map((item) => ({ ...item, href: `/services/${item.slug}`, category: item.categoryLabel }));

  return (
    <>
      <SEO
        title={`${service.title} | TaxFiler Global`}
        description={pageDescription}
        keywords={`${service.title}, ${service.categoryLabel}, tax service, accounting service`}
        ogImage={service.ogImage || '/og-image.jpg'}
        jsonLd={serviceJsonLd}
      />
      <main>
        {/* ① Hero */}
        <ServiceDetailHero
        eyebrow={service.categoryLabel}
        title={service.heroTitle}
        description={service.description}
        ctaText={service.ctaText}
      />

      {/* ② Description + Sidebar */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_320px] lg:px-8">
          {/* Long description */}
          <div>
            <Link
              to={ROUTES.SERVICES}
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand-navy hover:text-brand-gold"
            >
              <FaArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              Back to all services
            </Link>

            <h2 className="mt-8 text-2xl font-bold text-brand-navy">About This Service</h2>
            <p className="mt-4 text-base leading-8 text-brand-muted">{service.longDescription}</p>
          </div>

          {/* Required documents sidebar */}
          <ServiceSidebar
            documents={service.requiredDocuments}
            ctaLabel={service.ctaText || 'Request This Service'}
          />
        </div>
      </section>

      {/* ③ Benefits */}
      <ServiceBenefits
        benefits={service.benefits}
        title={`Benefits of ${service.title}`}
        eyebrow="Why Choose This Service"
      />

      {/* ④ Process */}
      <ServiceProcess
        steps={service.processSteps}
        title="How It Works"
        eyebrow="Our Process"
        description="A clear, step-by-step workflow designed to keep you informed and reduce back-and-forth."
      />

      {/* ⑤ FAQ */}
      <FAQSection
        eyebrow="Service FAQ"
        title={`${service.title} — Common Questions`}
        description="Answers to frequently asked questions about this service, required information, and next steps."
        faqs={service.faqs}
      />

      {/* ⑥ Contact CTA */}
      <ServiceContactCTA serviceTitle={service.title} />

      {/* ⑦ Inquiry Form */}
      <ServiceInquiryForm
        serviceTitle={service.title}
        inquirySubject={service.inquirySubject}
      />

      {/* ⑧ Related Services */}
      {relatedServices.length > 0 && (
        <ServiceGrid
          eyebrow="Related Services"
          title="You Might Also Need"
          description="Explore other services in this category that may complement your needs."
          services={relatedServices}
        />
      )}
    </main>
    </>
  );
}

export default ServiceDetails;
