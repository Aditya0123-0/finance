import { Link } from 'react-router-dom';
import { FaArrowRight, FaCheckCircle, FaFileInvoiceDollar, FaHandshake, FaUserTie } from 'react-icons/fa';
import {
  FAQSection,
  HeroSlider,
  SectionTitle,
  ServiceGrid,
  TestimonialsSection,
  YoutubeSection,
  SEO,
} from '../components/index.js';
import { ROUTES } from '../constants/routes.js';
import { fallbackServices } from '../data/fallbackServices.js';

const heroSlides = [
  {
    eyebrow: 'TaxFiler Global',
    title: 'US Tax Filing & Accounting Services',
    description:
      'Professional support for US individual tax filing, business tax returns, ITIN, FBAR, FATCA, bookkeeping, payroll, and CPA back-office operations.',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1600&auto=format&fit=crop',
    ctaLabel: 'Get Free Consultation',
    ctaHref: '#/contact',
  },
  {
    eyebrow: 'For Individuals, Businesses, and CPAs',
    title: 'Secure Tax Support Without Complicated Follow-Ups',
    description:
      'From document collection to filing support and service tracking, TaxFiler Global keeps each request organized and easy to follow.',
    image: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=1600&auto=format&fit=crop',
    ctaLabel: 'Explore Services',
    ctaHref: '#/services',
  },
];

const categoryCards = [
  {
    title: 'US Individual Tax',
    description: 'Tax planning, returns, ITIN, FBAR, FATCA, extensions, and preparation support.',
    href: ROUTES.US_INDIVIDUAL_TAX,
    icon: <FaFileInvoiceDollar className="h-5 w-5" aria-hidden="true" />,
  },
  {
    title: 'US Business Tax',
    description: 'Business incorporation, bookkeeping, payroll, and business tax preparation.',
    href: ROUTES.US_BUSINESS_TAX,
    icon: <FaHandshake className="h-5 w-5" aria-hidden="true" />,
  },
  {
    title: 'Accountants / CPAs',
    description: 'Bookkeeping, audit, tax, and back-office support for professional firms.',
    href: ROUTES.ACCOUNTANTS_CPA,
    icon: <FaUserTie className="h-5 w-5" aria-hidden="true" />,
  },
];

const testimonials = [
  {
    id: 'ramesh',
    clientName: 'Ramesh Kumar',
    clientLocation: 'USA',
    message: 'TaxFiler Global helped me file my US taxes and FBAR quickly without stress.',
    rating: 5,
  },
  {
    id: 'priya',
    clientName: 'Priya Sharma',
    clientLocation: 'Bangalore',
    message: 'The team handled bookkeeping and tax support professionally for my startup.',
    rating: 5,
  },
  {
    id: 'david',
    clientName: 'David Joseph',
    clientLocation: 'Texas',
    message: 'Excellent support for ITIN application and refund guidance.',
    rating: 5,
  },
];

const videos = [
  {
    title: 'Tax Filing Support',
    description: 'Client experience with individual tax filing support.',
    url: 'https://www.youtube.com/',
    thumbnail: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=900&auto=format&fit=crop',
  },
  {
    title: 'Bookkeeping Support',
    description: 'How businesses stay organized with monthly accounting support.',
    url: 'https://www.youtube.com/',
    thumbnail: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=900&auto=format&fit=crop',
  },
  {
    title: 'Refund Assistance',
    description: 'A simple process for service updates and status tracking.',
    url: 'https://www.youtube.com/',
    thumbnail: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=900&auto=format&fit=crop',
  },
];

const faqs = [
  {
    question: 'What services does TaxFiler Global provide?',
    answer:
      'TaxFiler Global supports US individual tax filing, business tax filing, ITIN, FBAR, FATCA, bookkeeping, payroll, and CPA back-office services.',
  },
  {
    question: 'Can I track my service status?',
    answer:
      'Yes. The Refund Status and service tracking flow is designed to show safe status updates using a customer ID or tracking reference.',
  },
  {
    question: 'How do I get started?',
    answer:
      'You can contact the team, register, or connect through WhatsApp to begin the document and service intake process.',
  },
];

function Home() {
  const featuredServices = fallbackServices.slice(0, 6).map((service) => ({
    ...service,
    href: `/services/${service.slug}`,
  }));

  const pageDescription =
    'Professional US tax filing, business tax returns, ITIN, FBAR, FATCA, bookkeeping, payroll, and CPA support for individuals, expats, and firms.';

  const homeJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'TaxFiler Global Home',
    description: pageDescription,
    url: `${window.location.origin}${window.location.pathname}${window.location.hash}`,
    publisher: {
      '@type': 'Organization',
      name: 'TaxFiler Global',
      url: 'https://taxfilerglobal.com',
    },
  };

  return (
    <>
      <SEO
        title="US Tax Filing & Accounting Services"
        description={pageDescription}
        keywords="US tax filing, FBAR, FATCA, ITIN, bookkeeping, payroll, CPA support, expats"
        ogImage={heroSlides[0].image}
        jsonLd={homeJsonLd}
      />
      <main>
        <HeroSlider slides={heroSlides} />

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle
            eyebrow="Welcome"
            title="Welcome To TaxFiler Global"
            description="Professional US tax filing, FBAR, FATCA, GST filing support, payroll, bookkeeping, and accounting services for NRIs, expats, startups, businesses, and CPA firms."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {categoryCards.map((card) => (
              <Link
                key={card.title}
                to={card.href}
                className="rounded-lg border border-slate-200 bg-brand-surface p-6 shadow-soft transition hover:-translate-y-1 hover:bg-white focus:outline-none focus:ring-2 focus:ring-brand-gold"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-brand-navy text-brand-gold">
                  {card.icon}
                </span>
                <h2 className="mt-5 text-xl font-bold text-brand-navy">{card.title}</h2>
                <p className="mt-3 text-sm leading-7 text-brand-muted">{card.description}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-navy">
                  View Services <FaArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ServiceGrid
        eyebrow="Latest Tax Services"
        title="Popular Services"
        description="Choose a service to view details, required documents, and the next steps."
        services={featuredServices}
      />

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <SectionTitle
              align="left"
              eyebrow="Why Choose Us"
              title="A Clear Process For Tax, Accounting, and CPA Support"
              description="The platform is designed around secure intake, practical communication, and status visibility without exposing sensitive customer data."
            />
          </div>
          <div className="grid gap-4">
            {['Secure document-first process', 'Responsive support and WhatsApp access', 'Service tracking with safe public updates'].map((item) => (
              <div key={item} className="flex gap-3 rounded-lg border border-slate-200 bg-brand-surface p-4">
                <FaCheckCircle className="mt-1 h-5 w-5 flex-none text-green-600" aria-hidden="true" />
                <p className="font-medium text-brand-navy">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <TestimonialsSection testimonials={testimonials} />
      <YoutubeSection videos={videos} />
      <FAQSection faqs={faqs} />
    </main>
    </>
  );
}

export default Home;
