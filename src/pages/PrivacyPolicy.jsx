import { PageHeader } from '../components/index.js';
import SEO from '../components/common/SEO.jsx';

function PrivacyPolicy() {
  const pageDescription =
    'TaxFiler Global Privacy Policy explaining how contact data, service requests, and documents are collected, used, and secured.';

  const privacyJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Privacy Policy',
    description: pageDescription,
    url: `${window.location.origin}/#/privacy-policy`,
  };

  return (
    <>
      <SEO
        title="Privacy Policy | TaxFiler Global"
        description={pageDescription}
        keywords="privacy policy, data security, contact data, service requests, document protection"
        ogImage="/og-image.jpg"
        jsonLd={privacyJsonLd}
      />
      <main>
        <PageHeader
          eyebrow="Privacy"
          title="Privacy Policy"
          description="How TaxFiler Global handles contact information, service requests, account data, and uploaded documents."
        />
        <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-4xl space-y-8 px-4 leading-7 text-brand-muted sm:px-6 lg:px-8">
          <section>
            <h2 className="text-2xl font-bold text-brand-navy">Information We Collect</h2>
            <p className="mt-3">We collect information submitted through contact forms, registration, service requests, refund/status requests, referrals, and document uploads.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-brand-navy">How We Use Information</h2>
            <p className="mt-3">Information is used to respond to inquiries, provide requested services, track service progress, and maintain secure client communication.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-brand-navy">Data Security</h2>
            <p className="mt-3">Sensitive documents should be stored only in secured Firebase Storage paths protected by authentication and authorization rules.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-brand-navy">Contact</h2>
            <p className="mt-3">Contact TaxFiler Global for privacy questions, data correction, or deletion requests.</p>
          </section>
        </div>
      </section>
    </main>
    </>
  );
}

export default PrivacyPolicy;
