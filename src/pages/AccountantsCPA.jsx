import SEO from '../components/common/SEO.jsx';
import { PageHeader, ServiceGrid } from '../components/index.js';
import { getServicesByCategory } from '../data/fallbackServices.js';

function AccountantsCPA() {
  const services = getServicesByCategory('accountants-cpas').map((service) => ({
    ...service,
    href: `/services/${service.slug}`,
    category: service.categoryLabel,
  }));

  const pageDescription =
    'Backoffice and tax support services for accountants, CPAs, EAs, and professional firms needing bookkeeping, audit support, and workflow management.';

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
        title="CPA Firm Support Services"
        description={pageDescription}
        keywords="CPA support, bookkeeping for firms, audit support, tax support, backoffice services"
        ogImage="/og-image.jpg"
        jsonLd={categoryJsonLd}
      />
      <main>
        <PageHeader
          eyebrow="For Accountants / CPAs"
          title="Backoffice Support For Accounting Firms"
          description="Bookkeeping, audit support, tax support, and back-office services for accountants, CPAs, EAs, business owners, and entrepreneurs."
        />
        <ServiceGrid services={services} title="CPA Firm Support Services" />
      </main>
    </>
  );
}

export default AccountantsCPA;
