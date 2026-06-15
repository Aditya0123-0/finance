import { PageHeader } from '../components/index.js';
import ReferralForm from '../components/forms/ReferralForm.jsx';
import SEO from '../components/common/SEO.jsx';

function ReferEarn() {
  const pageDescription =
    'Refer TaxFiler Global and earn rewards when your contact signs up for tax filing, bookkeeping, payroll, or CPA support services.';

  const referralJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    name: 'Referral Program',
    description: pageDescription,
    url: `${window.location.origin}/#/refer-earn`,
  };

  return (
    <>
      <SEO
        title="Refer & Earn | TaxFiler Global"
        description={pageDescription}
        keywords="refer and earn, referral program, tax referral, bookkeeping referral, CPA referral"
        ogImage="/og-image.jpg"
        jsonLd={referralJsonLd}
      />
      <main>
        <PageHeader
          eyebrow="Refer & Earn"
          title="Refer TaxFiler Global"
          description="Introduce friends, colleagues, or business owners who need tax filing, bookkeeping, payroll, or CPA support."
        />
        <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Program Steps */}
          <div className="rounded-2xl border border-slate-200 bg-brand-surface p-6 shadow-soft sm:p-8">
            <h2 className="text-2xl font-bold text-brand-navy text-center">Referral Program Workflow</h2>
            <p className="mt-2 text-sm text-brand-muted text-center max-w-xl mx-auto">
              Refer a friend or business in three simple steps. Earn rewards once they finalize their tax filing or service setup.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                { title: 'Share Details', desc: 'Submit their contact info via our secure form below.' },
                { title: 'We Contact Lead', desc: 'Our advisory team reaches out to assess their tax needs.' },
                { title: 'Claim Cash Reward', desc: 'Receive payout status notifications on your dashboard.' }
              ].map((step, index) => (
                <div key={step.title} className="rounded-xl bg-white p-5 text-center border border-slate-100 shadow-sm">
                  <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-brand-navy font-bold text-white shadow-sm">{index + 1}</span>
                  <h4 className="mt-4 text-sm font-bold text-brand-navy">{step.title}</h4>
                  <p className="mt-2 text-xs text-brand-muted leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Referral Submission Form */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft sm:p-8">
            <h2 className="text-2xl font-bold text-brand-navy text-center mb-6">Submit a Referral</h2>
            <ReferralForm />
          </div>
        </div>
      </section>
    </main>
    </>
  );
}

export default ReferEarn;

