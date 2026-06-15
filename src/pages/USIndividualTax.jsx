import SEO from '../components/common/SEO.jsx';
import { PageHeader, ServiceGrid } from '../components/index.js';
import { getServicesByCategory } from '../data/fallbackServices.js';

function USIndividualTax() {
  const services = getServicesByCategory('individual-tax').map((service) => ({
    ...service,
    href: `/services/${service.slug}`,
    category: service.categoryLabel,
  }));

  const pageDescription =
    'US Individual Tax services including ITIN, FBAR/FATCA, extension filing, tax planning, and return preparation for NRIs and expats.';

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
        title="US Individual Tax Services"
        description={pageDescription}
        keywords="individual tax, ITIN, FBAR, FATCA, expat tax, NRI tax, extension filing"
        ogImage="/og-image.jpg"
        jsonLd={categoryJsonLd}
      />
      <main>
        <PageHeader
          eyebrow="US Individual Tax"
          title="US Individual Tax Filing Services"
          description="Tax planning, return preparation, ITIN, FBAR/FATCA, extension filing, and advisory support for individuals, NRIs, and expats."
        />
        <ServiceGrid services={services} title="Individual Tax Services" />
      </main>
    </>
  );
}

export default USIndividualTax;
