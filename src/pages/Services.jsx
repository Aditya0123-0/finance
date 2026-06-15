import SEO from '../components/common/SEO.jsx';
import { PageHeader, ServiceGrid } from '../components/index.js';
import { fallbackServices } from '../data/fallbackServices.js';

function Services() {
  const services = fallbackServices.map((service) => ({
    ...service,
    href: `/services/${service.slug}`,
    category: service.categoryLabel,
  }));

  const pageDescription =
    'Explore TaxFiler Global service offerings across individual tax, business tax, bookkeeping, payroll, and CPA support.';

  const servicesJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: services.map((service, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: service.title,
      url: `${window.location.origin}/#/services/${service.slug}`,
    })),
  };

  return (
    <>
      <SEO
        title="All Services | TaxFiler Global"
        description={pageDescription}
        keywords="tax services, bookkeeping services, payroll services, ITIN, FBAR, FATCA, CPA support"
        ogImage="/og-image.jpg"
        jsonLd={servicesJsonLd}
      />
      <main>
        <PageHeader
          eyebrow="Services"
          title="TaxFiler Global Services"
          description="Explore individual tax, business tax, bookkeeping, payroll, and CPA support services."
        />
        <ServiceGrid
          title="All Services"
          description="Every service links to a dedicated detail page with scope, process, and document requirements."
          services={services}
        />
      </main>
    </>
  );
}

export default Services;
