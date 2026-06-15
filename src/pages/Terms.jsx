import SEO from '../components/common/SEO.jsx';
import { PageHeader } from '../components/index.js';

function Terms() {
  const pageDescription =
    'Terms and conditions for using the TaxFiler Global website, inquiry forms, refund tracking, and client communication tools.';

  const termsJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Terms and Conditions',
    description: pageDescription,
    url: `${window.location.origin}/#/terms`,
  };

  return (
    <>
      <SEO
        title="Terms and Conditions | TaxFiler Global"
        description={pageDescription}
        keywords="terms and conditions, website terms, service terms, legal agreement"
        ogImage="/og-image.jpg"
        jsonLd={termsJsonLd}
      />
      <main>
        <PageHeader
          eyebrow="Terms"
          title="Terms and Conditions"
          description="Terms for using the TaxFiler Global website, inquiry forms, service tracking, and client communication tools."
        />
        <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-4xl space-y-8 px-4 leading-7 text-brand-muted sm:px-6 lg:px-8">
          <section>
            <h2 className="text-2xl font-bold text-brand-navy">Website Use</h2>
            <p className="mt-3">This website provides business service information and inquiry tools. Content is for general information and does not replace professional advice for a specific case.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-brand-navy">Service Requests</h2>
            <p className="mt-3">Submitting a form does not guarantee acceptance of a service engagement. Scope, timelines, and pricing should be confirmed separately.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-brand-navy">User Responsibility</h2>
            <p className="mt-3">Users are responsible for providing accurate, complete, and timely information required for tax, accounting, payroll, and advisory services.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-brand-navy">Limitations</h2>
            <p className="mt-3">TaxFiler Global is not responsible for delays caused by incomplete records, inaccurate information, third-party systems, or government processing timelines.</p>
          </section>
        </div>
      </section>
    </main>
    </>
  );
}

export default Terms;
