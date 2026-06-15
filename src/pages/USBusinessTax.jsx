import SEO from '../components/common/SEO.jsx';
import { PageHeader, ServiceGrid } from '../components/index.js';
import { getServicesByCategory } from '../data/fallbackServices.js';

function USBusinessTax() {
  const services = getServicesByCategory('business-tax').map((service) => ({
    ...service,
    href: `/services/${service.slug}`,
    category: service.categoryLabel,
  }));

  const pageDescription =
    'US Business Tax filing services for incorporation, payroll, bookkeeping, and business tax return preparation.';

  const categoryJsonLd = {
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
        title="US Business Tax Services"
        description={pageDescription}
        keywords="business tax, bookkeeping, payroll, incorporation consulting, tax preparation"
        ogImage="/og-image.jpg"
        jsonLd={categoryJsonLd}
      />
      <main>
        <PageHeader
          eyebrow="US Business Tax"
          title="US Business Tax Filing Services"
          description="Business incorporation consulting, bookkeeping, payroll processing, and business tax return planning and preparation."
        />
        <ServiceGrid services={services} title="Business Tax Services" />
      </main>
    </>
  );
}

export default USBusinessTax;
